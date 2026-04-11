import {
  CrosshairSimple,
  Sparkle,
  StackSimple,
  Waveform,
} from '@phosphor-icons/react';
import type { Capability, Profile } from '../../data/profile';
import { Reveal } from '../Reveal/Reveal';
import { SectionTitle } from '../SectionTitle/SectionTitle';

type CraftSectionProps = {
  profile: Profile;
};

const capabilityIcons = {
  crosshair: CrosshairSimple,
  stack: StackSimple,
  wave: Waveform,
  sparkle: Sparkle,
} satisfies Record<Capability['icon'], typeof CrosshairSimple>;

export const CraftSection = ({ profile }: CraftSectionProps) => (
  <section id="method" className="grid gap-12 border-b border-[var(--line)] py-20 sm:py-24 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
    <Reveal>
      <SectionTitle
        eyebrow="Method"
        title="我更在意手感是怎么被组织出来的。"
        body="这部分把页面从“展示作品”再往前推一步，直接说明我判断一个交互或一个界面时，最先看的是什么。这样即使现在还是占位内容，也能先让人读懂你的方法感。"
      />

      <div className="mt-10 space-y-7">
        {profile.capabilities.map((capability, index) => {
          const Icon = capabilityIcons[capability.icon];

          return (
            <div
              key={capability.title}
              className={`grid gap-4 border-[var(--line)] pt-6 sm:grid-cols-[44px_minmax(0,1fr)] ${index === 0 ? 'border-t' : 'border-t'}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/60 text-[var(--text)]">
                <Icon size={18} weight="regular" />
              </div>
              <div>
                <h3 className="font-display text-[1.5rem] tracking-[-0.05em] text-[var(--text)]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-base leading-8 text-[var(--text-soft)]">{capability.description}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{capability.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>

    <div className="grid gap-5 md:grid-cols-2">
      {profile.principles.map((principle, index) => (
        <Reveal key={principle.title} delay={0.08 * index}>
          <div className="surface-card h-full p-6 sm:p-7">
            <p className="section-kicker">Principle {String(index + 1).padStart(2, '0')}</p>
            <h3 className="font-display mt-4 text-[1.7rem] leading-[1.02] tracking-[-0.05em] text-[var(--text)]">
              {principle.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-[0.98rem]">{principle.description}</p>
          </div>
        </Reveal>
      ))}

      <Reveal className="md:col-span-2" delay={0.16}>
        <div className="surface-card surface-card--strong p-6 sm:p-8">
          <p className="section-kicker">Current Build Queue</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <h3 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-[-0.06em] text-[var(--text)]">
                {profile.currentFocus.title}
              </h3>
              <p className="mt-4 max-w-[58ch] text-base leading-8 text-[var(--muted)]">{profile.currentFocus.intro}</p>
            </div>

            <ul className="grid gap-3 text-sm leading-7 text-[var(--text)] sm:grid-cols-3">
              {profile.currentFocus.items.map((item) => (
                <li key={item} className="rounded-[1.4rem] border border-[var(--line)] bg-white/58 px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
