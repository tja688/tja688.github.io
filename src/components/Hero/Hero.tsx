import { RefObject } from 'react';
import { profile } from '../../data/profile';
import { sectionLinks } from '../../app/routes';

type HeroProps = {
  heroRef: RefObject<HTMLElement | null>;
  onEnterWorks: () => void;
};

export const Hero = ({ heroRef, onEnterWorks }: HeroProps) => (
  <section ref={heroRef} className="hero" id="top" aria-label="Hero section">
    <div className="hero__noise" data-hero="grid" />
    <header className="hero__nav" data-hero="nav">
      <a className="hero__brand" href="#top">
        {profile.name}
      </a>
      <nav aria-label="Section navigation">
        {sectionLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>

    <div className="hero__content">
      <div className="hero__copy-group">
        <p className="hero__eyebrow">{profile.heroLabel}</p>
        <h1 className="hero__title" data-hero="title">
          <span>{profile.name}</span>
          <span>Strike-Feel</span>
          <span>Portfolio</span>
        </h1>
        <p className="hero__lead" data-hero="copy">
          {profile.role}
        </p>
        <p className="hero__body" data-hero="copy">
          {profile.heroDescription}
        </p>

        <div className="hero__actions" data-hero="cta">
          <button className="hero__cta hero__cta--primary" type="button" onClick={onEnterWorks}>
            ENTER WORKS
          </button>
          <a className="hero__cta hero__cta--ghost" href={profile.links[0].href} target="_blank" rel="noreferrer">
            OPEN GITHUB
          </a>
        </div>
      </div>

      <div className="hero__visor" data-hero="visor" aria-hidden="true">
        <div className="hero__visor-frame">
          <div className="hero__visor-core" />
          <div className="hero__visor-ring hero__visor-ring--outer" />
          <div className="hero__visor-ring hero__visor-ring--inner" />
          <div className="hero__visor-lines" />
          <div className="hero__visor-tag">impact-ready interface</div>
        </div>
      </div>
    </div>

    <div className="hero__rail" data-hero="rail">
      <div className="hero__rail-card">
        <span className="hero__rail-label">Pitch</span>
        <p>{profile.intro}</p>
      </div>
      <div className="hero__rail-card">
        <span className="hero__rail-label">Focus</span>
        <p>{profile.systemNote}</p>
      </div>
      <ul className="hero__skills" aria-label="Skill tags">
        {profile.skills.slice(0, 5).map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  </section>
);
