
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { useSoundEffects } from '../hooks/useSoundEffects';

const TopBar: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick } = useSoundEffects();
  
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

  const handleMoneyShopClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'money-shop' });
  };

  const handleDiamondShopClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'diamond-shop' });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between max-w-full mx-auto">
        {/* Money Display - Left */}
        <Button
          onClick={handleMoneyShopClick}
          className="flex items-center gap-2 bg-green-600/90 hover:bg-green-700 rounded-full px-4 py-2 border border-green-500 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <div className="text-2xl">💰</div>
          <span className="text-white font-bold text-lg">
            {formatMoney(state.money)}
          </span>
        </Button>

        {/* Center - Net Worth */}
        <div className="text-center">
          <div className="text-xs text-gray-400">Net Worth</div>
          <div className="text-white font-bold text-sm">
            {formatMoney(state.money + getTotalPortfolioValue())}
          </div>
        </div>

        {/* Diamonds Display - Right */}
        <Button
          onClick={handleDiamondShopClick}
          className="flex items-center gap-2 bg-purple-600/90 hover:bg-purple-700 rounded-full px-4 py-2 border border-purple-500 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <div className="text-2xl">💎</div>
          <span className="text-white font-bold text-lg">
            {formatDiamonds(state.diamonds)}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
