
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { ArrowLeft, Volume2, VolumeX, Music, RotateCcw, AlertTriangle } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone!')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
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
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/80">Game Preferences</p>
          </div>
          
          <div className="w-20" />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {state.soundEnabled ? 
                    <Volume2 className="w-5 h-5 text-white" /> : 
                    <VolumeX className="w-5 h-5 text-white/50" />
                  }
                  <div>
                    <div className="text-white font-medium">Sound Effects</div>
                    <div className="text-white/70 text-sm">Button clicks, notifications</div>
                  </div>
                </div>
                <Switch 
                  checked={state.soundEnabled}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_SOUND' })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className={`w-5 h-5 ${state.musicEnabled ? 'text-white' : 'text-white/50'}`} />
                  <div>
                    <div className="text-white font-medium">Background Music</div>
                    <div className="text-white/70 text-sm">Ambient game music</div>
                  </div>
                </div>
                <Switch 
                  checked={state.musicEnabled}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_MUSIC' })}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Game Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Login Streak:</span>
                <span className="font-semibold">{state.loginStreak} days</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Stocks Owned:</span>
                <span className="font-semibold">{Object.keys(state.portfolio).length}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Luxury Items:</span>
                <span className="font-semibold">
                  {state.luxuryItems.filter(item => item.owned).length} / {state.luxuryItems.length}
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span>Daily Reward:</span>
                <span className={`font-semibold ${state.dailyRewardClaimed ? 'text-green-400' : 'text-yellow-400'}`}>
                  {state.dailyRewardClaimed ? 'Claimed' : 'Available'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-500/20 backdrop-blur-md border-red-400/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-white font-medium mb-2">Reset Game Progress</div>
                  <p className="text-white/70 text-sm mb-4">
                    This will delete all your progress, money, stocks, and luxury items. This action cannot be undone!
                  </p>
                  <Button 
                    onClick={handleReset}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500/20 backdrop-blur-md border-blue-400/30">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-white mb-2">Stock Tycoon</h3>
              <p className="text-white/70 text-sm">
                Version 1.0.0 - Build your virtual empire!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
