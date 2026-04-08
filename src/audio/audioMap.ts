const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`.replace(
  /([^:]\/)\/+/g,
  '$1',
);

export const audioMap = {
  hover: withBase('sfx/ui-hover.wav'),
  hit: withBase('sfx/ui-hit.wav'),
  open: withBase('sfx/ui-open.wav'),
} as const;

export type SfxName = keyof typeof audioMap;
