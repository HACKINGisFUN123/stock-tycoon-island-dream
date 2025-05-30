
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Star, Diamond, DollarSign, Gift } from 'lucide-react';

interface WheelOfFortuneProps {
  onClose: () => void;
  isPremium?: boolean;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ onClose, isPremium = false }) => {
  const { state, dispatch } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ type: 'money' | 'diamonds'; amount: number } | null>(null);

  const prizes = isPremium 
    ? [
        { type: 'money', amount: 50000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 500, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 100000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 1000, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 200000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 2000, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 500000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 5000, icon: Diamond, color: 'text-purple-400' },
      ]
    : [
        { type: 'money', amount: 1000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 10, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 2500, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 25, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 5000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 50, icon: Diamond, color: 'text-purple-400' },
        { type: 'money', amount: 10000, icon: DollarSign, color: 'text-green-400' },
        { type: 'diamonds', amount: 100, icon: Diamond, color: 'text-purple-400' },
      ];

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Simulate spin duration
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(randomPrize);
      
      dispatch({ 
        type: 'DAILY_SPIN', 
        reward: { type: randomPrize.type as 'money' | 'diamonds', amount: randomPrize.amount }
      });
      
      setSpinning(false);
    }, 3000);
  };

  const canSpin = !state.dailySpinUsed || isPremium;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-md w-full ${isPremium ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-400/50' : 'bg-slate-800 border-slate-600'} animate-scale-in`}>
        <CardHeader className="text-center relative">
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-2 right-2 w-6 h-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            {isPremium ? (
              <Star className="w-8 h-8 text-yellow-400" />
            ) : (
              <Gift className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <CardTitle className={`${isPremium ? 'text-yellow-400' : 'text-white'}`}>
            {isPremium ? 'Premium Wheel of Fortune' : 'Daily Wheel of Fortune'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          {/* Wheel Visual */}
          <div className={`w-48 h-48 mx-auto mb-6 rounded-full border-4 ${isPremium ? 'border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20'} flex items-center justify-center relative ${spinning ? 'animate-spin' : ''}`}>
            <div className="grid grid-cols-2 gap-2 text-center">
              {prizes.slice(0, 4).map((prize, index) => {
                const Icon = prize.icon;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <Icon className={`w-4 h-4 ${prize.color}`} />
                    <span className="text-xs text-white">{prize.amount}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Center pointer */}
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
          </div>
          
          {result && !spinning && (
            <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <result.icon className={result.type === 'money' ? 'text-green-400' : 'text-purple-400'} />
                <span className="text-white font-bold">
                  You won {result.amount} {result.type === 'money' ? 'dollars' : 'diamonds'}!
                </span>
              </div>
            </div>
          )}
          
          {canSpin && !result ? (
            <Button
              onClick={spin}
              disabled={spinning}
              className={`w-full ${isPremium ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 transition-all duration-300 hover:scale-105`}
            >
              {spinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
            </Button>
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
              {isPremium && (
                <Button
                  onClick={onClose}
                  className="mt-2 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Maybe Later
                </Button>
              )}
            </div>
          )}
          
          {isPremium && !result && (
            <div className="mt-4 text-xs text-gray-400">
              Premium wheel with higher rewards!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelOfFortune;
