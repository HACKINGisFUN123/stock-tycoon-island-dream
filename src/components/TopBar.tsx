
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { TrendingUp, DollarSign } from 'lucide-react';

const TopBar: React.FC = () => {
  const { state } = useGame();
  
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <span className="text-white font-bold text-lg">Stock Tycoon</span>
        </div>
        
        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default TopBar;
