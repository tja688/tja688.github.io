import gsap from 'gsap';
import { easePresets } from '../../utils/easePresets';
import { flashElement } from './flashEffects';

export const createHeroTimeline = (
  root: HTMLElement,
  flash: HTMLElement | null,
  reducedMotion: boolean,
) => {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({
    defaults: {
      ease: easePresets.transition,
    },
  });

  tl.set(q('[data-hero="grid"]'), {
    opacity: 0,
    scale: reducedMotion ? 1 : 1.08,
  })
    .set(q('[data-hero="title"] > span'), {
      opacity: 0,
      yPercent: reducedMotion ? 0 : 100,
    })
    .set(q('[data-hero="copy"], [data-hero="nav"], [data-hero="cta"], [data-hero="rail"], [data-hero="visor"]'), {
      opacity: 0,
      y: reducedMotion ? 0 : 28,
    })
    .to(q('[data-hero="grid"]'), {
      opacity: 1,
      scale: 1,
      duration: reducedMotion ? 0.45 : 0.8,
    })
    .to(
      q('[data-hero="title"] > span'),
      {
        opacity: 1,
        yPercent: 0,
        stagger: reducedMotion ? 0.04 : 0.08,
        duration: reducedMotion ? 0.35 : 0.52,
        ease: easePresets.hit,
      },
      '-=0.18',
    )
    .to(
      q('[data-hero="copy"], [data-hero="nav"]'),
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: reducedMotion ? 0.3 : 0.46,
      },
      '-=0.28',
    );

  if (flash && !reducedMotion) {
    tl.add(() => {
      flashElement(flash, { alpha: 0.48, duration: 0.045 });
    }, '-=0.18');
  }

  tl.to(
    q('[data-hero="visor"], [data-hero="rail"]'),
    {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: reducedMotion ? 0.35 : 0.5,
    },
    '-=0.2',
  ).to(
    q('[data-hero="cta"]'),
    {
      opacity: 1,
      y: 0,
      duration: reducedMotion ? 0.3 : 0.42,
      ease: easePresets.rebound,
    },
    '-=0.12',
  );

  return tl;
};
