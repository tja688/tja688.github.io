import { useEffect, useState } from 'react';

const links = [
  { href: '#work', label: '作品' },
  { href: '#about', label: '履历' },
  { href: '#contact', label: '联系' },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-expo ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-end" aria-label="主导航">
        <ul className="flex items-center gap-6 text-sm text-ink-muted md:gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors duration-300 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
