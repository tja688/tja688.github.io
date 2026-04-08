import { type CSSProperties, useEffect, useRef } from 'react';
import { type WorkItem } from '../../data/works';
import { playSfx } from '../../audio/sfx';
import {
  playModalClose,
  playModalOpen,
} from '../../effects/gsap/modalTimeline';

type WorkPreviewModalProps = {
  work: WorkItem | null;
  isOpen: boolean;
  audioEnabled: boolean;
  reducedMotion: boolean;
  onClose: () => void;
  onExited: () => void;
};

export const WorkPreviewModal = ({
  work,
  isOpen,
  audioEnabled,
  reducedMotion,
  onClose,
  onExited,
}: WorkPreviewModalProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!work) {
      return;
    }

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;

    if (!overlay || !panel || !media || !copy) {
      return;
    }

    if (isOpen) {
      if (audioEnabled) {
        playSfx('open', { rate: reducedMotion ? 1 : 0.92 });
      }

      const openTimeline = playModalOpen(
        {
          overlay,
          panel,
          media,
          copy,
        },
        reducedMotion,
      );

      return () => {
        openTimeline.kill();
      };
    }

    const closeTimeline = playModalClose(
      {
        overlay,
        panel,
        media,
        copy,
      },
      reducedMotion,
      onExited,
    );

    return () => {
      closeTimeline.kill();
    };
  }, [audioEnabled, isOpen, onExited, reducedMotion, work]);

  useEffect(() => {
    if (!work || !isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, work]);

  if (!work) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`modal ${isOpen ? 'is-open' : 'is-closing'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-modal-title"
    >
      <div className="modal__backdrop" onClick={onClose} />
      <div ref={panelRef} className="modal__panel">
        <button className="modal__close" type="button" onClick={onClose} aria-label="Close detail panel">
          CLOSE
        </button>
        <div ref={mediaRef} className="modal__media">
          <div
            className="modal__art"
            style={
              {
                '--work-accent': work.accent,
                '--work-accent-secondary': work.secondaryAccent,
              } as CSSProperties
            }
          >
            <span>{work.status}</span>
            <strong>{work.title}</strong>
          </div>
        </div>
        <div ref={copyRef} className="modal__copy">
          <p className="modal__eyebrow">{work.subtitle}</p>
          <h3 id="work-modal-title">{work.title}</h3>
          <p className="modal__description">{work.description}</p>
          <ul className="modal__tags">
            {work.tech.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="modal__actions">
            <a href={work.href} target="_blank" rel="noreferrer">
              Visit
            </a>
            <button type="button" onClick={onClose}>
              Close Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
