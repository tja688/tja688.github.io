import { LazyMotion, domAnimation } from 'framer-motion';
import { Hero } from '../components/Hero/Hero';
import { CraftSection } from '../components/CraftSection/CraftSection';
import { SignalSection } from '../components/SignalSection/SignalSection';
import { SiteNav } from '../components/SiteNav/SiteNav';
import { WorksShowcase } from '../components/WorksShowcase/WorksShowcase';
import { sectionLinks } from './routes';
import { profile } from '../data/profile';
import { works } from '../data/works';

export const App = () => (
  <LazyMotion features={domAnimation}>
    <div className="relative min-h-screen overflow-x-clip">
      <SiteNav name={profile.name} descriptor={profile.descriptor} status={profile.status} links={sectionLinks} />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-10">
        <Hero profile={profile} works={works} />
        <WorksShowcase works={works} />
        <CraftSection profile={profile} />
        <SignalSection profile={profile} />
      </main>

      <footer className="mx-auto w-full max-w-[1400px] px-4 pb-10 text-sm text-[var(--muted)] sm:px-6 lg:px-10">
        <div className="flex flex-col gap-2 border-t border-[var(--line)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p>TJA688 / 个人主页重构中 / 真实项目与案例会在后续持续替换进来。</p>
          <p className="font-mono tracking-[-0.03em] text-[0.82rem]">Built with React, Tailwind CSS and restrained motion.</p>
        </div>
      </footer>
    </div>
  </LazyMotion>
);
