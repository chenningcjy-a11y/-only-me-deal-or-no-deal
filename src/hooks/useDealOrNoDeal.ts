import { useState, useCallback, useMemo, useEffect } from 'react';
import { AMOUNTS, ROUND_SCHEDULE, TOTAL_CASES } from '../constants';
import { GameState, BriefcaseType } from '../types';
import { shuffleArray, calculateBankerOffer } from '../utils';
import { playTheme, playRing, playOpenCase, playDeal } from '../audio';

export function useDealOrNoDeal() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [cases, setCases] = useState<BriefcaseType[]>([]);
  const [myCaseId, setMyCaseId] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [casesOpenedThisRound, setCasesOpenedThisRound] = useState(0);
  const [bankerOffer, setBankerOffer] = useState(0);
  const [revealingCase, setRevealingCase] = useState<BriefcaseType | null>(null);
  const [winnings, setWinnings] = useState<number | null>(null);
  const [isBankerCalling, setIsBankerCalling] = useState(false);

  // Magic Item State
  const [magicItemCount, setMagicItemCount] = useState(0);
  const [isMagicModeActive, setIsMagicModeActive] = useState(false);

  // Magic Item Generation Timer
  useEffect(() => {
    if (gameState === 'START' || gameState === 'GAME_OVER_DEAL' || gameState === 'GAME_OVER_NO_DEAL') {
      return;
    }
    const interval = setInterval(() => {
      setMagicItemCount(prev => Math.min(prev + 1, 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const toggleMagicMode = useCallback(() => {
    if (magicItemCount > 0 && (gameState === 'OPEN_CASES' || gameState === 'SELECT_MINE')) {
      setIsMagicModeActive(prev => !prev);
    }
  }, [magicItemCount, gameState]);

  const startGame = useCallback(() => {
    playTheme();
    const shuffledAmounts = shuffleArray([...AMOUNTS]);
    const initialCases: BriefcaseType[] = Array.from({ length: TOTAL_CASES }, (_, i) => ({
      id: i + 1,
      amount: shuffledAmounts[i],
      isOpened: false,
    }));
    
    setCases(initialCases);
    setMyCaseId(null);
    setCurrentRound(0);
    setCasesOpenedThisRound(0);
    setBankerOffer(0);
    setRevealingCase(null);
    setWinnings(null);
    setIsBankerCalling(false);
    setGameState('SELECT_MINE');
    setMagicItemCount(0);
    setIsMagicModeActive(false);
  }, []);

  const selectCase = useCallback((id: number) => {
    if (isMagicModeActive) {
      const selectedCase = cases.find(c => c.id === id);
      if (!selectedCase || selectedCase.isOpened || selectedCase.isRevealedByMagic) return;

      setCases(prev => prev.map(c => c.id === id ? { ...c, isRevealedByMagic: true } : c));
      setMagicItemCount(prev => prev - 1);
      setIsMagicModeActive(false);
      return;
    }

    if (gameState === 'SELECT_MINE') {
      setMyCaseId(id);
      setGameState('OPEN_CASES');
      return;
    }

    if (gameState === 'OPEN_CASES' && id !== myCaseId) {
      const selectedCase = cases.find(c => c.id === id);
      if (!selectedCase || selectedCase.isOpened) return;

      // Reveal the case
      playOpenCase();
      setGameState('CASE_REVEAL');
      setRevealingCase(selectedCase);

      setTimeout(() => {
        setCases(prev => prev.map(c => c.id === id ? { ...c, isOpened: true } : c));
        setRevealingCase(null);

        const newOpenedThisRound = casesOpenedThisRound + 1;
        const casesToOpenRound = ROUND_SCHEDULE[currentRound];
        
        if (newOpenedThisRound >= casesToOpenRound) {
          // Time for banker offer
          playRing();
          setIsBankerCalling(true);
          setGameState('BANKER_CALLING');
          
          const remainingAmounts = cases
            .filter(c => !c.isOpened && c.id !== id) // include the newly opened one as opened
            .map(c => c.amount);
          const offer = calculateBankerOffer(remainingAmounts, currentRound);
          
          setTimeout(() => {
            setIsBankerCalling(false);
            setCasesOpenedThisRound(newOpenedThisRound); // keep sync just in case
            
            // Calc offer based on remaining
            // Have to use the updated cases array here, but we can't reliably read state directly in timeout without a ref, 
            // so we calc based on mapping
            setCases(currentCases => {
              setBankerOffer(offer);
              setGameState('BANKER_OFFER');
              return currentCases;
            });

          }, 3000);
        } else {
          setCasesOpenedThisRound(newOpenedThisRound);
          setGameState('OPEN_CASES');
        }
      }, 2500); // Reveal duration
    }
  }, [gameState, cases, myCaseId, casesOpenedThisRound, currentRound, isMagicModeActive, magicItemCount]);


  const handleDeal = useCallback(() => {
    playDeal();
    setWinnings(bankerOffer);
    setGameState('GAME_OVER_DEAL');
  }, [bankerOffer]);

  const handleNoDeal = useCallback(() => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setCasesOpenedThisRound(0);

    if (nextRound >= ROUND_SCHEDULE.length) {
      // 2 cases left
      setGameState('FINAL_CHOICE');
    } else {
      setGameState('OPEN_CASES');
    }
  }, [currentRound]);

  const handleFinalChoice = useCallback((keep: boolean) => {
    playDeal();
    const remainingCases = cases.filter(c => !c.isOpened);
    const myActualCase = remainingCases.find(c => c.id === myCaseId)!;
    const otherCase = remainingCases.find(c => c.id !== myCaseId)!;

    if (keep) {
      setWinnings(myActualCase.amount);
    } else {
      setWinnings(otherCase.amount);
    }
    
    // Open all remaining
    setCases(prev => prev.map(c => ({ ...c, isOpened: true })));
    setGameState('GAME_OVER_NO_DEAL');
  }, [cases, myCaseId]);

  const remainingCasesToOpen = ROUND_SCHEDULE[currentRound] - casesOpenedThisRound;

  return {
    gameState,
    cases,
    myCaseId,
    currentRound,
    casesOpenedThisRound,
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
  };
}
