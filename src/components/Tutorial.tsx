
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, ArrowRight, TrendingUp, ShoppingBag, Package } from 'lucide-react';

const Tutorial: React.FC = () => {
  const { dispatch } = useGame();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Stock Tycoon!",
      content: "Build your financial empire by trading stocks and buying luxury items. Let's learn the basics!",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />
    },
    {
      title: "Trading Stocks",
      content: "Buy stocks when prices are low, sell when they're high. Use the +/- buttons to choose how many shares to buy or sell.",
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Reading Charts",
      content: "Green areas show rising prices (good time to sell), red areas show falling prices (good time to buy). Watch the trends!",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />
    },
    {
      title: "Luxury Shop",
      content: "Spend your profits on luxury items like cars, yachts, and houses. Items unlock as you get richer!",
      icon: <ShoppingBag className="w-8 h-8 text-purple-400" />
    },
    {
      title: "Your Collection",
      content: "View all your purchased items in the inventory. Show off your wealth and track your progress!",
      icon: <Package className="w-8 h-8 text-yellow-400" />
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const closeTutorial = () => {
    dispatch({ type: 'COMPLETE_TUTORIAL' });
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-600 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="w-6"></div>
            <div className="flex flex-col items-center">
              {step.icon}
              <CardTitle className="text-white mt-2">{step.title}</CardTitle>
            </div>
            <Button
              onClick={closeTutorial}
              variant="ghost"
              className="w-6 h-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-6 leading-relaxed">
            {step.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            
            <Button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                'Start Playing!'
              )}
            </Button>
          </div>
          
          <div className="flex gap-1 justify-center mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
