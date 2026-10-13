import { useState } from "react";
import { projects } from "../content/projects";
import { coverImage, statusLabel, kindLabel } from "../content/labels";
import type { ProjectKind } from "../content/types";

const filters: { id: "all" | ProjectKind; label: string }[] = [
  { id: "all", label: "全部作品" },
  { id: "indie", label: "独立项目" },
  { id: "jam", label: "Game Jam" },
  { id: "prototype", label: "练手原型" },
  { id: "coursework", label: "技术实验" },
];

export function ProjectArchive({
  onOpenProject,
}: {
  onOpenProject: (slug: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | ProjectKind>("all");
  const [query, setQuery] = useState("");
  const visible = projects.filter(
    (p) =>
      (filter === "all" || p.kind === filter) &&
      `${p.title} ${p.tagline} ${p.tags?.join(" ") ?? ""}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <section
      id="games"
      className="archive-section"
      aria-labelledby="archive-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / THE COLLECTION</p>
            <h2 id="archive-title">
              作品存档<span className="heading-dot">.</span>
            </h2>
          </div>
          <p>
            做出来的东西，和留下来的尝试。
            <br />
            选一个，看看它的玩法和故事。
          </p>
        </div>
        <div className="archive-toolbar">
          <div className="filters" aria-label="作品分类">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={f.id === filter}
              >
                {f.label}
                <small>
                  {f.id === "all"
                    ? projects.length
                    : projects.filter((p) => p.kind === f.id).length}
                </small>
              </button>
            ))}
          </div>
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">搜索作品或玩法</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索作品 / 玩法"
              type="search"
            />
          </label>
        </div>
        <div className="archive-count" role="status">
          {String(visible.length).padStart(2, "0")} 个作品{" "}
          <span>点击封面，打开档案</span>
        </div>
        <div className="archive-grid">
          {visible.map((p) => (
            <article className="archive-card" key={p.slug}>
              <button
                className="archive-image"
                onClick={() => onOpenProject(p.slug)}
                aria-label={`查看 ${p.title} 作品详情`}
              >
                <img
                  src={coverImage(p.cover)}
                  alt={p.cover.alt}
                  loading="lazy"
                />
                <span className={`status-label status-${p.status}`}>
                  <span />
                  {statusLabel[p.status]}
                </span>
                <span className="image-open" aria-hidden="true">
                  ↗
                </span>
              </button>
              <div className="archive-text">
                <p className="eyebrow">
                  {p.year} / {kindLabel[p.kind]}
                </p>
                <button
                  className="title-button"
                  onClick={() => onOpenProject(p.slug)}
                >
                  <h3>{p.title}</h3>
                </button>
                <p>{p.tagline}</p>
                <div className="archive-meta">
                  <span>{p.tags?.slice(0, 2).join(" · ")}</span>
                  <span>
                    {p.links.some((l) => l.kind === "play")
                      ? "可在线玩 ↗"
                      : p.links.some((l) => l.kind === "download")
                        ? "有试玩包 ↗"
                        : "查看档案 ↗"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">[ ? ]</span>
            <h3>没有找到这份档案</h3>
            <p>换个关键词，或者回到全部作品。</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              重置筛选
            </button>
          </div>
        )}
        <div className="archive-end">
          <span>END OF COLLECTION</span>
          <span>{projects.length} SMALL WORLDS / MORE TO COME</span>
        </div>
      </div>
    </section>
  );
}
