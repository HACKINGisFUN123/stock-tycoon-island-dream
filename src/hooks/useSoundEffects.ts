
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

    // Initialize background music with a simple pleasant tone
    backgroundMusicRef.current = new Audio();
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.15;
    
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
      oscillator.frequency.exponentialRampToValueAtTime(1000, audioContextRef.current.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.15);
    }
  };

  const playWindowOpen = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(900, audioContextRef.current.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    }
  };

  const playSpinSound = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(150, audioContextRef.current.currentTime + 10);
      gainNode.gain.setValueAtTime(0.12, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 10);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 10);
    }
  };

  const playWinSound = () => {
    if (audioContextRef.current) {
      // Victory melody
      const frequencies = [523, 659, 784, 1047, 1319];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContextRef.current!.createOscillator();
          const gainNode = audioContextRef.current!.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current!.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
          gainNode.gain.setValueAtTime(0.15, audioContextRef.current!.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.4);
          
          oscillator.start();
          oscillator.stop(audioContextRef.current!.currentTime + 0.4);
        }, index * 120);
      });

      // Add confetti effect sound
      setTimeout(() => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        oscillator.frequency.setValueAtTime(2000, audioContextRef.current!.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContextRef.current!.currentTime + 0.8);
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.8);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current!.currentTime + 0.8);
      }, 600);
    }
  };

  const startBackgroundMusic = () => {
    if (backgroundMusicRef.current && audioContextRef.current) {
      // Create pleasant ambient background music
      const playAmbientTone = () => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        // Play soft ambient tones in a pleasant scale
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C major scale
        const note = notes[Math.floor(Math.random() * notes.length)];
        
        oscillator.frequency.setValueAtTime(note, audioContextRef.current!.currentTime);
        gainNode.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContextRef.current!.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 3);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current!.currentTime + 3);
      };

      // Play ambient tones every few seconds
      const ambientInterval = setInterval(playAmbientTone, 4000);
      playAmbientTone(); // Play first tone immediately

      // Store interval for cleanup
      (backgroundMusicRef.current as any).ambientInterval = ambientInterval;
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      if ((backgroundMusicRef.current as any).ambientInterval) {
        clearInterval((backgroundMusicRef.current as any).ambientInterval);
      }
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
