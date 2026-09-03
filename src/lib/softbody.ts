/**
 * 二维软体晶格：六边形排布的质点，用距离约束（Verlet + 迭代松弛）连成一片。
 * 每个质点还带一根很弱的「回家」弹簧，保证被戳变形之后总能回到静止形状。
 * 纯 TS，无 DOM 依赖，方便单测与复用。
 */

export interface Pointer {
  x: number;
  y: number;
  /** 是否按下（按下时影响范围更大） */
  down: boolean;
  /** 影响力权重 0..1，默认 1；给「幽灵指针」淡入淡出用 */
  weight?: number;
}

export interface SoftBodyOptions {
  /** 六边形环数，环数 R 时质点数 = 3R² + 3R + 1 */
  rings: number;
  /** 相邻质点静止距离（px） */
  spacing: number;
  /** 约束松弛系数 0..1，越大越硬 */
  stiffness: number;
  /** 回家弹簧强度，很小的值即可 */
  homeStiffness: number;
  /** 速度保留比例，越小阻尼越大 */
  damping: number;
  /** 每帧约束迭代次数 */
  iterations: number;
  /** 指针影响半径（px）。指针被当成一个软碰撞体，半径内的质点会被挤出去 */
  pointerRadius: number;
  /** 每步挤出「侵入深度」的比例 0..1，越大手感越硬 */
  pointerStrength: number;
  /** 被挤出时有多少比例转化为速度 0..1，决定松手后的回弹幅度 */
  pointerInertia: number;
}

export const defaultSoftBodyOptions: SoftBodyOptions = {
  rings: 6,
  spacing: 30,
  stiffness: 0.3,
  homeStiffness: 0.005,
  damping: 0.985,
  iterations: 2,
  pointerRadius: 66,
  pointerStrength: 0.8,
  pointerInertia: 0.5,
};

export class SoftBody {
  readonly count: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly px: Float32Array;
  readonly py: Float32Array;
  readonly hx: Float32Array;
  readonly hy: Float32Array;
  /** 每个质点到中心的环距 0..rings，用于渲染时区分内外 */
  readonly ring: Uint8Array;

  readonly springA: Uint16Array;
  readonly springB: Uint16Array;
  readonly rest: Float32Array;
  readonly springCount: number;

  private readonly bendA: Uint16Array;
  private readonly bendB: Uint16Array;
  private readonly bendRest: Float32Array;

  /** 每根弹簧的当前应变 (len - rest) / rest，step 之后更新 */
  readonly strain: Float32Array;
  maxStrain = 0;

  private cx = 0;
  private cy = 0;
  readonly options: SoftBodyOptions;

  constructor(options: Partial<SoftBodyOptions> = {}) {
    this.options = { ...defaultSoftBodyOptions, ...options };
    const { rings, spacing } = this.options;

    // 轴向坐标 (q, r) 满足 |q|,|r|,|q+r| <= rings
    const coords: [number, number][] = [];
    const index = new Map<string, number>();
    for (let q = -rings; q <= rings; q++) {
      for (let r = -rings; r <= rings; r++) {
        if (Math.abs(q + r) > rings) continue;
        index.set(`${q},${r}`, coords.length);
        coords.push([q, r]);
      }
    }

    this.count = coords.length;
    this.x = new Float32Array(this.count);
    this.y = new Float32Array(this.count);
    this.px = new Float32Array(this.count);
    this.py = new Float32Array(this.count);
    this.hx = new Float32Array(this.count);
    this.hy = new Float32Array(this.count);
    this.ring = new Uint8Array(this.count);

    coords.forEach(([q, r], i) => {
      this.hx[i] = spacing * (q + r / 2);
      this.hy[i] = spacing * r * (Math.sqrt(3) / 2);
      this.ring[i] = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
    });

    // 三个方向各连一次，保证每条边只出现一次
    const dirs: [number, number][] = [
      [1, 0],
      [0, 1],
      [-1, 1],
    ];
    const a: number[] = [];
    const b: number[] = [];
    coords.forEach(([q, r], i) => {
      for (const [dq, dr] of dirs) {
        const j = index.get(`${q + dq},${r + dr}`);
        if (j !== undefined) {
          a.push(i);
          b.push(j);
        }
      }
    });
    this.springA = Uint16Array.from(a);
    this.springB = Uint16Array.from(b);
    this.springCount = a.length;
    this.rest = new Float32Array(this.springCount).fill(spacing);
    this.strain = new Float32Array(this.springCount);

    // 二级邻居（隔一个质点的六个方向）：抗剪切 / 抗折叠约束，只参与求解不参与绘制。
    // 没有它，指针从边缘推进来时质点会越过邻居翻到另一侧，晶格就折起来了。
    const bendDirs: [number, number][] = [
      [2, 0],
      [0, 2],
      [-2, 2],
      [1, 1],
      [-1, 2],
      [-2, 1],
    ];
    const ba: number[] = [];
    const bb: number[] = [];
    const br: number[] = [];
    coords.forEach(([q, r], i) => {
      for (const [dq, dr] of bendDirs) {
        const j = index.get(`${q + dq},${r + dr}`);
        if (j !== undefined) {
          ba.push(i);
          bb.push(j);
          br.push(Math.hypot(this.hx[j] - this.hx[i], this.hy[j] - this.hy[i]));
        }
      }
    });
    this.bendA = Uint16Array.from(ba);
    this.bendB = Uint16Array.from(bb);
    this.bendRest = Float32Array.from(br);

    this.reset(0, 0, 1);
  }

