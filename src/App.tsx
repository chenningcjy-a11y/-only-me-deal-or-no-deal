import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Phone, PhoneIncoming } from 'lucide-react';
import { useDealOrNoDeal } from './hooks/useDealOrNoDeal';
import { ValueBoard } from './components/ValueBoard';
import { CasesGrid } from './components/CasesGrid';
import { formatMoney } from './utils';

export default function App() {
  const {
    gameState,
    cases,
    myCaseId,
    currentRound,
    remainingCasesToOpen,
    bankerOffer,
    revealingCase,
    winnings,
    isBankerCalling,
    magicItemCount,
    isMagicModeActive,
    toggleMagicMode,
    startGame,
    selectCase,
    handleDeal,
    handleNoDeal,
    handleFinalChoice
  } = useDealOrNoDeal();

  useEffect(() => {
    if (gameState === 'GAME_OVER_DEAL' || gameState === 'GAME_OVER_NO_DEAL') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff']
      });
    }
  }, [gameState]);

  const [confirmingCaseId, setConfirmingCaseId] = useState<number | null>(null);

  const renderHostPrompt = () => {
    switch (gameState) {
      case 'START': return "欢迎来到一掷千金！";
      case 'SELECT_MINE': return "请选择一个你要保留的箱子。";
      case 'OPEN_CASES': return `请再打开 ${remainingCasesToOpen} 个箱子。`;
      case 'BANKER_CALLING': return "银行家来电...";
      case 'BANKER_OFFER': return "成交还是不成交？";
      case 'FINAL_CHOICE': return "只剩最后2个箱子了！您想保留自己的箱子，还是与剩下的那个交换？";
      case 'GAME_OVER_DEAL': return `成交！`;
      case 'GAME_OVER_NO_DEAL': return `不成交！让我们看看你的箱子里有什么...`;
      case 'CASE_REVEAL': return "正在开启...";
      default: return "";
    }
  };

  const isGridDisabled = 
    gameState !== 'SELECT_MINE' && 
    gameState !== 'OPEN_CASES' && 
    gameState !== 'START';

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-white overflow-hidden font-sans relative">
      
      {/* Studio Spotlights */}
      <div className="absolute top-0 left-[15%] w-[2px] h-[50vh] bg-blue-500/10 shadow-[0_0_80px_30px_rgba(59,130,246,0.15)] transform -rotate-12 origin-top pointer-events-none" />
      <div className="absolute top-0 right-[15%] w-[2px] h-[50vh] bg-yellow-500/10 shadow-[0_0_80px_30px_rgba(234,179,8,0.15)] transform rotate-12 origin-top pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      {/* Header / Host Prompt */}
      <header className="relative z-10 py-6 px-8 flex flex-col md:flex-row justify-between items-center mb-2 gap-4 border-b border-white/5 bg-black/30 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-400">
            DEAL OR NO DEAL
          </h1>
          <p className="text-blue-400 font-bold text-sm tracking-widest uppercase mt-1">
            中国版 · 心理博弈场
          </p>
        </div>
        
        <div className="text-xl md:text-2xl font-bold text-amber-300 text-center">
          {renderHostPrompt()}
        </div>
        
        {gameState !== 'START' ? (
          <div className="text-center md:text-right hidden md:block">
            <div className="text-xs text-slate-400 uppercase">当前轮次</div>
            <div className="text-2xl font-bold text-white">
              第 {currentRound + 1} 轮 <span className="text-sm font-normal text-slate-500">/ 剩余 {remainingCasesToOpen} 个箱子待开启</span>
            </div>
          </div>
        ) : (
          <div className="hidden md:block w-32" /> // spacer
        )}
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-0 p-4 gap-8 max-w-[1400px] mx-auto w-full">
        
        {/* Left Board */}
        <div className="hidden lg:flex w-[200px] justify-start shrink-0">
          <ValueBoard cases={cases} side="left" />
        </div>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col items-center justify-start xl:justify-center relative min-h-[50vh]">
          
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8 mt-12"
            >
              <div className="text-center max-w-lg text-slate-400">
                <p className="mb-4">游戏开始后，您将看到26个包含从0.01元到1,000,000元不等金额的手提箱。</p>
                <p>首先，选择一个您要保留的箱子。然后，逐轮打开剩余的箱子。每轮结束后，银行家会向您出价购买您的箱子。</p>
              </div>
              <button
                onClick={startGame}
                className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-2xl rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
              >
                开始游戏
              </button>
            </motion.div>
          )}

          {gameState !== 'START' && (
            <div className="w-full flex flex-col items-center">
              {/* Mobile Boards (visible only on small screens) */}
              <div className="flex lg:hidden w-full justify-between gap-2 mb-6">
                <div className="w-1/2 flex justify-center">
                  <ValueBoard cases={cases} side="left" />
                </div>
                <div className="w-1/2 flex justify-center">
                  <ValueBoard cases={cases} side="right" />
                </div>
              </div>

              {/* The Cases */}
              <CasesGrid 
                cases={cases} 
                myCaseId={myCaseId} 
                onSelectCase={(id) => {
                  if (isMagicModeActive) {
                    selectCase(id);
                  } else {
                    setConfirmingCaseId(id);
                  }
                }} 
                disabled={isGridDisabled && !isMagicModeActive} 
                isMagicModeActive={isMagicModeActive}
              />
            </div>
          )}

        </div>

        {/* Right Board */}
        <div className="hidden lg:flex w-[200px] justify-end shrink-0">
          <ValueBoard cases={cases} side="right" />
        </div>
      </main>

      {/* Footer for My Case */}
      {myCaseId && gameState !== 'START' && (
        <footer className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center px-8 pb-6 relative z-10 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-6">
            <div className="text-xs text-slate-500 uppercase font-bold hidden md:block">你的选择</div>
            <div className="w-24 h-16 bg-yellow-500 border-2 border-white rounded flex items-center justify-center relative shadow-lg shadow-yellow-500/20">
              <span className="text-3xl font-black text-black">{myCaseId}</span>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 bg-white text-[10px] text-black font-bold rounded whitespace-nowrap">我的箱子</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMagicMode}
              disabled={magicItemCount === 0 || (gameState !== 'OPEN_CASES' && gameState !== 'SELECT_MINE')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                isMagicModeActive 
                  ? 'bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(192,38,211,0.6)] animate-pulse' 
                  : magicItemCount > 0 && (gameState === 'OPEN_CASES' || gameState === 'SELECT_MINE')
                    ? 'bg-slate-800 text-fuchsia-400 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(192,38,211,0.3)] border border-fuchsia-900/50'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <span>透视魔法 ({magicItemCount}/10)</span>
            </button>
          </div>
        </footer>
      )}

      {/* Overlays */}
      <AnimatePresence>
        
        {/* Confirmation Modal */}
        {confirmingCaseId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6">
                {gameState === 'SELECT_MINE' ? '选择这个箱子作为你的箱子？' : '确认要打开这个箱子吗？'}
              </h3>
              <div className="w-24 h-16 mx-auto bg-gradient-to-br from-slate-300 to-slate-500 border-2 border-slate-600 rounded-md flex items-center justify-center mb-8 shadow-lg">
                <span className="text-3xl font-black text-slate-800">{confirmingCaseId}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmingCaseId(null)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    selectCase(confirmingCaseId);
                    setConfirmingCaseId(null);
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  确定
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Case Reveal Modal */}
        {revealingCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotateX: 90 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center gap-6 perspective-1000"
            >
              <span className="text-2xl text-slate-300">第 {revealingCase.id} 号箱子包含...</span>
              
              <div className="relative w-72 h-56 sm:w-80 sm:h-64 bg-zinc-800 rounded-xl border-4 border-zinc-700 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
                <div className="absolute inset-3 sm:inset-4 border-2 border-zinc-600 rounded-lg flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black shadow-inner">
                   <span className="text-4xl sm:text-5xl md:text-7xl font-black text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                     {formatMoney(revealingCase.amount)}
                   </span>
                </div>
                {/* Simulated top lid flipped back */}
                <div className="absolute -top-[100%] left-[-4px] right-[-4px] h-full bg-zinc-700 rounded-t-xl border-4 border-zinc-600 origin-bottom transform rotateX-[110deg] shadow-[inset_0_-20px_20px_rgba(0,0,0,0.5)] opacity-40" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Banker Calling / Offer Modal */}
        {(isBankerCalling || gameState === 'BANKER_OFFER') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-slate-900 to-black border-2 border-blue-900/50 rounded-3xl p-8 max-w-2xl w-full text-center shadow-[0_0_80px_rgba(30,58,138,0.3)] relative overflow-hidden"
            >
              
              {isBankerCalling ? (
                <div className="flex flex-col items-center gap-6 py-12">
                  <motion.div
                    animate={{ rotate: [-10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center border-2 border-blue-500"
                  >
                    <PhoneIncoming className="w-8 h-8 text-blue-200" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white">银行家来电...</h2>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center border-2 border-blue-500 mb-2">
                    <Phone className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-blue-400 text-xs font-bold uppercase tracking-wider">银行家出价</div>
                    <div className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-md">
                      {formatMoney(bankerOffer)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-8">
                    <button
                      onClick={handleDeal}
                      className="px-12 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-full text-xl shadow-lg border-b-4 border-red-900 uppercase tracking-widest w-full sm:w-auto"
                    >
                      成交 (Deal)
                    </button>
                    <button
                      onClick={handleNoDeal}
                      className="px-12 py-3 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-full text-xl shadow-lg border-b-4 border-slate-900 uppercase tracking-widest w-full sm:w-auto"
                    >
                      不成交 (No Deal)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Final Choice Modal (Keep or Swap) */}
        {gameState === 'FINAL_CHOICE' && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          >
             <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-xl w-full text-center shadow-2xl">
               <h2 className="text-3xl font-black mb-6 text-amber-400">最终决定</h2>
               <p className="text-xl text-slate-300 mb-8">
                 只剩最后2个箱子了！您想保留自己的箱子，还是与剩下的那个交换？
               </p>
               <div className="flex gap-4">
                 <button
                   onClick={() => handleFinalChoice(true)}
                   className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 font-black text-xl rounded-xl transition-all"
                 >
                   保留我的箱子
                 </button>
                 <button
                   onClick={() => handleFinalChoice(false)}
                   className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl rounded-xl transition-all"
                 >
                   交换
                 </button>
               </div>
             </div>
          </motion.div>
        )}

        {/* Game Over Modal */}
        {(gameState === 'GAME_OVER_DEAL' || gameState === 'GAME_OVER_NO_DEAL') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
          >
            <div className="flex flex-col items-center gap-6 text-center max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-amber-400 mb-2">
                {gameState === 'GAME_OVER_DEAL' ? "成交！" : "游戏结束"}
              </h2>
              <p className="text-2xl text-slate-300">
                您最终赢得了...
              </p>
              <div className="text-6xl md:text-8xl font-black text-green-400 py-8 drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                {winnings !== null && formatMoney(winnings)}
              </div>
              
              {gameState === 'GAME_OVER_DEAL' && myCaseId && (
                <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <p className="text-slate-400 mb-2">你的 {myCaseId} 号箱子里的真实金额是:</p>
                  <p className="text-3xl font-black text-slate-200">
                    {formatMoney(cases.find(c => c.id === myCaseId)?.amount || 0)}
                  </p>
                  <p className="text-sm mt-4 font-medium">
                    {(cases.find(c => c.id === myCaseId)?.amount || 0) < (winnings || 0) 
                      ? <span className="text-green-400">好交易！你战胜了银行家！</span>
                      : <span className="text-red-400">太可惜了！你本应该保留自己的箱子！</span>}
                  </p>
                </div>
              )}

              <button
                onClick={startGame}
                className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold rounded-full transition-all"
              >
                再玩一次
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
