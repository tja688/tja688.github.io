import { useEffect, useRef } from "react";
import type { Project } from "../content/types";
import { kindLabel, statusLabel } from "../content/labels";
import { CopyField } from "./ui/CopyField";
import { Media } from "./ui/Media";

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const playable = project?.links.find((link) => link.kind === "play");
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project) {
      if (!dialog.open) {
        returnFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
      dialog.querySelector("[data-scroll]")?.scrollTo({ top: 0 });
    } else if (dialog.open) {
      dialog.close();
      returnFocus.current?.focus({ preventScroll: true });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="dialog-inner" data-scroll>
          <header className="dialog-bar">
            <span className="eyebrow">
              GAME FILE / {project.year} / {kindLabel[project.kind]}
            </span>
            <button
              className="dialog-close"
              onClick={onClose}
              aria-label="关闭作品详情"
              autoFocus
            >
              关闭 <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className="dialog-heading">
            <div>
              <p className={`status-label status-${project.status}`}>
                <span />
                {statusLabel[project.status]}
              </p>
              <h2 id="project-dialog-title">{project.title}</h2>
              <p>{project.tagline}</p>
            </div>
            {playable && (
              <a
                className="button primary"
                href={playable.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                在线试玩 <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <div className="dialog-cover">
            <Media
              key={project.slug}
              item={project.cover}
              className="dialog-media"
              priority
            />
          </div>
          <div className="dialog-body">
            <div className="project-story">
              <p className="eyebrow">ABOUT THIS GAME</p>
              {project.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {project.award && (
                <p className="award">
                  <span aria-hidden="true">✦</span> {project.award}
                </p>
              )}
            </div>
            <aside className="project-facts">
              <dl>
                <div>
                  <dt>开发</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>团队</dt>
                  <dd>{project.team}</dd>
                </div>
                {project.event && (
                  <div>
                    <dt>场合</dt>
                    <dd>{project.event}</dd>
                  </div>
                )}
                {project.tags && (
                  <div>
                    <dt>关键词</dt>
                    <dd>{project.tags.join(" / ")}</dd>
                  </div>
                )}
              </dl>
              <div className="project-links">
                {project.links.map((link) => (
                  <div key={link.url}>
                    <a
                      className={`button ${link.kind === "play" || link.kind === "download" ? "primary" : ""}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label ?? "获取试玩包"}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                    {link.kind === "download" && link.code && (
                      <CopyField value={link.code} className="copy-code">
                        提取码 <span>{link.code}</span>
                      </CopyField>
                    )}
                  </div>
                ))}
                {project.links.length === 0 && (
                  <p className="no-build">这份档案暂时没有试玩版本。</p>
                )}
              </div>
            </aside>
          </div>
          {project.gallery.length > 0 && (
            <section className="dialog-gallery" aria-label="游戏画面">
              <p className="eyebrow">MORE FROM THIS WORLD / 游戏画面</p>
              <div>
                {project.gallery.map((item) => (
                  <figure key={item.src}>
                    <Media item={item} className="gallery-media" />
                    <figcaption>{item.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
          <div className="dialog-end">
            <span className="eyebrow">END OF FILE</span>
            <button onClick={onClose}>
              返回作品库 <span aria-hidden="true">↙</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