  /** 把静止形状放到 (cx, cy)，并以 scale 缩放初始形状（<1 会在开场「长开」） */
  reset(cx: number, cy: number, scale = 1) {
    this.cx = cx;
    this.cy = cy;
    for (let i = 0; i < this.count; i++) {
      this.x[i] = cx + this.hx[i] * scale;
      this.y[i] = cy + this.hy[i] * scale;
      this.px[i] = this.x[i];
      this.py[i] = this.y[i];
    }
  }

  /** 只移动「家」的位置，当前质点保持原位，会自然漂过去 */
  moveHome(cx: number, cy: number) {
    this.cx = cx;
    this.cy = cy;
  }

  /** 给某个质点一个瞬时速度 */
  kick(i: number, vx: number, vy: number) {
    this.px[i] -= vx;
    this.py[i] -= vy;
  }

  /** 在 (x, y) 附近半径 radius 内施加一次向外的冲量 */
  impulse(x: number, y: number, radius: number, strength: number) {
    for (let i = 0; i < this.count; i++) {
      const dx = this.x[i] - x;
      const dy = this.y[i] - y;
      const d = Math.hypot(dx, dy);
      if (d < radius && d > 1e-3) {
        const f = (1 - d / radius) * strength;
        this.kick(i, (dx / d) * f, (dy / d) * f);
      }
    }
  }

  step(pointer: Pointer | null) {
    const { damping, homeStiffness, pointerRadius, pointerStrength, pointerInertia, stiffness, iterations } =
      this.options;
    const n = this.count;
    const x = this.x;
    const y = this.y;
    const px = this.px;
    const py = this.py;

    // 1) Verlet 积分 + 回家弹簧
    for (let i = 0; i < n; i++) {
      const vx = (x[i] - px[i]) * damping;
      const vy = (y[i] - py[i]) * damping;
      const ax = (this.cx + this.hx[i] - x[i]) * homeStiffness;
      const ay = (this.cy + this.hy[i] - y[i]) * homeStiffness;
      px[i] = x[i];
      py[i] = y[i];
      x[i] += vx + ax;
      y[i] += vy + ay;
    }

    // 2) 指针：软碰撞体。半径内的质点按侵入深度被挤向边界，
    //    位置式修正不会积累速度，所以怎么戳都不会把晶格戳穿
    if (pointer) {
      const weight = pointer.weight ?? 1;
      const pr = pointer.down ? pointerRadius * 1.4 : pointerRadius;
      const ps = pointerStrength * weight;
      // 单步位移上限：一步挪太远质点会翻到邻居另一侧，晶格就打结了
      const maxPush = this.options.spacing * 0.25;
      if (ps > 1e-4) {
        for (let i = 0; i < n; i++) {
          const dx = x[i] - pointer.x;
          const dy = y[i] - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < pr) {
            // 正好压在指针上的质点：随便挑个方向推出去
            const inv = d > 1e-3 ? 1 / d : 0;
            const nx = d > 1e-3 ? dx * inv : 1;
            const ny = d > 1e-3 ? dy * inv : 0;
            const push = Math.min(maxPush, (pr - d) * ps);
            x[i] += nx * push;
            y[i] += ny * push;
            // 把一部分位移也记到上一帧位置里，抵消掉多余的速度
            px[i] += nx * push * (1 - pointerInertia);
            py[i] += ny * push * (1 - pointerInertia);
          }
        }
      }
    }

    // 3) 距离约束松弛

    const sa = this.springA;
    const sb = this.springB;
    const rest = this.rest;
    const ba = this.bendA;
    const bb = this.bendB;
    const bendRest = this.bendRest;
    const bendCount = ba.length;
    const k = stiffness * 0.5;
    const kb = k * 0.8;
    for (let it = 0; it < iterations; it++) {
      for (let s = 0; s < this.springCount; s++) {
        const i = sa[s];
        const j = sb[s];
        const dx = x[j] - x[i];
        const dy = y[j] - y[i];
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = ((d - rest[s]) / d) * k;
        const ox = dx * diff;
        const oy = dy * diff;
        x[i] += ox;
        y[i] += oy;
        x[j] -= ox;
        y[j] -= oy;
      }
      // 抗折叠约束只在被压短时起作用（单向），拉长不管，保留一级弹簧的柔软手感
      for (let s = 0; s < bendCount; s++) {
        const i = ba[s];
        const j = bb[s];
        const dx = x[j] - x[i];
        const dy = y[j] - y[i];
        const d = Math.hypot(dx, dy) || 1e-6;
        if (d >= bendRest[s]) continue;
        const diff = ((d - bendRest[s]) / d) * kb;
        const ox = dx * diff;
        const oy = dy * diff;
        x[i] += ox;
        y[i] += oy;
        x[j] -= ox;
        y[j] -= oy;
      }
    }

    let max = 0;
    for (let s = 0; s < this.springCount; s++) {
      const i = sa[s];
      const j = sb[s];
      const d = Math.hypot(x[j] - x[i], y[j] - y[i]);
      const e = (d - rest[s]) / rest[s];
      this.strain[s] = e;
      const ae = Math.abs(e);
      if (ae > max) max = ae;
    }
    this.maxStrain = max;
  }
}
