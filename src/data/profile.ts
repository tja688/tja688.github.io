export type HeroMetric = {
  label: string;
  value: string;
  note: string;
};

export type Capability = {
  icon: 'crosshair' | 'stack' | 'wave' | 'sparkle';
  title: string;
  description: string;
  note: string;
};

export type Principle = {
  title: string;
  description: string;
};

export type SignalLink = {
  icon: 'github' | 'mail' | 'notes';
  label: string;
  href?: string;
  note: string;
};

export type Profile = {
  name: string;
  descriptor: string;
  status: string;
  location: string;
  heroLabel: string;
  heroTitleLines: string[];
  heroSummary: string;
  heroBody: string;
  heroTags: string[];
  heroMetrics: HeroMetric[];
  capabilities: Capability[];
  principles: Principle[];
  currentFocus: {
    title: string;
    intro: string;
    items: string[];
  };
  signal: {
    title: string;
    body: string;
    availability: string;
    links: SignalLink[];
  };
};

export const profile: Profile = {
  name: 'TJA688',
  descriptor: '游戏交互开发',
  status: '个人主页重构中',
  location: 'Shanghai / Remote',
  heroLabel: 'Game Interaction Developer',
  heroTitleLines: ['把反馈、镜头和界面节奏，', '组织成能落地的', '游戏交互。'],
  heroSummary:
    '我做偏玩法与交互演出的开发，长期关注命中确认、信息层级、输入回响，以及玩家在一秒内能否明确感到“这下打中了”。',
  heroBody:
    '这版主页先不用情绪图和夸张特效撑场，而是用更成熟的排版、结构和节奏，把后续真实项目要落进来的位置提前留好。素材补齐之后，它会从占位页面自然过渡成完整作品站，而不是再重做一遍骨架。',
  heroTags: ['Gameplay Systems', 'Combat Feel', 'HUD Grammar', 'Presentation Timing'],
  heroMetrics: [
    {
      label: '反馈结构',
      value: 'Hit-stop / 镜头 / 声画对齐',
      note: '把“打中了”拆成可复用的交互单元。',
    },
    {
      label: '信息设计',
      value: '优先级 / 风险提示 / 读取节奏',
      note: '让忙乱场景里的信息仍然保持可读。',
    },
    {
      label: '原型方式',
      value: '先可玩，再精修，再包装',
      note: '先验证手感，再给它正确的视觉壳体。',
    },
  ],
  capabilities: [
    {
      icon: 'crosshair',
      title: '战斗反馈与输入确认',
      description:
        '从停顿、回弹、镜头和音效之间找准命中感，不把“爽点”只交给粒子特效。',
      note: '更关心玩家是否立即读懂结果，而不是单次演出是否炫目。',
    },
    {
      icon: 'stack',
      title: 'HUD 层级与系统语法',
      description:
        '把标签、计数、危险提示和次要说明排成稳定秩序，让界面像系统而不是装饰。',
      note: '信息越密，越需要克制和优先级，而不是更多边框。',
    },
    {
      icon: 'wave',
      title: '节奏编排与页面过渡',
      description:
        '擅长处理标题进入、面板开合、状态切换和镜头节拍之间的衔接，让内容更有进入方式。',
      note: '这里保留少量锋利感，但不再用旧版那种强赛博外壳。',
    },
    {
      icon: 'sparkle',
      title: '原型化表达与后续替换',
      description:
        '会先把结构、动线和阅读顺序做对，再逐步替换成真实截图、流程拆解和可公开的项目材料。',
      note: '这样站点会持续进化，而不是每补内容一次就推翻一次设计。',
    },
  ],
  principles: [
    {
      title: '先确认玩家是否感到结果，再决定效果强度。',
      description:
        '无论是按钮、战斗命中还是系统弹层，我会优先检查结果是否被读到，而不是先堆一层视觉刺激。',
    },
    {
      title: '界面要像一套规则，而不是一堆会发亮的块。',
      description:
        '标签、行文、边界和状态色都需要有明确职责，尤其在节奏快的场景里更是如此。',
    },
    {
      title: '占位内容也要有可延展的秩序。',
      description:
        '页面现在还没填正式材料，所以版式本身必须先能成立，后续替换真实项目时才能稳稳接住。',
    },
  ],
  currentFocus: {
    title: '当前会优先补进来的内容',
    intro:
      '这次翻新先把“结构正确、气质正确、替换路径正确”三件事一次做完，接下来补真实素材就会很顺。',
    items: [
      '三到四个可公开的真实项目封面与简述。',
      '更完整的交互拆解图、流程截图和动线说明。',
      '项目角色、负责范围和复盘角度的正式文案。',
    ],
  },
  signal: {
    title: '如果你也在做讲究手感与信息秩序的东西，可以直接发我链接。',
    body:
      '当前更欢迎同行之间的项目交流、原型互看、UI 反馈和玩法沟通。正式案例页会在真实素材整理完之后补进来，但现在已经可以用这版结构来承接对话。',
    availability: '更适合交流玩法原型、战斗反馈、HUD 方向和页面节奏。',
    links: [
      {
        icon: 'github',
        label: 'GitHub',
        href: 'https://github.com/tja688',
        note: '公开代码与后续项目入口会先集中在这里。',
      },
      {
        icon: 'mail',
        label: '邮件',
        href: 'mailto:156814864+tja688@users.noreply.github.com',
        note: '适合发长一点的背景、链接和合作上下文。',
      },
      {
        icon: 'notes',
        label: '案例拆解',
        note: '真实项目整理中，后续会补成独立案例页。',
      },
    ],
  },
};
