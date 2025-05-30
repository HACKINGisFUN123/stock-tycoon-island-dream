
import React from 'react';
import { GameProvider, useGame } from '../contexts/GameContext';
import MainMenu from './screens/MainMenu';
import MarketScreen from './screens/MarketScreen';
import TradingScreen from './screens/TradingScreen';
import InventoryScreen from './screens/InventoryScreen';
import ShopScreen from './screens/ShopScreen';
import MoneyShopScreen from './screens/MoneyShopScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import TopBar from './TopBar';
import Tutorial from './Tutorial';

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
      case 'money-shop':
        return <MoneyShopScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'help':
        return <HelpScreen />;
      default:
        return <MainMenu />;
    }
  };
  
  const showTopBar = state.currentScreen !== 'main-menu';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {showTopBar && <TopBar />}
      <div className={showTopBar ? 'pt-20' : ''}>
        {renderScreen()}
      </div>
      {!state.tutorialCompleted && <Tutorial />}
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
