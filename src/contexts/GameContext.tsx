import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  history: number[];
  trend: 'up' | 'down' | 'neutral';
  color: string;
  logo?: string;
  volatility?: number;
}

export interface LuxuryItem {
  id: string;
  name: string;
  price: number;
  diamondPrice: number;
  category: 'yacht' | 'jet' | 'car' | 'house' | 'gadget' | 'jewelry' | 'art' | 'electronics' | 'fashion' | 'accessories' | 'countries';
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
  diamonds: number;
  portfolio: Portfolio;
  stocks: Stock[];
  luxuryItems: LuxuryItem[];
  unlockedItems: string[];
  currentScreen: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  dailyRewardClaimed: boolean;
  dailySpinUsed: boolean;
  lastSpinDate: string;
  loginStreak: number;
  tutorialCompleted: boolean;
}

type GameAction = 
  | { type: 'BUY_STOCK'; stockId: string; amount: number; price: number }
  | { type: 'SELL_STOCK'; stockId: string; amount: number; price: number }
  | { type: 'UPDATE_STOCK_PRICES' }
  | { type: 'BUY_LUXURY_ITEM'; itemId: string; currency: 'money' | 'diamonds' }
  | { type: 'CHANGE_SCREEN'; screen: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'ADD_MONEY'; amount: number }
  | { type: 'ADD_DIAMONDS'; amount: number }
  | { type: 'SPEND_DIAMONDS'; amount: number }
  | { type: 'DAILY_SPIN'; reward: { type: 'money' | 'diamonds'; amount: number } }
  | { type: 'RESET_GAME' }
  | { type: 'COMPLETE_TUTORIAL' }
  | { type: 'RESTART_TUTORIAL' }
  | { type: 'UNLOCK_ITEM'; itemId: string };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const initialStocks: Stock[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 150,
    trend: 'up',
    logo: '🍎',
    history: [150],
    volatility: 0.02,
    color: '#007AFF'
  },
  {
    id: '2',
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    price: 800,
    trend: 'up',
    logo: '🚗',
    history: [800],
    volatility: 0.04,
    color: '#E31E24'
  },
  {
    id: '3',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 300,
    trend: 'neutral',
    logo: '💻',
    history: [300],
    volatility: 0.015,
    color: '#00BCF2'
  },
  {
    id: '4',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 3200,
    trend: 'up',
    logo: '📦',
    history: [3200],
    volatility: 0.025,
    color: '#FF9900'
  },
  {
    id: '5',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: 2500,
    trend: 'neutral',
    logo: '🔍',
    history: [2500],
    volatility: 0.02,
    color: '#4285F4'
  }
];

