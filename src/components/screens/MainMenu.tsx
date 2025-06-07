
import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, ShoppingBag, Package, Settings, HelpCircle, Play, DollarSign, Star, Crown } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import WheelOfFortune from '../WheelOfFortune';

const MainMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick, startBackgroundMusic } = useSoundEffects();
  const [showWheel, setShowWheel] = useState(false);
  const [showPremiumWheel, setShowPremiumWheel] = useState(false);
  
  useEffect(() => {
    // Start background music when entering main menu
    startBackgroundMusic();
  }, [startBackgroundMusic]);
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const getTotalPortfolioValue = () => {
    return Object.entries(state.portfolio).reduce((total, [stockId, holding]) => {
      const stock = state.stocks.find(s => s.id === stockId);
      return total + (stock ? holding.shares * stock.price : 0);
    }, 0);
  };
  
  const totalWealth = state.money + getTotalPortfolioValue();

  const handleButtonClick = (screen: string) => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen });
  };

  const handleSpinWheel = () => {
    playButtonClick();
    setShowWheel(true);
  };

  const handlePremiumUpgrade = () => {
    setShowWheel(false);
    setShowPremiumWheel(true);
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 animate-fade-in ${state.tutorialCompleted ? '' : 'overflow-hidden'} pt-16`}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Stock Tycoon</h1>
            <p className="text-gray-300">Build Your Financial Empire</p>
          </div>
        </div>
        
        <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600 mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-white text-center">Your Wealth</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatMoney(totalWealth)}
            </div>
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <span>🪙</span>
                Cash: {formatMoney(state.money)}
              </div>
              <div className="flex items-center gap-1">
                <span>💎</span>
                {state.diamonds}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Stocks: {formatMoney(getTotalPortfolioValue())}
            </div>
          </CardContent>
        </Card>

        {/* Central Spin Wheel Button */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30 mb-6 animate-scale-in">
          <CardContent className="p-4 text-center">
            <Button
              onClick={handleSpinWheel}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
            >
              <Star className="w-6 h-6 mr-3 animate-pulse" />
              Daily Lucky Spin
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
            </Button>
            {!state.dailySpinUsed && (
              <div className="text-purple-400 text-sm font-semibold mt-2 animate-pulse">
                🎁 FREE SPIN AVAILABLE!
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button 
            onClick={() => handleButtonClick('market')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <Play className="w-6 h-6 mr-3" />
            Start Trading
          </Button>
          
          <Button 
            onClick={() => handleButtonClick('shop')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <ShoppingBag className="w-6 h-6 mr-3" />
            Luxury Shop
          </Button>
          
          <Button 
            onClick={() => handleButtonClick('money-shop')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <DollarSign className="w-6 h-6 mr-3" />
            Get Money
          </Button>
          
          <Button 
            onClick={() => handleButtonClick('inventory')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-lg py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Package className="w-6 h-6 mr-3" />
            My Collection
          </Button>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              onClick={() => handleButtonClick('settings')}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={() => handleButtonClick('help')}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
        
        {/* Daily Reward Notification - positioned closer to content */}
        {!state.dailyRewardClaimed && (
          <Card className="bg-yellow-500/20 backdrop-blur-md border-yellow-400/30 mt-4 animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="text-yellow-400 font-semibold mb-2">Daily Bonus Available!</div>
              <Button
                onClick={() => handleButtonClick('money-shop')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-300 hover:scale-105"
              >
                Claim $1,000
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Wheel Components */}
      {showWheel && (
        <WheelOfFortune 
          onClose={() => setShowWheel(false)} 
          onPremiumUpgrade={handlePremiumUpgrade}
        />
      )}
      
      {showPremiumWheel && (
        <WheelOfFortune 
          onClose={() => setShowPremiumWheel(false)} 
          isPremium={true} 
        />
      )}
    </div>
  );
};

export default MainMenu;
