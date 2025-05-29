
import React from 'react';
import { GameProvider, useGame } from '../contexts/GameContext';
import MainMenu from './screens/MainMenu';
import MarketScreen from './screens/MarketScreen';
import TradingScreen from './screens/TradingScreen';
import InventoryScreen from './screens/InventoryScreen';
import ShopScreen from './screens/ShopScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';

const GameRouter: React.FC = () => {
  const { state } = useGame();
  
  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'main-menu':
        return <MainMenu />;
      case 'market':
        return <MarketScreen />;
      case 'trading':
        return <TradingScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'shop':
        return <ShopScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'help':
        return <HelpScreen />;
      default:
        return <MainMenu />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {renderScreen()}
    </div>
  );
};

const StockGame: React.FC = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default StockGame;
