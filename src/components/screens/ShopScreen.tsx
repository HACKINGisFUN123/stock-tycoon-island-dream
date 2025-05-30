
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Lock, CheckCircle, ShoppingCart, Car, Home, Plane, Smartphone, ChevronUp, Diamond, DollarSign, Watch, Anchor, Gem, Shirt, Globe, Crown } from 'lucide-react';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handlePurchase = (itemId: string, currency: 'money' | 'diamonds') => {
    dispatch({ type: 'BUY_LUXURY_ITEM', itemId, currency });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const categories = [
    { id: 'all', name: 'All', icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { id: 'car', name: 'Cars', icon: Car, color: 'from-red-500 to-orange-500' },
    { id: 'house', name: 'Real Estate', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'yacht', name: 'Yachts', icon: Anchor, color: 'from-blue-500 to-cyan-500' },
    { id: 'jet', name: 'Jets', icon: Plane, color: 'from-gray-500 to-slate-500' },
    { id: 'accessories', name: 'Accessories', icon: Watch, color: 'from-purple-500 to-pink-500' },
    { id: 'jewelry', name: 'Jewelry', icon: Gem, color: 'from-yellow-500 to-amber-500' },
    { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'from-pink-500 to-rose-500' },
    { id: 'countries', name: 'Locations', icon: Globe, color: 'from-indigo-500 to-blue-500' },
  ];

  // Auto-unlock items based on money
  React.useEffect(() => {
    const itemsToUnlock = state.luxuryItems.filter(item => 
      !state.unlockedItems.includes(item.id) && 
      state.money >= item.price * 0.3
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
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white">Luxury Shop</h1>
            <div className="flex items-center justify-center gap-6 text-white/80 text-sm mt-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-semibold">{formatMoney(state.money)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <span className="font-semibold">{state.diamonds}</span>
              </div>
            </div>
          </div>

          <div className="w-20"></div>
        </div>

        {/* Compact Category Filter */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 px-4 py-2 h-auto flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  } rounded-xl`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => {
            const canAffordMoney = state.money >= item.price;
            const canAffordDiamonds = state.diamonds >= item.diamondPrice;
            const isUnlocked = state.unlockedItems.includes(item.id) || item.unlocked;
            
            return (
              <Card 
                key={item.id} 
                className={`backdrop-blur-md border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-105 rounded-xl shadow-xl ${
                  item.owned 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50' 
                    : !isUnlocked 
                    ? 'bg-gray-500/20 border-gray-400/30'
                    : 'bg-white/10 hover:bg-white/15' 
                }`}
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={`w-full h-40 object-cover rounded-lg transition-all duration-300 ${!isUnlocked ? 'grayscale' : ''}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-40 bg-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{item.name}</span>
                    </div>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {item.owned && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                  
                  {!item.owned && isUnlocked && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-bold">{formatMoney(item.price)}</span>
                        </div>
                        <Button
                          onClick={() => handlePurchase(item.id, 'money')}
                          disabled={!canAffordMoney}
                          size="sm"
                          className={`${canAffordMoney ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white transition-all duration-300 hover:scale-105 rounded-lg px-4`}
                        >
                          Buy
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💎</span>
                          <span className="text-purple-400 font-bold">{item.diamondPrice}</span>
                        </div>
                        <Button
                          onClick={() => handlePurchase(item.id, 'diamonds')}
                          disabled={!canAffordDiamonds}
                          size="sm"
                          className={`${canAffordDiamonds ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500'} text-white transition-all duration-300 hover:scale-105 rounded-lg px-4`}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <div className="text-center p-3 bg-black/30 rounded-lg">
                      <div className="text-xs text-white/60">
                        Unlocks at {formatMoney(item.price * 0.3)}
                      </div>
                    </div>
                  )}
                  
                  {item.owned && (
                    <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                      <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
                        <Crown className="w-5 h-5" />
                        Owned
                      </div>
                    </div>
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
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 p-0 transition-all duration-300 hover:scale-110 shadow-xl"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;
