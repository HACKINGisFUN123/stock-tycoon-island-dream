
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { TrendingUp, DollarSign, Plus } from 'lucide-react';
import { Button } from './ui/button';

const TopBar: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Stock Tycoon</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2 border border-slate-600">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold text-lg">
                  {formatMoney(state.money)}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Net: {formatMoney(totalWealth)}
              </div>
            </div>
            
            <Button
              onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white p-2 h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
