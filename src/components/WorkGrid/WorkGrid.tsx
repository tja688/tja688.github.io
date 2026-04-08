import { type WorkItem } from '../../data/works';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { WorkCard } from '../WorkCard/WorkCard';
import type { BackgroundSceneHandle } from '../../effects/pixi/backgroundScene';

type WorkGridProps = {
  works: WorkItem[];
  audioEnabled: boolean;
  lowFx: boolean;
  reducedMotion: boolean;
  background: BackgroundSceneHandle | null;
  onOpen: (work: WorkItem) => void;
};

export const WorkGrid = ({
  works,
  audioEnabled,
  lowFx,
  reducedMotion,
  background,
  onOpen,
}: WorkGridProps) => (
  <section className="works-section section-shell" id="works">
    <SectionTitle
      eyebrow="Target Select"
      title="Hover like a level node. Click like a hit confirm."
      body="这里先只放三张占位卡，重点验证它们是否像游戏里的可交互对象，而不是普通作品集卡片。"
    />

    <div className="works-grid">
      {works.map((work) => (
        <WorkCard
          key={work.id}
          work={work}
          audioEnabled={audioEnabled}
          lowFx={lowFx}
          reducedMotion={reducedMotion}
          background={background}
          onOpen={onOpen}
        />
      ))}
    </div>
  </section>
);
