import { Graphics } from 'pixi.js';
import { clamp } from '../../utils/clamp';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
};

export type ParticleSystem = ReturnType<typeof createParticleSystem>;

export const createParticleSystem = (
  width: number,
  height: number,
  count: number,
) => {
  let bounds = { width, height };
  let particles = seedParticles(count, bounds.width, bounds.height);

  const respawn = (particle: Particle) => {
    particle.x = Math.random() * bounds.width;
    particle.y = Math.random() * bounds.height;
    particle.vx = (Math.random() - 0.5) * 0.18;
    particle.vy = (Math.random() - 0.5) * 0.22;
    particle.radius = 1 + Math.random() * 2.2;
    particle.alpha = 0.12 + Math.random() * 0.24;
    particle.life = 0;
    particle.maxLife = 260 + Math.random() * 220;
  };

  return {
    resize(nextWidth: number, nextHeight: number) {
      bounds = { width: nextWidth, height: nextHeight };
      particles.forEach((particle) => {
        particle.x = clamp(particle.x, 0, bounds.width);
        particle.y = clamp(particle.y, 0, bounds.height);
      });
    },
    setCount(nextCount: number) {
      if (nextCount === particles.length) {
        return;
      }

      particles = seedParticles(nextCount, bounds.width, bounds.height);
    },
    burst(x: number, y: number, intensity: number) {
      const amount = Math.max(6, Math.round(intensity));

      for (let index = 0; index < amount; index += 1) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * (1.4 + Math.random() * 1.8),
          vy: (Math.random() - 0.5) * (1.4 + Math.random() * 1.8),
          radius: 1.4 + Math.random() * 2.8,
          alpha: 0.32 + Math.random() * 0.42,
          life: 0,
          maxLife: 16 + Math.random() * 24,
        });
      }
    },
    update(delta: number) {
      particles.forEach((particle) => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life += delta;
        particle.alpha *= 0.997;

        if (
          particle.life > particle.maxLife ||
          particle.x < -20 ||
          particle.x > bounds.width + 20 ||
          particle.y < -20 ||
          particle.y > bounds.height + 20
        ) {
          respawn(particle);
        }
      });
    },
    draw(graphics: Graphics) {
      graphics.clear();

      particles.forEach((particle) => {
        graphics.beginFill(0x91ebff, particle.alpha);
        graphics.drawCircle(particle.x, particle.y, particle.radius);
        graphics.endFill();
      });
    },
  };
};

const seedParticles = (count: number, width: number, height: number) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.22,
    radius: 1 + Math.random() * 2.2,
    alpha: 0.12 + Math.random() * 0.24,
    life: 0,
    maxLife: 260 + Math.random() * 220,
  }));
