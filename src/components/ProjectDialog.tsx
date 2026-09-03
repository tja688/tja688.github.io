import { useEffect, useRef } from 'react';
import type { Project } from '../content/types';
import { kindLabel, projectEyebrow, statusLabel } from '../content/labels';
import { Arrow, LinkButton } from './ui/Button';
import { CopyField } from './ui/CopyField';
import { Media } from './ui/Media';
import { AwardMark, Fact } from './FeaturedWork';

interface Props {
  project: Project | null;
  onClose: () => void;
}

/**
 * 项目详情：原生 <dialog>，Esc / 点击遮罩关闭。
 * 试玩包的网盘链接与提取码只在这里出现，首页保持干净。
 */
export function ProjectDialog({ project, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!project && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // 每次换项目时把滚动位置归零
  useEffect(() => {
    ref.current?.querySelector('[data-scroll]')?.scrollTo({ top: 0 });
  }, [project?.slug]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // 点击 dialog 自身（即遮罩区域）时关闭；点击内容不关闭
        if (e.target === e.currentTarget) onClose();
      }}
      className="project-dialog m-auto w-[min(100vw-1.5rem,64rem)] max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-2xl bg-surface p-0 text-ink shadow-[0_40px_120px_rgb(0_0_0/0.5)] backdrop:bg-transparent"
      aria-labelledby="project-dialog-title"
    >
      {project && (
        <div data-scroll className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-surface/85 px-5 py-3.5 backdrop-blur-md md:px-8">
            <p className="eyebrow truncate">{projectEyebrow(project)}</p>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </header>

          <div className="px-5 pb-10 md:px-8 md:pb-14">
            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <h2 id="project-dialog-title" className="font-serif text-[2rem] leading-[1.05] font-bold tracking-tight md:text-[2.5rem]">
                {project.title}
              </h2>
              {project.latinTitle && project.latinTitle !== project.title && (
                <p className="font-display-wide text-lg text-ink-muted">{project.latinTitle}</p>
              )}
            </div>
            {project.award && (
              <p className="mt-4 inline-flex items-start gap-2 text-[15px] leading-snug text-accent-ink">
                <AwardMark />
                <span>{project.award}</span>
              </p>
            )}
            <p className="mt-5 max-w-3xl text-[1.125rem] leading-relaxed">{project.tagline}</p>

            <div className={`media-frame mt-8 ${project.cover.kind === 'video' ? 'mx-auto max-w-[40rem] aspect-square' : 'aspect-[16/10]'}`}>
              <Media item={project.cover} className="h-full w-full object-cover" priority />
            </div>

            <div className="mt-10 grid gap-10 md:grid-cols-12">
              <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted md:col-span-7 md:text-base">
                {project.description.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>

              <aside className="md:col-span-5">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-sm">
                  <Fact label="角色" value={project.role} />
                  <Fact label="团队" value={project.team} />
                  <Fact label="类型" value={kindLabel[project.kind]} />
                  <Fact label="状态" value={statusLabel[project.status]} />
                  {project.event && (
                    <div className="col-span-2">
                      <Fact label="场合" value={project.event} />
                    </div>
                  )}
                  {project.tags && (
                    <div className="col-span-2">
                      <Fact label="技术" value={project.tags.join(' · ')} />
                    </div>
                  )}
                </dl>

                {project.links.length > 0 && (
                  <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
                    {project.links.map((link) => {
                      if (link.kind === 'download') {
                        return (
                          <div key={link.url} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <LinkButton href={link.url}>
                              获取{link.label ?? '试玩包'}
                              <Arrow direction="up-right" />
                            </LinkButton>
                            {link.code && (
                              <CopyField
                                value={link.code}
                                className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
                              >
                                <span>
                                  提取码 <span className="font-mono text-ink">{link.code}</span>
                                </span>
                              </CopyField>
                            )}
                          </div>
                        );
                      }
                      return (
                        <LinkButton key={link.url} href={link.url} variant="ghost" className="self-start">
                          {link.label}
                          <Arrow direction="up-right" />
                        </LinkButton>
                      );
                    })}
                  </div>
                )}
              </aside>
            </div>

            {project.gallery.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((item) => (
                  <figure key={item.src} className={`media-frame ${item.kind === 'video' ? 'aspect-square' : ''}`}>
                    <Media item={item} className={item.kind === 'video' ? 'h-full w-full object-cover' : 'w-full'} />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
