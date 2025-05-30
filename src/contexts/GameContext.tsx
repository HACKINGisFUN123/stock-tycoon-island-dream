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
  // Tech Giants
  { id: 'apple', name: 'Apple Inc', symbol: 'AAPL', price: 175, history: [175], trend: 'neutral', color: '#007AFF', logo: '🍎' },
  { id: 'microsoft', name: 'Microsoft Corp', symbol: 'MSFT', price: 380, history: [380], trend: 'neutral', color: '#00BCF2', logo: '💻' },
  { id: 'google', name: 'Alphabet Inc', symbol: 'GOOGL', price: 2800, history: [2800], trend: 'neutral', color: '#4285F4', logo: '🔍' },
  { id: 'amazon', name: 'Amazon.com Inc', symbol: 'AMZN', price: 3400, history: [3400], trend: 'neutral', color: '#FF9900', logo: '📦' },
  { id: 'meta', name: 'Meta Platforms Inc', symbol: 'META', price: 320, history: [320], trend: 'neutral', color: '#1877F2', logo: '👥' },
  { id: 'tesla', name: 'Tesla Inc', symbol: 'TSLA', price: 250, history: [250], trend: 'neutral', color: '#CC0000', logo: '⚡' },
  { id: 'netflix', name: 'Netflix Inc', symbol: 'NFLX', price: 450, history: [450], trend: 'neutral', color: '#E50914', logo: '🎬' },
  { id: 'nvidia', name: 'NVIDIA Corp', symbol: 'NVDA', price: 900, history: [900], trend: 'neutral', color: '#76B900', logo: '🎮' },
  
  // Traditional Companies
  { id: 'nike', name: 'Nike Inc', symbol: 'NKE', price: 120, history: [120], trend: 'neutral', color: '#32D74B', logo: '👟' },
  { id: 'coca-cola', name: 'Coca-Cola Co', symbol: 'KO', price: 60, history: [60], trend: 'neutral', color: '#FF2D2D', logo: '🥤' },
  { id: 'mcdonalds', name: 'McDonald\'s Corp', symbol: 'MCD', price: 280, history: [280], trend: 'neutral', color: '#FFC72C', logo: '🍟' },
  { id: 'disney', name: 'Walt Disney Co', symbol: 'DIS', price: 95, history: [95], trend: 'neutral', color: '#113CCF', logo: '🏰' },
  { id: 'visa', name: 'Visa Inc', symbol: 'V', price: 240, history: [240], trend: 'neutral', color: '#1A1F71', logo: '💳' },
  { id: 'jpmorgan', name: 'JPMorgan Chase', symbol: 'JPM', price: 150, history: [150], trend: 'neutral', color: '#0066CC', logo: '🏦' },
  { id: 'johnson', name: 'Johnson & Johnson', symbol: 'JNJ', price: 170, history: [170], trend: 'neutral', color: '#CC0000', logo: '🏥' },
  
  // Energy & Finance
  { id: 'berkshire', name: 'Berkshire Hathaway', symbol: 'BRK.A', price: 450000, history: [450000], trend: 'neutral', color: '#1B365D', logo: '💼' },
  { id: 'exxon', name: 'Exxon Mobil Corp', symbol: 'XOM', price: 110, history: [110], trend: 'neutral', color: '#FF6600', logo: '⛽' },
  { id: 'walmart', name: 'Walmart Inc', symbol: 'WMT', price: 160, history: [160], trend: 'neutral', color: '#004C91', logo: '🛒' },
  { id: 'procter', name: 'Procter & Gamble', symbol: 'PG', price: 150, history: [150], trend: 'neutral', color: '#003DA5', logo: '🧴' },
  
  // Emerging Companies
  { id: 'salesforce', name: 'Salesforce Inc', symbol: 'CRM', price: 200, history: [200], trend: 'neutral', color: '#00A1E0', logo: '☁️' },
  { id: 'adobe', name: 'Adobe Inc', symbol: 'ADBE', price: 550, history: [550], trend: 'neutral', color: '#FF0000', logo: '🎨' },
  { id: 'paypal', name: 'PayPal Holdings', symbol: 'PYPL', price: 75, history: [75], trend: 'neutral', color: '#0070BA', logo: '💰' },
  { id: 'zoom', name: 'Zoom Video Comm', symbol: 'ZM', price: 70, history: [70], trend: 'neutral', color: '#2D8CFF', logo: '📹' },
  { id: 'spotify', name: 'Spotify Technology', symbol: 'SPOT', price: 150, history: [150], trend: 'neutral', color: '#1DB954', logo: '🎵' },
  { id: 'uber', name: 'Uber Technologies', symbol: 'UBER', price: 45, history: [45], trend: 'neutral', color: '#000000', logo: '🚗' },
];

