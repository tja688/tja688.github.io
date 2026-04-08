import { Howl, Howler } from 'howler';
import { audioMap, type SfxName } from './audioMap';

const soundBank: Record<SfxName, Howl> = {
  hover: new Howl({
    src: [audioMap.hover],
    preload: true,
    volume: 0.22,
  }),
  hit: new Howl({
    src: [audioMap.hit],
    preload: true,
    volume: 0.34,
  }),
  open: new Howl({
    src: [audioMap.open],
    preload: true,
    volume: 0.3,
  }),
};

export const configureAudio = (muted: boolean) => {
  Howler.mute(muted);
};

export const primeAudio = async () => {
  try {
    await Howler.ctx?.resume?.();
  } catch {
    // Ignore browsers that do not expose the context.
  }
};

export const playSfx = (
  name: SfxName,
  options?: {
    rate?: number;
    volume?: number;
  },
) => {
  const clip = soundBank[name];
  const id = clip.play();

  if (options?.rate !== undefined) {
    clip.rate(options.rate, id);
  }

  if (options?.volume !== undefined) {
    clip.volume(options.volume, id);
  }

  return id;
};
