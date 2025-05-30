
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, DollarSign, Play, Gift, Star, Zap, Diamond, Crown } from 'lucide-react';
import WheelOfFortune from '../WheelOfFortune';

const MoneyShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showWheel, setShowWheel] = useState(false);
  const [showPremiumWheel, setShowPremiumWheel] = useState(false);
  
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };
  
  const handleWatchAd = (reward: number) => {
    // Simulate watching an ad
    setTimeout(() => {
      dispatch({ type: 'ADD_MONEY', amount: reward });
    }, 2000);
  };
  
  const handlePurchase = (amount: number, type: 'money' | 'diamonds') => {
    // Simulate in-app purchase
    if (type === 'money') {
      dispatch({ type: 'ADD_MONEY', amount });
    } else {
      dispatch({ type: 'ADD_DIAMONDS', amount });
    }
  };

  const handleSpendDiamondsForMoney = (diamondCost: number, moneyAmount: number) => {
    if (state.diamonds >= diamondCost) {
      dispatch({ type: 'SPEND_DIAMONDS', amount: diamondCost });
      dispatch({ type: 'ADD_MONEY', amount: moneyAmount });
    }
  };
  
  const adOffers = [
    { id: 'small-ad', reward: 1000, description: 'צפה בפרסומת קצרה', icon: Play },
    { id: 'medium-ad', reward: 2500, description: 'צפה בפרסומת וידאו', icon: Play },
    { id: 'big-ad', reward: 5000, description: 'צפה בפרסומת ארוכה', icon: Play },
  ];
  
  const moneyOffers = [
    { id: 'starter', amount: 25000, price: '$0.99', description: 'חבילת מתחילים', icon: Gift, popular: false },
    { id: 'investor', amount: 100000, price: '$4.99', description: 'חבילת משקיעים', icon: Star, popular: true },
    { id: 'tycoon', amount: 500000, price: '$19.99', description: 'חבילת טייקון', icon: Zap, popular: false },
    { id: 'millionaire', amount: 2000000, price: '$49.99', description: 'חבילת מיליונר', icon: Crown, popular: false },
  ];

  const diamondOffers = [
    { id: 'diamond-small', amount: 100, price: '$1.99', description: 'יהלומי מתחילים', icon: Diamond, popular: false },
    { id: 'diamond-medium', amount: 500, price: '$7.99', description: 'חבילת יהלומים', icon: Diamond, popular: true },
    { id: 'diamond-large', amount: 1500, price: '$19.99', description: 'תיבת יהלומים', icon: Crown, popular: false },
    { id: 'diamond-mega', amount: 5000, price: '$49.99', description: 'כספת יהלומים', icon: Crown, popular: false },
  ];

  const diamondToMoneyOffers = [
    { diamondCost: 25, moneyAmount: 5000, description: 'כסף מהיר' },
    { diamondCost: 100, moneyAmount: 25000, description: 'חבילת כסף' },
    { diamondCost: 400, moneyAmount: 120000, description: 'תיבת כסף' },
  ];

  const canUseDailyWheel = !state.dailySpinUsed || state.lastSpinDate !== new Date().toDateString();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">חנות מטבעות</h1>
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
        
        <div className="space-y-6">
          {/* Wheel of Fortune Section */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                גלגל המזל
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowWheel(true)}
                  disabled={!canUseDailyWheel}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {canUseDailyWheel ? 'סיבוב יומי חינם' : 'חזור מחר'}
                </Button>
                
                <Button
                  onClick={() => setShowPremiumWheel(true)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold transition-all duration-300 hover:scale-105"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  סיבוב פרימיום - $2.99
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spend Diamonds for Money */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Diamond className="w-5 h-5" />
                המר יהלומים לכסף
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diamondToMoneyOffers.map((offer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Diamond className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{formatMoney(offer.moneyAmount)}</div>
                      <div className="text-white/70 text-sm">{offer.description}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSpendDiamondsForMoney(offer.diamondCost, offer.moneyAmount)}
                    disabled={state.diamonds < offer.diamondCost}
                    className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    {offer.diamondCost} 💎
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Free Money Section */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                כסף חינם - צפה בפרסומות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {adOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{formatMoney(offer.reward)}</div>
                        <div className="text-white/70 text-sm">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleWatchAd(offer.reward)}
                      className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      צפה
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Purchase Money Section */}
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                רכישת כסף
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moneyOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className={`relative flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    {offer.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        פופולרי
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        offer.popular ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${offer.popular ? 'text-yellow-400' : 'text-blue-400'}`} />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{formatMoney(offer.amount)}</div>
                        <div className="text-white/70 text-sm">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(offer.amount, 'money')}
                      className={`transition-all duration-300 hover:scale-105 ${
                        offer.popular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {offer.price}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Purchase Diamonds Section */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Diamond className="w-5 h-5" />
                רכישת יהלומים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diamondOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className={`relative flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    {offer.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        פופולרי
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        offer.popular ? 'bg-yellow-500/20' : 'bg-purple-500/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${offer.popular ? 'text-yellow-400' : 'text-purple-400'}`} />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{offer.amount} יהלומים</div>
                        <div className="text-white/70 text-sm">{offer.description}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(offer.amount, 'diamonds')}
                      className={`transition-all duration-300 hover:scale-105 ${
                        offer.popular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
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
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                בונוס יומי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!state.dailyRewardClaimed ? (
                  <Button
                    onClick={() => dispatch({ type: 'CLAIM_DAILY_REWARD' })}
                    className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    קבל {formatMoney(2000)} בונוס יומי
                  </Button>
                ) : (
                  <div className="text-white/70 p-4 bg-white/10 rounded-lg">
                    בונוס יומי נלקח! חזור מחר.
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
