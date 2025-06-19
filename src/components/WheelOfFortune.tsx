
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

  // 7 segments for cleaner design
  const regularPrizes: Prize[] = [
    { type: 'money', amount: 500, color: '#22c55e', icon: '💰' },
    { type: 'diamonds', amount: 5, color: '#a855f7', icon: '💎' },
    { type: 'money', amount: 1000, color: '#16a34a', icon: '🪙' },
    { type: 'diamonds', amount: 10, color: '#9333ea', icon: '💎' },
    { type: 'money', amount: 2000, color: '#15803d', icon: '💰' },
    { type: 'diamonds', amount: 15, color: '#7c3aed', icon: '💎' },
    { type: 'money', amount: 5000, color: '#fbbf24', icon: '🎁' },
  ];

  const premiumPrizes: Prize[] = [
    { type: 'money', amount: 25000, color: '#f59e0b', icon: '💰' },
    { type: 'diamonds', amount: 100, color: '#d97706', icon: '💎' },
    { type: 'money', amount: 50000, color: '#b45309', icon: '💰' },
    { type: 'diamonds', amount: 200, color: '#92400e', icon: '💎' },
    { type: 'money', amount: 100000, color: '#78350f', icon: '💰' },
    { type: 'diamonds', amount: 500, color: '#451a03', icon: '💎' },
    { type: 'money', amount: 250000, color: '#ffd700', icon: '👑' },
  ];

  const prizes = isPremium ? premiumPrizes : regularPrizes;
  const segmentAngle = 360 / prizes.length; // 51.43 degrees per segment

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    playSpinSound();
    
    // Pre-determine the winning index for accurate results
    const winningIndex = Math.floor(Math.random() * prizes.length);
    
    // Calculate exact rotation to land on the winning segment
    // The pointer is at the top (0 degrees), so we need to rotate to align the segment center with it
    const targetAngle = -(winningIndex * segmentAngle + segmentAngle / 2);
    const spinAmount = 1800 + targetAngle; // 5 full rotations plus target
    const finalRotation = rotation + spinAmount;
    
    setRotation(finalRotation);
    
    // 5 second animation with proper timing
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
      
      // Show diamond spin option after regular wheel
      if (!isPremium) {
        setShowDiamondSpinOption(true);
      }
    }, 5000);
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in">
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

      <Card className={`max-w-md w-full ${isPremium ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-400/50'} animate-scale-in backdrop-blur-md`}>
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
        
        <CardContent className="text-center">
          {/* Wheel Container - Centered */}
          <div className="flex justify-center mb-4">
            <div className="relative w-80 h-80">
              {/* Static Arrow Pointer - Fixed at top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
                <div 
                  className={`w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent ${
                    isPremium ? 'border-b-yellow-400' : 'border-b-white'
                  } shadow-2xl filter drop-shadow-lg`} 
                />
              </div>
              
              {/* Main Wheel - Perfectly Centered */}
              <div
                className={`relative w-72 h-72 rounded-full border-8 shadow-2xl mx-auto mt-4 ${
                  isPremium ? 'border-yellow-400/80 shadow-yellow-400/30' : 'border-purple-400/80 shadow-purple-400/30'
                }`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                  background: `conic-gradient(${prizes.map((prize, index) => 
                    `${prize.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                  ).join(', ')})`
                }}
              >
                {/* Segment lines and content */}
                {prizes.map((prize, index) => (
                  <div key={index} className="absolute inset-0">
                    {/* Divider line */}
                    <div 
                      className="absolute w-1 bg-white/80 shadow-lg z-10"
                      style={{
                        height: '136px',
                        top: '0px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                        transformOrigin: 'bottom'
                      }}
                    />
                    
                    {/* Prize content - Centered in each segment */}
                    <div
                      className="absolute flex flex-col items-center justify-center text-white font-bold z-5"
                      style={{
                        width: '80px',
                        height: '80px',
                        top: '30px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${index * segmentAngle + segmentAngle/2}deg)`,
                        transformOrigin: '50% 106px',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.9)'
                      }}
                    >
                      <div className="text-2xl mb-1 drop-shadow-lg">{prize.icon}</div>
                      <div className="text-xs font-bold bg-black/70 px-2 py-1 rounded text-center leading-tight">
                        {prize.amount}
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
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-400/50' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-400/50'
                    } ${spinning ? 'animate-pulse' : ''}`}
                  >
                    {spinning ? (
                      <Sparkles className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="text-sm font-black">SPIN</span>
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
