import { projects } from '../content/projects';
import { coverImage, kindLabel, statusLabel } from '../content/labels';
import { Arrow } from './ui/Button';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';
import { AwardMark } from './FeaturedWork';

interface Props {
  onOpenProject: (slug: string) => void;
}

export function ProjectArchive({ onOpenProject }: Props) {
  const years = projects.map((p) => p.year).filter((y) => /^\d{4}/.test(y));
  const span = years.length ? `${years[years.length - 1].slice(0, 4)} – ${years[0].slice(0, 4)}` : '';

  return (
    <section id="archive" className="container-x pb-24 md:pb-36">
      <Reveal>
        <SectionHeader eyebrow="all projects" title="全部项目" aside={`${span} · ${projects.length} 个`} />
      </Reveal>

      <Reveal>
        <ul className="border-y border-line">
          {projects.map((p) => (
            <li key={p.slug} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => onOpenProject(p.slug)}
                className="group -mx-3 grid w-[calc(100%+1.5rem)] grid-cols-[3.25rem_3.5rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-xl px-3 py-4 text-left transition-colors duration-300 ease-expo hover:bg-surface md:grid-cols-[3.5rem_3.5rem_minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.1fr)_auto] md:gap-x-6"
              >
                <span className="font-mono text-[13px] text-ink-muted tabular-nums">{p.year}</span>

                <span className="media-frame h-14 w-14 rounded-lg">
                  <img
                    src={coverImage(p.cover)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-serif text-[1.15rem] font-bold tracking-tight text-ink">{p.title}</span>
                    {p.latinTitle && p.latinTitle !== p.title && (
                      <span className="font-display-wide text-[13px] text-ink-muted">{p.latinTitle}</span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-ink-muted">{p.tagline}</span>
                </span>

                <span className="hidden min-w-0 text-sm leading-snug text-ink-muted md:block">
                  <span className="block truncate">{p.event ?? kindLabel[p.kind]}</span>
                  <span className="block truncate text-ink-faint">{p.role}</span>
                </span>

                <span className="hidden min-w-0 text-sm leading-snug md:block">
                  {p.award ? (
                    <span className="inline-flex items-start gap-1.5 text-accent-ink">
                      <AwardMark />
                      <span className="line-clamp-2">{p.award}</span>
                    </span>
                  ) : (
                    <span className="text-ink-faint">{statusLabel[p.status]}</span>
                  )}
                </span>

                <Arrow className="text-ink-faint transition-[color,transform] duration-300 ease-expo group-hover:translate-x-0.5 group-hover:text-ink" />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
