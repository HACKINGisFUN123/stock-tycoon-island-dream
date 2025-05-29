
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, DollarSign, Play, Gift } from 'lucide-react';

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
    { id: 'small-ad', reward: 500, description: 'Watch a short ad' },
    { id: 'medium-ad', reward: 1000, description: 'Watch a video ad' },
    { id: 'big-ad', reward: 2500, description: 'Watch a longer ad' },
  ];
  
  const purchaseOffers = [
    { id: 'starter', amount: 10000, price: '$0.99', description: 'Starter Pack' },
    { id: 'investor', amount: 50000, price: '$4.99', description: 'Investor Pack' },
    { id: 'tycoon', amount: 250000, price: '$19.99', description: 'Tycoon Pack' },
    { id: 'millionaire', amount: 1000000, price: '$49.99', description: 'Millionaire Pack' },
    { id: 'billionaire', amount: 10000000, price: '$99.99', description: 'Billionaire Pack' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">Money Shop</h1>
            <p className="text-white/80">Current Balance: {formatMoney(state.money)}</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="space-y-6">
          {/* Free Money Section */}
          <Card className="bg-green-500/20 backdrop-blur-md border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Free Money - Watch Ads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {adOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{formatMoney(offer.reward)}</div>
                    <div className="text-white/70 text-sm">{offer.description}</div>
                  </div>
                  <Button
                    onClick={() => handleWatchAd(offer.reward)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Purchase Money Section */}
          <Card className="bg-blue-500/20 backdrop-blur-md border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Purchase Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchaseOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{formatMoney(offer.amount)}</div>
                    <div className="text-white/70 text-sm">{offer.description}</div>
                  </div>
                  <Button
                    onClick={() => handlePurchase(offer.amount)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {offer.price}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Daily Bonus */}
          <Card className="bg-purple-500/20 backdrop-blur-md border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400">Daily Bonus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {!state.dailyRewardClaimed ? (
                  <Button
                    onClick={() => dispatch({ type: 'CLAIM_DAILY_REWARD' })}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Claim {formatMoney(1000)} Daily Bonus
                  </Button>
                ) : (
                  <div className="text-white/70">
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
