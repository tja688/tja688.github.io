import gsap from 'gsap';

type ScreenShakeOptions = {
  amplitude?: number;
  duration?: number;
};

export const screenShake = (
  element: HTMLElement,
  options: ScreenShakeOptions = {},
) => {
  const amplitude = options.amplitude ?? 8;
  const duration = options.duration ?? 0.2;

  return gsap.timeline().to(element, {
    keyframes: [
      { x: -amplitude, y: amplitude * 0.35, duration: duration * 0.18 },
      { x: amplitude * 0.72, y: -amplitude * 0.3, duration: duration * 0.18 },
      { x: -amplitude * 0.45, y: amplitude * 0.18, duration: duration * 0.18 },
      { x: amplitude * 0.25, y: -amplitude * 0.12, duration: duration * 0.18 },
      { x: 0, y: 0, duration: duration * 0.28 },
    ],
    overwrite: true,
    ease: 'none',
  });
};
