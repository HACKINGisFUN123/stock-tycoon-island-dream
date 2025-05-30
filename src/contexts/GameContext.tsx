
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
  
  // Cars (25 items)
  const cars = [
    { name: 'פורש 911 טורבו', description: 'מכונית ספורט יוקרתית', price: 200000, diamondPrice: 800 },
    { name: 'למבורגיני הוראקאן', description: 'סופר קאר איטלקי', price: 350000, diamondPrice: 1400 },
    { name: 'פרארי 488 GTB', description: 'מכונית מירוץ איטלקית', price: 500000, diamondPrice: 2000 },
    { name: 'מקלארן 720S', description: 'סופר קאר בריטי', price: 750000, diamondPrice: 3000 },
    { name: 'בוגאטי שירון', description: 'ההיפר קאר הכי מהיר', price: 3000000, diamondPrice: 12000 },
    { name: 'רולס רויס פנטום', description: 'יוקרה בריטית', price: 600000, diamondPrice: 2400 },
    { name: 'בנטלי קונטיננטל GT', description: 'יוקרה וביצועים', price: 300000, diamondPrice: 1200 },
    { name: 'אסטון מרטין DB11', description: 'אלגנטיות בריטית', price: 400000, diamondPrice: 1600 },
    { name: 'מרצדס AMG GT63', description: 'ביצועים גרמניים', price: 250000, diamondPrice: 1000 },
    { name: 'BMW M8 קופה', description: 'מכונית ספורט גרמנית', price: 180000, diamondPrice: 720 },
    { name: 'אאודי RS7', description: 'ספורט וויגן גרמני', price: 170000, diamondPrice: 680 },
    { name: 'יגואר F-Type', description: 'ספורט בריטי קלאסי', price: 120000, diamondPrice: 480 },
    { name: 'קורבט Z06', description: 'אמריקאי אגדי', price: 140000, diamondPrice: 560 },
    { name: 'גט ר35', description: 'יפני מהיר', price: 160000, diamondPrice: 640 },
    { name: 'פורש טיקאן', description: 'חשמלי יוקרתי', price: 190000, diamondPrice: 760 },
    { name: 'מזראטי MC20', description: 'איטלקי מרהיב', price: 280000, diamondPrice: 1120 },
    { name: 'לוטוס אמירה', description: 'בריטי קל משקל', price: 150000, diamondPrice: 600 },
    { name: 'מקלארן 540C', description: 'סופר קאר נגיש', price: 220000, diamondPrice: 880 },
    { name: 'פורש 718 קיימן', description: 'ספורט מושלם', price: 110000, diamondPrice: 440 },
    { name: 'BMW i8', description: 'היברידי עתידני', price: 160000, diamondPrice: 640 }
  ];

  // Houses (25 items)
  const houses = [
    { name: 'וילה במליבו', description: 'נוף לאוקיינוס השקט', price: 5000000, diamondPrice: 20000 },
    { name: 'פנטהאוז במנהטן', description: 'נוף לסנטרל פארק', price: 15000000, diamondPrice: 60000 },
    { name: 'טירה בצרפת', description: 'טירה היסטורית', price: 25000000, diamondPrice: 100000 },
    { name: 'וילה בהמפטונס', description: 'נופש קיצי יוקרתי', price: 8000000, diamondPrice: 32000 },
    { name: 'בית בביברלי הילס', description: 'שכונת הסלבריטאים', price: 12000000, diamondPrice: 48000 },
    { name: 'פנטהאוז בדובאי', description: 'יוקרה במזרח התיכון', price: 10000000, diamondPrice: 40000 },
    { name: 'וילה בטוסקנה', description: 'כפרי איטלקי', price: 6000000, diamondPrice: 24000 },
    { name: 'דירה בלונדון', description: 'מיקום מרכזי', price: 7000000, diamondPrice: 28000 },
    { name: 'בית בזכוכית מיאמי', description: 'מודרני על החוף', price: 9000000, diamondPrice: 36000 },
    { name: 'וילה בקוטדז׳ור', description: 'נוף לים התיכון', price: 11000000, diamondPrice: 44000 },
    { name: 'פנטהאוז בטוקיו', description: 'טכנולוגיה יפנית', price: 8500000, diamondPrice: 34000 },
    { name: 'וילה בהוואי', description: 'גן עדן טרופי', price: 7500000, diamondPrice: 30000 },
    { name: 'בית בצ׳לסי', description: 'אזור אמנותי', price: 13000000, diamondPrice: 52000 },
    { name: 'וילה בסן טרופז', description: 'יוקרה צרפתית', price: 14000000, diamondPrice: 56000 },
    { name: 'פנטהאוז במונקו', description: 'מרכז ההימורים', price: 16000000, diamondPrice: 64000 },
    { name: 'וילה בסנטוריני', description: 'יווני קלאסי', price: 4500000, diamondPrice: 18000 },
    { name: 'בית באספן', description: 'סקי וטבע', price: 6500000, diamondPrice: 26000 },
    { name: 'וילה בברבדוס', description: 'קריבי יוקרתי', price: 5500000, diamondPrice: 22000 },
    { name: 'פנטהאוז בסידני', description: 'נוף לנמל', price: 9500000, diamondPrice: 38000 },
    { name: 'וילה בקיפוס', description: 'ים תיכוני', price: 3500000, diamondPrice: 14000 }
  ];

  // Add all items with proper categorization
  let id = 1;
  
  [...cars.slice(0, 20), ...houses.slice(0, 20)].forEach((item, index) => {
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
    
    // Enhanced bias towards positive movement (70% chance of going up)
    const trend = Math.random();
    let change;
    
    if (trend < 0.7) {
      // Positive movement (70% chance)
      change = Math.random() * volatility * 1.2;
    } else if (trend < 0.9) {
      // Small negative movement (20% chance)
      change = -Math.random() * volatility * 0.3;
    } else {
      // Larger negative movement (10% chance)
      change = -Math.random() * volatility * 0.8;
    }
    
    // Prevent stock from going below $1
    const newPrice = Math.max(1, stock.price * (1 + change));
    
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
