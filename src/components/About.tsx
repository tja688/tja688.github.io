import { profile } from '../content/profile';
import { Reveal } from './ui/Reveal';
import { SectionHeader } from './ui/SectionHeader';

export function About() {
  const { bio, education, work, skills, plays, photos } = profile;

  return (
    <section id="about" className="container-x border-t border-line pt-24 pb-24 md:pt-32 md:pb-32">
      <Reveal>
        <SectionHeader eyebrow="about" title="关于我" />
      </Reveal>

      <Reveal>
        <div className="max-w-3xl space-y-5 text-[1.05rem] leading-[1.85] md:text-[1.2rem]">
          {bio.map((para) => (
            <p key={para.slice(0, 16)}>{para}</p>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-12">
          <Reveal delay={0.05}>
            <Block label="教育">
              <ul className="space-y-5">
                {education.map((e) => (
                  <li key={e.school}>
                    <p className="font-medium text-ink">{e.school}</p>
                    <p className="text-sm text-ink-muted">{e.degree}</p>
                    {e.detail?.map((d) => (
                      <p key={d} className="mt-1 text-sm text-ink-muted">
                        {d}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </Block>
          </Reveal>
        </div>

        <div className="space-y-12">
          <Reveal delay={0.08}>
            <Block label="会用的">
              <dl className="space-y-2">
                {skills.map((tier) => (
                  <div key={tier.level} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-3 text-sm">
                    <dt className="font-mono text-[12px] tracking-wide text-ink-faint">{tier.level}</dt>
                    <dd className="text-ink">{tier.items.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          </Reveal>

          <Reveal delay={0.12}>
            <Block label="在玩">
              <dl className="space-y-2">
                {plays.map((p) => (
                  <div key={p.label} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-3 text-sm">
                    <dt className="font-mono text-[12px] tracking-wide text-ink-faint">{p.label}</dt>
                    <dd className="text-ink">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          </Reveal>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <Reveal delay={0.1}>
            <Block label="工作">
              <ul className="space-y-5">
                {work.map((w) => (
                  <li key={w.org}>
                    <p className="font-medium text-ink">{w.org}</p>
                    <p className="text-sm text-ink-muted">{w.role}</p>
                    {w.detail?.map((d) => (
                      <p key={d} className="mt-1 text-sm text-ink-muted">
                        {d}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </Block>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-20 md:mt-28">
        <Block label="相册">
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {photos.map((ph) => (
              <li key={ph.src}>
                <figure>
                  <div className="media-frame aspect-[4/3]">
                    <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-2.5 text-[13px] leading-snug text-ink-muted">{ph.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Block>
      </Reveal>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-5">
      <p className="eyebrow mb-4">{label}</p>
      {children}
    </div>
  );
}
