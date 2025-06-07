
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, CheckCircle, ChevronUp, DollarSign, Diamond, Car, Home, Plane, Smartphone, Crown, Gem, Shirt, Globe } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick } = useSoundEffects();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handlePurchase = (itemId: string, currency: 'money' | 'diamonds') => {
    playButtonClick();
    dispatch({ type: 'BUY_LUXURY_ITEM', itemId, currency });
  };

  const handleBackClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const categories = [
    { id: 'all', name: 'All', icon: Crown, color: 'from-blue-500 to-purple-500' },
    { id: 'car', name: 'Cars', icon: Car, color: 'from-red-500 to-orange-500' },
    { id: 'house', name: 'Real Estate', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'yacht', name: 'Yachts', icon: Plane, color: 'from-blue-500 to-cyan-500' },
    { id: 'jet', name: 'Aircraft', icon: Plane, color: 'from-gray-500 to-slate-500' },
    { id: 'electronics', name: 'Tech', icon: Smartphone, color: 'from-purple-500 to-pink-500' },
    { id: 'jewelry', name: 'Jewelry', icon: Gem, color: 'from-yellow-500 to-amber-500' },
    { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'from-pink-500 to-rose-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 pt-20 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={handleBackClick}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Luxury Shop</h1>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-sm">💰</span>
                {formatMoney(state.money)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">💎</span>
                {state.diamonds}
              </div>
            </div>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Category Filter */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => {
                  playButtonClick();
                  setSelectedCategory(category.id);
                }}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 p-2 h-auto flex flex-col items-center gap-1 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-3 mb-8">
          {filteredItems.map((item) => {
            const canAffordMoney = state.money >= item.price;
            const canAffordDiamonds = state.diamonds >= item.diamondPrice;
            const isUnlocked = state.unlockedItems.includes(item.id) || item.unlocked;
            
            return (
              <Card 
                key={item.id} 
                className={`backdrop-blur-md border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  item.owned 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30' 
                    : !isUnlocked 
                    ? 'bg-gray-500/20 border-gray-400/30'
                    : 'bg-white/10 hover:bg-white/15' 
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className={`w-16 h-16 object-cover rounded-lg transition-all duration-300 ${!isUnlocked ? 'grayscale' : ''}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs text-center">{item.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-white/70 mb-2">{item.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span>💰</span>
                          <span className="text-green-400 font-bold">{formatMoney(item.price)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span>💎</span>
                          <span className="text-purple-400 font-bold">{item.diamondPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {!item.owned && isUnlocked && (
                        <>
                          <Button
                            onClick={() => handlePurchase(item.id, 'money')}
                            disabled={!canAffordMoney}
                            size="sm"
                            className={`text-xs px-2 py-1 h-6 ${canAffordMoney ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white`}
                          >
                            💰
                          </Button>
                          <Button
                            onClick={() => handlePurchase(item.id, 'diamonds')}
                            disabled={!canAffordDiamonds}
                            size="sm"
                            className={`text-xs px-2 py-1 h-6 ${canAffordDiamonds ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500'} text-white`}
                          >
                            💎
                          </Button>
                        </>
                      )}
                      
                      {!isUnlocked && (
                        <div className="text-xs text-white/60 text-center">
                          Unlock at {formatMoney(item.price * 0.3)}
                        </div>
                      )}
                      
                      {item.owned && (
                        <div className="text-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                          <div className="text-xs text-green-400 font-semibold">Owned</div>
                        </div>
                      )}
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default ShopScreen;
