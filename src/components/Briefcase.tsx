import React from 'react';
import { motion } from 'motion/react';
import { cn, formatMoney } from '../utils';

interface BriefcaseProps {
  id: number;
  isOpened: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isRevealedByMagic?: boolean;
  amount?: number;
  isMagicModeActive?: boolean;
}

export const Briefcase: React.FC<BriefcaseProps> = ({ id, isOpened, isSelected, onClick, disabled, isRevealedByMagic, amount, isMagicModeActive }) => {
  return (
    <motion.button
      whileHover={!disabled && !isOpened ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isOpened ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || isOpened}
      className={cn(
        "relative flex flex-col items-center justify-center w-[80px] h-[60px] sm:w-[90px] sm:h-[65px] md:w-[100px] md:h-[75px] rounded-lg transition-all perspective-1000",
        isOpened && "opacity-20 pointer-events-none grayscale",
        isSelected && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900 z-10 scale-110",
        (!disabled && !isOpened) && "cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
        isMagicModeActive && !isOpened && !isRevealedByMagic && "ring-2 ring-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.8)] cursor-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23e879f9%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z%22/><path d=%22M5 3v4%22/><path d=%22M19 17v4%22/><path d=%22M3 5h4%22/><path d=%22M17 19h4%22/></svg>'),_auto]"
      )}
    >
      {/* Handle */}
      <div className="absolute -top-[10px] w-[36px] h-[14px] border-[4px] border-zinc-400 rounded-t-lg border-b-0 z-0 bg-transparent drop-shadow-md" />
      
      {/* Main Body */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 rounded-lg shadow-xl border-t-[2px] border-white/60 border-b-[4px] border-zinc-700 z-10 flex items-center justify-center overflow-hidden",
        isRevealedByMagic && "from-fuchsia-300 via-fuchsia-400 to-fuchsia-500 border-fuchsia-200"
      )}>
        {/* Texture/Ribs */}
        <div className="absolute inset-0 flex justify-evenly px-2 opacity-30">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-[2px] h-full bg-black shadow-[1px_0_1px_rgba(255,255,255,0.8)]" />
          ))}
        </div>

        {/* Corner guards */}
        <div className="absolute top-0 left-0 w-3 h-3 border-r border-b border-zinc-500 bg-zinc-400 rounded-tl-lg shadow-sm" />
        <div className="absolute top-0 right-0 w-3 h-3 border-l border-b border-zinc-500 bg-zinc-400 rounded-tr-lg shadow-sm" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-r border-t border-zinc-500 bg-zinc-400 rounded-bl-lg shadow-sm" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-l border-t border-zinc-500 bg-zinc-400 rounded-br-lg shadow-sm" />

        {/* Lock mechanism details */}
        <div className="absolute top-0 left-1/4 w-3 h-2 bg-zinc-200 border border-zinc-500 rounded-b-sm" />
        <div className="absolute top-0 right-1/4 w-3 h-2 bg-zinc-200 border border-zinc-500 rounded-b-sm" />

        {/* Center Number Plate */}
        <div className="relative w-10 h-8 sm:w-12 sm:h-10 md:w-14 md:h-12 bg-gradient-to-br from-white to-zinc-200 rounded flex flex-col items-center justify-center border-2 border-zinc-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.4)] z-20">
          {isRevealedByMagic && amount ? (
            <span className="text-[10px] sm:text-xs md:text-sm font-black text-fuchsia-700 drop-shadow-sm leading-tight text-center px-1">
              {formatMoney(amount)}
            </span>
          ) : (
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-black drop-shadow-sm">{id}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

