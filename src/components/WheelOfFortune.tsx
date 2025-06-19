
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Star, Crown, Sparkles, Home } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Prize {
  type: 'money' | 'diamonds';
  amount: number;
  color: string;
  icon: string;
  label: string;
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
  onPremiumUpgrade?: () => void;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ onClose, isPremium = false, onPremiumUpgrade }) => {
  const { state, dispatch } = useGame();
  const { playSpinSound, playWinSound, playButtonClick } = useSoundEffects();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDiamondSpinOption, setShowDiamondSpinOption] = useState(false);

  // 8 segments for better symmetry
  const regularPrizes: Prize[] = [
    { type: 'money', amount: 500, color: '#059669', icon: '💰', label: '$500' },
    { type: 'diamonds', amount: 5, color: '#7c3aed', icon: '💎', label: '5 💎' },
    { type: 'money', amount: 1000, color: '#047857', icon: '🪙', label: '$1K' },
    { type: 'diamonds', amount: 10, color: '#6d28d9', icon: '💎', label: '10 💎' },
    { type: 'money', amount: 2000, color: '#065f46', icon: '💰', label: '$2K' },
    { type: 'diamonds', amount: 15, color: '#581c87', icon: '💎', label: '15 💎' },
    { type: 'money', amount: 5000, color: '#f59e0b', icon: '🎁', label: '$5K' },
    { type: 'money', amount: 750, color: '#0891b2', icon: '💰', label: '$750' },
  ];

  const premiumPrizes: Prize[] = [
    { type: 'money', amount: 100000, color: '#f59e0b', icon: '💰', label: '$100K' },
    { type: 'diamonds', amount: 1000, color: '#d97706', icon: '💎', label: '1K 💎' },
    { type: 'money', amount: 250000, color: '#b45309', icon: '💰', label: '$250K' },
    { type: 'diamonds', amount: 2500, color: '#92400e', icon: '💎', label: '2.5K 💎' },
    { type: 'money', amount: 500000, color: '#78350f', icon: '💰', label: '$500K' },
    { type: 'diamonds', amount: 5000, color: '#451a03', icon: '💎', label: '5K 💎' },
    { type: 'money', amount: 1000000, color: '#fbbf24', icon: '👑', label: '$1M' },
    { type: 'money', amount: 150000, color: '#ea580c', icon: '💰', label: '$150K' },
  ];

  const prizes = isPremium ? premiumPrizes : regularPrizes;
  const segmentAngle = 360 / prizes.length;

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    playSpinSound();
    
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const targetAngle = -(winningIndex * segmentAngle + segmentAngle / 2);
    const spinAmount = 1800 + targetAngle;
    const finalRotation = rotation + spinAmount;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const selectedPrize = prizes[winningIndex];
      setResult({ 
        type: selectedPrize.type, 
        amount: selectedPrize.amount, 
        index: winningIndex,
        icon: selectedPrize.icon
      });
      
      dispatch({ 
        type: 'DAILY_SPIN', 
        reward: { type: selectedPrize.type, amount: selectedPrize.amount }
      });
      
      playWinSound();
      setShowConfetti(true);
      setSpinning(false);
      
      if (!isPremium) {
        setShowDiamondSpinOption(true);
      }
    }, 4000);
  };

  const handleDiamondSpin = () => {
    if (state.diamonds >= 50) {
      playButtonClick();
      dispatch({ type: 'SPEND_DIAMONDS', amount: 50 });
      setResult(null);
      setShowDiamondSpinOption(false);
      spin();
    }
  };

  const handleBackToHome = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
    onClose();
  };

  const canSpin = !state.dailySpinUsed || isPremium;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-fade-in overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <Card className={`max-w-lg w-full ${isPremium ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-400/50' : 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-400/50'} animate-scale-in backdrop-blur-md`}>
        <CardHeader className="text-center relative pb-2">
          <div className="flex justify-between items-center">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center mb-2">
            {isPremium ? (
              <Crown className="w-8 h-8 text-yellow-400" />
            ) : (
              <Star className="w-8 h-8 text-purple-400" />
            )}
          </div>
          <CardTitle className={`${isPremium ? 'text-yellow-400' : 'text-purple-400'} text-xl`}>
            {isPremium ? 'Premium Golden Wheel' : 'Lucky Spin Wheel'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center flex flex-col items-center">
          {/* Wheel Container - Perfectly Centered */}
          <div className="flex justify-center mb-4 relative">
            {/* Static Arrow Pointer - Positioned above wheel */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 -mt-2">
              <div 
                className={`w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent ${
                  isPremium ? 'border-b-yellow-400' : 'border-b-white'
                } drop-shadow-2xl filter`}
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
              />
            </div>
            
            {/* Casino Wheel - Perfectly Centered */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-80 h-80 rounded-full shadow-2xl ${
                  isPremium ? 'shadow-yellow-400/30' : 'shadow-purple-400/30'
                } relative`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                  background: `conic-gradient(${prizes.map((prize, index) => 
                    `${prize.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                  ).join(', ')})`,
                  border: isPremium ? '6px solid #fbbf24' : '6px solid #8b5cf6'
                }}
              >
                {/* Outer decorative ring */}
                <div className={`absolute inset-2 rounded-full border-4 ${
                  isPremium ? 'border-yellow-300/50' : 'border-purple-300/50'
                }`} />
                
                {/* Inner decorative ring */}
                <div className={`absolute inset-6 rounded-full border-2 ${
                  isPremium ? 'border-yellow-200/30' : 'border-purple-200/30'
                }`} />

                {/* Segment lines and content */}
                {prizes.map((prize, index) => (
                  <div key={index} className="absolute inset-0">
                    {/* Divider line */}
                    <div 
                      className="absolute w-1 bg-white/90 shadow-lg z-10"
                      style={{
                        height: '152px',
                        top: '6px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                        transformOrigin: 'bottom'
                      }}
                    />
                    
                    {/* Prize content - Positioned closer to edge */}
                    <div
                      className="absolute flex flex-col items-center justify-center text-white font-bold z-5"
                      style={{
                        width: '90px',
                        height: '40px',
                        top: '20px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${index * segmentAngle + segmentAngle/2}deg)`,
                        transformOrigin: '50% 140px',
                        textAlign: 'center'
                      }}
                    >
                      <div className="text-xl mb-1 drop-shadow-lg filter">{prize.icon}</div>
                      <div className="text-xs font-black bg-black/90 px-2 py-1 rounded-md text-center leading-tight border border-white/40 shadow-xl text-white">
                        {prize.label}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Center hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <Button
                    onClick={spin}
                    disabled={spinning || !canSpin}
                    className={`w-20 h-20 rounded-full font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 ${
                      isPremium 
                        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-400/50 border-2 border-yellow-300' 
                        : 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-400/50 border-2 border-purple-300'
                    } ${spinning ? 'animate-pulse' : ''}`}
                  >
                    {spinning ? (
                      <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="text-xs font-black">SPIN</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {result && !spinning && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30 animate-scale-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl animate-bounce">{result.icon}</span>
                <span className="text-white font-bold text-lg">
                  You won {result.amount} {result.type === 'money' ? 'dollars' : 'diamonds'}!
                </span>
              </div>
            </div>
          )}
          
          {/* Diamond Spin Option */}
          {showDiamondSpinOption && !spinning && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
              <p className="text-white text-sm mb-3">Want another spin?</p>
              <Button
                onClick={handleDiamondSpin}
                disabled={state.diamonds < 50}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2"
              >
                <span className="mr-2">💎</span>
                Spin Again (50 Diamonds)
              </Button>
              {state.diamonds < 50 && (
                <p className="text-red-400 text-xs mt-2">Not enough diamonds</p>
              )}
            </div>
          )}
          
          {canSpin && !result ? (
            <div className="text-center">
              {!isPremium && state.dailySpinUsed && (
                <div className="mb-4 text-gray-400 text-sm">
                  <p>Free spin used today</p>
                  <p>Upgrade to Premium Wheel for better prizes!</p>
                </div>
              )}
            </div>
          ) : result ? (
            <div className="space-y-2">
              <Button
                onClick={onClose}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 transition-all duration-300 hover:scale-105"
              >
                Collect Prize
              </Button>
              {!isPremium && onPremiumUpgrade && (
                <Button
                  onClick={onPremiumUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 transition-all duration-300 hover:scale-105"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Try Premium Wheel
                </Button>
              )}
            </div>
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
