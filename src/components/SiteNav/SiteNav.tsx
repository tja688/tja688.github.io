import { m, useReducedMotion } from 'framer-motion';

type NavLink = {
  label: string;
  href: string;
};

type SiteNavProps = {
  name: string;
  descriptor: string;
  status: string;
  links: readonly NavLink[];
};

export const SiteNav = ({ name, descriptor, status, links }: SiteNavProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <m.header
      className="sticky top-3 z-40 px-4 sm:px-6 lg:px-10"
      initial={reducedMotion ? undefined : { opacity: 0, y: -20 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="top-nav mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-5">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-display text-[1.02rem] tracking-[-0.04em] text-[var(--text)]">{name}</span>
          <span className="hidden text-sm text-[var(--muted)] md:inline">{descriptor}</span>
        </a>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <span className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-[0.72rem] tracking-[0.18em] text-[var(--muted)] uppercase lg:inline-flex">
            {status}
          </span>
          <nav className="flex items-center gap-1" aria-label="Primary">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="top-nav__link rounded-full px-3 py-2 text-sm">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </m.header>
  );
};
