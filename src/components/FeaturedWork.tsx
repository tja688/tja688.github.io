import { ArrowUpRightIcon, TrophyIcon } from "@phosphor-icons/react";
import { projects } from "../content/projects";
import { statusLabel } from "../content/labels";
import { Media } from "./ui/Media";
import { Reveal, Tilt } from "./ui/Motion";
const picks = ["jiugong", "wind-will-read", "helltel"];
const descriptions: Record<string, string> = {
  jiugong: "九格之间，一层层冒险。",
  "wind-will-read": "在风雪尽头，送一封信。",
  helltel: "身体软一点，上班疯一点。",
};

export function FeaturedWork({
  onOpenProject,
}: {
  onOpenProject: (slug: string) => void;
}) {
  return (
    <section
      id="selected"
      className="selected-section wrap"
      aria-labelledby="selected-title"
    >
      <Reveal className="section-heading">
        <h2 id="selected-title">
          先玩这几个<span className="heading-dot">。</span>
        </h2>
      </Reveal>
      <div className="featured-grid">
        {picks.map((slug, i) => {
          const p = projects.find((item) => item.slug === slug);
          if (!p) return null;
          return (
            <Reveal
              key={p.slug}
              className={`featured-slot featured-slot-${i}`}
              delay={i * 0.06}
            >
              <article className="featured-card">
                <Tilt className="featured-tilt">
                  <button
                    className="featured-image"
                    aria-label={`查看 ${p.title} 作品详情`}
                    onClick={() => onOpenProject(p.slug)}
                  >
                    <Media item={p.cover} className="card-media" />
                  </button>
                </Tilt>
                <div className="featured-text">
                  <div className="featured-title">
                    <button
                      className="title-button"
                      onClick={() => onOpenProject(p.slug)}
                    >
                      <h3>{p.title}</h3>
                    </button>
                    <ArrowUpRightIcon size={23} aria-hidden="true" />
                  </div>
                  <p>{descriptions[p.slug]}</p>
                  <div className="card-foot">
                    <span>
                      {p.year} / {statusLabel[p.status]}
                    </span>
                    {p.award ? (
                      <span className="award">
                        <TrophyIcon size={14} aria-hidden="true" />
                        最佳视觉设计 第一名
                      </span>
                    ) : (
                      <span>{p.tags?.slice(0, 2).join(" / ")}</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
