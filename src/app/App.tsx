import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { works, type WorkItem } from '../data/works';
import { Hero } from '../components/Hero/Hero';
import { WorkGrid } from '../components/WorkGrid/WorkGrid';
import { SectionTitle } from '../components/SectionTitle/SectionTitle';
import { WorkPreviewModal } from '../components/WorkPreviewModal/WorkPreviewModal';
import { DebugHud } from '../components/HUD/DebugHud';
import { configureAudio } from '../audio/sfx';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAudioGate } from '../hooks/useAudioGate';
import { useHeroIntro } from '../hooks/useHeroIntro';
import type { BackgroundSceneHandle, EffectLevel } from '../effects/pixi/backgroundScene';

type DebugSettings = {
  soundEnabled: boolean;
  pixiEnabled: boolean;
  lowFx: boolean;
  simulateReducedMotion: boolean;
};

const defaultDebugSettings: DebugSettings = {
  soundEnabled: true,
  pixiEnabled: true,
  lowFx: false,
  simulateReducedMotion: false,
};

export const App = () => {
  const [debugSettings, setDebugSettings] = useState(defaultDebugSettings);
  const [modalWork, setModalWork] = useState<WorkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const pixiContainerRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<BackgroundSceneHandle | null>(null);
  const reducedMotion = useReducedMotion(debugSettings.simulateReducedMotion);
  const audioEnabled = useAudioGate(debugSettings.soundEnabled);
  const effectLevel: EffectLevel = useMemo(() => {
    if (!debugSettings.pixiEnabled || reducedMotion) {
      return 'reduced';
    }

    return debugSettings.lowFx ? 'low' : 'full';
  }, [debugSettings.lowFx, debugSettings.pixiEnabled, reducedMotion]);
  const deferredEffectLevel = useDeferredValue(effectLevel);

  useHeroIntro(heroRef, flashRef, reducedMotion);

  useEffect(() => {
    configureAudio(!debugSettings.soundEnabled);
  }, [debugSettings.soundEnabled]);

  useEffect(() => {
    const container = pixiContainerRef.current;

    if (!container || deferredEffectLevel === 'reduced') {
      backgroundRef.current?.destroy();
      backgroundRef.current = null;
      if (container) {
        container.innerHTML = '';
      }
      return;
    }

    let isDisposed = false;

    void import('../effects/pixi/backgroundScene').then(({ createBackgroundScene }) => {
      void createBackgroundScene(container, deferredEffectLevel).then((scene) => {
        if (isDisposed) {
          scene.destroy();
          return;
        }

        backgroundRef.current = scene;
      });
    });

    return () => {
      isDisposed = true;
      backgroundRef.current?.destroy();
      backgroundRef.current = null;
      container.innerHTML = '';
    };
  }, [deferredEffectLevel]);

  useEffect(() => {
    backgroundRef.current?.setLevel(deferredEffectLevel);
  }, [deferredEffectLevel]);

  const toggleSetting = (key: keyof DebugSettings) => {
    setDebugSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleEnterWorks = () => {
    document.getElementById('works')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleOpenWork = (work: WorkItem) => {
    startTransition(() => {
      setModalWork(work);
      setIsModalOpen(true);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExited = () => {
    setModalWork(null);
  };

  return (
    <div className="app-shell">
      <div ref={pixiContainerRef} className="background-layer" aria-hidden="true" />
      <div ref={flashRef} className="screen-flash" aria-hidden="true" />

      <main className="app">
        <Hero heroRef={heroRef} onEnterWorks={handleEnterWorks} />

        <WorkGrid
          works={works}
          audioEnabled={audioEnabled}
          lowFx={debugSettings.lowFx}
          reducedMotion={reducedMotion}
          background={backgroundRef.current}
          onOpen={handleOpenWork}
        />

        <section className="about-section section-shell" id="about">
          <SectionTitle
            eyebrow="About / Skills"
            title="Less resume. More combat-readiness."
            body="这部分刻意降躁，作为节奏缓冲。只保留身份、技能方向和对外信号，不抢前面的交互舞台。"
          />

          <div className="about-section__layout">
            <div className="about-section__panel">
              <p>{profile.intro}</p>
              <p>{profile.systemNote}</p>
            </div>
            <div className="about-section__panel">
              <ul className="about-section__skills">
                {profile.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="signal-section section-shell" id="signal">
          <SectionTitle
            eyebrow="Contact Signal"
            title="如果风格对味，就把真实项目接进来。"
            body="这个原型已经把结构、动效层、特效层和音效门控分开。后续只需要替换占位内容和补素材。"
          />
          <div className="signal-section__actions">
            {profile.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <DebugHud settings={debugSettings} onToggle={toggleSetting} />

      <WorkPreviewModal
        work={modalWork}
        isOpen={isModalOpen}
        audioEnabled={audioEnabled}
        reducedMotion={reducedMotion}
        onClose={handleCloseModal}
        onExited={handleExited}
      />
    </div>
  );
};
