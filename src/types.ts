export type GameState = 
  | 'START'
  | 'SELECT_MINE'
  | 'OPEN_CASES'
  | 'CASE_REVEAL'
  | 'BANKER_CALLING'
  | 'BANKER_OFFER'
  | 'FINAL_CHOICE'
  | 'GAME_OVER_DEAL'
  | 'GAME_OVER_NO_DEAL';

export interface BriefcaseType {
  id: number;
  amount: number;
  isOpened: boolean;
  isRevealedByMagic?: boolean;
}

export interface GameContextType {
  gameState: GameState;
  cases: BriefcaseType[];
  myCaseId: number | null;
  currentRound: number;
  casesOpenedThisRound: number;
  bankerOffer: number;
  revealingCase: BriefcaseType | null;
  winnings: number | null;
  isBankerCalling: boolean;
}
