import { projects } from "../content/projects";
import { statusLabel } from "../content/labels";
import { Media } from "./ui/Media";

const picks = ["jiugong", "wind-will-read", "helltel"];
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
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / SELECTED WORKS</p>
          <h2 id="selected-title">
            值得停留的小世界<span className="heading-dot">.</span>
          </h2>
        </div>
        <p>
          从九格地牢，到雪中的一封信。
          <br />
          先从这几款开始看看。
        </p>
      </div>
      <div className="featured-grid">
        {picks.map((slug, i) => {
          const p = projects.find((item) => item.slug === slug);
          if (!p) return null;
          return (
            <article key={p.slug} className="featured-card">
              <button
                className="featured-image"
                aria-label={`查看 ${p.title} 作品详情`}
                onClick={() => onOpenProject(p.slug)}
              >
                <Media item={p.cover} className="card-media" />
                <span className="image-index">0{i + 1}</span>
                <span className="image-open" aria-hidden="true">
                  ↗
                </span>
              </button>
              <div className="featured-text">
                <p className="eyebrow">
                  {p.year} <span>/</span> {statusLabel[p.status]}
                </p>
                <button
                  className="title-button"
                  onClick={() => onOpenProject(p.slug)}
                >
                  <h3>{p.title}</h3>
                </button>
                <p>{p.tagline}</p>
                <div className="card-foot">
                  <span>{p.tags?.slice(0, 2).join(" / ")}</span>
                  <button onClick={() => onOpenProject(p.slug)}>
                    打开作品 <span aria-hidden="true">↗</span>
                  </button>
                </div>
                {p.award && (
                  <p className="award">
                    <span aria-hidden="true">✦</span> {p.award}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