const generateLuxuryItems = (): LuxuryItem[] => {
  const items: LuxuryItem[] = [];
  
  // Cars (20 items)
  const cars = [
    { name: 'Porsche 911 Turbo', description: 'Luxury sports car', price: 200000, diamondPrice: 800 },
    { name: 'Lamborghini Huracan', description: 'Italian supercar', price: 350000, diamondPrice: 1400 },
    { name: 'Ferrari 488 GTB', description: 'Italian racing machine', price: 500000, diamondPrice: 2000 },
    { name: 'McLaren 720S', description: 'British supercar', price: 750000, diamondPrice: 3000 },
    { name: 'Bugatti Chiron', description: 'The fastest hypercar', price: 3000000, diamondPrice: 12000 },
    { name: 'Rolls Royce Phantom', description: 'British luxury', price: 600000, diamondPrice: 2400 },
    { name: 'Bentley Continental GT', description: 'Luxury and performance', price: 300000, diamondPrice: 1200 },
    { name: 'Aston Martin DB11', description: 'British elegance', price: 400000, diamondPrice: 1600 },
    { name: 'Mercedes AMG GT63', description: 'German performance', price: 250000, diamondPrice: 1000 },
    { name: 'BMW M8 Coupe', description: 'German sports car', price: 180000, diamondPrice: 720 },
    { name: 'Audi RS7', description: 'German sport wagon', price: 170000, diamondPrice: 680 },
    { name: 'Jaguar F-Type', description: 'Classic British sports', price: 120000, diamondPrice: 480 },
    { name: 'Corvette Z06', description: 'American legend', price: 140000, diamondPrice: 560 },
    { name: 'Nissan GT-R', description: 'Japanese speedster', price: 160000, diamondPrice: 640 },
    { name: 'Porsche Taycan', description: 'Luxury electric', price: 190000, diamondPrice: 760 },
    { name: 'Maserati MC20', description: 'Italian masterpiece', price: 280000, diamondPrice: 1120 },
    { name: 'Lotus Emira', description: 'British lightweight', price: 150000, diamondPrice: 600 },
    { name: 'McLaren 540C', description: 'Accessible supercar', price: 220000, diamondPrice: 880 },
    { name: 'Porsche 718 Cayman', description: 'Perfect sports car', price: 110000, diamondPrice: 440 },
    { name: 'BMW i8', description: 'Futuristic hybrid', price: 160000, diamondPrice: 640 }
  ];

  // Houses (20 items)
  const houses = [
    { name: 'Malibu Villa', description: 'Pacific Ocean view', price: 5000000, diamondPrice: 20000 },
    { name: 'Manhattan Penthouse', description: 'Central Park view', price: 15000000, diamondPrice: 60000 },
    { name: 'French Chateau', description: 'Historic castle', price: 25000000, diamondPrice: 100000 },
    { name: 'Hamptons Villa', description: 'Luxury summer retreat', price: 8000000, diamondPrice: 32000 },
    { name: 'Beverly Hills Mansion', description: 'Celebrity neighborhood', price: 12000000, diamondPrice: 48000 },
    { name: 'Dubai Penthouse', description: 'Middle Eastern luxury', price: 10000000, diamondPrice: 40000 },
    { name: 'Tuscany Villa', description: 'Italian countryside', price: 6000000, diamondPrice: 24000 },
    { name: 'London Apartment', description: 'Central location', price: 7000000, diamondPrice: 28000 },
    { name: 'Miami Glass House', description: 'Modern beachfront', price: 9000000, diamondPrice: 36000 },
    { name: 'French Riviera Villa', description: 'Mediterranean views', price: 11000000, diamondPrice: 44000 },
    { name: 'Tokyo Penthouse', description: 'Japanese technology', price: 8500000, diamondPrice: 34000 },
    { name: 'Hawaii Villa', description: 'Tropical paradise', price: 7500000, diamondPrice: 30000 },
    { name: 'Chelsea Townhouse', description: 'Artistic district', price: 13000000, diamondPrice: 52000 },
    { name: 'Saint-Tropez Villa', description: 'French luxury', price: 14000000, diamondPrice: 56000 },
    { name: 'Monaco Penthouse', description: 'Casino central', price: 16000000, diamondPrice: 64000 },
    { name: 'Santorini Villa', description: 'Greek classic', price: 4500000, diamondPrice: 18000 },
    { name: 'Aspen Chalet', description: 'Ski and nature', price: 6500000, diamondPrice: 26000 },
    { name: 'Barbados Villa', description: 'Caribbean luxury', price: 5500000, diamondPrice: 22000 },
    { name: 'Sydney Penthouse', description: 'Harbor views', price: 9500000, diamondPrice: 38000 },
    { name: 'Cyprus Villa', description: 'Mediterranean island', price: 3500000, diamondPrice: 14000 }
  ];

  // Add all items with proper categorization
  let id = 1;
  
  [...cars, ...houses].forEach((item, index) => {
    let category: 'car' | 'house' = 'car';
    if (index >= 20) category = 'house';
    
    items.push({
      id: id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      diamondPrice: item.diamondPrice,
      image: `/placeholder-${category}.jpg`,
      category,
      owned: false,
      unlocked: item.price <= 1000
    });
    id++;
  });

  return items;
};

