import { profile } from '../content/profile';
import { Arrow } from './ui/Button';
import { CopyField } from './ui/CopyField';
import { Reveal } from './ui/Reveal';

/** 名片背面：一列联系方式，能复制的复制，能点的点开 */
export function Contact() {
  return (
    <section id="contact" className="container-x border-t border-line pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-3">contact</p>
          <h2 className="font-serif text-[2rem] leading-none font-bold tracking-tight md:text-[2.5rem]">找我聊聊</h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-muted">
            合作、组队、或者只是聊聊游戏都可以。微信、QQ 和 Steam 好友代码点一下就能复制。
          </p>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-6 lg:col-start-7">
          <ul className="border-t border-line">
            {profile.contacts.map((c) => (
              <li key={c.label} className="border-b border-line">
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group grid grid-cols-[7rem_1fr_auto] items-center gap-4 py-4 transition-colors duration-300 ease-expo hover:text-accent-ink md:grid-cols-[9rem_1fr_auto]"
                  >
                    <span className="eyebrow">{c.label}</span>
                    <span className="font-display-wide text-[1.05rem]">{c.value}</span>
                    <Arrow direction="up-right" className="text-ink-faint transition-colors group-hover:text-accent-ink" />
                  </a>
                ) : (
                  <CopyField
                    value={c.value}
                    className="grid w-full grid-cols-[7rem_1fr_auto] items-center gap-4 py-4 transition-colors duration-300 ease-expo hover:text-accent-ink md:grid-cols-[9rem_1fr_auto]"
                  >
                    <span className="eyebrow">{c.label}</span>
                    <span className="font-mono text-[1.05rem] tabular-nums">{c.value}</span>
                  </CopyField>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
