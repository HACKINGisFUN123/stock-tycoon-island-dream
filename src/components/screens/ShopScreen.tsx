
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Lock, CheckCircle, ShoppingCart, Car, Home, Plane, Smartphone, ChevronUp, Diamond, DollarSign, Crown, Gem, Shirt, Globe, Anchor, Watch } from 'lucide-react';

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
    { id: 'all', name: 'הכל', icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { id: 'car', name: 'רכבים', icon: Car, color: 'from-red-500 to-orange-500' },
    { id: 'house', name: 'נדל״ן', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'yacht', name: 'יאכטות', icon: Anchor, color: 'from-blue-500 to-cyan-500' },
    { id: 'jet', name: 'מטוסים', icon: Plane, color: 'from-gray-500 to-slate-500' },
    { id: 'accessories', name: 'אביזרים', icon: Watch, color: 'from-purple-500 to-pink-500' },
    { id: 'jewelry', name: 'תכשיטים', icon: Gem, color: 'from-yellow-500 to-amber-500' },
    { id: 'fashion', name: 'אופנה', icon: Shirt, color: 'from-pink-500 to-rose-500' },
    { id: 'countries', name: 'מקומות', icon: Globe, color: 'from-indigo-500 to-blue-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 p-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' })}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            חזרה
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-white">חנות יוקרה</h1>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                {formatMoney(state.money)}
              </div>
              <div className="flex items-center gap-1">
                <Diamond className="w-4 h-4 text-purple-400" />
                {state.diamonds}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item) => {
            const canAffordMoney = state.money >= item.price;
            const canAffordDiamonds = state.diamonds >= item.diamondPrice;
            const isUnlocked = state.unlockedItems.includes(item.id) || item.unlocked;
            
            return (
              <Card 
                key={item.id} 
                className={`backdrop-blur-md border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  item.owned 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30' 
                    : !isUnlocked 
                    ? 'bg-gray-500/20 border-gray-400/30'
                    : 'bg-white/10 hover:bg-white/15' 
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
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">{formatMoney(item.price)}</span>
                      </div>
                      {!item.owned && isUnlocked && (
                        <Button
                          onClick={() => handlePurchase(item.id, 'money')}
                          disabled={!canAffordMoney}
                          size="sm"
                          className={`${canAffordMoney ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white transition-all duration-300 hover:scale-105`}
                        >
                          קנה
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <div className="flex items-center gap-1">
                        <Diamond className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-bold">{item.diamondPrice}</span>
                      </div>
                      {!item.owned && isUnlocked && (
                        <Button
                          onClick={() => handlePurchase(item.id, 'diamonds')}
                          disabled={!canAffordDiamonds}
                          size="sm"
                          className={`${canAffordDiamonds ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500'} text-white transition-all duration-300 hover:scale-105`}
                        >
                          קנה
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!isUnlocked && (
                    <div className="text-xs text-white/60 text-center">
                      יפתח ב-{formatMoney(item.price * 0.5)}
                    </div>
                  )}
                  
                  {item.owned && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        בבעלותך
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
