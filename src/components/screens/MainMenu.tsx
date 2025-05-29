
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, ShoppingBag, Package, Settings, HelpCircle, DollarSign } from 'lucide-react';

const MainMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Stock Tycoon</h1>
          <p className="text-white/80">Build Your Financial Empire</p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-center">Your Wealth</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatMoney(totalWealth)}
            </div>
            <div className="text-white/70 text-sm">
              Cash: {formatMoney(state.money)} | Stocks: {formatMoney(getTotalPortfolioValue())}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'market' })}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6"
          >
            <TrendingUp className="w-6 h-6 mr-3" />
            Trade Stocks
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'shop' })}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white text-lg py-6"
          >
            <ShoppingBag className="w-6 h-6 mr-3" />
            Luxury Shop
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-6"
          >
            <DollarSign className="w-6 h-6 mr-3" />
            Get Money
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'inventory' })}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6"
          >
            <Package className="w-6 h-6 mr-3" />
            My Collection
          </Button>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'settings' })}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'help' })}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
        
        {/* Daily Reward Notification */}
        {!state.dailyRewardClaimed && (
          <Card className="bg-yellow-500/20 backdrop-blur-md border-yellow-400/30 mt-6">
            <CardContent className="p-4 text-center">
              <div className="text-yellow-400 font-semibold mb-2">Daily Bonus Available!</div>
              <Button
                onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Claim $1,000
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
