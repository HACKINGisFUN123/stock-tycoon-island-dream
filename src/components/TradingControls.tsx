
import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';

interface TradingControlsProps {
  shares: number;
  maxShares: number;
  onSharesChange: (shares: number) => void;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
  totalCost: number;
  formatMoney: (amount: number) => string;
  disabled?: boolean;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  shares,
  maxShares,
  onSharesChange,
  onAction,
  actionLabel,
  actionColor,
  totalCost,
  formatMoney,
  disabled = false
}) => {
  const adjustShares = (delta: number) => {
    onSharesChange(Math.max(1, Math.min(maxShares, shares + delta)));
  };

  const setToMax = () => {
    onSharesChange(maxShares);
  };

  const quickIncrements = [5, 10, 25];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-white/80 text-sm mb-3">Number of Shares</div>
        
        {/* Main controls */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Button
            onClick={() => adjustShares(-1)}
            disabled={shares <= 1 || disabled}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-700 text-white p-0 rounded-full"
          >
            <Minus className="w-5 h-5" />
          </Button>
          
          <div className="bg-slate-800 border border-slate-600 rounded-lg px-6 py-3 text-white text-2xl font-bold min-w-[100px] text-center">
            {disabled ? 0 : shares}
          </div>
          
          <Button
            onClick={() => adjustShares(1)}
            disabled={shares >= maxShares || disabled}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-700 text-white p-0 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick increment buttons */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {quickIncrements.map((increment) => (
            <Button
              key={increment}
              onClick={() => adjustShares(increment)}
              disabled={shares + increment > maxShares || disabled}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1 h-8"
            >
              +{increment}
            </Button>
          ))}
          
          <Button
            onClick={setToMax}
            disabled={maxShares === 0 || disabled}
            className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1 h-8 font-semibold"
          >
            MAX
          </Button>
        </div>
        
        <div className="text-xs text-white/60 mb-4">
          Total: {formatMoney(totalCost)}
        </div>
      </div>
      
      <Button 
        onClick={onAction}
        className={`w-full ${actionColor} text-white font-semibold py-4 text-lg`}
        disabled={disabled || shares <= 0 || shares > maxShares || maxShares === 0}
      >
        {actionLabel} {disabled ? 0 : shares} Share{shares !== 1 ? 's' : ''}
      </Button>
    </div>
  );
};

export default TradingControls;
