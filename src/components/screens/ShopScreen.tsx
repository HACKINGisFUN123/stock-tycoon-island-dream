
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Lock, CheckCircle, ShoppingCart } from 'lucide-react';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handlePurchase = (itemId: string) => {
    dispatch({ type: 'BUY_LUXURY_ITEM', itemId });
  };
  
  const categories = [
    { id: 'car', name: 'Vehicles', emoji: '🚗' },
    { id: 'house', name: 'Real Estate', emoji: '🏠' },
    { id: 'yacht', name: 'Yachts', emoji: '🛥️' },
    { id: 'jet', name: 'Aircraft', emoji: '✈️' },
    { id: 'gadget', name: 'Gadgets', emoji: '📱' },
  ];
  
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
            <h1 className="text-2xl font-bold text-white">Luxury Shop</h1>
            <p className="text-white/80">Cash: {formatMoney(state.money)}</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        {categories.map((category) => {
          const categoryItems = state.luxuryItems.filter(item => item.category === category.id);
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                {category.name}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => {
                  const canAfford = state.money >= item.price;
                  const isUnlocked = state.unlockedItems.includes(item.id) || item.unlocked;
                  
                  return (
                    <Card 
                      key={item.id} 
                      className={`backdrop-blur-md border-white/20 ${
                        item.owned 
                          ? 'bg-green-500/20 border-green-400/30' 
                          : !isUnlocked 
                          ? 'bg-gray-500/20 border-gray-400/30'
                          : canAfford 
                          ? 'bg-white/10 hover:bg-white/15' 
                          : 'bg-red-500/20 border-red-400/30'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{item.image}</div>
                          <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                          <p className="text-sm text-white/70">{item.description}</p>
                        </div>
                        
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-yellow-400">
                            {formatMoney(item.price)}
                          </div>
                        </div>
                        
                        {item.owned ? (
                          <Button 
                            disabled 
                            className="w-full bg-green-500 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Owned
                          </Button>
                        ) : !isUnlocked ? (
                          <Button 
                            disabled 
                            className="w-full bg-gray-500 text-white"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handlePurchase(item.id)}
                            disabled={!canAfford}
                            className={`w-full ${
                              canAfford 
                                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                                : 'bg-gray-500 text-white cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {canAfford ? 'Buy Now' : 'Insufficient Funds'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        <Card className="bg-blue-500/20 backdrop-blur-md border-blue-400/30 mt-8">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Unlock More Items</h3>
            <p className="text-white/70">
              Grow your wealth to unlock more luxury items! Items become available when you can afford half their price.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopScreen;
