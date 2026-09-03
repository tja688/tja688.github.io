/**
 * 站点内容的数据结构。
 * 新增项目只需要在 `projects.ts` 里追加一条 `Project`，页面会自动出现在「全部项目」列表里；
 * 把 `featured` 设为 true 会同时进入首页的「精选作品」。
 */

/** 一段媒体：循环视频（由 GIF 转成的 mp4）或静态图 */
export type MediaItem =
  | { kind: 'video'; src: string; poster: string; alt: string }
  | { kind: 'image'; src: string; alt: string };

/** 项目对外链接 */
export type ProjectLink =
  /** 试玩包下载（网盘 + 提取码），提取码会在详情页里提供一键复制 */
  | { kind: 'download'; url: string; code?: string; label?: string }
  /** 演示视频（B 站 / YouTube） */
  | { kind: 'video'; url: string; label: string }
  /** 其他页面（Steam / itch.io / 仓库） */
  | { kind: 'page'; url: string; label: string };

export type ProjectKind = 'indie' | 'jam' | 'coursework' | 'prototype';

export type ProjectStatus = 'in-dev' | 'shipped' | 'shelved';

export interface Project {
  /** URL 友好的唯一 id，同时也是 `public/media/<slug>/` 的目录名 */
  slug: string;
  /** 主标题（中文优先） */
  title: string;
  /** 英文名，存在时用展示字体单独排出来 */
  latinTitle?: string;
  /** 年份文本，例如 "2026" 或 "2024–25" */
  year: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** 赛事 / 场合 */
  event?: string;
  /** 奖项（存在时会进入「履历」的获奖记录） */
  award?: string;
  /** 我在项目中的角色 */
  role: string;
  /** 团队构成 */
  team: string;
  /** 一句话介绍，用于列表和精选卡片 */
  tagline: string;
  /** 详情正文，每个元素一段 */
  description: string[];
  /** 封面媒体：列表缩略图与精选大图都用它 */
  cover: MediaItem;
  /** 详情页画廊（不必重复 cover） */
  gallery: MediaItem[];
  links: ProjectLink[];
  /** 技术 / 引擎标签 */
  tags?: string[];
  /** 是否进入首页精选（建议 2–4 个） */
  featured?: boolean;
}

export interface Education {
  school: string;
  degree: string;
  detail?: string[];
}

export interface Contact {
  label: string;
  value: string;
  /** 有 href 时渲染为外链，否则渲染为可复制的字段 */
  href?: string;
}

export interface Photo {
  src: string;
  alt: string;
  caption: string;
}

export interface Profile {
  name: string;
  handle: string;
  /** 首页一句定位 / 题记 */
  headline: string;
  /** 首页引导语（第二段，短） */
  lead: string;
  /** 「关于我」里的自述段落 */
  bio: string[];
  /** 首页右侧可切换的两张肖像（冯诺依曼派 / 图灵派） */
  portrait: {
    vonNeumann: { src: string; alt: string };
    turing: { src: string; alt: string };
    caption: string;
  };
  /** 当前在做的事（内容保留，供别处取用） */
  now: { label: string; text: string; projectSlug?: string };
  education: Education[];
  /** 技能按诚实程度分层 */
  skills: { level: string; items: string[] }[];
  plays: { label: string; value: string }[];
  contacts: Contact[];
  photos: Photo[];
}
