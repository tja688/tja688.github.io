import gsap from 'gsap';

export const flashElement = (
  element: HTMLElement,
  options?: {
    alpha?: number;
    duration?: number;
  },
) => {
  const alpha = options?.alpha ?? 0.72;
  const duration = options?.duration ?? 0.08;

  return gsap
    .timeline()
    .set(element, { opacity: 0, scale: 0.96 })
    .to(element, { opacity: alpha, scale: 1.02, duration, ease: 'power2.out' })
    .to(element, { opacity: 0, scale: 1.1, duration: duration * 1.8, ease: 'power3.out' });
};
