import { motion } from 'motion/react';
import { profile } from '../content/profile';
import { SoftBodyCanvas } from './SoftBodyCanvas';
import { Arrow, LinkButton } from './ui/Button';

const ease = [0.16, 1, 0.3, 1] as const;
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

interface Props {
  onOpenProject: (slug: string) => void;
}

export function Hero({ onOpenProject }: Props) {
  const { name, handle, headline, lead, now } = profile;

  return (
    <section id="top" className="relative overflow-hidden">
      {/* 首屏一层很淡的群青光 + 细颗粒，让暖炭底有质感而不出现色阶断层 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[80vh]"
        style={{
          background: 'radial-gradient(55% 50% at 68% 22%, rgb(74 99 255 / 0.09), transparent 72%)',
        }}
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />

      <div className="container-x relative flex min-h-[100svh] flex-col pt-24 pb-8 lg:pt-16">
        <div className="grid flex-1 grid-cols-1 content-center gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <motion.div
          className="order-2 lg:order-1 lg:col-span-7"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09, delayChildren: 0.15 }}
        >
          <motion.p variants={item} className="eyebrow">
            独立游戏开发者 · Indie game developer
          </motion.p>

          <motion.div variants={item} className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <h1 className="font-serif text-[clamp(4.5rem,11vw,8.75rem)] leading-[0.92] font-bold tracking-[-0.03em]">
              {name}
            </h1>
            <p className="font-display-wide text-[clamp(1.35rem,2.6vw,2.1rem)] text-ink-muted">{handle}</p>
          </motion.div>

          <motion.p variants={item} className="mt-9 max-w-2xl text-[1.35rem] leading-snug md:text-[1.6rem]">
            {headline}
          </motion.p>
          <motion.p variants={item} className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted md:text-[1.05rem]">
            {lead}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href="#work">
              看作品
              <Arrow direction="down" />
            </LinkButton>
            <LinkButton href="#contact" variant="ghost">
              联系我
            </LinkButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2 lg:col-span-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          <SoftBodyCanvas className="mx-auto aspect-square w-full max-w-[420px] lg:max-w-none" />
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
        >
          <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
            <span className="eyebrow inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-1.5 w-1.5 bg-accent" />
              {now.label}
            </span>
            {now.projectSlug ? (
              <button
                type="button"
                onClick={() => onOpenProject(now.projectSlug!)}
                className="group inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-accent-ink"
              >
                {now.text}
                <Arrow className="transition-transform duration-300 ease-expo group-hover:translate-x-0.5" />
              </button>
            ) : (
              <span className="text-sm">{now.text}</span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
