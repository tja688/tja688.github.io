import { Graphics } from 'pixi.js';

type Trail = {
  y: number;
  speed: number;
  phase: number;
  span: number;
};

export const createBezierTrails = (height: number, count: number) => {
  let trails = seedTrails(height, count);
  let currentHeight = height;

  return {
    resize(nextHeight: number, nextCount: number) {
      currentHeight = nextHeight;
      trails = seedTrails(nextHeight, nextCount);
    },
    update(delta: number) {
      trails.forEach((trail) => {
        trail.phase += trail.speed * delta;
      });
    },
    draw(graphics: Graphics, width: number) {
      graphics.clear();

      trails.forEach((trail, index) => {
        const offset = Math.sin(trail.phase) * 28;
        const startY = trail.y + offset;
        const endY = startY + Math.cos(trail.phase * 1.2) * 36;
        const controlA = width * (0.24 + index * 0.08);
        const controlB = width * 0.82;

        graphics.lineStyle(
          1.1,
          index % 2 === 0 ? 0x58d8ff : 0xaa8eff,
          0.08 + (Math.sin(trail.phase) + 1) * 0.05,
        );
        graphics.moveTo(-80, startY);
        graphics.bezierCurveTo(
          controlA,
          startY - trail.span,
          controlB,
          endY + trail.span,
          width + 80,
          endY,
        );
      });
    },
  };
};

const seedTrails = (height: number, count: number): Trail[] =>
  Array.from({ length: count }, (_, index) => ({
    y: ((index + 1) / (count + 1)) * height,
    speed: 0.0022 + Math.random() * 0.0026,
    phase: Math.random() * Math.PI * 2,
    span: 26 + Math.random() * 54,
  }));
