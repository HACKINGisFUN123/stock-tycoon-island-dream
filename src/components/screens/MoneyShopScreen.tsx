
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, DollarSign, Play, Gift, Star, Zap } from 'lucide-react';

const MoneyShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
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
  
  const handlePurchase = (amount: number) => {
    // Simulate in-app purchase
    dispatch({ type: 'ADD_MONEY', amount });
  };
  
  const adOffers = [
    { id: 'small-ad', reward: 500, description: 'Watch a short ad', icon: Play },
    { id: 'medium-ad', reward: 1000, description: 'Watch a video ad', icon: Play },
    { id: 'big-ad', reward: 2500, description: 'Watch a longer ad', icon: Play },
  ];
  
  const purchaseOffers = [
    { id: 'starter', amount: 10000, price: '$0.99', description: 'Starter Pack', icon: Gift, popular: false },
    { id: 'investor', amount: 50000, price: '$4.99', description: 'Investor Pack', icon: Star, popular: true },
    { id: 'tycoon', amount: 250000, price: '$19.99', description: 'Tycoon Pack', icon: Zap, popular: false },
    { id: 'millionaire', amount: 1000000, price: '$49.99', description: 'Millionaire Pack', icon: Zap, popular: false },
    { id: 'billionaire', amount: 10000000, price: '$99.99', description: 'Billionaire Pack', icon: Zap, popular: false },
  ];
  
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
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Money Shop</h1>
            <p className="text-white/80">Current Balance: {formatMoney(state.money)}</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="space-y-6">
          {/* Free Money Section */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Free Money - Watch Ads
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
                      Watch
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Purchase Money Section */}
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Purchase Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchaseOffers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <div key={offer.id} className={`relative flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                    offer.popular 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    {offer.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
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
                      onClick={() => handlePurchase(offer.amount)}
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
          
          {/* Daily Bonus */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Daily Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!state.dailyRewardClaimed ? (
                  <Button
                    onClick={() => dispatch({ type: 'CLAIM_DAILY_REWARD' })}
                    className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Claim {formatMoney(1000)} Daily Bonus
                  </Button>
                ) : (
                  <div className="text-white/70 p-4 bg-white/10 rounded-lg">
                    Daily bonus claimed! Come back tomorrow.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoneyShopScreen;
