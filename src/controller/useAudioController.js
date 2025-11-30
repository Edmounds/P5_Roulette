import { useState, useEffect, useRef } from 'react';

/**
 * 音频控制 Hook
 * @param {string} audioSource - 音频文件路径
 * @param {number} volume - 音量 (0.0 - 1.0)
 * @returns {Object} { isMusicPlaying, toggleMusic }
 */
export const useAudioController = (audioSource, volume = 0.7) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const audio = new Audio(audioSource);
    audio.loop = true;
    audio.volume = volume;
    audio.autoplay = true;
    audioRef.current = audio;

    const attemptAutoPlay = () => {
      audio.play()
        .then(() => {
          if (!isMounted) return;
          setIsMusicPlaying(true);
        })
        .catch(() => {
          if (!isMounted) return;
          setIsMusicPlaying(false);
        });
    };

    attemptAutoPlay();

    return () => {
      isMounted = false;
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSource, volume]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  return { isMusicPlaying, toggleMusic };
};
