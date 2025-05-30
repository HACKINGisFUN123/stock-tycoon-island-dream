
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getTotalPortfolioValue = () => {
    return Object.entries(state.portfolio).reduce((total, [stockId, holding]) => {
      const stock = state.stocks.find(s => s.id === stockId);
      return total + (stock ? holding.shares * stock.price : 0);
    }, 0);
  };

  const getStockPerformance = (stock: any) => {
    if (stock.history.length < 2) return 0;
    const current = stock.price;
    const previous = stock.history[stock.history.length - 2];
    return ((current - previous) / previous) * 100;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' })}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-white">Stock Market</h1>
            <div className="text-white/80 text-sm">
              Portfolio: {formatMoney(getTotalPortfolioValue())}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {state.stocks.map((stock) => {
            const holding = state.portfolio[stock.id];
            const performance = getStockPerformance(stock);
            const isPositive = performance >= 0;
            
            return (
              <Card 
                key={stock.id} 
                className="bg-slate-800/80 backdrop-blur-md border-slate-600 transition-all duration-300 hover:scale-105 hover:bg-slate-700/80 rounded-xl shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{stock.name}</h3>
                          <p className="text-gray-400 text-sm">{stock.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-white">
                          {formatMoney(stock.price)}
                        </div>
                        
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          isPositive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : performance < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                          {performance > 0 ? '+' : ''}{performance.toFixed(2)}%
                        </div>
                      </div>
                      
                      {holding && (
                        <div className="mt-2 text-sm text-gray-400">
                          Owned: {holding.shares} shares • Value: {formatMoney(holding.shares * stock.price)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'trading' })}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 rounded-xl px-6 py-3 font-semibold"
                      >
                        Trade
                      </Button>
                    </div>
                  </div>
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
