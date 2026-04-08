import { RefObject, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { createHeroTimeline } from '../effects/gsap/heroTimeline';

export const useHeroIntro = (
  rootRef: RefObject<HTMLElement | null>,
  flashRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) => {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const ctx = gsap.context(() => {
      createHeroTimeline(root, flashRef.current, reducedMotion);
    }, root);

    return () => ctx.revert();
  }, [flashRef, reducedMotion, rootRef]);
};
