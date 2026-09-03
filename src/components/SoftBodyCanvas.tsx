import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { SoftBody, type Pointer } from '../lib/softbody';

const STEP_MS = 1000 / 120;
const MAX_STEPS_PER_FRAME = 4;

function readVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** 把 `#rrggbb` 拆成 `r, g, b`，方便拼 rgba() */
function hexToRgb(hex: string) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return '236, 231, 221';
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

interface Props {
  className?: string;
}

/**
 * 首页的签名元素：一块可以戳的软体晶格。
 * 边的颜色随应变从骨白过渡到群青，右下角有一行实时求解器读数。
 */
export function SoftBodyCanvas({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const readout = readoutRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ink = hexToRgb(readVar('--color-ink', '#ece7dd'));
    const accent = hexToRgb(readVar('--color-accent', '#4a63ff'));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let body: SoftBody | null = null;
    let raf = 0;
    let visible = true;
    let lastTime = 0;
    let acc = 0;
    let frame = 0;
    let pointerActive = false;
    const pointer: Pointer = { x: 0, y: 0, down: false };

    /**
     * 幽灵指针：没人碰的时候，每隔几秒有一只看不见的手慢慢划过晶格。
     * 它和真实指针走同一套碰撞逻辑，只是权重会淡入淡出。
     */
    const ghost: Pointer = { x: 0, y: 0, down: false, weight: 0 };
    let ghostStart = performance.now() + 1800;
    let ghostDuration = 0;
    let ghostFrom = { x: 0, y: 0 };
    let ghostTo = { x: 0, y: 0 };

    const planGhost = (now: number, delay: number) => {
      // 从晶格外的一侧划到另一侧，路径略偏离圆心，别每次都穿心
      const r = Math.min(width, height) * 0.42;
      const a = Math.random() * Math.PI * 2;
      const offset = (Math.random() - 0.5) * r * 0.9;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      const cx = width / 2 - ny * offset;
      const cy = height / 2 + nx * offset;
      const reach = r * 1.15;
      ghostFrom = { x: cx - nx * reach, y: cy - ny * reach };
      ghostTo = { x: cx + nx * reach, y: cy + ny * reach };
      ghostStart = now + delay;
      ghostDuration = 2600 + Math.random() * 1400;
    };

    const updateGhost = (now: number) => {
      if (pointerActive) {
        ghost.weight = 0;
        return;
      }
      const t = (now - ghostStart) / ghostDuration;
      if (t < 0) return;
      if (t >= 1) {
        ghost.weight = 0;
        planGhost(now, 2200 + Math.random() * 3000);
        return;
      }
      // 位置 ease-in-out，权重两端淡入淡出
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      ghost.x = ghostFrom.x + (ghostTo.x - ghostFrom.x) * e;
      ghost.y = ghostFrom.y + (ghostTo.y - ghostFrom.y) * e;
      ghost.weight = Math.sin(Math.PI * t) ** 0.6 * 0.85;
    };

    const build = (scale: number) => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rings = 6;
      const radius = Math.min(width, height) * 0.42;
      const spacing = radius / rings;
      // 指针半径按间距缩放，保证不同尺寸下手感一致；强度是比例值，不用缩放
      body = new SoftBody({
        rings,
        spacing,
        pointerRadius: spacing * 2.4,
      });
      body.reset(width / 2, height / 2, scale);
      planGhost(performance.now(), 1800);
      if (import.meta.env.DEV) (window as unknown as { __softbody?: SoftBody }).__softbody = body;
      return body;
    };

    /** 静态模式：多松弛几步让晶格完全落在静止形状上 */
    const settle = (b: SoftBody) => {
      for (let i = 0; i < 20; i++) b.step(null);
    };

    const draw = () => {
      if (!body) return;
      ctx.clearRect(0, 0, width, height);
      const { x, y, springA, springB, strain, springCount, count } = body;

      // 基础边：一笔画完
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ink}, 0.13)`;
      ctx.beginPath();
      for (let s = 0; s < springCount; s++) {
        ctx.moveTo(x[springA[s]], y[springA[s]]);
        ctx.lineTo(x[springB[s]], y[springB[s]]);
      }
      ctx.stroke();

      // 受力边：按应变叠加群青
      for (let s = 0; s < springCount; s++) {
        const a = Math.min(1, Math.abs(strain[s]) * 4);
        if (a < 0.04) continue;
        ctx.strokeStyle = `rgba(${accent}, ${a})`;
        ctx.lineWidth = 1 + a * 0.8;
        ctx.beginPath();
        ctx.moveTo(x[springA[s]], y[springA[s]]);
        ctx.lineTo(x[springB[s]], y[springB[s]]);
        ctx.stroke();
      }

      // 质点
      ctx.fillStyle = `rgba(${ink}, 0.55)`;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        ctx.moveTo(x[i] + 1.4, y[i]);
        ctx.arc(x[i], y[i], 1.4, 0, Math.PI * 2);
      }
      ctx.fill();

      // 指针影响半径
      if (pointerActive) {
        const r = body.options.pointerRadius * (pointer.down ? 1.4 : 1);
        ctx.strokeStyle = `rgba(${ink}, ${pointer.down ? 0.28 : 0.14})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const updateReadout = () => {
      if (!readout || !body) return;
      readout.textContent = `nodes ${body.count} · springs ${body.springCount} · max strain ${body.maxStrain.toFixed(3)}`;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !body) return;
      if (!lastTime) lastTime = now;
      acc += Math.min(100, now - lastTime);
      lastTime = now;

      updateGhost(now);
      const active = pointerActive ? pointer : ghost.weight! > 0 ? ghost : null;

      let steps = 0;
      while (acc >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
        body.step(active);
        acc -= STEP_MS;
        steps++;
      }
      if (acc >= STEP_MS) acc = 0;

      draw();
      if (++frame % 6 === 0) updateReadout();
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onMove = (e: PointerEvent) => {
      toLocal(e);
      pointerActive = true;
    };
    const onLeave = () => {
      pointerActive = false;
      pointer.down = false;
      planGhost(performance.now(), 2600);
    };
    const onDown = (e: PointerEvent) => {
      toLocal(e);
      pointerActive = true;
      pointer.down = true;
      // 按下时额外给周围一圈质点一个向外的速度，形成一次「弹开」
      body?.impulse(pointer.x, pointer.y, body.options.pointerRadius * 2.2, body.options.spacing * 0.5);
    };
    const onUp = () => {
      pointer.down = false;
    };

    if (reduced) {
      settle(build(1));
      draw();
      updateReadout();
      const ro = new ResizeObserver(() => {
        settle(build(1));
        draw();
      });
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    build(0.72);
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      if (!body) return;
      const rect = wrap.getBoundingClientRect();
      if (Math.round(rect.width) === width && Math.round(rect.height) === height) return;
      build(1);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        lastTime = 0;
      },
      { threshold: 0.05 },
    );
    io.observe(wrap);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      lastTime = 0;
    };
    document.addEventListener('visibilitychange', onVisibility);

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onLeave);
    canvas.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onLeave);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair select-none"
        style={{ touchAction: 'pan-y' }}
        aria-label="可交互的软体晶格：移动指针会推开质点，松开后会回到原位"
        role="img"
      />
      <span
        ref={readoutRef}
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 font-mono text-[11px] leading-none tracking-wide text-ink-faint tabular-nums"
      />
    </div>
  );
}
