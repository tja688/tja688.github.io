"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import { projects } from "../content/projects";
import { coverImage, statusLabel } from "../content/labels";
import type { Project } from "../content/types";
import { Media } from "./ui/Media";
import { Burst, MagneticLink, Tilt } from "./ui/Motion";
const showcase = ["phantom-flash", "jiugong", "wind-will-read"]
  .map((slug) => projects.find((item) => item.slug === slug))
  .filter((item): item is Project => item !== undefined);

export function Hero({
  onOpenProject,
}: {
  onOpenProject: (slug: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const reduce = useReducedMotion();
  const project = showcase[selected];
  if (!project) return null;
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <motion.div
        className="hero-intro"
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      >
        <p className="eyebrow">独立游戏与玩法实验</p>
        <h1 id="hero-title">
          把想法
          <br />
          做成
          <span className="ink-word">
            游戏<span className="pixel-period">。</span>
          </span>
        </h1>
        <p className="hero-description">
          一些小世界，一些奇怪的规则。
          <br />
          欢迎来玩。
        </p>
        <MagneticLink className="button primary" href="#games">
          全部游戏{" "}
          <ArrowDownRightIcon size={20} weight="bold" aria-hidden="true" />
        </MagneticLink>
      </motion.div>
      <motion.div
        className="hero-gallery"
        initial={reduce ? false : { opacity: 0, y: 36, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          delay: 0.12,
        }}
      >
        <Tilt className="showcase">
          <button
            className="showcase-screen"
            onClick={() => onOpenProject(project.slug)}
            aria-label={`查看 ${project.title} 作品详情`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                className="showcase-frame"
                key={project.slug}
                initial={reduce ? false : { opacity: 0, scale: 1.045, x: 16 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
              >
                <Media
                  item={project.cover}
                  priority
                  className="showcase-media"
                />
              </motion.div>
            </AnimatePresence>
          </button>
          <div className="showcase-info" aria-live="polite" aria-atomic="true">
            <div>
              <p className="project-meta">
                {project.year}
                <span>{statusLabel[project.status]}</span>
              </p>
              <h2>{project.title}</h2>
            </div>
            <motion.button
              className="square-button"
              whileHover={reduce ? undefined : { rotate: 8, scale: 1.1 }}
              whileTap={reduce ? undefined : { scale: 0.85 }}
              aria-label={`打开 ${project.title}`}
              onClick={() => onOpenProject(project.slug)}
            >
              <ArrowUpRightIcon size={25} weight="bold" aria-hidden="true" />
            </motion.button>
          </div>
        </Tilt>
        <div className="showcase-selector" aria-label="选择展示作品">
          {showcase.map((p, i) => (
            <motion.button
              key={p.slug}
              onClick={() => {
                if (i !== selected) {
                  setSelected(i);
                  setSelectionCount((n) => n + 1);
                }
              }}
              aria-pressed={i === selected}
              whileTap={reduce ? undefined : { scale: 0.94 }}
            >
              {i === selected && (
                <motion.span
                  className="selector-active"
                  layoutId="showcase-selection"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <img src={coverImage(p.cover)} alt="" width="48" height="36" />
              <span className="selector-title">{p.title}</span>
              {i === selected && (
                <PlayIcon
                  className="selector-play"
                  size={11}
                  weight="fill"
                  aria-hidden="true"
                />
              )}
              {i === selected && selectionCount > 0 && (
                <Burst key={selectionCount} />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
