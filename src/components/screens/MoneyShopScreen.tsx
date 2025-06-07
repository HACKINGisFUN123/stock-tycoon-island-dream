
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, DollarSign, Play, Gift, Star, Zap, Diamond, Crown } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import WheelOfFortune from '../WheelOfFortune';

const MoneyShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick } = useSoundEffects();
  const [showWheel, setShowWheel] = useState(false);
  const [showPremiumWheel, setShowPremiumWheel] = useState(false);
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handleWatchAd = (reward: number) => {
    playButtonClick();
    setTimeout(() => {
      dispatch({ type: 'ADD_MONEY', amount: reward });
    }, 2000);
  };
  
  const handlePurchase = (amount: number, type: 'money' | 'diamonds') => {
    playButtonClick();
    if (type === 'money') {
      dispatch({ type: 'ADD_MONEY', amount });
    } else {
      dispatch({ type: 'ADD_DIAMONDS', amount });
    }
  };

  const handleSpendDiamondsForMoney = (diamondCost: number, moneyAmount: number) => {
    if (state.diamonds >= diamondCost) {
      playButtonClick();
      dispatch({ type: 'SPEND_DIAMONDS', amount: diamondCost });
      dispatch({ type: 'ADD_MONEY', amount: moneyAmount });
    }
  };

  const handleBackClick = () => {
    playButtonClick();
    dispatch({ type: 'CHANGE_SCREEN', screen: 'main-menu' });
  };

  const handleSpinWheel = () => {
    playButtonClick();
    setShowWheel(true);
  };

  const handlePremiumWheelUpgrade = () => {
    setShowWheel(false);
    setShowPremiumWheel(true);
  };

  const handleBuyPremiumSpin = () => {
    playButtonClick();
    setShowPremiumWheel(true);
  };
  
  const adOffers = [
    { id: 'small-ad', reward: 500, description: 'Watch short ad', icon: Play },
    { id: 'medium-ad', reward: 1000, description: 'Watch video ad', icon: Play },
    { id: 'big-ad', reward: 2500, description: 'Watch longer ad', icon: Play },
  ];
  
  const moneyOffers = [
    { id: 'starter', amount: 10000, price: '$0.99', description: 'Starter Pack', icon: Gift, popular: false },
    { id: 'investor', amount: 50000, price: '$4.99', description: 'Investor Pack', icon: Star, popular: true },
    { id: 'tycoon', amount: 250000, price: '$19.99', description: 'Tycoon Pack', icon: Zap, popular: false },
    { id: 'millionaire', amount: 1000000, price: '$49.99', description: 'Millionaire Pack', icon: Crown, popular: false },
  ];

  const diamondToMoneyOffers = [
    { diamondCost: 10, moneyAmount: 2000, description: 'Quick Cash' },
    { diamondCost: 50, moneyAmount: 12000, description: 'Cash Bundle' },
    { diamondCost: 200, moneyAmount: 50000, description: 'Cash Chest' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 pt-20 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 relative z-50">
          <Button 
            onClick={handleBackClick}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Money Shop</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-lg">🪙</span>
                {formatMoney(state.money)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">💎</span>
                {state.diamonds}
              </div>
            </div>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="space-y-6">
          {/* Spin Wheels Section */}
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border-purple-400/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-300 flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Lucky Spin Wheels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Regular Wheel */}
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Regular Wheel</div>
                    <div className="text-purple-200 text-sm">1 Free Spin Daily</div>
                  </div>
                </div>
                <Button
                  onClick={handleSpinWheel}
                  className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105 px-4 py-2"
                >
                  Spin Now
                </Button>
              </div>

              {/* Premium Wheel */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-lg backdrop-blur-sm border border-yellow-400/70 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/40 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Premium Wheel</div>
                    <div className="text-yellow-200 text-sm">Bigger Prizes!</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPremiumSpin}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition-all duration-300 hover:scale-105 px-4 py-2"
                >
                  $2.99
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Convert Diamonds to Money */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md border-blue-400/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-300 flex items-center gap-2 text-lg">
                <Diamond className="w-5 h-5" />
                Convert Diamonds to Cash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diamondToMoneyOffers.map((offer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    <div>
                      <div className="text-white font-bold text-base">{formatMoney(offer.moneyAmount)}</div>
                      <div className="text-blue-200 text-sm">{offer.description}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSpendDiamondsForMoney(offer.diamondCost, offer.moneyAmount)}
                    disabled={state.diamonds < offer.diamondCost}
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 px-4 py-2"
                  >
                    {offer.diamondCost} 💎
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Free Money - Watch Ads */}
          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md border-green-400/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-300 flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5" />
                Watch Ads for Free Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {adOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-base">{formatMoney(offer.reward)}</div>
                        <div className="text-green-200 text-sm">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleWatchAd(offer.reward)}
                      className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105 px-4 py-2"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Purchase Money */}
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-md border-yellow-400/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-300 flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Premium Money Packs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moneyOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className={`relative flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400/70 shadow-lg' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}>
                    {offer.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        POPULAR
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        offer.popular ? 'bg-yellow-500/40' : 'bg-yellow-500/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${offer.popular ? 'text-yellow-300' : 'text-yellow-400'}`} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-base">{formatMoney(offer.amount)}</div>
                        <div className="text-yellow-200 text-sm">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(offer.amount, 'money')}
                      className={`transition-all duration-300 hover:scale-105 px-4 py-2 ${
                        offer.popular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg' 
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      }`}
                    >
                      {offer.price}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Daily Bonus */}
          <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-md border-orange-400/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-300 flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5" />
                Daily Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!state.dailyRewardClaimed ? (
                  <Button
                    onClick={() => {
                      playButtonClick();
                      dispatch({ type: 'CLAIM_DAILY_REWARD' });
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105 py-4 text-lg font-bold"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Claim {formatMoney(1000)} Daily Bonus
                  </Button>
                ) : (
                  <div className="text-white/70 p-4 bg-white/10 rounded-lg text-base">
                    Daily bonus claimed! Come back tomorrow.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wheel Components */}
      {showWheel && (
        <WheelOfFortune 
          onClose={() => setShowWheel(false)} 
          onPremiumUpgrade={handlePremiumWheelUpgrade}
        />
      )}
      
      {showPremiumWheel && (
        <WheelOfFortune 
          onClose={() => setShowPremiumWheel(false)} 
          isPremium={true} 
        />
      )}
    </div>
  );
};

export default MoneyShopScreen;
