
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, Package, ShoppingCart, Settings, HelpCircle, Gift } from 'lucide-react';

const MainMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const portfolioValue = Object.entries(state.portfolio).reduce((total, [stockId, holding]) => {
    const stock = state.stocks.find(s => s.id === stockId);
    return total + (stock ? stock.price * holding.shares : 0);
  }, 0);
  
  const totalWealth = state.money + portfolioValue;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-yellow-300 drop-shadow-lg">
          💰 Stock Tycoon
        </h1>
        <p className="text-xl opacity-90">Build Your Virtual Empire!</p>
      </div>
      
      <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8 w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="text-sm opacity-80 mb-1">Your Wealth</div>
          <div className="text-3xl font-bold text-green-300 mb-2">
            {formatMoney(totalWealth)}
          </div>
          <div className="text-sm opacity-80">
            Cash: {formatMoney(state.money)} | Portfolio: {formatMoney(portfolioValue)}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'market' })}
          className="h-16 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg"
        >
          <TrendingUp className="w-6 h-6 mr-2" />
          Trade
        </Button>
        
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'inventory' })}
          className="h-16 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg"
        >
          <Package className="w-6 h-6 mr-2" />
          Assets
        </Button>
        
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'shop' })}
          className="h-16 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg"
        >
          <ShoppingCart className="w-6 h-6 mr-2" />
          Shop
        </Button>
        
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'settings' })}
          className="h-16 bg-gray-500 hover:bg-gray-600 text-white font-semibold text-lg"
        >
          <Settings className="w-6 h-6 mr-2" />
          Settings
        </Button>
      </div>
      
      <div className="flex gap-4 w-full max-w-md">
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'help' })}
          variant="outline"
          className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        
        {!state.dailyRewardClaimed && (
          <Button 
            onClick={() => dispatch({ type: 'CLAIM_DAILY_REWARD' })}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse"
          >
            <Gift className="w-4 h-4 mr-2" />
            Daily Bonus
          </Button>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm opacity-60">
        <p>Login Streak: {state.loginStreak} days</p>
      </div>
    </div>
  );
};

export default MainMenu;
