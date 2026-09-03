import { profile } from '../content/profile';

export function Footer() {
  return (
    <footer className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-line py-8 text-[13px] text-ink-muted">
      <p>
        © {new Date().getFullYear()} {profile.name} · <span className="font-display-wide">{profile.handle}</span>
      </p>
      <p>页面里的视频都是各项目的实机录制。</p>
    </footer>
  );
}
