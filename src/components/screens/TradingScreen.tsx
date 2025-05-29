
import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import StockChart from '../StockChart';

const TradingScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  
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
  
  const handleBuy = () => {
    const investAmount = parseFloat(amount);
    if (isNaN(investAmount) || investAmount <= 0) return;
    
    const sharesToBuy = Math.floor(investAmount / stock.price);
    if (sharesToBuy > 0) {
      dispatch({
        type: 'BUY_STOCK',
        stockId: stock.id,
        amount: sharesToBuy,
        price: stock.price
      });
      setAmount('');
      setShares('');
    }
  };
  
  const handleSell = () => {
    const sharesToSell = parseInt(shares);
    if (isNaN(sharesToSell) || sharesToSell <= 0 || !holding) return;
    
    const maxShares = holding.shares;
    const actualShares = Math.min(sharesToSell, maxShares);
    
    if (actualShares > 0) {
      dispatch({
        type: 'SELL_STOCK',
        stockId: stock.id,
        amount: actualShares,
        price: stock.price
      });
      setAmount('');
      setShares('');
    }
  };
  
  const maxBuyShares = Math.floor(state.money / stock.price);
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
              <div>
                <label className="text-white/80 text-sm block mb-2">
                  Investment Amount ($)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-white/50"
                />
                <div className="text-xs text-white/60 mt-1">
                  Max: {formatMoney(state.money)} ({maxBuyShares} shares)
                </div>
              </div>
              
              <Button 
                onClick={handleBuy}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > state.money}
              >
                Buy Shares
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-red-500/20 backdrop-blur-md border-red-400/30">
            <CardHeader>
              <CardTitle className="text-red-400">Sell Shares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white/80 text-sm block mb-2">
                  Number of Shares
                </label>
                <Input
                  type="number"
                  placeholder="Enter shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-white/50"
                  disabled={!holding}
                />
                <div className="text-xs text-white/60 mt-1">
                  Owned: {holding ? holding.shares : 0} shares
                </div>
              </div>
              
              <Button 
                onClick={handleSell}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                disabled={!holding || !shares || parseInt(shares) <= 0 || parseInt(shares) > holding.shares}
              >
                Sell Shares
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingScreen;
