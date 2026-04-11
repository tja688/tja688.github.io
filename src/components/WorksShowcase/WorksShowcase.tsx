import { ArrowUpRight, DotsThreeOutline, LockKeyOpen } from '@phosphor-icons/react';
import { m, useReducedMotion } from 'framer-motion';
import type { WorkItem } from '../../data/works';
import { Reveal } from '../Reveal/Reveal';
import { SectionTitle } from '../SectionTitle/SectionTitle';

type WorksShowcaseProps = {
  works: WorkItem[];
};

type WorkCardProps = {
  work: WorkItem;
  featured?: boolean;
};

const WorkPlaceholder = ({ work, featured = false }: WorkCardProps) => (
  <div
    className={`work-placeholder ${featured ? 'min-h-[20rem] sm:min-h-[25rem]' : 'min-h-[16rem]'} `}
    data-tone={work.tone}
    aria-hidden="true"
  >
    <div className="work-placeholder__frame absolute inset-4 sm:inset-5" />
    <div className="work-placeholder__block absolute left-4 top-4 h-20 w-[46%] sm:left-5 sm:top-5 sm:h-24" />
    <div className="work-placeholder__block work-placeholder__block--soft absolute right-4 top-8 h-[44%] w-[36%] sm:right-5" />
    <div className="work-placeholder__block absolute bottom-4 left-4 right-20 h-16 sm:bottom-5 sm:left-5 sm:h-[4.5rem]" />
    <div className="work-placeholder__orb absolute bottom-4 right-4 sm:bottom-5 sm:right-5" />
    <div className="work-placeholder__line absolute left-4 right-4 top-1/2 sm:left-5 sm:right-5" />
    <div className="absolute left-4 top-4 rounded-full border border-[var(--placeholder-ink)] bg-white/72 px-3 py-1 text-[0.68rem] tracking-[0.18em] text-[var(--muted)] uppercase sm:left-5 sm:top-5">
      {work.status}
    </div>
  </div>
);

const WorkCard = ({ work, featured = false }: WorkCardProps) => {
  const reducedMotion = useReducedMotion();
  const hiddenLinkNotes = work.links.filter((link) => !link.href).map((link) => link.note);

  return (
    <m.article
      className="h-full"
      whileHover={reducedMotion ? undefined : { y: -5 }}
      whileTap={reducedMotion ? undefined : { scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24 }}
    >
      <div className="surface-card h-full overflow-hidden p-4 sm:p-5">
        <WorkPlaceholder work={work} featured={featured} />

        <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.72rem] tracking-[0.18em] text-[var(--muted)] uppercase">
          <span>{work.year}</span>
          <span className="text-[var(--line-strong)]">/</span>
          <span>{work.role}</span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={`font-display tracking-[-0.05em] text-[var(--text)] ${featured ? 'text-[clamp(2rem,4vw,3.2rem)] leading-[0.95]' : 'text-[clamp(1.6rem,3vw,2.2rem)] leading-[0.98]'}`}
            >
              {work.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:text-[0.98rem]">{work.subtitle}</p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white/62 text-[var(--text)]">
            <DotsThreeOutline size={18} weight="regular" />
          </div>
        </div>

        <p className="mt-5 max-w-[70ch] text-base leading-8 text-[var(--text-soft)]">{work.summary}</p>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{work.detail}</p>

        <div className="mt-6 border-t border-[var(--line)] pt-5">
          <p className="text-[0.72rem] tracking-[0.18em] text-[var(--muted)] uppercase">当前重点</p>
          <p className="mt-2 text-sm leading-7 text-[var(--text)]">{work.outcome}</p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2.5">
          {work.stack.map((item) => (
            <li key={item} className="tag-chip">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {work.links.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="action-link action-link--ghost min-w-[11rem] justify-between"
              >
                <span className="flex flex-col items-start text-left">
                  <span>{link.label}</span>
                  <span className="mt-0.5 text-[0.74rem] text-[var(--muted)]">{link.note}</span>
                </span>
                <ArrowUpRight size={16} weight="regular" className="shrink-0" />
              </a>
            ) : (
              <span key={link.label} className="action-link action-link--muted min-w-[11rem] justify-between">
                <span className="flex flex-col items-start text-left">
                  <span>{link.label}</span>
                  <span className="mt-0.5 text-[0.74rem] text-[var(--muted)]">{link.note}</span>
                </span>
                <LockKeyOpen size={16} weight="regular" className="shrink-0" />
              </span>
            ),
          )}
        </div>

        {hiddenLinkNotes.length > 0 ? (
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">未公开部分会在素材和权限都准备好之后补进来。</p>
        ) : null}
      </div>
    </m.article>
  );
};

export const WorksShowcase = ({ works }: WorksShowcaseProps) => {
  const featureWork = works.find((work) => work.layout === 'feature') ?? works[0];
  const supportingWorks = works.filter((work) => work.id !== featureWork?.id);

  return (
    <section id="works" className="border-b border-[var(--line)] py-20 sm:py-24">
      <Reveal>
        <SectionTitle
          eyebrow="Selected Work"
          title="先把最能代表你的项目结构摆出来。"
          body="这部分不再用三张等宽作品卡交差，而是改成更接近真实作品站的编排方式：一个主项目负责定调，另外两个承担补充方向和占位弹性。"
        />
      </Reveal>

      {featureWork ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <Reveal>
            <WorkCard work={featureWork} featured />
          </Reveal>

          <div className="grid gap-6">
            {supportingWorks.map((work, index) => (
              <Reveal key={work.id} delay={0.08 * (index + 1)}>
                <WorkCard work={work} />
              </Reveal>
            ))}
          </div>
        </div>
      ) : (
        <Reveal className="mt-12">
          <div className="surface-card p-8 sm:p-10">
            <p className="section-kicker">Empty State</p>
            <h3 className="font-display mt-4 text-3xl tracking-[-0.05em] text-[var(--text)]">这里会接住后续公开项目。</h3>
            <p className="mt-4 max-w-[58ch] text-base leading-8 text-[var(--muted)]">
              当前数据为空时，页面仍然应该保持完整。等你后续把正式项目补进来，只需要替换数据内容，不需要再推翻视觉与结构。
            </p>
          </div>
        </Reveal>
      )}
    </section>
  );
};
