
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
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
  
  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            hide 
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={stock.color}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: stock.color }}
            animationDuration={500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
