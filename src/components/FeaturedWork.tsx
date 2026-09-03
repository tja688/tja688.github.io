import { featuredProjects, projects } from '../content/projects';
import { projectEyebrow, statusLabel } from '../content/labels';
import type { Project } from '../content/types';
import { Arrow, Button, LinkButton } from './ui/Button';
import { Media } from './ui/Media';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';

interface Props {
  onOpenProject: (slug: string) => void;
}

export function FeaturedWork({ onOpenProject }: Props) {
  return (
    <section id="work" className="container-x pt-20 pb-24 md:pt-28 md:pb-36">
      <Reveal>
        <SectionHeader
          eyebrow="selected work"
          title="精选作品"
          aside={`${String(featuredProjects.length).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`}
        />
      </Reveal>

      <div className="flex flex-col gap-24 md:gap-36">
        {featuredProjects.map((p, i) => (
          <FeaturedItem key={p.slug} project={p} flip={i % 2 === 1} onOpen={() => onOpenProject(p.slug)} />
        ))}
      </div>
    </section>
  );
}

function FeaturedItem({ project: p, flip, onOpen }: { project: Project; flip: boolean; onOpen: () => void }) {
  const video = p.links.find((l) => l.kind === 'video');
  const aspect = p.cover.kind === 'video' ? 'aspect-square' : 'aspect-[16/10]';

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Reveal className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
        <button
          type="button"
          onClick={onOpen}
          className={`media-frame group block w-full ${aspect} focus-visible:outline-offset-4`}
          aria-label={`查看 ${p.title} 详情`}
        >
          <Media
            item={p.cover}
            className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-expo group-hover:brightness-105"
          />
        </button>
      </Reveal>

      <Reveal delay={0.08} className={`lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
        <p className="eyebrow">{projectEyebrow(p)}</p>
        <h3 className="mt-4 font-serif text-[2.25rem] leading-[1.05] font-bold tracking-tight md:text-[2.75rem]">
          {p.title}
        </h3>
        {p.latinTitle && p.latinTitle !== p.title && (
          <p className="font-display-wide mt-1 text-lg text-ink-muted">{p.latinTitle}</p>
        )}
        {p.award && (
          <p className="mt-5 inline-flex items-start gap-2 text-[15px] leading-snug text-accent-ink">
            <AwardMark />
            <span>{p.award}</span>
          </p>
        )}

        <p className="mt-6 text-[1.125rem] leading-relaxed">{p.tagline}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{p.description[0]}</p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-sm">
          <Fact label="角色" value={p.role} />
          <Fact label="团队" value={p.team} />
          <Fact label="状态" value={statusLabel[p.status]} />
          {p.tags && <Fact label="技术" value={p.tags.join(' · ')} />}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={onOpen}>
            项目详情
            <Arrow />
          </Button>
          {video && (
            <LinkButton variant="ghost" href={video.url}>
              {video.label}
              <Arrow direction="up-right" />
            </LinkButton>
          )}
        </div>
      </Reveal>
    </article>
  );
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

/** 奖项标记：一个小小的群青菱形，只在有奖项的地方出现 */
export function AwardMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="mt-[5px] shrink-0" aria-hidden>
      <path d="M6 0.5 11.5 6 6 11.5 0.5 6Z" fill="currentColor" />
    </svg>
  );
}
