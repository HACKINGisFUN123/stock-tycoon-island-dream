
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Lock, CheckCircle, ShoppingCart, Car, Home, Plane, Smartphone, ChevronUp } from 'lucide-react';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handlePurchase = (itemId: string) => {
    dispatch({ type: 'BUY_LUXURY_ITEM', itemId });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingCart },
    { id: 'car', name: 'Vehicles', icon: Car },
    { id: 'house', name: 'Real Estate', icon: Home },
    { id: 'yacht', name: 'Yachts', icon: Plane },
    { id: 'jet', name: 'Aircraft', icon: Plane },
    { id: 'gadget', name: 'Tech', icon: Smartphone },
  ];

  // Auto-unlock items based on money
  React.useEffect(() => {
    const itemsToUnlock = state.luxuryItems.filter(item => 
      !state.unlockedItems.includes(item.id) && 
      state.money >= item.price * 0.5
    );
    
    if (itemsToUnlock.length > 0) {
      itemsToUnlock.forEach(item => {
        dispatch({ type: 'UNLOCK_ITEM', itemId: item.id });
      });
    }
  }, [state.money, state.luxuryItems, state.unlockedItems, dispatch]);

  const filteredItems = selectedCategory === 'all' 
    ? state.luxuryItems 
    : state.luxuryItems.filter(item => item.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' })}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item) => {
            const canAfford = state.money >= item.price;
            const isUnlocked = state.unlockedItems.includes(item.id) || item.unlocked;
            
            return (
              <Card 
                key={item.id} 
                className={`backdrop-blur-md border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
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
                  <div className="relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={`w-full h-32 object-cover rounded-lg transition-all duration-300 ${!isUnlocked ? 'grayscale' : ''}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-32 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">{item.name}</span>
                    </div>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {formatMoney(item.price)}
                    </div>
                    {!isUnlocked && (
                      <div className="text-xs text-white/60 mt-1">
                        Unlock at {formatMoney(item.price * 0.5)}
                      </div>
                    )}
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
                      className={`w-full transition-all duration-300 hover:scale-105 ${
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

        {/* Scroll to Top Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={scrollToTop}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 p-0 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
        </div>
        
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
