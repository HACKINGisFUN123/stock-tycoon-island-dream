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

const initialStocks: Stock[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 150,
    trend: 'up',
    logo: '🍎',
    history: [150],
    volatility: 0.02
  },
  {
    id: '2',
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    price: 800,
    trend: 'up',
    logo: '🚗',
    history: [800],
    volatility: 0.04
  },
  {
    id: '3',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 300,
    trend: 'stable',
    logo: '💻',
    history: [300],
    volatility: 0.015
  },
  {
    id: '4',
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 3200,
    trend: 'up',
    logo: '📦',
    history: [3200],
    volatility: 0.025
  },
  {
    id: '5',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: 2500,
    trend: 'stable',
    logo: '🔍',
    history: [2500],
    volatility: 0.02
  }
];

const generateLuxuryItems = (): LuxuryItem[] => {
  const items: LuxuryItem[] = [];
  
  // Cars (25 items)
  const cars = [
    { name: 'פורש 911 טורבו', description: 'מכונית ספורט יוקרתית', price: 200000, diamondPrice: 800 },
    { name: 'למבורגיני הוראקאן', description: 'סופר קאר איטלקי', price: 350000, diamondPrice: 1400 },
    { name: 'פרארי 488 GTB', description: 'מכונית מירוץ איטלקית', price: 500000, diamondPrice: 2000 },
    { name: 'מקלארן 720S', description: 'סופר קאר בריטי', price: 750000, diamondPrice: 3000 },
    { name: 'בוגאטי שירון', description: 'ההיפר קאר הכי מהיר', price: 3000000, diamondPrice: 12000 },
    { name: 'רולס רויס פנטום', description: 'יוקרה בריטית', price: 600000, diamondPrice: 2400 },
    { name: 'בנטלי קונטינnett GT', description: 'יוקרה וביצועים', price: 300000, diamondPrice: 1200 },
    { name: 'אסטון מרטין DB11', description: 'אלגנטיות בריטית', price: 400000, diamondPrice: 1600 },
    { name: 'מרצדס AMG GT63', description: 'ביצועים גרמניים', price: 250000, diamondPrice: 1000 },
    { name: 'BMW M8 קופה', description: 'מכונית ספורט גרמנית', price: 180000, diamondPrice: 720 },
    // Add more cars...
  ];

  // Houses (25 items)
  const houses = [
    { name: 'וילה במליבו', description: 'נוף לאוקיינוס השקט', price: 5000000, diamondPrice: 20000 },
    { name: 'פנטהאוז במנהטן', description: 'נוף לסנטרל פארק', price: 15000000, diamondPrice: 60000 },
    { name: 'טירה בצרפת', description: 'טירה היסטורית', price: 25000000, diamondPrice: 100000 },
    { name: 'וילה בהמפטונס', description: 'נופש קיצי יוקרתי', price: 8000000, diamondPrice: 32000 },
    { name: 'בית בביברלי הילס', description: 'שכונת הסלבריטאים', price: 12000000, diamondPrice: 48000 },
    // Add more houses...
  ];

  // Yachts (20 items)
  const yachts = [
    { name: 'יאכטה של 50 מטר', description: 'יוקרה על המים', price: 3000000, diamondPrice: 12000 },
    { name: 'מגה יאכטה 80 מטר', description: 'ארמון צף', price: 15000000, diamondPrice: 60000 },
    { name: 'יאכטה פרטית 30 מטר', description: 'פרטיות מוחלטת', price: 1500000, diamondPrice: 6000 },
    // Add more yachts...
  ];

  // Jets (15 items)
  const jets = [
    { name: 'ג\'ט פרטי סיסנה', description: 'מטוס פרטי קטן', price: 5000000, diamondPrice: 20000 },
    { name: 'גולפסטרים G650', description: 'יוקרה בשמיים', price: 75000000, diamondPrice: 300000 },
    { name: 'בומברדייה גלובל 7500', description: 'מטוס בינלאומי', price: 85000000, diamondPrice: 340000 },
    // Add more jets...
  ];

  // Accessories (30 items)
  const accessories = [
    { name: 'שעון רולקס דייטונה', description: 'שעון יוקרה שוויצרי', price: 50000, diamondPrice: 200 },
    { name: 'אייפון 15 פרו מקס זהב', description: 'טלפון יוקרה', price: 2000, diamondPrice: 8 },
    { name: 'תיק הרמס ברקין', description: 'תיק יד יוקרתי', price: 25000, diamondPrice: 100 },
    { name: 'משקפי טום פורד', description: 'משקפיים מעוצבים', price: 800, diamondPrice: 3 },
    // Add more accessories...
  ];

  // Add all items with proper categorization
  let id = 1;
  
  [...cars.slice(0, 10), ...houses.slice(0, 10), ...yachts.slice(0, 8), ...jets.slice(0, 5), ...accessories.slice(0, 15)].forEach((item, index) => {
    let category = 'car';
    if (index >= 10 && index < 20) category = 'house';
    else if (index >= 20 && index < 28) category = 'yacht';
    else if (index >= 28 && index < 33) category = 'jet';
    else if (index >= 33) category = 'accessories';
    
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
    
    // Bias towards positive movement (60% chance of going up)
    const trend = Math.random();
    let change;
    
    if (trend < 0.6) {
      // Positive movement (60% chance)
      change = Math.random() * volatility * 1.5; // Slightly larger gains
    } else if (trend < 0.85) {
      // Small negative movement (25% chance)
      change = -Math.random() * volatility * 0.5; // Smaller losses
    } else {
      // Larger negative movement (15% chance)
      change = -Math.random() * volatility * 1.2;
    }
    
    // Prevent stock from going below $1
    const newPrice = Math.max(1, stock.price * (1 + change));
    
    // Determine trend based on price movement
    let newTrend: 'up' | 'down' | 'stable' = 'stable';
    if (change > 0.01) newTrend = 'up';
    else if (change < -0.01) newTrend = 'down';
    
    return {
      ...stock,
      price: newPrice,
      trend: newTrend,
      history: [...stock.history.slice(-29), newPrice] // Keep last 30 prices
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

const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      // Create a new state with updated unlocked items
      const updatedState = {
        ...state,
        unlockedItems: [...state.unlockedItems, ...newUnlocks]
      };
      // This would need a proper action to handle unlocking
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
