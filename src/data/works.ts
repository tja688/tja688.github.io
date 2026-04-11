export type WorkLink = {
  label: string;
  href?: string;
  note: string;
};

export type WorkItem = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  status: string;
  summary: string;
  detail: string;
  outcome: string;
  stack: string[];
  links: WorkLink[];
  layout: 'feature' | 'stacked';
  tone: 'sage' | 'slate' | 'linen';
};

export const works: WorkItem[] = [
  {
    id: 'parry-atlas',
    title: 'Parry Atlas',
    subtitle: '近战动作反馈原型',
    year: '2026',
    role: 'Gameplay / Combat Feel',
    status: '进行中',
    summary: '围绕格挡窗口、命中停顿和镜头复位，搭一套能被反复验证的近战确认感。',
    detail:
      '当前先用纯版式占位，后续会替换成更具体的战斗切片、输入反馈对照和关键帧拆解，方便把“感觉”落成能讨论的证据。',
    outcome: '把“看见命中”和“听见命中”统一进一套可复用的原型语法。',
    stack: ['TypeScript', 'PixiJS', 'Frame Timing', 'Combat UI'],
    links: [
      {
        label: '代码仓库',
        href: 'https://github.com/tja688',
        note: '当前公开代码会先放在 GitHub。',
      },
      {
        label: '案例拆解',
        note: '拆解页还在整理战斗截图与流程说明。',
      },
    ],
    layout: 'feature',
    tone: 'sage',
  },
  {
    id: 'signal-chorus',
    title: 'Signal Chorus',
    subtitle: 'HUD 层级与风险提示实验',
    year: '2025',
    role: 'UI Systems / Readability',
    status: '占位中',
    summary: '更偏系统页面方向，关注状态层叠、优先级排序，以及在高压场景里如何保住可读性。',
    detail:
      '它代表我对“界面语法”的兴趣：面板不只是装饰，而是帮助玩家读懂规则、风险和下一步动作的系统层。',
    outcome: '验证密集信息里哪些应该被压住，哪些必须在 0.5 秒内跳出来。',
    stack: ['React', 'HUD Grammar', 'Interaction Timing', 'SCSS'],
    links: [
      {
        label: '项目说明',
        note: '还没有整理成可公开的长文说明。',
      },
      {
        label: '外部入口',
        href: 'https://github.com/tja688',
        note: '临时以 GitHub 作为统一外链入口。',
      },
    ],
    layout: 'stacked',
    tone: 'slate',
  },
  {
    id: 'dustline-briefing',
    title: 'Dustline Briefing',
    subtitle: '任务入口与过场编排',
    year: '2024',
    role: 'Interface Direction / Flow',
    status: '素材整理中',
    summary: '关注任务选择、信息预热和过场切换，让进入一段内容之前就先建立节奏预期。',
    detail:
      '这块会补成更完整的“进入方式”案例，强调标题、列表、面板和视线引导如何一起工作，而不是只有一张结果图。',
    outcome: '把菜单、简报和演出之间的边界处理得更顺，不让界面像三套系统拼在一起。',
    stack: ['Flow Design', 'Motion System', 'Information Framing'],
    links: [
      {
        label: '公开链接',
        note: '暂时没有对外版本，等素材和权限整理完会补。',
      },
      {
        label: '补充说明',
        note: '目前先由站内文字承担说明功能。',
      },
    ],
    layout: 'stacked',
    tone: 'linen',
  },
];
