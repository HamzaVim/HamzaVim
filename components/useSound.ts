import { useRef, useEffect, useCallback } from "react";

const useSound = () => {
  // Ref: audio
  const soundRef = useRef<HTMLAudioElement>(null);

  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    soundRef.current = new Audio("/audios/idea 22.mp3");
    soundRef.current.loop = true;
    soundRef.current.volume = 0.2;

    // Cleanup
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }

      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
        soundRef.current = null;
      }
    };
  }, []);

  const playSound = useCallback(() => {
    if (!soundRef.current) return;
    soundRef.current.play();
  }, []);

  const decreaseVolume = useCallback(() => {
    if (!soundRef.current) return;

    // If the interval is not null, clear it
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Create an interval
    intervalRef.current = setInterval(() => {
      if (!soundRef.current) return;

      // Getting the current volume
      const currentVolume = soundRef.current.volume;

      // If the volume is 0.0, clear the interval
      if (soundRef.current.volume == 0.0) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }

        // Ealse decrease the volume
      } else {
        soundRef.current.volume = Math.max(currentVolume - 0.01, 0.0);
      }
    }, 50);
  }, []);

  const increaseVolume = useCallback(() => {
    if (!soundRef.current) return;

    // If the interval is not null, clear it
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Create an interval
    intervalRef.current = setInterval(() => {
      if (!soundRef.current) return;

      // Getting the current volume
      const currentVolume = soundRef.current.volume;

      // If the volume is 0.2, clear the interval
      if (soundRef.current.volume == 0.2) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }

        // Ealse increase the volume
      } else {
        soundRef.current.volume = Math.min(currentVolume + 0.01, 0.2);
      }
    }, 50);
  }, []);

  return {
    playSound,
    decreaseVolume,
    increaseVolume,
  };
};

export default useSound;
