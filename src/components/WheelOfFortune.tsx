
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Star, Diamond, DollarSign, Gift, Zap } from 'lucide-react';

interface WheelOfFortuneProps {
  onClose: () => void;
  isPremium?: boolean;
}

interface Prize {
  type: 'money' | 'diamonds';
  amount: number;
  icon: React.ComponentType<any>;
  color: string;
  rarity: 'common' | 'rare' | 'ultra-rare';
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ onClose, isPremium = false }) => {
  const { state, dispatch } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ type: 'money' | 'diamonds'; amount: number } | null>(null);
  const [rotation, setRotation] = useState(0);

  const regularPrizes: Prize[] = [
    { type: 'money', amount: 500, icon: DollarSign, color: '#10B981', rarity: 'common' },
    { type: 'diamonds', amount: 5, icon: Diamond, color: '#8B5CF6', rarity: 'common' },
    { type: 'money', amount: 1000, icon: DollarSign, color: '#10B981', rarity: 'common' },
    { type: 'diamonds', amount: 10, icon: Diamond, color: '#8B5CF6', rarity: 'common' },
    { type: 'money', amount: 2500, icon: DollarSign, color: '#10B981', rarity: 'common' },
    { type: 'diamonds', amount: 25, icon: Diamond, color: '#8B5CF6', rarity: 'rare' },
    { type: 'money', amount: 5000, icon: DollarSign, color: '#10B981', rarity: 'rare' },
    { type: 'diamonds', amount: 50, icon: Diamond, color: '#8B5CF6', rarity: 'rare' },
    { type: 'money', amount: 10000, icon: DollarSign, color: '#F59E0B', rarity: 'rare' },
    { type: 'diamonds', amount: 100, icon: Diamond, color: '#F59E0B', rarity: 'ultra-rare' },
  ];

  const premiumPrizes: Prize[] = [
    { type: 'money', amount: 25000, icon: DollarSign, color: '#F59E0B', rarity: 'common' },
    { type: 'diamonds', amount: 200, icon: Diamond, color: '#F59E0B', rarity: 'common' },
    { type: 'money', amount: 50000, icon: DollarSign, color: '#F59E0B', rarity: 'common' },
    { type: 'diamonds', amount: 500, icon: Diamond, color: '#F59E0B', rarity: 'common' },
    { type: 'money', amount: 100000, icon: DollarSign, color: '#F59E0B', rarity: 'rare' },
    { type: 'diamonds', amount: 1000, icon: Diamond, color: '#F59E0B', rarity: 'rare' },
    { type: 'money', amount: 250000, icon: DollarSign, color: '#F59E0B', rarity: 'rare' },
    { type: 'diamonds', amount: 2500, icon: Diamond, color: '#F59E0B', rarity: 'rare' },
    { type: 'money', amount: 500000, icon: DollarSign, color: '#F59E0B', rarity: 'ultra-rare' },
    { type: 'diamonds', amount: 5000, icon: Diamond, color: '#F59E0B', rarity: 'ultra-rare' },
  ];

  const prizes = isPremium ? premiumPrizes : regularPrizes;

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Calculate random rotation (multiple full spins + random position)
    const baseRotation = 360 * 5; // 5 full spins
    const randomRotation = Math.random() * 360;
    const finalRotation = rotation + baseRotation + randomRotation;
    
    setRotation(finalRotation);
    
    // Determine winning prize based on final position
    setTimeout(() => {
      const segmentAngle = 360 / prizes.length;
      const normalizedRotation = (finalRotation % 360);
      const prizeIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % prizes.length;
      
      // Apply rarity probability (lower chance for rare items)
      let selectedPrize = prizes[prizeIndex];
      const rarityRoll = Math.random();
      
      if (selectedPrize.rarity === 'ultra-rare' && rarityRoll > 0.02) {
        // 2% chance for ultra-rare
        selectedPrize = prizes.find(p => p.rarity === 'common') || prizes[0];
      } else if (selectedPrize.rarity === 'rare' && rarityRoll > 0.15) {
        // 15% chance for rare
        selectedPrize = prizes.find(p => p.rarity === 'common') || prizes[0];
      }
      
      const prizeResult = { type: selectedPrize.type, amount: selectedPrize.amount };
      setResult(prizeResult);
      
      dispatch({ 
        type: 'DAILY_SPIN', 
        reward: prizeResult
      });
      
      setSpinning(false);
    }, 3000);
  };

  const canSpin = !state.dailySpinUsed || isPremium;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className={`max-w-lg w-full ${isPremium ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50' : 'bg-slate-800 border-slate-600'} animate-scale-in`}>
        <CardHeader className="text-center relative pb-2">
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-2 right-2 w-8 h-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            {isPremium ? (
              <Star className="w-8 h-8 text-yellow-400" />
            ) : (
              <Gift className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <CardTitle className={`${isPremium ? 'text-yellow-400' : 'text-white'} text-xl`}>
            {isPremium ? 'Premium Wheel' : 'Lucky Wheel'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          {/* Wheel Container */}
          <div className="relative w-80 h-80 mx-auto mb-6">
            {/* Wheel Base */}
            <div className={`w-full h-full rounded-full border-8 ${isPremium ? 'border-yellow-400 bg-gradient-to-br from-yellow-300 to-orange-400' : 'border-blue-400 bg-gradient-to-br from-blue-400 to-purple-500'} relative overflow-hidden shadow-2xl`}>
              
              {/* Wheel Segments */}
              <div 
                className="w-full h-full rounded-full relative transition-transform duration-3000 ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index;
                  const nextAngle = (360 / prizes.length) * (index + 1);
                  const Icon = prize.icon;
                  
                  return (
                    <div
                      key={index}
                      className="absolute w-full h-full"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 45 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                        backgroundColor: index % 2 === 0 ? (isPremium ? '#FCD34D' : '#3B82F6') : (isPremium ? '#F59E0B' : '#8B5CF6')
                      }}
                    >
                      <div 
                        className="absolute flex flex-col items-center justify-center text-white text-xs font-bold"
                        style={{
                          top: '20%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle + (360 / prizes.length) / 2}deg)`,
                          transformOrigin: '50% 150%'
                        }}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span>{prize.amount}</span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Dividing Lines */}
                {prizes.map((_, index) => {
                  const angle = (360 / prizes.length) * index;
                  return (
                    <div
                      key={`line-${index}`}
                      className="absolute w-1 h-1/2 bg-white/50 top-0 left-1/2 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                    />
                  );
                })}
              </div>
              
              {/* Center Hub */}
              <div className={`absolute top-1/2 left-1/2 w-16 h-16 ${isPremium ? 'bg-yellow-500' : 'bg-blue-600'} rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-4 border-white shadow-lg z-10`}>
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-2 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white transform -translate-x-1/2 z-20 drop-shadow-lg"></div>
            
            {/* Decorative Lights */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => {
                const angle = (360 / 12) * i;
                const x = 50 + 48 * Math.cos((angle - 90) * Math.PI / 180);
                const y = 50 + 48 * Math.sin((angle - 90) * Math.PI / 180);
                return (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-pulse"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {result && !spinning && (
            <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30 animate-scale-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-white font-bold text-lg">
                  You won {result.amount} {result.type === 'money' ? 'Cash' : 'Diamonds'}!
                </span>
              </div>
            </div>
          )}
          
          {canSpin && !result ? (
            <Button
              onClick={spin}
              disabled={spinning}
              className={`w-full ${isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              {spinning ? 'SPINNING...' : 'SPIN NOW!'}
            </Button>
          ) : result ? (
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Collect Prize
            </Button>
          ) : (
            <div className="text-gray-400 text-center">
              <p className="text-lg mb-4">Come back tomorrow for a free spin!</p>
              {isPremium && (
                <Button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl px-6 py-3"
                >
                  Maybe Later
                </Button>
              )}
            </div>
          )}
          
          {isPremium && !result && (
            <div className="mt-4 text-sm text-gray-400">
              Premium wheel with high-value rewards only!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelOfFortune;
