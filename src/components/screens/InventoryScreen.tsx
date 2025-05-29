
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Trophy, DollarSign } from 'lucide-react';

const InventoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const portfolioValue = Object.entries(state.portfolio).reduce((total, [stockId, holding]) => {
    const stock = state.stocks.find(s => s.id === stockId);
    return total + (stock ? stock.price * holding.shares : 0);
  }, 0);
  
  const ownedItems = state.luxuryItems.filter(item => item.owned);
  const totalItemsValue = ownedItems.reduce((total, item) => total + item.price, 0);
  const totalWealth = state.money + portfolioValue + totalItemsValue;
  
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'car': return '🚗';
      case 'house': return '🏠';
      case 'yacht': return '🛥️';
      case 'jet': return '✈️';
      case 'gadget': return '📱';
      default: return '💎';
    }
  };
  
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
            <h1 className="text-2xl font-bold text-white">Your Empire</h1>
            <p className="text-white/80">Assets & Holdings</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-500/20 backdrop-blur-md border-green-400/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-white/80">Cash</div>
              <div className="text-xl font-bold text-green-400">
                {formatMoney(state.money)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500/20 backdrop-blur-md border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-white/80">Stocks</div>
              <div className="text-xl font-bold text-blue-400">
                {formatMoney(portfolioValue)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500/20 backdrop-blur-md border-purple-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-sm text-white/80">Luxury Items</div>
              <div className="text-xl font-bold text-purple-400">
                {formatMoney(totalItemsValue)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-yellow-500/20 backdrop-blur-md border-yellow-400/30 mb-6">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {formatMoney(totalWealth)}
            </div>
            <div className="text-white/80">Total Net Worth</div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {Object.keys(state.portfolio).length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Stock Portfolio</h2>
              <div className="grid gap-3">
                {Object.entries(state.portfolio).map(([stockId, holding]) => {
                  const stock = state.stocks.find(s => s.id === stockId);
                  if (!stock) return null;
                  
                  const currentValue = stock.price * holding.shares;
                  const profitLoss = (stock.price - holding.avgBuyPrice) * holding.shares;
                  
                  return (
                    <Card key={stockId} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-white">{stock.name}</h3>
                            <p className="text-sm text-white/70">
                              {holding.shares} shares @ {formatMoney(holding.avgBuyPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              {formatMoney(currentValue)}
                            </div>
                            <div className={`text-sm ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {profitLoss >= 0 ? '+' : ''}{formatMoney(profitLoss)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          
          {ownedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Luxury Collection</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedItems.map((item) => (
                  <Card key={item.id} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-3">{item.image}</div>
                      <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-white/70 mb-2">{item.description}</p>
                      <div className="text-lg font-bold text-yellow-400">
                        {formatMoney(item.price)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {ownedItems.length === 0 && Object.keys(state.portfolio).length === 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Building Your Empire!</h3>
                <p className="text-white/70 mb-4">
                  Trade stocks and buy luxury items to grow your wealth
                </p>
                <Button 
                  onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'market' })}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Trading
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryScreen;
