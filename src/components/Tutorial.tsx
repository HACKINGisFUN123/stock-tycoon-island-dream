
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, X, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const Tutorial: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playButtonClick, playWindowOpen } = useSoundEffects();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Stock Tycoon!",
      content: "Build your financial empire by trading stocks and buying luxury items. Let's get started!",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />
    },
    {
      title: "Your Money & Diamonds",
      content: "💰 Money is earned through trading and can be spent on luxury items. 💎 Diamonds are premium currency for special features.",
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Stock Trading",
      content: "Buy low, sell high! Each stock has its own chart and trend. Start small and learn the market patterns.",
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Luxury Shopping",
      content: "Spend your profits on cars, houses, yachts and more! Items unlock as you earn more money.",
      icon: <ShoppingBag className="w-8 h-8 text-purple-400" />
    },
    {
      title: "Daily Rewards",
      content: "Don't forget to claim your daily bonus and spin the Lucky Wheel for free prizes!",
      icon: <DollarSign className="w-8 h-8 text-orange-400" />
    }
  ];

  const handleNext = () => {
    playButtonClick();
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dispatch({ type: 'COMPLETE_TUTORIAL' });
    }
  };

  const handleSkip = () => {
    playButtonClick();
    dispatch({ type: 'COMPLETE_TUTORIAL' });
  };

  if (state.tutorialCompleted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="max-w-md w-full bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 animate-scale-in">
        <CardHeader className="text-center relative">
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="absolute top-2 right-2 w-8 h-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center mb-4">
            {tutorialSteps[currentStep].icon}
          </div>
          <CardTitle className="text-white text-xl">
            {tutorialSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-300 mb-6 leading-relaxed">
            {tutorialSteps[currentStep].content}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Skip Tutorial
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
