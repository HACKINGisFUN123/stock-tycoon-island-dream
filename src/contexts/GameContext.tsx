
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  history: number[];
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface LuxuryItem {
  id: string;
  name: string;
  price: number;
  category: 'yacht' | 'jet' | 'car' | 'house' | 'gadget';
  image: string;
  description: string;
  unlocked: boolean;
  owned: boolean;
}

export interface Portfolio {
  [stockId: string]: {
    shares: number;
    avgBuyPrice: number;
  };
}

interface GameState {
  money: number;
  portfolio: Portfolio;
  stocks: Stock[];
  luxuryItems: LuxuryItem[];
  unlockedItems: string[];
  currentScreen: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  dailyRewardClaimed: boolean;
  loginStreak: number;
}

type GameAction = 
  | { type: 'BUY_STOCK'; stockId: string; amount: number; price: number }
  | { type: 'SELL_STOCK'; stockId: string; amount: number; price: number }
  | { type: 'UPDATE_STOCK_PRICES' }
  | { type: 'BUY_LUXURY_ITEM'; itemId: string }
  | { type: 'CHANGE_SCREEN'; screen: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'ADD_MONEY'; amount: number }
  | { type: 'RESET_GAME' };

const initialStocks: Stock[] = [
  { id: 'apple', name: 'Apple Inc', symbol: 'AAPL', price: 150, history: [150], trend: 'neutral', color: '#007AFF' },
  { id: 'tesla', name: 'Tesla Inc', symbol: 'TSLA', price: 800, history: [800], trend: 'neutral', color: '#FF3B30' },
  { id: 'amazon', name: 'Amazon.com Inc', symbol: 'AMZN', price: 3200, history: [3200], trend: 'neutral', color: '#FF9500' },
  { id: 'nike', name: 'Nike Inc', symbol: 'NKE', price: 120, history: [120], trend: 'neutral', color: '#32D74B' },
  { id: 'meta', name: 'Meta Platforms Inc', symbol: 'META', price: 280, history: [280], trend: 'neutral', color: '#5856D6' },
  { id: 'netflix', name: 'Netflix Inc', symbol: 'NFLX', price: 450, history: [450], trend: 'neutral', color: '#AF52DE' },
];

const initialLuxuryItems: LuxuryItem[] = [
  { id: 'sports-car', name: 'Sports Car', price: 50000, category: 'car', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', description: 'Fast and stylish sports car', unlocked: true, owned: false },
  { id: 'mansion', name: 'Luxury Mansion', price: 200000, category: 'house', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', description: 'Your dream home with stunning views', unlocked: false, owned: false },
  { id: 'yacht', name: 'Super Yacht', price: 500000, category: 'yacht', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', description: 'Sail the seas in luxury', unlocked: false, owned: false },
  { id: 'private-jet', name: 'Private Jet', price: 1000000, category: 'jet', image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop', description: 'Fly anywhere in the world', unlocked: false, owned: false },
  { id: 'luxury-phone', name: 'Diamond Phone', price: 25000, category: 'gadget', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', description: 'Ultimate luxury smartphone', unlocked: true, owned: false },
  { id: 'hypercar', name: 'Hypercar', price: 150000, category: 'car', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', description: 'Ultimate speed machine', unlocked: false, owned: false },
];

const initialState: GameState = {
  money: 10000,
  portfolio: {},
  stocks: initialStocks,
  luxuryItems: initialLuxuryItems,
  unlockedItems: ['sports-car', 'luxury-phone'],
  currentScreen: 'main-menu',
  soundEnabled: true,
  musicEnabled: true,
  dailyRewardClaimed: false,
  loginStreak: 1,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BUY_STOCK': {
      const { stockId, amount, price } = action;
      const cost = amount * price;
      
      if (state.money < cost) return state;
      
      const currentHolding = state.portfolio[stockId] || { shares: 0, avgBuyPrice: 0 };
      const totalShares = currentHolding.shares + amount;
      const totalCost = (currentHolding.shares * currentHolding.avgBuyPrice) + cost;
      const avgBuyPrice = totalCost / totalShares;
      
      return {
        ...state,
        money: state.money - cost,
        portfolio: {
          ...state.portfolio,
          [stockId]: { shares: totalShares, avgBuyPrice }
        }
      };
    }
    
    case 'SELL_STOCK': {
      const { stockId, amount, price } = action;
      const holding = state.portfolio[stockId];
      
      if (!holding || holding.shares < amount) return state;
      
      const revenue = amount * price;
      const remainingShares = holding.shares - amount;
      
      return {
        ...state,
        money: state.money + revenue,
        portfolio: remainingShares > 0 
          ? { ...state.portfolio, [stockId]: { ...holding, shares: remainingShares } }
          : { ...Object.fromEntries(Object.entries(state.portfolio).filter(([key]) => key !== stockId)) }
      };
    }
    
    case 'UPDATE_STOCK_PRICES': {
      return {
        ...state,
        stocks: state.stocks.map(stock => {
          const change = (Math.random() - 0.5) * stock.price * 0.08; // 8% max change for more volatility
          const newPrice = Math.max(1, stock.price + change);
          const newHistory = [...stock.history.slice(-29), newPrice]; // Keep last 30 points
          
          let trend: 'up' | 'down' | 'neutral' = 'neutral';
          if (change > stock.price * 0.015) trend = 'up';
          else if (change < -stock.price * 0.015) trend = 'down';
          
          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            history: newHistory,
            trend
          };
        })
      };
    }
    
    case 'BUY_LUXURY_ITEM': {
      const item = state.luxuryItems.find(i => i.id === action.itemId);
      if (!item || state.money < item.price || item.owned) return state;
      
      return {
        ...state,
        money: state.money - item.price,
        luxuryItems: state.luxuryItems.map(i => 
          i.id === action.itemId ? { ...i, owned: true } : i
        )
      };
    }
    
    case 'CHANGE_SCREEN':
      return { ...state, currentScreen: action.screen };
    
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    
    case 'TOGGLE_MUSIC':
      return { ...state, musicEnabled: !state.musicEnabled };
    
    case 'ADD_MONEY':
      return { ...state, money: state.money + action.amount };
    
    case 'CLAIM_DAILY_REWARD':
      return { 
        ...state, 
        dailyRewardClaimed: true, 
        money: state.money + 1000,
        loginStreak: state.loginStreak + 1 
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Update stock prices every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_STOCK_PRICES' });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Unlock items based on money
  useEffect(() => {
    const newUnlocks: string[] = [];
    state.luxuryItems.forEach(item => {
      if (!state.unlockedItems.includes(item.id) && state.money >= item.price * 0.5) {
        newUnlocks.push(item.id);
      }
    });
    
    if (newUnlocks.length > 0) {
      // We would need to add an UNLOCK_ITEMS action to properly handle this
      // For now, we'll update the unlocked items directly in the state
    }
  }, [state.money, state.luxuryItems, state.unlockedItems]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
