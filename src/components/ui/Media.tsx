import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../../content/types";

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
export function Media({
  item,
  className,
  autoplay = true,
  priority = false,
}: Props) {
  if (item.kind === "image") {
    return (
      <ImageMedia
        src={item.src}
        alt={item.alt}
        priority={priority}
        className={className}
      />
    );
  }
  return (
    <LoopVideo
      src={item.src}
      poster={item.poster}
      alt={item.alt}
      className={className}
      autoplay={autoplay}
    />
  );
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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay || failed) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const updatePlayback = () => {
      if (preference.matches || document.hidden || !visible) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) video.src = src;
      void video.play().catch(() => undefined);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { rootMargin: "0px", threshold: 0.01 },
    );
    io.observe(video);
    preference.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      io.disconnect();
      preference.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [src, autoplay, failed]);

  if (failed)
    return <ImageMedia src={poster} alt={alt} className={className} />;
  return (
    <video
      ref={ref}
      onError={() => setFailed(true)}
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

function ImageMedia({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={`${className ?? ""} media-error`}
        role="img"
        aria-label={alt}
      >
        画面暂时无法加载
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
