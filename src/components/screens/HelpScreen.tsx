
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, TrendingUp, ShoppingCart, Package, Gift, DollarSign } from 'lucide-react';

const HelpScreen: React.FC = () => {
  const { dispatch } = useGame();
  
  const helpSections = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-400" />,
      title: "Getting Started",
      content: "You start with $10,000 in virtual cash. Use this money to buy stocks and grow your wealth!"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Trading Stocks",
      content: "Watch the animated stock charts and buy low, sell high! Each stock moves randomly but realistically. Time your trades for maximum profit."
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-purple-400" />,
      title: "Luxury Shop",
      content: "Spend your profits on luxury items like cars, yachts, and mansions. Items unlock as your wealth grows!"
    },
    {
      icon: <Package className="w-6 h-6 text-yellow-400" />,
      title: "Your Assets",
      content: "View all your stocks and luxury items in the Assets screen. Track your total net worth and portfolio performance."
    },
    {
      icon: <Gift className="w-6 h-6 text-pink-400" />,
      title: "Daily Rewards",
      content: "Log in daily to claim free money bonuses and build up your login streak for bigger rewards!"
    }
  ];
  
  const tradingTips = [
    "💡 Buy stocks when they're trending down and sell when they're going up",
    "📈 Watch the price change percentage to spot good opportunities",
    "💰 Don't invest all your money in one stock - diversify your portfolio",
    "⏰ Stock prices update every 3 seconds, so timing matters",
    "🎯 Set profit targets - don't be too greedy!"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-3xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">How to Play</h1>
            <p className="text-white/80">Learn the Game</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Welcome to Stock Tycoon! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Build your virtual empire by trading stocks and collecting luxury items. 
                Start small, think big, and become the ultimate tycoon!
              </p>
            </CardContent>
          </Card>
          
          {helpSections.map((section, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{section.content}</p>
              </CardContent>
            </Card>
          ))}
          
          <Card className="bg-yellow-500/20 backdrop-blur-md border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-yellow-400">Pro Trading Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tradingTips.map((tip, index) => (
                  <div key={index} className="text-white/80">
                    {tip}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500/20 backdrop-blur-md border-green-400/30">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready to Start?</h3>
              <p className="text-white/70 mb-4">
                Begin your journey to becoming a virtual millionaire!
              </p>
              <Button 
                onClick={() => dispatch({ type: 'CHANGE_SCREEN', screen: 'market' })}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Start Trading Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
