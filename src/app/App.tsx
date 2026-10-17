import { MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { projectBySlug } from "../content/projects";
import { SiteNav } from "../components/SiteNav";
import { Hero } from "../components/Hero";
import { FeaturedWork } from "../components/FeaturedWork";
import { ProjectArchive } from "../components/ProjectArchive";
import { ProjectDialog } from "../components/ProjectDialog";
import { Footer } from "../components/Footer";

const HASH_PREFIX = "#p/";

/** 从 URL hash 读出要打开的项目，方便直接分享某个项目的链接 */
const slugFromHash = () => {
  const h = window.location.hash;
  return h.startsWith(HASH_PREFIX) ? h.slice(HASH_PREFIX.length) : null;
};

export const App = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(() =>
    slugFromHash(),
  );

  const openProject = useCallback((slug: string) => {
    if (!projectBySlug(slug)) return;
    setActiveSlug(slug);
    history.replaceState(null, "", `${HASH_PREFIX}${slug}`);
  }, []);

  const closeProject = useCallback(() => {
    setActiveSlug(null);
    if (window.location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  useEffect(() => {
    const onHash = () => setActiveSlug(slugFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const active = activeSlug ? (projectBySlug(activeSlug) ?? null) : null;

  return (
    <MotionConfig reducedMotion="user">
      <div>
        <a href="#games" className="skip-link">
          跳到作品库
        </a>
        <SiteNav />
        <main>
          <Hero onOpenProject={openProject} />
          <FeaturedWork onOpenProject={openProject} />
          <ProjectArchive onOpenProject={openProject} />
        </main>
        <Footer />
        <ProjectDialog project={active} onClose={closeProject} />
      </div>
    </MotionConfig>
  );
};
