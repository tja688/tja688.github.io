type SectionTitleProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export const SectionTitle = ({ eyebrow, title, body }: SectionTitleProps) => (
  <div className="section-title">
    <p className="section-title__eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    <p>{body}</p>
  </div>
);