const updateStockPrices = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => {
    const volatility = stock.volatility || 0.02;
    
    // More balanced approach - 60% chance of going up, 40% chance of going down
    const trend = Math.random();
    let change;
    
    if (trend < 0.6) {
      // Positive movement (60% chance) - moderate gains
      change = Math.random() * volatility * 0.8;
    } else {
      // Negative movement (40% chance) - smaller losses
      change = -Math.random() * volatility * 0.5;
    }
    
    // Prevent stock from going below $1
    const newPrice = Math.max(1, stock.price * (1 + change));
    
    // Cap gains at 2x original price, then introduce losses
    const originalPrice = stock.history[0];
    if (newPrice > originalPrice * 2) {
      // Force a small decline when hitting 2x
      const declineChange = -Math.random() * volatility * 0.3;
      const adjustedPrice = Math.max(originalPrice * 1.8, stock.price * (1 + declineChange));
      
      return {
        ...stock,
        price: adjustedPrice,
        trend: 'down' as const,
        history: [...stock.history.slice(-29), adjustedPrice]
      };
    }
    
    // Determine trend based on price movement
    let newTrend: 'up' | 'down' | 'neutral' = 'neutral';
    if (change > 0.01) newTrend = 'up';
    else if (change < -0.01) newTrend = 'down';
    
    return {
      ...stock,
      price: newPrice,
      trend: newTrend,
      history: [...stock.history.slice(-29), newPrice]
    };
  });
};

const initialLuxuryItems: LuxuryItem[] = generateLuxuryItems();

const initialState: GameState = {
  money: 10000,
  diamonds: 100,
  portfolio: {},
  stocks: initialStocks,
  luxuryItems: initialLuxuryItems,
  unlockedItems: ['sports-car', 'luxury-phone', 'smart-watch', 'gaming-setup', 'designer-suit', 'luxury-shoes'],
  currentScreen: 'main-menu',
  soundEnabled: true,
  musicEnabled: true,
  dailyRewardClaimed: false,
  dailySpinUsed: false,
  lastSpinDate: '',
  loginStreak: 1,
  tutorialCompleted: false,
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
        stocks: updateStockPrices(state.stocks)
      };
    }
    
    case 'BUY_LUXURY_ITEM': {
      const { itemId, currency } = action;
      const item = state.luxuryItems.find(i => i.id === itemId);
      if (!item || item.owned) return state;
      
      const cost = currency === 'diamonds' ? item.diamondPrice : item.price;
      const canAfford = currency === 'diamonds' ? state.diamonds >= cost : state.money >= cost;
      
      if (!canAfford) return state;
      
      return {
        ...state,
        money: currency === 'money' ? state.money - cost : state.money,
        diamonds: currency === 'diamonds' ? state.diamonds - cost : state.diamonds,
        luxuryItems: state.luxuryItems.map(i => 
          i.id === itemId ? { ...i, owned: true } : i
        )
      };
    }
    
    case 'ADD_DIAMONDS':
      return { ...state, diamonds: state.diamonds + action.amount };
    
    case 'SPEND_DIAMONDS':
      return { ...state, diamonds: Math.max(0, state.diamonds - action.amount) };
    
    case 'DAILY_SPIN': {
      const today = new Date().toDateString();
      const { reward } = action;
      
      return {
        ...state,
        dailySpinUsed: true,
        lastSpinDate: today,
        money: reward.type === 'money' ? state.money + reward.amount : state.money,
        diamonds: reward.type === 'diamonds' ? state.diamonds + reward.amount : state.diamonds,
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
    
    case 'COMPLETE_TUTORIAL':
      return { ...state, tutorialCompleted: true };
    
    case 'RESTART_TUTORIAL':
      return { ...state, tutorialCompleted: false };
    
    case 'UNLOCK_ITEM': {
      const itemId = (action as any).itemId;
      return {
        ...state,
        unlockedItems: state.unlockedItems.includes(itemId) 
          ? state.unlockedItems 
          : [...state.unlockedItems, itemId]
      };
    }
    
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Update stock prices every 2 seconds for more dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_STOCK_PRICES' });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Unlock items based on money - more aggressive unlocking
  useEffect(() => {
    const newUnlocks: string[] = [];
    state.luxuryItems.forEach(item => {
      if (!state.unlockedItems.includes(item.id) && state.money >= item.price * 0.3) {
        newUnlocks.push(item.id);
      }
    });
    
    if (newUnlocks.length > 0) {
      newUnlocks.forEach(itemId => {
        dispatch({ type: 'UNLOCK_ITEM', itemId });
      });
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
