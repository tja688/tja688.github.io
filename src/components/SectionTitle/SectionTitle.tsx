type SectionTitleProps = {
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
};

export const SectionTitle = ({ eyebrow, title, body, className }: SectionTitleProps) => (
  <div className={className}>
    <p className="section-kicker">{eyebrow}</p>
    <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(2.35rem,5vw,4.7rem)] leading-[0.92] tracking-[-0.05em] text-[var(--text)]">
      {title}
    </h2>
    <p className="mt-4 max-w-[62ch] text-base leading-8 text-[var(--muted)] sm:text-[1.05rem]">
      {body}
    </p>
  </div>
);
