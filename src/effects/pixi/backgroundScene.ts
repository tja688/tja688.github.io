import { Application, Graphics } from 'pixi.js';
import { createBezierTrails } from './bezierTrails';
import { createDistortionLayer } from './distortionLayer';
import { createParticleSystem } from './particleSystem';

export type EffectLevel = 'full' | 'low' | 'reduced';

export type BackgroundSceneHandle = {
  hoverAt: (x: number, y: number) => void;
  impactAt: (x: number, y: number) => void;
  setLevel: (level: EffectLevel) => void;
  destroy: () => void;
};

export const createBackgroundScene = async (
  container: HTMLDivElement,
  initialLevel: EffectLevel,
) => {
  const app = new Application();
  await app.init({
    backgroundAlpha: 0,
    antialias: true,
    resizeTo: window,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true,
  });

  container.appendChild(app.canvas);

  const particleGraphics = new Graphics();
  const trailGraphics = new Graphics();
  const pulseGraphics = new Graphics();

  app.stage.addChild(trailGraphics, pulseGraphics, particleGraphics);

  let level = initialLevel;
  let particleCount = getParticleCount(level);
  let trailCount = getTrailCount(level);

  const particles = createParticleSystem(window.innerWidth, window.innerHeight, particleCount);
  const trails = createBezierTrails(window.innerHeight, trailCount);
  const pulses = createDistortionLayer();

  const syncCounts = () => {
    particleCount = getParticleCount(level);
    trailCount = getTrailCount(level);
    particles.setCount(particleCount);
    trails.resize(window.innerHeight, trailCount);
  };

  const handleResize = () => {
    particles.resize(window.innerWidth, window.innerHeight);
    trails.resize(window.innerHeight, trailCount);
  };

  window.addEventListener('resize', handleResize);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 16.6667;
    particles.update(delta);
    trails.update(delta);
    pulses.update(delta);

    trails.draw(trailGraphics, window.innerWidth);
    pulses.draw(pulseGraphics);
    particles.draw(particleGraphics);
  });

  const handle: BackgroundSceneHandle = {
    hoverAt(x, y) {
      if (level === 'reduced') {
        return;
      }

      pulses.push(x, y, level === 'low' ? 0.7 : 1);
    },
    impactAt(x, y) {
      if (level === 'reduced') {
        return;
      }

      pulses.push(x, y, level === 'low' ? 1 : 1.3);
      particles.burst(x, y, level === 'low' ? 8 : 16);
    },
    setLevel(nextLevel) {
      level = nextLevel;
      syncCounts();
    },
    destroy() {
      window.removeEventListener('resize', handleResize);
      app.destroy(true, { children: true });
    },
  };

  return handle;
};

const getParticleCount = (level: EffectLevel) => {
  if (level === 'reduced') {
    return 0;
  }

  const mobilePenalty = window.innerWidth < 960 ? 0.65 : 1;
  return Math.round((level === 'low' ? 28 : 46) * mobilePenalty);
};

const getTrailCount = (level: EffectLevel) => {
  if (level === 'reduced') {
    return 1;
  }

  return window.innerWidth < 960 ? (level === 'low' ? 2 : 3) : level === 'low' ? 3 : 5;
};
