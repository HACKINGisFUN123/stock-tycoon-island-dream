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
    { type: 'money', amount: 500, color: '#10b981', icon: '💰', label: '$500' },
    { type: 'diamonds', amount: 5, color: '#8b5cf6', icon: '💎', label: '5 💎' },
    { type: 'money', amount: 1000, color: '#059669', icon: '🪙', label: '$1K' },
    { type: 'diamonds', amount: 10, color: '#7c3aed', icon: '💎', label: '10 💎' },
    { type: 'money', amount: 2000, color: '#047857', icon: '💰', label: '$2K' },
    { type: 'diamonds', amount: 15, color: '#6d28d9', icon: '💎', label: '15 💎' },
    { type: 'money', amount: 5000, color: '#f59e0b', icon: '🎁', label: '$5K' },
    { type: 'money', amount: 750, color: '#0891b2', icon: '💰', label: '$750' },
  ];

  const premiumPrizes: Prize[] = [
    { type: 'money', amount: 500000, color: '#ffd700', icon: '💰', label: '$500K' },
    { type: 'diamonds', amount: 10000, color: '#ff6b6b', icon: '💎', label: '10K 💎' },
    { type: 'money', amount: 1000000, color: '#ff4757', icon: '👑', label: '$1M' },
    { type: 'diamonds', amount: 25000, color: '#5f27cd', icon: '💎', label: '25K 💎' },
    { type: 'money', amount: 2500000, color: '#00d2d3', icon: '💰', label: '$2.5M' },
    { type: 'diamonds', amount: 50000, color: '#ff9ff3', icon: '💎', label: '50K 💎' },
    { type: 'money', amount: 10000000, color: '#54a0ff', icon: '🏆', label: '$10M' },
    { type: 'money', amount: 750000, color: '#2ed573', icon: '💰', label: '$750K' },
  ];

  const prizes = isPremium ? premiumPrizes : regularPrizes;
  const segmentAngle = 360 / prizes.length;

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    playSpinSound();
    
    // Calculate winning index - the arrow points to the top (12 o'clock position)
    const winningIndex = Math.floor(Math.random() * prizes.length);
    
    // Calculate the angle where the winning segment should stop at the top
    // We want the center of the winning segment to align with the arrow (top position)
    const segmentCenterAngle = winningIndex * segmentAngle + segmentAngle / 2;
    
    // The wheel needs to rotate so that the winning segment's center aligns with the top (0 degrees)
    // Since we're rotating the wheel clockwise, we need to calculate the negative rotation
    const targetRotation = 360 - segmentCenterAngle;
    
    // Add multiple full rotations for dramatic effect
    const spinAmount = 1800 + targetRotation; // 5 full rotations + target position
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
            {/* Static Arrow Pointer - Fixed at top, pointing down */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 -mt-6">
              <div className="flex flex-col items-center">
                <div 
                  className={`w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent ${
                    isPremium ? 'border-b-yellow-400' : 'border-b-white'
                  } drop-shadow-2xl filter animate-pulse`} 
                />
                <div 
                  className={`w-2 h-4 ${
                    isPremium ? 'bg-yellow-400' : 'bg-white'
                  } drop-shadow-xl`}
                />
              </div>
            </div>
            
            {/* Casino Wheel - Perfectly Centered and Symmetric */}
            <div className="relative">
              <div
                className={`w-80 h-80 rounded-full shadow-2xl ${
                  isPremium ? 'shadow-yellow-400/20' : 'shadow-purple-400/20'
                } mx-auto relative overflow-hidden`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                  border: isPremium ? '8px solid #fbbf24' : '8px solid #8b5cf6'
                }}
              >
                {/* Background gradient for each segment */}
                {prizes.map((prize, index) => (
                  <div
                    key={`bg-${index}`}
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(from ${index * segmentAngle}deg, ${prize.color} 0deg, ${prize.color} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((index * segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((index * segmentAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos(((index + 1) * segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((index + 1) * segmentAngle - 90) * Math.PI / 180)}%)`
                    }}
                  />
                ))}

                {/* Outer decorative ring */}
                <div className={`absolute inset-2 rounded-full border-4 ${
                  isPremium ? 'border-yellow-300/50' : 'border-purple-300/50'
                }`} />
                
                {/* Inner decorative ring */}
                <div className={`absolute inset-6 rounded-full border-2 ${
                  isPremium ? 'border-yellow-200/30' : 'border-purple-200/30'
                }`} />

                {/* Segment divider lines */}
                {prizes.map((_, index) => (
                  <div 
                    key={`line-${index}`}
                    className="absolute w-1 bg-white/90 shadow-lg z-10"
                    style={{
                      height: '152px',
                      top: '8px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                      transformOrigin: 'bottom'
                    }}
                  />
                ))}
                
                {/* Prize content - Positioned near outer edge */}
                {prizes.map((prize, index) => (
                  <div
                    key={`prize-${index}`}
                    className="absolute flex flex-col items-center justify-center z-20"
                    style={{
                      width: '90px',
                      height: '45px',
                      top: '35px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${index * segmentAngle + segmentAngle/2}deg)`,
                      transformOrigin: '50% 125px',
                      textAlign: 'center'
                    }}
                  >
                    <div className="text-xl mb-1 drop-shadow-lg filter">{prize.icon}</div>
                    <div className="text-xs font-black bg-black/95 px-2 py-1 rounded-md text-center leading-tight border border-white/60 shadow-xl text-white min-w-0">
                      {prize.label}
                    </div>
                  </div>
                ))}
                
                {/* Center hub with spin button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <Button
                    onClick={spin}
                    disabled={spinning || !canSpin}
                    className={`w-24 h-24 rounded-full font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 ${
                      isPremium 
                        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-400/50 border-4 border-yellow-300' 
                        : 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-400/50 border-4 border-purple-300'
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
