
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Star, Diamond, DollarSign, Gift, Crown } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Prize {
  type: 'money' | 'diamonds';
  amount: number;
  color: string;
  icon: string;
}

interface WheelResult {
  type: 'money' | 'diamonds';
  amount: number;
  index: number;
  icon: string;
}

interface WheelOfFortuneProps {
  onClose: () => void;
  isPremium?: boolean;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ onClose, isPremium = false }) => {
  const { state, dispatch } = useGame();
  const { playSpinSound, playWinSound } = useSoundEffects();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelResult | null>(null);

  const regularPrizes: Prize[] = [
    { type: 'money', amount: 500, color: '#4ade80', icon: '💰' },
    { type: 'diamonds', amount: 5, color: '#a855f7', icon: '💎' },
    { type: 'money', amount: 1000, color: '#22c55e', icon: '💰' },
    { type: 'diamonds', amount: 10, color: '#9333ea', icon: '💎' },
    { type: 'money', amount: 750, color: '#16a34a', icon: '💰' },
    { type: 'diamonds', amount: 8, color: '#7c3aed', icon: '💎' },
    { type: 'money', amount: 1500, color: '#15803d', icon: '💰' },
    { type: 'diamonds', amount: 15, color: '#6d28d9', icon: '💎' },
    { type: 'money', amount: 2000, color: '#166534', icon: '💰' },
    { type: 'diamonds', amount: 20, color: '#581c87', icon: '💎' },
    { type: 'money', amount: 1250, color: '#14532d', icon: '💰' },
    { type: 'diamonds', amount: 12, color: '#4c1d95', icon: '💎' },
    { type: 'money', amount: 3000, color: '#052e16', icon: '💰' },
    { type: 'diamonds', amount: 25, color: '#3730a3', icon: '💎' },
    { type: 'money', amount: 10000, color: '#fbbf24', icon: '🎁' }, // Ultra rare
  ];

  const premiumPrizes: Prize[] = [
    { type: 'money', amount: 25000, color: '#fbbf24', icon: '💰' },
    { type: 'diamonds', amount: 250, color: '#f59e0b', icon: '💎' },
    { type: 'money', amount: 50000, color: '#f59e0b', icon: '💰' },
    { type: 'diamonds', amount: 500, color: '#d97706', icon: '💎' },
    { type: 'money', amount: 75000, color: '#b45309', icon: '💰' },
    { type: 'diamonds', amount: 750, color: '#92400e', icon: '💎' },
    { type: 'money', amount: 100000, color: '#78350f', icon: '💰' },
    { type: 'diamonds', amount: 1000, color: '#451a03', icon: '💎' },
    { type: 'money', amount: 125000, color: '#fbbf24', icon: '💰' },
    { type: 'diamonds', amount: 1250, color: '#f59e0b', icon: '💎' },
    { type: 'money', amount: 150000, color: '#d97706', icon: '💰' },
    { type: 'diamonds', amount: 1500, color: '#b45309', icon: '💎' },
    { type: 'money', amount: 200000, color: '#92400e', icon: '💰' },
    { type: 'diamonds', amount: 2000, color: '#78350f', icon: '💎' },
    { type: 'money', amount: 500000, color: '#ffd700', icon: '👑' }, // Jackpot
  ];

  const prizes = isPremium ? premiumPrizes : regularPrizes;
  const segmentAngle = 360 / prizes.length;

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    playSpinSound();
    
    const spinAmount = Math.random() * 360 + 1440; // At least 4 full rotations
    const finalRotation = rotation + spinAmount;
    const normalizedRotation = finalRotation % 360;
    const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % prizes.length;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const selectedPrize = prizes[selectedIndex];
      setResult({ 
        type: selectedPrize.type, 
        amount: selectedPrize.amount, 
        index: selectedIndex,
        icon: selectedPrize.icon
      });
      
      dispatch({ 
        type: 'DAILY_SPIN', 
        reward: { type: selectedPrize.type, amount: selectedPrize.amount }
      });
      
      playWinSound();
      setSpinning(false);
    }, 3000);
  };

  const canSpin = !state.dailySpinUsed || isPremium;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className={`max-w-md w-full ${isPremium ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-400/50'} animate-scale-in backdrop-blur-md`}>
        <CardHeader className="text-center relative">
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-2 right-2 w-8 h-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            {isPremium ? (
              <Crown className="w-8 h-8 text-yellow-400" />
            ) : (
              <Star className="w-8 h-8 text-purple-400" />
            )}
          </div>
          <CardTitle className={`${isPremium ? 'text-yellow-400' : 'text-purple-400'} text-xl`}>
            {isPremium ? 'Premium Wheel' : 'Lucky Wheel'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          {/* Wheel Container */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Lights around the wheel */}
            <div className="absolute inset-0 rounded-full">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full animate-pulse ${
                    isPremium ? 'bg-yellow-400' : 'bg-purple-400'
                  }`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-130px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            
            {/* Wheel */}
            <div
              className="relative w-56 h-56 rounded-full border-4 border-white/30 shadow-2xl transition-transform duration-[3000ms] ease-out mx-auto mt-4"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${prizes.map((prize, index) => 
                  `${prize.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                ).join(', ')})`
              }}
            >
              {/* Segment dividers and content */}
              {prizes.map((prize, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${index * segmentAngle}deg)`
                  }}
                >
                  {/* Divider line */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-28 bg-white/50 transform -translate-x-0.5" />
                  
                  {/* Prize content */}
                  <div
                    className="absolute text-white font-bold text-xs"
                    style={{
                      top: '20px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`,
                      textAlign: 'center'
                    }}
                  >
                    <div className="text-lg">{prize.icon}</div>
                    <div>{prize.amount}</div>
                  </div>
                </div>
              ))}
              
              {/* Center spin button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Button
                  onClick={spin}
                  disabled={spinning || !canSpin}
                  className={`w-16 h-16 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 ${
                    isPremium 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {spinning ? '...' : 'SPIN'}
                </Button>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white" />
            </div>
          </div>
          
          {result && !spinning && (
            <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30 animate-scale-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{result.icon}</span>
                <span className="text-white font-bold text-lg">
                  You won {result.amount} {result.type === 'money' ? 'dollars' : 'diamonds'}!
                </span>
              </div>
            </div>
          )}
          
          {canSpin && !result ? (
            <div className="text-center">
              {!isPremium && state.dailySpinUsed && (
                <div className="mb-4 text-gray-400 text-sm">
                  <p>Free spin used today</p>
                  <p>Additional spins: 10 💎</p>
                </div>
              )}
            </div>
          ) : result ? (
            <Button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 transition-all duration-300 hover:scale-105"
            >
              Collect Prize
            </Button>
          ) : (
            <div className="text-gray-400 text-center">
              <p>Come back tomorrow for your free spin!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelOfFortune;
