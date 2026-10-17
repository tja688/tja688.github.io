"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { projects } from "../content/projects";
import { coverImage, statusLabel, kindLabel } from "../content/labels";
import type { ProjectKind } from "../content/types";
import { Media } from "./ui/Media";
import { Reveal } from "./ui/Motion";
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
  const reduce = useReducedMotion();
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
      className="archive-section wrap"
      aria-labelledby="archive-title"
    >
      <Reveal className="section-heading">
        <h2 id="archive-title">
          所有小世界<span className="collection-total">{projects.length}</span>
        </h2>
      </Reveal>
      <div className="archive-toolbar">
        <div className="filters" aria-label="作品分类">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={f.id === filter}
            >
              {f.id === filter && (
                <motion.span
                  className="filter-active"
                  layoutId="archive-filter"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span>{f.label}</span>
              <small>
                {f.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.kind === f.id).length}
              </small>
            </button>
          ))}
        </div>
        <label className="search">
          <MagnifyingGlassIcon size={18} aria-hidden="true" />
          <span className="sr-only">搜索作品或玩法</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="找个游戏"
            type="search"
          />
          {query && (
            <button
              type="button"
              aria-label="清空搜索"
              onClick={() => setQuery("")}
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>
      <p className="sr-only" role="status">
        找到 {visible.length} 个作品
      </p>
      <motion.div className="archive-grid" layout={reduce ? false : "position"}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((p) => (
            <motion.article
              className="archive-card"
              key={p.slug}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                className="archive-image"
                onClick={() => onOpenProject(p.slug)}
                aria-label={`查看 ${p.title} 作品详情`}
              >
                <Media
                  item={{
                    kind: "image",
                    src: coverImage(p.cover),
                    alt: p.cover.alt,
                  }}
                />
              </button>
              <div className="archive-text">
                <p className="project-meta">
                  {kindLabel[p.kind]}
                  <span>{p.year}</span>
                </p>
                <div className="archive-title">
                  <button
                    className="title-button"
                    onClick={() => onOpenProject(p.slug)}
                  >
                    <h3>{p.title}</h3>
                  </button>
                  <ArrowUpRightIcon size={20} aria-hidden="true" />
                </div>
                <p>{p.tagline}</p>
                <div className="archive-meta">
                  <span>{p.tags?.slice(0, 2).join(" / ")}</span>
                  <span className={`status-label status-${p.status}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && (
        <div className="empty-state">
          <MagnifyingGlassIcon size={36} aria-hidden="true" />
          <h3>没有找到这份档案</h3>
          <p>换个词，再找找。</p>
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
    </section>
  );
}
