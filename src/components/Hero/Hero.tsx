import { ArrowDown, ArrowRight, EnvelopeSimple, MapPin } from '@phosphor-icons/react';
import { m, useReducedMotion } from 'framer-motion';
import type { Profile } from '../../data/profile';
import type { WorkItem } from '../../data/works';
import { Reveal } from '../Reveal/Reveal';

type HeroProps = {
  profile: Profile;
  works: WorkItem[];
};

const HeroPulse = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/75">
      {!reducedMotion && (
        <m.span
          className="absolute inset-1 rounded-full border border-[rgba(102,122,109,0.28)]"
          animate={{ scale: [1, 1.16, 1], opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
    </div>
  );
};

export const Hero = ({ profile, works }: HeroProps) => (
  <section
    id="top"
    className="grid min-h-[100dvh] items-center gap-12 border-b border-[var(--line)] py-16 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-[4.5rem] lg:py-24"
  >
    <Reveal className="max-w-4xl">
      <p className="section-kicker">{profile.heroLabel}</p>

      <h1 className="font-display mt-6 text-[clamp(3.1rem,7vw,6.8rem)] leading-[0.92] tracking-[-0.07em] text-[var(--text)]">
        {profile.heroTitleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p className="mt-6 max-w-[62ch] text-[1.15rem] leading-8 text-[var(--text-soft)] sm:text-[1.22rem]">
        {profile.heroSummary}
      </p>
      <p className="mt-5 max-w-[68ch] text-base leading-8 text-[var(--muted)] sm:text-[1.04rem]">
        {profile.heroBody}
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {profile.heroTags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#works" className="action-link action-link--primary">
          <span>看精选项目</span>
          <ArrowDown size={16} weight="regular" />
        </a>
        <a href="#signal" className="action-link action-link--ghost">
          <span>发我链接</span>
          <EnvelopeSimple size={16} weight="regular" />
        </a>
      </div>

      <dl className="mt-14 grid gap-7 border-t border-[var(--line)] pt-8 sm:grid-cols-3 sm:gap-0">
        {profile.heroMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`sm:px-5 ${index === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-[var(--line)]'} ${index === profile.heroMetrics.length - 1 ? 'sm:pr-0' : ''}`}
          >
            <dt className="text-[0.72rem] font-medium tracking-[0.18em] text-[var(--muted)] uppercase">
              {metric.label}
            </dt>
            <dd className="mt-2 text-[1rem] font-medium leading-7 tracking-[-0.03em] text-[var(--text)]">
              {metric.value}
            </dd>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{metric.note}</p>
          </div>
        ))}
      </dl>
    </Reveal>

    <Reveal className="lg:translate-y-10" delay={0.12}>
      <div className="surface-card surface-card--strong overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Current index</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.3rem)] leading-[0.95] tracking-[-0.06em] text-[var(--text)]">
              正在补齐的三个方向
            </h2>
          </div>
          <HeroPulse />
        </div>

        <div className="mt-8 space-y-2.5">
          {works.map((work, index) => (
            <a
              key={work.id}
              href="#works"
              className="group flex items-start gap-4 rounded-[1.35rem] border border-transparent px-3 py-3 transition duration-300 hover:border-[var(--line)] hover:bg-white/55"
            >
              <span className="font-mono text-[0.76rem] tracking-[0.1em] text-[var(--muted)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium tracking-[-0.03em] text-[var(--text)]">{work.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{work.subtitle}</p>
              </div>
              <ArrowRight
                size={16}
                weight="regular"
                className="mt-1 shrink-0 text-[var(--muted)] transition duration-300 group-hover:translate-x-1 group-hover:text-[var(--text)]"
              />
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/58 p-4">
            <p className="section-kicker">Status</p>
            <p className="mt-3 text-base font-medium tracking-[-0.03em] text-[var(--text)]">{profile.status}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              先把结构、版式和替换路径做对，再逐步接入真实材料。
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/58 p-4">
            <p className="section-kicker">Signal</p>
            <div className="mt-3 flex items-center gap-2 text-base font-medium tracking-[-0.03em] text-[var(--text)]">
              <MapPin size={16} weight="regular" className="text-[var(--muted)]" />
              <span>{profile.location}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              目前更适合用来承接同行交流、项目链接和方向判断。
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);
