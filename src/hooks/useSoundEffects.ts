
import { useGame } from '../contexts/GameContext';

export const useSoundEffects = () => {
  const { state } = useGame();
  
  const playSound = (type: 'click' | 'buy' | 'sell' | 'success' | 'error') => {
    if (!state.soundEnabled) return;
    
    // For now, we'll just log the sound type
    // In a real implementation, you would play audio files here
    console.log(`Playing sound: ${type}`);
    
    // Example of how you might implement this with actual audio:
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.play().catch(console.error);
  };
  
  return { playSound };
};
