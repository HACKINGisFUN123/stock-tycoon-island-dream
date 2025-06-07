
import { useEffect, useRef } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
    };
  }, []);

  const playButtonClick = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // More pleasant button click sound
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContextRef.current.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.12);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.12);
    }
  };

  const playWindowOpen = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(500, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, audioContextRef.current.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.06, audioContextRef.current.currentTime);
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
      
      oscillator.frequency.setValueAtTime(300, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(100, audioContextRef.current.currentTime + 5);
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 5);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 5);
    }
  };

  const playWinSound = () => {
    if (audioContextRef.current) {
      // Happy victory melody
      const frequencies = [523, 659, 784, 1047];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContextRef.current!.createOscillator();
          const gainNode = audioContextRef.current!.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current!.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
          gainNode.gain.setValueAtTime(0.12, audioContextRef.current!.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.3);
          
          oscillator.start();
          oscillator.stop(audioContextRef.current!.currentTime + 0.3);
        }, index * 80);
      });
    }
  };

  const startBackgroundMusic = () => {
    if (backgroundMusicRef.current && audioContextRef.current) {
      // Stop any existing music
      stopBackgroundMusic();
      
      // Create cheerful ambient background music
      const playCheerfulTone = () => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        // Happy major scale notes
        const cheerfulNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
        const note = cheerfulNotes[Math.floor(Math.random() * cheerfulNotes.length)];
        
        oscillator.frequency.setValueAtTime(note, audioContextRef.current!.currentTime);
        gainNode.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.015, audioContextRef.current!.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current!.currentTime + 2);
      };

      // Play cheerful tones every 3 seconds
      musicIntervalRef.current = setInterval(playCheerfulTone, 3000);
      playCheerfulTone(); // Play first tone immediately
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
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
