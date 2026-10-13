import type { MediaItem, Project, ProjectKind, ProjectStatus } from "./types";

export const kindLabel: Record<ProjectKind, string> = {
  indie: "独立项目",
  jam: "Game Jam",
  coursework: "技术实验",
  prototype: "原型",
};

export const statusLabel: Record<ProjectStatus, string> = {
  "in-dev": "开发中",
  shipped: "已完成",
  shelved: "已搁置",
  unreleased: "练手 · 未发布",
};

/** 列表缩略图用的静态图：视频取海报帧 */
export const coverImage = (item: MediaItem) =>
  item.kind === "video" ? item.poster : item.src;

/** 「2025 · thatgamecompany × …」这类引导行 */
export const projectEyebrow = (p: Project) =>
  [p.year, p.event ?? kindLabel[p.kind]].filter(Boolean).join(" · ");
