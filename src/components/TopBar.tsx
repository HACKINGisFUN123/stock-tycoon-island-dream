
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { DollarSign, Plus } from 'lucide-react';
import { Button } from './ui/button';

const TopBar: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatDiamonds = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
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
        {/* Money Display - Left Side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-xl px-4 py-2 border border-slate-600 shadow-lg">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-lg">
                  {formatMoney(state.money)}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Net: {formatMoney(totalWealth)}
              </div>
            </div>
          </div>

          <Button
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white p-2 h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Diamonds Display - Right Side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-800/80 rounded-xl px-4 py-2 border border-purple-600 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="text-purple-300 font-bold text-lg">
                {formatDiamonds(state.diamonds)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' })}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
