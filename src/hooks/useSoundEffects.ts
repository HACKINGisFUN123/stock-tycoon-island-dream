
import { useEffect, useRef } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio context for sound effects
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported');
    }

    // Initialize background music
    backgroundMusicRef.current = new Audio();
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.3;
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, []);

  const playButtonClick = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    }
  };

  const playWindowOpen = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(900, audioContextRef.current.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    }
  };

  const playSpinSound = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(200, audioContextRef.current.currentTime + 2);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 2);
    }
  };

  const playWinSound = () => {
    if (audioContextRef.current) {
      const frequencies = [523, 659, 784, 1047];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContextRef.current!.createOscillator();
          const gainNode = audioContextRef.current!.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current!.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContextRef.current!.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.3);
          
          oscillator.start();
          oscillator.stop(audioContextRef.current!.currentTime + 0.3);
        }, index * 100);
      });
    }
  };

  const startBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      // Simple background music using Web Audio API
      backgroundMusicRef.current.play().catch(() => {
        console.warn('Background music autoplay blocked');
      });
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  };

  return {
    playButtonClick,
    playWindowOpen,
    playSpinSound,
    playWinSound,
    startBackgroundMusic,
    stopBackgroundMusic
  };
};
