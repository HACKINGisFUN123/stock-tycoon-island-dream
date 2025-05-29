
import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Plus, Lock } from 'lucide-react';
import StockChart from '../StockChart';

const TradingScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [buyShares, setBuyShares] = useState<number>(1);
  const [sellShares, setSellShares] = useState<number>(1);
  
  useEffect(() => {
    const stockId = localStorage.getItem('selectedStockId');
    if (stockId) {
      setSelectedStockId(stockId);
    } else {
      dispatch({ type: 'CHANGE_SCREEN', screen: 'market' });
    }
  }, [dispatch]);
  
  const stock = state.stocks.find(s => s.id === selectedStockId);
  const holding = selectedStockId ? state.portfolio[selectedStockId] : null;
  
  if (!stock) {
    return null;
  }
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getPriceChange = () => {
    if (stock.history.length < 2) return 0;
    const current = stock.price;
    const previous = stock.history[stock.history.length - 2];
    return ((current - previous) / previous) * 100;
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const maxBuyShares = Math.floor(state.money / stock.price);
  const maxSellShares = holding ? holding.shares : 0;
  
  const adjustBuyShares = (delta: number) => {
    setBuyShares(prev => Math.max(1, Math.min(maxBuyShares, prev + delta)));
  };
  
  const adjustSellShares = (delta: number) => {
    setSellShares(prev => Math.max(1, Math.min(maxSellShares, prev + delta)));
  };
  
  const setBuyToMax = () => {
    setBuyShares(maxBuyShares);
  };
  
  const setSellToMax = () => {
    setSellShares(maxSellShares);
  };
  
  const handleBuy = () => {
    if (buyShares > 0 && buyShares <= maxBuyShares) {
      dispatch({
        type: 'BUY_STOCK',
        stockId: stock.id,
        amount: buyShares,
        price: stock.price
      });
      setBuyShares(1);
    }
  };
  
  const handleSell = () => {
    if (sellShares > 0 && sellShares <= maxSellShares && holding) {
      dispatch({
        type: 'SELL_STOCK',
        stockId: stock.id,
        amount: sellShares,
        price: stock.price
      });
      setSellShares(1);
    }
  };
  
  const priceChange = getPriceChange();
  const portfolioValue = holding ? holding.shares * stock.price : 0;
  const profitLoss = holding ? (stock.price - holding.avgBuyPrice) * holding.shares : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => {
              localStorage.removeItem('selectedStockId');
              dispatch({ type: 'CHANGE_SCREEN', screen: 'market' });
            }}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{stock.name}</h1>
            <p className="text-white/80">{stock.symbol}</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTrendIcon(stock.trend)}
                <div>
                  <div className="text-3xl font-bold text-white">
                    {formatMoney(stock.price)}
                  </div>
                  <div className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="text-right text-white/80">
                <div className="text-sm">Your Cash</div>
                <div className="text-lg font-semibold">{formatMoney(state.money)}</div>
              </div>
            </div>
            
            <StockChart stock={stock} height={120} />
          </CardContent>
        </Card>
        
        {holding && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Your Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <div className="text-sm opacity-80">Shares Owned</div>
                  <div className="text-xl font-bold">{holding.shares}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Current Value</div>
                  <div className="text-xl font-bold">{formatMoney(portfolioValue)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Avg. Buy Price</div>
                  <div className="text-lg">{formatMoney(holding.avgBuyPrice)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Profit/Loss</div>
                  <div className={`text-lg font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitLoss >= 0 ? '+' : ''}{formatMoney(profitLoss)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-green-500/20 backdrop-blur-md border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400">Buy Shares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-white/80 text-sm mb-2">Number of Shares</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Button
                    onClick={() => adjustBuyShares(-1)}
                    disabled={buyShares <= 1}
                    className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="bg-white/10 border border-white/30 rounded px-4 py-2 text-white text-xl font-bold min-w-[80px] text-center">
                    {buyShares}
                  </div>
                  
                  <Button
                    onClick={() => adjustBuyShares(1)}
                    disabled={buyShares >= maxBuyShares}
                    className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={setBuyToMax}
                  disabled={maxBuyShares === 0}
                  className="mb-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                >
                  MAX ({maxBuyShares})
                </Button>
                
                <div className="text-xs text-white/60">
                  Total Cost: {formatMoney(buyShares * stock.price)}
                </div>
              </div>
              
              <Button 
                onClick={handleBuy}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                disabled={buyShares <= 0 || buyShares > maxBuyShares || maxBuyShares === 0}
              >
                Buy {buyShares} Share{buyShares !== 1 ? 's' : ''}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-red-500/20 backdrop-blur-md border-red-400/30">
            <CardHeader>
              <CardTitle className="text-red-400">Sell Shares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-white/80 text-sm mb-2">Number of Shares</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Button
                    onClick={() => adjustSellShares(-1)}
                    disabled={sellShares <= 1 || !holding}
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="bg-white/10 border border-white/30 rounded px-4 py-2 text-white text-xl font-bold min-w-[80px] text-center">
                    {holding ? sellShares : 0}
                  </div>
                  
                  <Button
                    onClick={() => adjustSellShares(1)}
                    disabled={sellShares >= maxSellShares || !holding}
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={setSellToMax}
                  disabled={!holding || maxSellShares === 0}
                  className="mb-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                >
                  MAX ({maxSellShares})
                </Button>
                
                <div className="text-xs text-white/60">
                  Total Value: {holding ? formatMoney(sellShares * stock.price) : '$0.00'}
                </div>
              </div>
              
              <Button 
                onClick={handleSell}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                disabled={!holding || sellShares <= 0 || sellShares > maxSellShares}
              >
                Sell {holding ? sellShares : 0} Share{sellShares !== 1 ? 's' : ''}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingScreen;
