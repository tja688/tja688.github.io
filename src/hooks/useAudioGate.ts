import { useEffect, useState } from 'react';
import { primeAudio } from '../audio/sfx';

export const useAudioGate = (enabled: boolean) => {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!enabled || unlocked) {
      return;
    }

    const unlock = () => {
      void primeAudio();
      setUnlocked(true);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [enabled, unlocked]);

  return unlocked && enabled;
};
