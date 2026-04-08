import gsap from 'gsap';
import { easePresets } from '../../utils/easePresets';
import { flashElement } from './flashEffects';
import { screenShake } from './screenShake';

type CardRefs = {
  root: HTMLElement;
  cover: HTMLElement;
  glow: HTMLElement;
  sheen: HTMLElement;
  flash: HTMLElement;
};

type CardOptions = {
  reducedMotion: boolean;
  lowFx: boolean;
};

export const createCardHoverTimeline = (
  refs: CardRefs,
  options: CardOptions,
) => {
  const scaleTarget = options.reducedMotion ? 1.01 : options.lowFx ? 1.025 : 1.04;
  const lift = options.reducedMotion ? -3 : options.lowFx ? -8 : -12;

  return gsap
    .timeline({ paused: true })
    .to(
      refs.root,
      {
        y: lift,
        scale: scaleTarget,
        duration: 0.24,
        ease: easePresets.hit,
      },
      0,
    )
    .to(
      refs.cover,
      {
        scale: options.reducedMotion ? 1.02 : 1.08,
        duration: 0.32,
        ease: easePresets.float,
      },
      0,
    )
    .to(
      refs.glow,
      {
        opacity: 1,
        duration: 0.18,
        ease: 'power2.out',
      },
      0,
    )
    .fromTo(
      refs.sheen,
      {
        xPercent: -140,
        opacity: 0,
      },
      {
        xPercent: 140,
        opacity: options.reducedMotion ? 0.28 : 0.58,
        duration: options.lowFx ? 0.65 : 0.9,
        ease: 'power2.out',
      },
      0,
    );
};

export const playCardImpact = async (
  refs: CardRefs,
  options: CardOptions,
) =>
  new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      defaults: {
        overwrite: true,
      },
      onComplete: resolve,
    });

    tl.to(refs.root, {
      scale: options.reducedMotion ? 0.99 : 0.97,
      duration: 0.08,
      ease: 'power2.out',
    })
      .add(() => {
        if (!options.reducedMotion) {
          screenShake(refs.root, {
            amplitude: options.lowFx ? 5 : 8,
            duration: options.lowFx ? 0.16 : 0.2,
          });
          flashElement(refs.flash, {
            alpha: options.lowFx ? 0.45 : 0.72,
            duration: 0.04,
          });
        }
      }, '>-0.03')
      .to(
        refs.root,
        {
          scale: options.reducedMotion ? 1.02 : options.lowFx ? 1.06 : 1.1,
          duration: 0.18,
          ease: easePresets.hit,
        },
        '>-0.01',
      )
      .to(
        refs.cover,
        {
          scale: options.reducedMotion ? 1.03 : options.lowFx ? 1.08 : 1.12,
          duration: 0.18,
          ease: easePresets.hit,
        },
        '<',
      )
      .to(refs.root, {
        scale: 1,
        duration: 0.22,
        ease: easePresets.rebound,
      })
      .to(
        refs.cover,
        {
          scale: 1,
          duration: 0.24,
          ease: easePresets.rebound,
        },
        '<',
      );
  });