const initialLuxuryItems: LuxuryItem[] = [
  // Cars
  { id: 'sports-car', name: 'Sports Car', price: 80000, diamondPrice: 400, category: 'car', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', description: 'Fast and stylish sports car', unlocked: true, owned: false },
  { id: 'luxury-sedan', name: 'Luxury Sedan', price: 120000, diamondPrice: 600, category: 'car', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', description: 'Premium luxury sedan', unlocked: false, owned: false },
  { id: 'supercar', name: 'Supercar', price: 300000, diamondPrice: 1500, category: 'car', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', description: 'Ultimate speed machine', unlocked: false, owned: false },
  { id: 'hypercar', name: 'Hypercar', price: 800000, diamondPrice: 4000, category: 'car', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69886?w=400&h=300&fit=crop', description: 'Cutting-edge hypercar', unlocked: false, owned: false },
  { id: 'vintage-car', name: 'Vintage Classic', price: 250000, diamondPrice: 1250, category: 'car', image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop', description: 'Timeless vintage automobile', unlocked: false, owned: false },
  { id: 'electric-car', name: 'Electric Supercar', price: 200000, diamondPrice: 1000, category: 'car', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', description: 'Eco-friendly electric power', unlocked: false, owned: false },
  
  // Houses
  { id: 'penthouse', name: 'City Penthouse', price: 500000, diamondPrice: 2500, category: 'house', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop', description: 'Luxury penthouse with city views', unlocked: false, owned: false },
  { id: 'mansion', name: 'Luxury Mansion', price: 1200000, diamondPrice: 6000, category: 'house', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', description: 'Grand mansion with stunning grounds', unlocked: false, owned: false },
  { id: 'beach-house', name: 'Beach Villa', price: 800000, diamondPrice: 4000, category: 'house', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop', description: 'Oceanfront beach villa', unlocked: false, owned: false },
  { id: 'mountain-cabin', name: 'Mountain Retreat', price: 350000, diamondPrice: 1750, category: 'house', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', description: 'Secluded mountain cabin', unlocked: false, owned: false },
  { id: 'castle', name: 'Historic Castle', price: 5000000, diamondPrice: 25000, category: 'house', image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=300&fit=crop', description: 'Medieval castle estate', unlocked: false, owned: false },
  
  // Yachts
  { id: 'yacht', name: 'Luxury Yacht', price: 2000000, diamondPrice: 10000, category: 'yacht', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', description: 'Sail the seas in luxury', unlocked: false, owned: false },
  { id: 'mega-yacht', name: 'Mega Yacht', price: 8000000, diamondPrice: 40000, category: 'yacht', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', description: 'Ultimate floating palace', unlocked: false, owned: false },
  { id: 'sailing-yacht', name: 'Racing Sailboat', price: 500000, diamondPrice: 2500, category: 'yacht', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', description: 'High-performance sailing yacht', unlocked: false, owned: false },
  { id: 'motor-yacht', name: 'Sport Yacht', price: 1500000, diamondPrice: 1000, category: 'yacht', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', description: 'Fast motor yacht', unlocked: false, owned: false },
  
  // Jets
  { id: 'private-jet', name: 'Private Jet', price: 15000000, diamondPrice: 75000, category: 'jet', image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop', description: 'Fly anywhere in the world', unlocked: false, owned: false },
  { id: 'helicopter', name: 'Luxury Helicopter', price: 3000000, diamondPrice: 15000, category: 'jet', image: 'https://images.unsplash.com/photo-1541891174-c581b8eed6bd?w=400&h=300&fit=crop', description: 'Personal helicopter transport', unlocked: false, owned: false },
  
  // Gadgets & Electronics
  { id: 'luxury-phone', name: 'Diamond Phone', price: 50000, diamondPrice: 250, category: 'gadget', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', description: 'Ultimate luxury smartphone', unlocked: true, owned: false },
  { id: 'smart-watch', name: 'Platinum Smartwatch', price: 25000, diamondPrice: 125, category: 'gadget', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', description: 'Luxury smartwatch with platinum case', unlocked: true, owned: false },
  { id: 'gaming-setup', name: 'Ultimate Gaming Rig', price: 15000, diamondPrice: 75, category: 'electronics', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop', description: 'Top-tier gaming computer setup', unlocked: true, owned: false },
  { id: 'home-theater', name: 'Home Theater System', price: 100000, diamondPrice: 500, category: 'electronics', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', description: 'Cinema-quality home theater', unlocked: false, owned: false },
  
  // Jewelry
  { id: 'diamond-ring', name: 'Diamond Ring', price: 75000, diamondPrice: 375, category: 'jewelry', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop', description: 'Stunning diamond ring', unlocked: false, owned: false },
  { id: 'gold-watch', name: 'Gold Rolex', price: 150000, diamondPrice: 750, category: 'jewelry', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=300&fit=crop', description: 'Classic gold luxury watch', unlocked: false, owned: false },
  { id: 'pearl-necklace', name: 'Pearl Necklace', price: 30000, diamondPrice: 150, category: 'jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop', description: 'Elegant pearl necklace', unlocked: false, owned: false },
  
  // Art & Collectibles
  { id: 'painting', name: 'Famous Painting', price: 500000, diamondPrice: 2500, category: 'art', image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop', description: 'Masterpiece artwork', unlocked: false, owned: false },
  { id: 'sculpture', name: 'Modern Sculpture', price: 200000, diamondPrice: 1000, category: 'art', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', description: 'Contemporary art sculpture', unlocked: false, owned: false },
  
  // Fashion
  { id: 'designer-suit', name: 'Designer Suit', price: 8000, diamondPrice: 40, category: 'fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', description: 'Bespoke designer suit', unlocked: true, owned: false },
  { id: 'luxury-shoes', name: 'Luxury Shoes', price: 3000, diamondPrice: 15, category: 'fashion', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop', description: 'Handcrafted luxury footwear', unlocked: true, owned: false },
  
  // More Cars
  { id: 'race-car', name: 'Formula 1 Car', price: 2000000, diamondPrice: 10000, category: 'car', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', description: 'Professional racing car', unlocked: false, owned: false },
  { id: 'limousine', name: 'Stretch Limousine', price: 180000, diamondPrice: 750, category: 'car', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', description: 'Luxury stretch limousine', unlocked: false, owned: false },
  
  // More Houses
  { id: 'skyscraper', name: 'Private Skyscraper', price: 50000000, diamondPrice: 250000, category: 'house', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', description: 'Your own skyscraper building', unlocked: false, owned: false },
  { id: 'island', name: 'Private Island', price: 25000000, diamondPrice: 125000, category: 'house', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', description: 'Tropical private island', unlocked: false, owned: false },
  
  // More Gadgets
  { id: 'robot', name: 'Personal Robot', price: 85000, diamondPrice: 400, category: 'gadget', image: 'https://images.unsplash.com/photo-1485827235947-a955ef187fcc?w=400&h=300&fit=crop', description: 'AI-powered personal assistant robot', unlocked: false, owned: false },
  { id: 'drone', name: 'Professional Drone', price: 15000, diamondPrice: 75, category: 'gadget', image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=300&fit=crop', description: 'High-end camera drone', unlocked: true, owned: false },
  
  // More Jewelry
  { id: 'emerald-earrings', name: 'Emerald Earrings', price: 45000, diamondPrice: 225, category: 'jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop', description: 'Exquisite emerald earrings', unlocked: false, owned: false },
  { id: 'sapphire-bracelet', name: 'Sapphire Bracelet', price: 65000, diamondPrice: 325, category: 'jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop', description: 'Beautiful sapphire bracelet', unlocked: false, owned: false },
  
  // Unique Items
  { id: 'space-ticket', name: 'Space Tourism Ticket', price: 1000000, diamondPrice: 5000, category: 'gadget', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop', description: 'Trip to space', unlocked: false, owned: false },
  { id: 'submarine', name: 'Personal Submarine', price: 5000000, diamondPrice: 25000, category: 'yacht', image: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=400&h=300&fit=crop', description: 'Explore the ocean depths', unlocked: false, owned: false },
  { id: 'wine-collection', name: 'Vintage Wine Collection', price: 500000, diamondPrice: 2500, category: 'art', image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400&h=300&fit=crop', description: 'Rare vintage wine collection', unlocked: false, owned: false },
  { id: 'race-horse', name: 'Champion Race Horse', price: 750000, diamondPrice: 3750, category: 'gadget', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop', description: 'Prize-winning thoroughbred', unlocked: false, owned: false },
  { id: 'gold-bars', name: 'Gold Bar Collection', price: 300000, diamondPrice: 1500, category: 'jewelry', image: 'https://images.unsplash.com/photo-1610375461369-d58a2b7621b8?w=400&h=300&fit=crop', description: 'Pure gold investment bars', unlocked: false, owned: false },
  
  // High-End Electronics
  { id: 'hologram-display', name: 'Holographic Display', price: 250000, diamondPrice: 1250, category: 'electronics', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', description: 'Futuristic hologram technology', unlocked: false, owned: false },
  { id: 'quantum-computer', name: 'Quantum Computer', price: 10000000, diamondPrice: 50000, category: 'electronics', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', description: 'Next-generation quantum computing', unlocked: false, owned: false },
  
  // More Fashion
  { id: 'designer-dress', name: 'Couture Gown', price: 25000, diamondPrice: 125, category: 'fashion', image: 'https://images.unsplash.com/photo-1566479179817-c5c24ba41eaa?w=400&h=300&fit=crop', description: 'High-fashion designer gown', unlocked: false, owned: false },
  { id: 'fur-coat', name: 'Luxury Fur Coat', price: 40000, diamondPrice: 200, category: 'fashion', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', description: 'Premium fur coat', unlocked: false, owned: false },
  
  // Entertainment
  { id: 'concert-hall', name: 'Private Concert Hall', price: 15000000, diamondPrice: 75000, category: 'house', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', description: 'Your own concert venue', unlocked: false, owned: false },
  { id: 'sports-team', name: 'Sports Team Ownership', price: 100000000, diamondPrice: 500000, category: 'art', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop', description: 'Own a professional sports team', unlocked: false, owned: false },
  
  // Ultimate Luxury
  { id: 'golden-toilet', name: 'Golden Toilet', price: 500000, diamondPrice: 2500, category: 'house', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', description: 'Solid gold bathroom fixture', unlocked: false, owned: false },
  { id: 'time-machine', name: 'Time Machine', price: 1000000000, diamondPrice: 5000000, category: 'gadget', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', description: 'Travel through time (fictional)', unlocked: false, owned: false },
];

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
        stocks: state.stocks.map(stock => {
          // Improved stock movement - more player-friendly with occasional dips
          const volatility = Math.random();
          let changePercent = 0;
          
          // 80% chance of positive movement (0% to +2.5%)
          if (volatility < 0.8) {
            changePercent = Math.random() * 0.025;
          }
          // 15% chance of small negative movement (-1.5% to 0%)
          else if (volatility < 0.95) {
            changePercent = -Math.random() * 0.015;
          }
          // 5% chance of bigger movement (-3% to +4%)
          else {
            changePercent = (Math.random() - 0.3) * 0.07;
          }
          
          // Small positive bias
          changePercent += 0.001;
          
          const change = stock.price * changePercent;
          const newPrice = Math.max(1, stock.price + change);
          const newHistory = [...stock.history.slice(-29), newPrice];
          
          let trend: 'up' | 'down' | 'neutral' = 'neutral';
          if (changePercent > 0.008) trend = 'up';
          else if (changePercent < -0.008) trend = 'down';
          
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

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

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
