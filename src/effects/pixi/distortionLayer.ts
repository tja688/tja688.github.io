import { Graphics } from 'pixi.js';

type Pulse = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  growth: number;
};

export const createDistortionLayer = () => {
  let pulses: Pulse[] = [];

  return {
    push(x: number, y: number, scale: number) {
      pulses.push({
        x,
        y,
        radius: 18,
        maxRadius: 90 * scale,
        alpha: 0.26,
        growth: 2.8 * scale,
      });
    },
    update(delta: number) {
      pulses = pulses
        .map((pulse) => ({
          ...pulse,
          radius: pulse.radius + pulse.growth * delta,
          alpha: pulse.alpha * 0.96,
        }))
        .filter((pulse) => pulse.alpha > 0.01 && pulse.radius < pulse.maxRadius);
    },
    draw(graphics: Graphics) {
      graphics.clear();

      pulses.forEach((pulse, index) => {
        graphics.lineStyle(1.4, index % 2 === 0 ? 0x9ff8ff : 0xff72c0, pulse.alpha);
        graphics.drawCircle(pulse.x, pulse.y, pulse.radius);
      });
    },
  };
};
