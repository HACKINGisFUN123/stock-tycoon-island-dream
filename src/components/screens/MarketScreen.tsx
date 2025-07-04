
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import StockChart from '../StockChart';

const MarketScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick } = useSoundEffects();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getPortfolioValue = (stockId: string) => {
    const holding = state.portfolio[stockId];
    const stock = state.stocks.find(s => s.id === stockId);
    if (!holding || !stock) return 0;
    return holding.shares * stock.price;
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const getPriceChange = (stock: any) => {
    if (stock.history.length < 2) return 0;
    const current = stock.price;
    const previous = stock.history[stock.history.length - 2];
    return ((current - previous) / previous) * 100;
  };

  const handleBackClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
  };

  const handleStockClick = (stockId: string) => {
    playButtonClick();
    localStorage.setItem('selectedStockId', stockId);
    dispatch({ type: 'CHANGE_SCREEN', screen: 'trading' });
  };
  
  if (selectedStock) {
    dispatch({ type: 'CHANGE_SCREEN', screen: 'trading' });
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={handleBackClick}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Stock Market</h1>
            <p className="text-gray-400 text-sm">Choose a stock to trade</p>
          </div>
          
          <div className="w-16" />
        </div>
        
        <div className="space-y-3">
          {state.stocks.map((stock) => {
            const holding = state.portfolio[stock.id];
            const priceChange = getPriceChange(stock);
            const portfolioValue = getPortfolioValue(stock.id);
            
            return (
              <Card 
                key={stock.id} 
                className="bg-slate-800/50 backdrop-blur-md border-slate-600 hover:bg-slate-700/50 transition-all cursor-pointer hover:scale-[1.02] animate-fade-in"
                onClick={() => handleStockClick(stock.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">{stock.name}</h3>
                      <p className="text-sm text-gray-400">{stock.symbol}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(stock.trend)}
                        <span className="text-lg font-bold text-white">
                          {formatMoney(stock.price)}
                        </span>
                      </div>
                      <p className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StockChart stock={stock} height={50} />
                  </div>
                  
                  {holding && (
                    <div className="border-t border-slate-600 pt-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Shares: {holding.shares}</span>
                        <span>Value: {formatMoney(portfolioValue)}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Avg. Buy: {formatMoney(holding.avgBuyPrice)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketScreen;
