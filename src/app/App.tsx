import { useCallback, useEffect, useState } from 'react';
import { projectBySlug } from '../content/projects';
import { SiteNav } from '../components/SiteNav';
import { Hero } from '../components/Hero';
import { FeaturedWork } from '../components/FeaturedWork';
import { ProjectArchive } from '../components/ProjectArchive';
import { ProjectDialog } from '../components/ProjectDialog';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

const HASH_PREFIX = '#p/';

/** 从 URL hash 读出要打开的项目，方便直接分享某个项目的链接 */
const slugFromHash = () => {
  const h = window.location.hash;
  return h.startsWith(HASH_PREFIX) ? h.slice(HASH_PREFIX.length) : null;
};

export const App = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => slugFromHash());

  const openProject = useCallback((slug: string) => {
    if (!projectBySlug(slug)) return;
    setActiveSlug(slug);
    history.replaceState(null, '', `${HASH_PREFIX}${slug}`);
  }, []);

  const closeProject = useCallback(() => {
    setActiveSlug(null);
    if (window.location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const onHash = () => setActiveSlug(slugFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const active = activeSlug ? (projectBySlug(activeSlug) ?? null) : null;

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-bg">
      <SiteNav />
      <main>
        <Hero />
        <FeaturedWork onOpenProject={openProject} />
        <ProjectArchive onOpenProject={openProject} />
        <About onOpenProject={openProject} />
        <Contact />
      </main>
      <Footer />
      <ProjectDialog project={active} onClose={closeProject} />
    </div>
  );
};
