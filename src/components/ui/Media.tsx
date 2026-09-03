import { useEffect, useRef } from 'react';
import type { MediaItem } from '../../content/types';

interface Props {
  item: MediaItem;
  className?: string;
  /** 视频是否在进入视口时自动播放（默认是） */
  autoplay?: boolean;
  /** 图片解码优先级 */
  priority?: boolean;
  sizes?: string;
}

/**
 * 渲染一段媒体。视频只在进入视口时加载并播放，离开视口暂停，
 * 这样首页十来个循环视频不会同时争带宽。
 */
export function Media({ item, className, autoplay = true, priority = false }: Props) {
  if (item.kind === 'image') {
    return (
      <img
        src={item.src}
        alt={item.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    );
  }
  return <LoopVideo src={item.src} poster={item.poster} alt={item.alt} className={className} autoplay={autoplay} />;
}

interface VideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  autoplay: boolean;
}

function LoopVideo({ src, poster, alt, className, autoplay }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src, autoplay]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      className={className}
      // 减少动画时保留海报帧即可；autoplay=false 时交给使用方控制
      {...(!autoplay ? { src, controls: true } : {})}
    />
  );
}
