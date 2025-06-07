
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Diamond, Crown, Star, Gem } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const DiamondShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick } = useSoundEffects();
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handlePurchase = (amount: number) => {
    playButtonClick();
    dispatch({ type: 'ADD_DIAMONDS', amount });
  };

  const handleBackClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
  };

  const diamondOffers = [
    { id: 'small', amount: 100, price: '$1.99', description: 'Starter Diamonds', icon: Diamond, popular: false },
    { id: 'medium', amount: 500, price: '$7.99', description: 'Diamond Pack', icon: Diamond, popular: true },
    { id: 'large', amount: 1200, price: '$14.99', description: 'Diamond Chest', icon: Gem, popular: false },
    { id: 'huge', amount: 2500, price: '$24.99', description: 'Diamond Vault', icon: Crown, popular: false },
    { id: 'mega', amount: 5000, price: '$49.99', description: 'Diamond Treasury', icon: Star, popular: false },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 pt-20 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={handleBackClick}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Diamond Shop</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-lg">💰</span>
                {formatMoney(state.money)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">💎</span>
                {state.diamonds}
              </div>
            </div>
          </div>
          
          <div className="w-16" />
        </div>
        
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30 mb-4">
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">💎</div>
              <div className="text-purple-300 font-semibold mb-2">Premium Currency</div>
              <div className="text-white/80 text-sm">
                Use diamonds for premium features, extra spins, and exclusive items!
              </div>
            </CardContent>
          </Card>

          {diamondOffers.map((offer) => {
            const Icon = offer.icon;
            return (
              <Card key={offer.id} className={`backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] ${
                offer.popular 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30'
              }`}>
                <CardContent className="p-4">
                  {offer.popular && (
                    <div className="text-center mb-2">
                      <div className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        offer.popular ? 'bg-yellow-500/20' : 'bg-purple-500/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${offer.popular ? 'text-yellow-400' : 'text-purple-400'}`} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{offer.amount} 💎</div>
                        <div className="text-white/70 text-sm">{offer.description}</div>
                        <div className="text-white/50 text-xs">
                          {(offer.amount / parseFloat(offer.price.slice(1))).toFixed(0)} diamonds per $
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(offer.amount)}
                      className={`transition-all duration-300 hover:scale-105 font-bold ${
                        offer.popular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {offer.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border-blue-400/30 mt-6">
            <CardContent className="p-4 text-center">
              <div className="text-blue-300 font-semibold mb-2">💎 Diamond Benefits</div>
              <div className="text-white/80 text-sm space-y-1">
                <div>• Extra Lucky Wheel spins</div>
                <div>• Convert to cash instantly</div>
                <div>• Buy exclusive luxury items</div>
                <div>• Premium wheel access (coming soon)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiamondShopScreen;
