
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Area, AreaChart } from 'recharts';
import { Stock } from '../contexts/GameContext';

interface StockChartProps {
  stock: Stock;
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({ stock, height = 100 }) => {
  const data = stock.history.map((price, index) => ({
    time: index,
    price: price,
  }));
  
  const minPrice = Math.min(...stock.history);
  const maxPrice = Math.max(...stock.history);
  const padding = (maxPrice - minPrice) * 0.1;
  
  // Determine overall trend based on first and last prices
  const isPositiveTrend = stock.history.length > 1 && 
    stock.history[stock.history.length - 1] > stock.history[0];
  
  const trendColor = isPositiveTrend ? '#10B981' : '#EF4444'; // green or red
  const gradientId = `gradient-${stock.id}`;
  
  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={trendColor} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            hide 
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: trendColor, strokeWidth: 2, stroke: '#ffffff' }}
            animationDuration={500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
