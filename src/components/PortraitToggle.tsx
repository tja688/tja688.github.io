import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { profile } from '../content/profile';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * 首页签名：两张大头照叠在同一方框里，点击做一次交叉溶解。
 * 默认冯诺依曼派（本人），再点切到图灵派，再点还原。
 */
export function PortraitToggle({ className }: { className?: string }) {
  const [turing, setTuring] = useState(false);
  const reduced = useReducedMotion();
  const { vonNeumann, turing: alternate, caption } = profile.portrait;
  const duration = reduced ? 0 : 0.64;

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => setTuring((v) => !v)}
        className="media-frame group relative block aspect-square w-full cursor-pointer overflow-hidden focus-visible:outline-offset-4"
        aria-pressed={turing}
        aria-label={turing ? '当前为图灵派，点击切回冯诺依曼派肖像' : '当前为冯诺依曼派肖像，点击切换为图灵派'}
      >
        <motion.img
          src={vonNeumann.src}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          animate={{ opacity: turing ? 0 : 1, scale: turing ? 1.04 : 1 }}
          transition={{ duration, ease }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <motion.img
          src={alternate.src}
          alt=""
          width={960}
          height={960}
          decoding="async"
          draggable={false}
          animate={{ opacity: turing ? 1 : 0, scale: turing ? 1 : 1.04 }}
          transition={{ duration, ease }}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.06]"
        />
      </button>
      <figcaption className="mt-4 text-[13px] leading-relaxed text-ink-muted md:text-sm">
        {caption}
      </figcaption>
    </figure>
  );
}
