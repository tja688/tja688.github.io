import { type CSSProperties, startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { type WorkItem } from '../../data/works';
import { playSfx } from '../../audio/sfx';
import {
  createCardHoverTimeline,
  playCardImpact,
} from '../../effects/gsap/cardInteractions';
import type { BackgroundSceneHandle } from '../../effects/pixi/backgroundScene';

type WorkCardProps = {
  work: WorkItem;
  audioEnabled: boolean;
  lowFx: boolean;
  reducedMotion: boolean;
  background: BackgroundSceneHandle | null;
  onOpen: (work: WorkItem) => void;
};

export const WorkCard = ({
  work,
  audioEnabled,
  lowFx,
  reducedMotion,
  background,
  onOpen,
}: WorkCardProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const options = useMemo(
    () => ({
      lowFx,
      reducedMotion,
    }),
    [lowFx, reducedMotion],
  );

  useEffect(() => {
    const root = rootRef.current;
    const cover = coverRef.current;
    const glow = glowRef.current;
    const sheen = sheenRef.current;
    const flash = flashRef.current;

    if (!root || !cover || !glow || !sheen || !flash) {
      return;
    }

    const timeline = createCardHoverTimeline(
      {
        root,
        cover,
        glow,
        sheen,
        flash,
      },
      options,
    );

    const triggerHover = () => {
      timeline.restart();
      if (audioEnabled) {
        playSfx('hover', { rate: 1.05, volume: lowFx ? 0.15 : 0.22 });
      }

      const rect = root.getBoundingClientRect();
      background?.hoverAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    const clearHover = () => {
      timeline.reverse();
    };

    root.addEventListener('mouseenter', triggerHover);
    root.addEventListener('focusin', triggerHover);
    root.addEventListener('mouseleave', clearHover);
    root.addEventListener('focusout', clearHover);

    return () => {
      root.removeEventListener('mouseenter', triggerHover);
      root.removeEventListener('focusin', triggerHover);
      root.removeEventListener('mouseleave', clearHover);
      root.removeEventListener('focusout', clearHover);
      timeline.kill();
    };
  }, [audioEnabled, background, lowFx, options]);

  const handleOpen = async () => {
    if (isBusy) {
      return;
    }

    const root = rootRef.current;
    const cover = coverRef.current;
    const glow = glowRef.current;
    const sheen = sheenRef.current;
    const flash = flashRef.current;

    if (!root || !cover || !glow || !sheen || !flash) {
      return;
    }

    setIsBusy(true);

    if (audioEnabled) {
      playSfx('hit', {
        rate: lowFx ? 0.92 : 0.86,
      });
    }

    const rect = root.getBoundingClientRect();
    background?.impactAt(rect.left + rect.width / 2, rect.top + rect.height / 2);

    await playCardImpact(
      {
        root,
        cover,
        glow,
        sheen,
        flash,
      },
      options,
    );

    startTransition(() => {
      onOpen(work);
    });

    window.setTimeout(() => setIsBusy(false), 120);
  };

  return (
    <article
      ref={rootRef}
      className="work-card"
      style={
        {
          '--work-accent': work.accent,
          '--work-accent-secondary': work.secondaryAccent,
        } as CSSProperties
      }
    >
      <div ref={glowRef} className="work-card__glow" aria-hidden="true" />
      <div ref={flashRef} className="work-card__flash" aria-hidden="true" />
      <div className="work-card__frame">
        <div ref={coverRef} className="work-card__cover">
          <div className="work-card__cover-grid" />
          <div className="work-card__cover-mark">{work.status}</div>
          <div ref={sheenRef} className="work-card__sheen" />
        </div>

        <div className="work-card__body">
          <div className="work-card__heading">
            <p>{work.subtitle}</p>
            <h3>{work.title}</h3>
          </div>
          <p className="work-card__blurb">{work.blurb}</p>
          <ul className="work-card__tags" aria-label={`${work.title} tech stack`}>
            {work.tech.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="work-card__actions">
            <button type="button" onClick={handleOpen}>
              Strike Open
            </button>
            <a href={work.href} target="_blank" rel="noreferrer">
              External Link
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
