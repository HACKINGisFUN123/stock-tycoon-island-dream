
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import StockChart from '../StockChart';

const MarketScreen: React.FC = () => {
  const { state, dispatch } = useGame();
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
  
  if (selectedStock) {
    dispatch({ type: 'CHANGE_SCREEN', screen: 'trading' });
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' })}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Stock Market</h1>
            <p className="text-white/80">Cash: {formatMoney(state.money)}</p>
          </div>
          
          <div className="w-20" /> {/* Spacer */}
        </div>
        
        <div className="grid gap-4">
          {state.stocks.map((stock) => {
            const holding = state.portfolio[stock.id];
            const priceChange = getPriceChange(stock);
            const portfolioValue = getPortfolioValue(stock.id);
            
            return (
              <Card 
                key={stock.id} 
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => {
                  // Store selected stock for trading screen
                  localStorage.setItem('selectedStockId', stock.id);
                  dispatch({ type: 'CHANGE_SCREEN', screen: 'trading' });
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{stock.name}</h3>
                      <p className="text-sm text-white/70">{stock.symbol}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(stock.trend)}
                        <span className="text-xl font-bold text-white">
                          {formatMoney(stock.price)}
                        </span>
                      </div>
                      <p className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StockChart stock={stock} height={60} />
                  </div>
                  
                  {holding && (
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between text-sm text-white/80">
                        <span>Shares: {holding.shares}</span>
                        <span>Value: {formatMoney(portfolioValue)}</span>
                      </div>
                      <div className="text-xs text-white/60 mt-1">
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
