
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Home } from 'lucide-react';

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

  const handleBackToHome = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 border-b border-slate-700/50 px-3 py-2 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between max-w-full mx-auto">
          {/* Back to Home Button - Left */}
          <Button
            onClick={handleBackToHome}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full px-3 py-1.5 border border-blue-500/30 transition-all duration-300 hover:scale-105 shadow-lg min-w-0"
          >
            <Home className="w-4 h-4" />
            <span className="text-white font-bold text-sm hidden sm:inline">Home</span>
          </Button>

          {/* Money Display - Center Left */}
          <Button
            onClick={handleMoneyShopClick}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full px-3 py-1.5 border border-green-500/30 transition-all duration-300 hover:scale-105 shadow-lg min-w-0"
          >
            <div className="text-xl">🪙</div>
            <span className="text-white font-bold text-sm">
              {formatMoney(state.money)}
            </span>
          </Button>

          {/* Net Worth - Center (optional, hidden on small screens) */}
          <div className="text-center px-2 min-w-0 hidden md:block">
            <div className="text-xs text-gray-400">Net Worth</div>
            <div className="text-white font-bold text-xs">
              {formatMoney(state.money + getTotalPortfolioValue())}
            </div>
          </div>

          {/* Diamonds Display - Right */}
          <Button
            onClick={handleDiamondShopClick}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full px-3 py-1.5 border border-purple-500/30 transition-all duration-300 hover:scale-105 shadow-lg min-w-0"
          >
            <div className="text-xl">💎</div>
            <span className="text-white font-bold text-sm">
              {formatDiamonds(state.diamonds)}
            </span>
          </Button>
        </div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-16 w-full"></div>
    </>
  );
};

export default TopBar;
