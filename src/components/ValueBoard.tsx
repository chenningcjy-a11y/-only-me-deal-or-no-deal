import { useMemo } from 'react';
import { AMOUNTS } from '../constants';
import { formatMoney, cn } from '../utils';
import { BriefcaseType } from '../types';

interface ValueBoardProps {
  cases: BriefcaseType[];
  side: 'left' | 'right';
}

export function ValueBoard({ cases, side }: ValueBoardProps) {
  const amounts = useMemo(() => {
    const half = Math.ceil(AMOUNTS.length / 2);
    return side === 'left' ? AMOUNTS.slice(0, half) : AMOUNTS.slice(half);
  }, [side]);

  // Determine which amounts are still in play
  const remainingAmounts = useMemo(() => {
    return new Set(cases.filter(c => !c.isOpened).map(c => c.amount));
  }, [cases]);

  return (
    <div className="flex flex-col w-full items-center gap-1.5 md:gap-2">
      {amounts.map(amount => {
        const isInPlay = cases.length === 0 || remainingAmounts.has(amount);
        
        return (
          <div
            key={amount}
            className={cn(
              "w-full max-w-[120px] md:max-w-[140px] h-[30px] md:h-[36px] flex items-center justify-center rounded font-bold text-xs md:text-sm transition-all relative overflow-hidden border shadow-md",
              side === 'left' 
                ? "bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 border-blue-400 text-white" 
                : "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 border-yellow-300 text-black",
              !isInPlay 
                ? "opacity-20 grayscale shadow-none" 
                : side === 'left' 
                  ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  : "shadow-[0_0_10px_rgba(234,179,8,0.5)]"
            )}
          >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none h-1/2" />
            <span className="drop-shadow-sm">{formatMoney(amount)}</span>
          </div>
        );
      })}
    </div>
  );
}
