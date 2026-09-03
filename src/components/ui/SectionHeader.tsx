interface Props {
  /** 小号等宽的引导标签，例如 "selected work" */
  eyebrow: string;
  title: string;
  /** 右侧补充信息，例如数量 */
  aside?: string;
}

export function SectionHeader({ eyebrow, title, aside }: Props) {
  return (
    <header className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5 md:mb-14">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-serif text-[2rem] leading-none font-bold tracking-tight md:text-[2.5rem]">{title}</h2>
      </div>
      {aside && <p className="font-mono text-sm text-ink-muted tabular-nums">{aside}</p>}
    </header>
  );
}
