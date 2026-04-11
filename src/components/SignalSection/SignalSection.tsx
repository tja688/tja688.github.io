import {
  ArrowUpRight,
  FileText,
  GithubLogo,
  EnvelopeSimple,
} from '@phosphor-icons/react';
import { m, useReducedMotion } from 'framer-motion';
import type { Profile, SignalLink } from '../../data/profile';
import { Reveal } from '../Reveal/Reveal';

type SignalSectionProps = {
  profile: Profile;
};

const signalIcons = {
  github: GithubLogo,
  mail: EnvelopeSimple,
  notes: FileText,
} satisfies Record<SignalLink['icon'], typeof GithubLogo>;

export const SignalSection = ({ profile }: SignalSectionProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <section id="signal" className="py-20 sm:py-24">
      <Reveal>
        <div className="surface-card surface-card--strong overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)]">
            <div>
              <p className="section-kicker">Contact Signal</p>
              <h2 className="font-display mt-4 max-w-[16ch] text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.06em] text-[var(--text)]">
                {profile.signal.title}
              </h2>
              <p className="mt-5 max-w-[62ch] text-base leading-8 text-[var(--text-soft)] sm:text-[1.04rem]">
                {profile.signal.body}
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="tag-chip">{profile.signal.availability}</span>
                <span className="tag-chip">{profile.location}</span>
                <span className="tag-chip">{profile.status}</span>
              </div>
            </div>

            <div className="grid gap-3">
              {profile.signal.links.length > 0 ? (
                profile.signal.links.map((link, index) => {
                  const Icon = signalIcons[link.icon];
                  const content = (
                    <>
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/70 text-[var(--text)]">
                          <Icon size={18} weight="regular" />
                        </span>
                        <div>
                          <p className="text-base font-medium tracking-[-0.03em] text-[var(--text)]">{link.label}</p>
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{link.note}</p>
                        </div>
                      </div>
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/72 text-[var(--text)]">
                        <ArrowUpRight size={16} weight="regular" />
                      </span>
                    </>
                  );

                  return link.href ? (
                    <m.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-[1.55rem] border border-[var(--line)] bg-white/58 p-4 transition duration-300 hover:border-[var(--line-strong)] hover:bg-white/82"
                      whileHover={reducedMotion ? undefined : { y: -4 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.995 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 24, delay: index * 0.03 }}
                    >
                      {content}
                    </m.a>
                  ) : (
                    <div
                      key={link.label}
                      className="flex items-center justify-between gap-4 rounded-[1.55rem] border border-[var(--line)] bg-white/46 p-4 text-[var(--muted)]"
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/58 text-[var(--muted)]">
                          <Icon size={18} weight="regular" />
                        </span>
                        <div>
                          <p className="text-base font-medium tracking-[-0.03em] text-[var(--text)]">{link.label}</p>
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{link.note}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.72rem] tracking-[0.18em] uppercase">
                        Soon
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.55rem] border border-[var(--line)] bg-white/58 p-5">
                  <p className="text-base font-medium tracking-[-0.03em] text-[var(--text)]">联系入口会放在这里。</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    即使暂时没有外链，页面也应该保留可读的空状态，而不是直接塌掉。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
