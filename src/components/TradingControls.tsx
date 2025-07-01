
import React, { useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Minus, Plus, RotateCcw } from 'lucide-react';

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
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const adjustShares = useCallback((delta: number) => {
    onSharesChange(Math.max(0, Math.min(maxShares, shares + delta)));
  }, [shares, maxShares, onSharesChange]);

  const startHolding = useCallback((delta: number) => {
    // Clear any existing intervals
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);

    // Initial adjustment
    adjustShares(delta);

    // Start with slower increments, then speed up
    let speed = 200; // Start with 200ms intervals
    
    const startInterval = () => {
      holdIntervalRef.current = setInterval(() => {
        adjustShares(delta);
        
        // Gradually increase speed (decrease interval)
        if (speed > 50) {
          speed = Math.max(50, speed - 10);
          clearInterval(holdIntervalRef.current!);
          startInterval();
        }
      }, speed);
    };

    // Start the accelerating intervals after initial delay
    holdTimeoutRef.current = setTimeout(startInterval, 300);
  }, [adjustShares]);

  const stopHolding = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  }, []);

  const setToMax = () => {
    onSharesChange(maxShares);
  };

  const resetShares = () => {
    onSharesChange(0);
  };

  const positiveIncrements = [5, 10, 25];
  const negativeIncrements = [5, 10, 15];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-white/80 text-sm mb-3">Number of Shares</div>
        
        {/* Main controls with hold functionality */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Button
            onMouseDown={() => startHolding(-1)}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={() => startHolding(-1)}
            onTouchEnd={stopHolding}
            disabled={shares <= 0 || disabled}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-700 text-white p-0 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Minus className="w-5 h-5" />
          </Button>
          
          <div className="bg-slate-800 border border-slate-600 rounded-lg px-6 py-3 text-white text-2xl font-bold min-w-[100px] text-center transition-all duration-200">
            {disabled ? 0 : shares}
          </div>
          
          <Button
            onMouseDown={() => startHolding(1)}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={() => startHolding(1)}
            onTouchEnd={stopHolding}
            disabled={shares >= maxShares || disabled}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-700 text-white p-0 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Reset button */}
        <div className="flex justify-center mb-3">
          <Button
            onClick={resetShares}
            disabled={shares === 0 || disabled}
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 h-8 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Negative increment buttons */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {negativeIncrements.map((decrement) => (
            <Button
              key={decrement}
              onClick={() => adjustShares(-decrement)}
              disabled={shares - decrement < 0 || disabled}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 h-8 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              -{decrement}
            </Button>
          ))}
        </div>

        {/* Positive increment buttons */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {positiveIncrements.map((increment) => (
            <Button
              key={increment}
              onClick={() => adjustShares(increment)}
              disabled={shares + increment > maxShares || disabled}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 h-8 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              +{increment}
            </Button>
          ))}
          
          <Button
            onClick={setToMax}
            disabled={maxShares === 0 || disabled}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 h-8 font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
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
        className={`w-full ${actionColor} text-white font-semibold py-4 text-lg transition-all duration-200 hover:scale-105 active:scale-95`}
        disabled={disabled || shares <= 0 || shares > maxShares || maxShares === 0}
      >
        {actionLabel} {disabled ? 0 : shares} Share{shares !== 1 ? 's' : ''}
      </Button>
    </div>
  );
};

export default TradingControls;
