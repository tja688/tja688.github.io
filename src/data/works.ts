export type WorkItem = {
  id: string;
  title: string;
  subtitle: string;
  blurb: string;
  description: string;
  status: string;
  tech: string[];
  href: string;
  accent: string;
  secondaryAccent: string;
};

export const works: WorkItem[] = [
  {
    id: 'neon-raid',
    title: 'Neon Raid Loop',
    subtitle: 'Combat encounter sandbox',
    blurb: '强调高速输入反馈、受击停顿与命中特效联动的 2D 动作原型。',
    description:
      '这个占位项目代表你偏爱的“战斗感搭建”方向：从 UI 扣动、命中帧停顿，到爆点粒子和局部闪白，所有交互都围绕确认感来组织。',
    status: 'Strike Prototype',
    tech: ['TypeScript', 'Pixi', 'GSAP'],
    href: 'https://github.com/tja688',
    accent: '#7df0ff',
    secondaryAccent: '#ff5cb8',
  },
  {
    id: 'signal-forge',
    title: 'Signal Forge',
    subtitle: 'Systems and HUD direction',
    blurb: '更偏系统页与 UI 味道验证，关注信息层次、危险提示和可点击对象语言。',
    description:
      '这个条目用于展示你对 HUD 设计与交互气质的兴趣：让面板、标签和按钮像游戏里的“可操作系统”，而不是普通网页卡片。',
    status: 'UI Direction',
    tech: ['React', 'SCSS', 'Motion'],
    href: 'https://github.com/tja688',
    accent: '#89e8ff',
    secondaryAccent: '#6d7cff',
  },
  {
    id: 'phase-breaker',
    title: 'Phase Breaker',
    subtitle: 'Boss intro visualization',
    blurb: '偏演出向的场景验证，测试入场时间轴、面板开合与背景能量流之间的统一。',
    description:
      '这类项目代表你的“演出味”取向：不是堆满特效，而是让大标题、层级缩放、屏幕压暗和简短音效一起组成完整节奏。',
    status: 'Presentation Test',
    tech: ['Howler', 'FX Layer', 'Timeline'],
    href: 'https://github.com/tja688',
    accent: '#b48cff',
    secondaryAccent: '#7df0ff',
  },
];
