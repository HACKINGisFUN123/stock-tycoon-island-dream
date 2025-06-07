
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, DollarSign, Play, Gift, Star, Zap, Diamond, Crown } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import WheelOfFortune from '../WheelOfFortune';

const MoneyShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick, playWindowOpen } = useSoundEffects();
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

  const handleOpenWheel = () => {
    playWindowOpen();
    setShowWheel(true);
  };

  const handleOpenPremiumWheel = () => {
    playWindowOpen();
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

  const canUseDailyWheel = !state.dailySpinUsed || state.lastSpinDate !== new Date().toDateString();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 pt-20 p-4">
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
            <h1 className="text-xl font-bold text-white">Money Shop</h1>
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
          {/* Lucky Wheel Section */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Lucky Wheel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleOpenWheel}
                disabled={!canUseDailyWheel}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 transition-all duration-300 hover:scale-105"
              >
                <Gift className="w-4 h-4 mr-2" />
                {canUseDailyWheel ? 'Spin Lucky Wheel (FREE)' : 'Come Back Tomorrow'}
              </Button>
              
              {!canUseDailyWheel && (
                <Button
                  onClick={() => handleSpendDiamondsForMoney(10, 0)}
                  disabled={state.diamonds < 10}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 transition-all duration-300 hover:scale-105"
                >
                  <Diamond className="w-4 h-4 mr-2" />
                  Extra Spin - 10 💎
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Convert Diamonds to Money */}
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border-blue-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <Diamond className="w-5 h-5" />
                Convert Diamonds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {diamondToMoneyOffers.map((offer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">💎</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{formatMoney(offer.moneyAmount)}</div>
                      <div className="text-white/70 text-xs">{offer.description}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSpendDiamondsForMoney(offer.diamondCost, offer.moneyAmount)}
                    disabled={state.diamonds < offer.diamondCost}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    {offer.diamondCost} 💎
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Free Money - Watch Ads */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5" />
                Watch Ads for Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{formatMoney(offer.reward)}</div>
                        <div className="text-white/70 text-xs">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleWatchAd(offer.reward)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Purchase Money */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Buy Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {moneyOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className={`relative flex items-center justify-between p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    {offer.popular && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        offer.popular ? 'bg-yellow-500/20' : 'bg-yellow-500/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${offer.popular ? 'text-yellow-400' : 'text-yellow-400'}`} />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{formatMoney(offer.amount)}</div>
                        <div className="text-white/70 text-xs">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(offer.amount, 'money')}
                      size="sm"
                      className={`transition-all duration-300 hover:scale-105 ${
                        offer.popular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold' 
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
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border-orange-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
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
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105 py-3"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Claim {formatMoney(1000)} Daily Bonus
                  </Button>
                ) : (
                  <div className="text-white/70 p-3 bg-white/10 rounded-lg text-sm">
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
        <WheelOfFortune onClose={() => setShowWheel(false)} />
      )}
      
      {showPremiumWheel && (
        <WheelOfFortune onClose={() => setShowPremiumWheel(false)} isPremium={true} />
      )}
    </div>
  );
};

export default MoneyShopScreen;
