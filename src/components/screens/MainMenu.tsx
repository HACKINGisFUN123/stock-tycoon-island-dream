
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, ShoppingBag, Package, Settings, HelpCircle, DollarSign, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Stock Tycoon</h1>
            <p className="text-gray-300">Build Your Financial Empire</p>
          </div>
        </div>
        
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-600 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-center">Your Wealth</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatMoney(totalWealth)}
            </div>
            <div className="text-gray-400 text-sm">
              Cash: {formatMoney(state.money)} | Stocks: {formatMoney(getTotalPortfolioValue())}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'market' })}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Trading
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'shop' })}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-lg py-6"
          >
            <ShoppingBag className="w-6 h-6 mr-3" />
            Luxury Shop
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-lg py-6"
          >
            <DollarSign className="w-6 h-6 mr-3" />
            Get Money
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'inventory' })}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg py-6"
          >
            <Package className="w-6 h-6 mr-3" />
            My Collection
          </Button>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button 
              onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'settings' })}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'help' })}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
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
