import { useState } from "react";
import { projects } from "../content/projects";
import { coverImage, statusLabel } from "../content/labels";
import { Media } from "./ui/Media";

const showcase = projects.filter((p) =>
  ["the-called", "jiugong", "wind-will-read"].includes(p.slug),
);

export function Hero({
  onOpenProject,
}: {
  onOpenProject: (slug: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const project = showcase[selected];
  if (!project) return null;
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-intro">
        <p className="eyebrow">
          <span className="signal" /> INDEPENDENT GAME ARCHIVE
        </p>
        <h1 id="hero-title">
          把想法
          <br />
          做成
          <span className="ink-word">
            游戏
            <span className="pixel-period" />。
          </span>
        </h1>
        <p className="hero-description">
          一些小世界，一些奇怪的规则。
          <br />
          这里收藏我做过的独立游戏、Game Jam，
          <br className="desktop-break" />
          还有没能走到终点的实验。
        </p>
        <a className="button primary" href="#games">
          进入作品库 <span aria-hidden="true">↓</span>
        </a>
        <div className="hero-note">
          <span className="pixel-spark" aria-hidden="true">
            ✦
          </span>
          <span>
            已完成的、开发中的，都在这里。
            <br />
            <small>SELECT A GAME. STAY A WHILE.</small>
          </span>
        </div>
      </div>
      <div className="showcase">
        <div className="window-bar">
          <span>
            <i /> NOW SHOWING
          </span>
          <span>
            {String(selected + 1).padStart(2, "0")} / 03{" "}
            <span aria-hidden="true">▰ ▱ ▱</span>
          </span>
        </div>
        <button
          className="showcase-screen"
          onClick={() => onOpenProject(project.slug)}
          aria-label={`查看 ${project.title} 作品详情`}
        >
          <Media
            key={project.slug}
            item={project.cover}
            priority
            className="showcase-media"
          />
          <span className="screen-corner top-left" />
          <span className="screen-corner bottom-right" />
          <span className="screen-caption">
            实际游戏画面 <span aria-hidden="true">↗</span>
          </span>
        </button>
        <div className="showcase-info">
          <div>
            <span className="eyebrow">
              {project.year} / {statusLabel[project.status]}
            </span>
            <h2>{project.title}</h2>
            <p>{project.tagline}</p>
          </div>
          <button
            className="square-button"
            aria-label={`打开 ${project.title}`}
            onClick={() => onOpenProject(project.slug)}
          >
            ↗
          </button>
        </div>
        <div className="showcase-selector" aria-label="选择展示作品">
          {showcase.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className={i === selected ? "selected" : ""}
            >
              <img src={coverImage(p.cover)} alt="" />
              <span>
                <small>0{i + 1}</small>
                {p.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="hero-bottom">
        <span>小体量 · 玩法实验 · 自己动手</span>
        <a href="#selected">
          往下探索 <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
