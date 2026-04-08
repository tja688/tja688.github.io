import gsap from 'gsap';
import { easePresets } from '../../utils/easePresets';

type ModalRefs = {
  overlay: HTMLElement;
  panel: HTMLElement;
  media: HTMLElement;
  copy: HTMLElement;
};

export const playModalOpen = (refs: ModalRefs, reducedMotion: boolean) =>
  gsap
    .timeline()
    .set(refs.overlay, { opacity: 0 })
    .set(refs.panel, {
      opacity: 0,
      y: reducedMotion ? 0 : 48,
      scale: reducedMotion ? 1 : 0.96,
    })
    .set(refs.media, {
      opacity: 0,
      x: reducedMotion ? 0 : -30,
    })
    .set(refs.copy, {
      opacity: 0,
      x: reducedMotion ? 0 : 28,
    })
    .to(refs.overlay, {
      opacity: 1,
      duration: reducedMotion ? 0.18 : 0.26,
      ease: 'power2.out',
    })
    .to(
      refs.panel,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: reducedMotion ? 0.24 : 0.42,
        ease: easePresets.transition,
      },
      '<',
    )
    .to(
      refs.media,
      {
        opacity: 1,
        x: 0,
        duration: reducedMotion ? 0.22 : 0.34,
        ease: easePresets.hit,
      },
      '-=0.2',
    )
    .to(
      refs.copy,
      {
        opacity: 1,
        x: 0,
        duration: reducedMotion ? 0.22 : 0.32,
        ease: easePresets.transition,
      },
      '-=0.24',
    );

export const playModalClose = (
  refs: ModalRefs,
  reducedMotion: boolean,
  onComplete: () => void,
) =>
  gsap.timeline({ onComplete }).to(refs.panel, {
    opacity: 0,
    y: reducedMotion ? 0 : 28,
    scale: reducedMotion ? 1 : 0.98,
    duration: reducedMotion ? 0.16 : 0.22,
    ease: 'power2.in',
  }).to(
    refs.overlay,
    {
      opacity: 0,
      duration: reducedMotion ? 0.12 : 0.18,
      ease: 'power2.in',
    },
    '-=0.12',
  );
