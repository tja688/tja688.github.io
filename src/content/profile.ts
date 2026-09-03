import type { Profile } from './types';

export const profile: Profile = {
  name: '唐今',
  handle: 'TJA688',
  headline: 'The wonder lies not in why the world exists, but that it exists at all.',
  lead: '纽卡斯尔大学计算机游戏工程硕士，重庆工程学院数字媒体技术专任教师，独立游戏开发者，一个持续探索更优体验的构建者。',
  portrait: {
    vonNeumann: {
      src: '/media/hero/portrait.jpg',
      alt: '唐今的肖像，摄于二〇二五年十一月纽卡斯尔大学图书馆',
    },
    turing: {
      src: '/media/hero/turing.jpg',
      alt: '图灵派切换图',
    },
    caption:
      '这个社会需要给我们这种冯诺依曼派一点空间，当然如果你觉得这个雷霆大头照吓到了你，可以点击它切换为图灵派',
  },
  bio: [
    '重庆渝北人。本科在福建理工大学读信息与计算科学，研究生去了英国纽卡斯尔大学读计算机游戏工程，研究方向是软体物理动画在 Unity 中的稳定性优化，导师是 Dr Gary Ushaw 和 Dr Rich Davison。',
    '做游戏的方式偏工程：先把系统搭稳，再看它能长出什么。参加过的 jam 里，我大多是主程，偶尔兼 TA，负责让物理、渲染和玩法在同一帧里不打架。',
    '最喜欢的运动是徒步，走路能让我思维活跃。玩游戏是杂食向，偏好带强构筑元素的：肉鸽、RPG 冒险、法术编程。',
  ],
  now: {
    label: '正在做',
    text: '九宫地下城 · 轻度肉鸽 × 卡牌 · 计划上架 Steam',
    projectSlug: 'jiugong',
  },
  education: [
    {
      school: '纽卡斯尔大学 Newcastle University',
      degree: 'MSc Computer Game Engineering',
      detail: ['研究方向：软体物理动画在 Unity 中的稳定性优化', '导师：Dr Gary Ushaw · Dr Rich Davison'],
    },
    {
      school: '福建理工大学',
      degree: '信息与计算科学 · 本科',
    },
  ],
  skills: [
    { level: '熟练', items: ['Unity', 'C#'] },
    { level: '会用', items: ['C++', 'OpenGL'] },
    { level: '一点点', items: ['着色器', '音效制作'] },
  ],
  plays: [
    { label: '心中最佳', value: '星际拓荒' },
    { label: '个人最爱', value: '泰拉瑞亚 · 504 小时' },
    { label: '最近在玩', value: '节奏地牢' },
  ],
  contacts: [
    { label: '微信', value: 'jintang1212' },
    { label: 'QQ', value: '315635975' },
    { label: 'Steam 好友代码', value: '875775160' },
    { label: 'itch.io', value: 'tja688.itch.io', href: 'https://tja688.itch.io' },
    { label: 'GitHub', value: 'github.com/tja688', href: 'https://github.com/tja688' },
  ],
  photos: [
    {
      src: '/media/about/newcastle-library.webp',
      alt: '纽卡斯尔大学图书馆窗外的晚霞',
      caption: '纽卡斯尔 · 图书馆的傍晚',
    },
    {
      src: '/media/about/ncu-group.webp',
      alt: 'NCU 计算机游戏工程同学结业合照',
      caption: '纽卡斯尔 · 计算机游戏工程结业',
    },
    {
      src: '/media/about/tgc-expo.webp',
      alt: '线下展会上玩家试玩 Wind Will Read',
      caption: 'TGC × COREBLAZER 线下展 · Wind Will Read 展位',
    },
    {
      src: '/media/about/ggj-chengdu.webp',
      alt: 'GGJ 2026 成都站现场',
      caption: 'Global Game Jam 2026 · 成都站现场',
    },
  ],
};
