import { motion } from 'motion/react';
import { profile } from '../content/profile';
import { PortraitToggle } from './PortraitToggle';
import { Arrow, LinkButton } from './ui/Button';

const ease = [0.16, 1, 0.3, 1] as const;
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export function Hero() {
  const { name, handle, headline, lead } = profile;

  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="grain pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />

      <div className="container-x relative flex min-h-[100svh] flex-col pt-20 pb-14 lg:pt-16 lg:pb-12">
        <div className="grid flex-1 grid-cols-1 content-center gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-10">
          <motion.div
            className="order-2 lg:order-1 lg:col-span-7"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.09, delayChildren: 0.15 }}
          >
            <motion.div variants={item} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <h1 className="font-serif text-[clamp(4.5rem,11vw,8.75rem)] leading-[0.92] font-bold tracking-[-0.03em]">
                {name}
              </h1>
              <p className="font-display-wide text-[clamp(1.35rem,2.6vw,2.1rem)] text-ink-muted">{handle}</p>
            </motion.div>

            <motion.p
              variants={item}
              className="mt-9 max-w-2xl font-serif text-[1.2rem] leading-[1.5] text-pretty italic md:text-[1.45rem]"
            >
              {headline}
            </motion.p>
            <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-[1.05rem]">
              {lead}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
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
            <PortraitToggle className="mx-auto w-full max-w-[320px] md:max-w-[420px] lg:max-w-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
