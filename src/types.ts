export type GameStage = 
  | 'intro'
  | 'quest1_code'
  | 'quest2_coin'
  | 'quest3_mine'
  | 'quest4_core'
  | 'cinematic'
  | 'scroll_animation'
  | 'reveal';

export interface GameState {
  stage: GameStage;
  xp: number;
  maxStageXp: number;
  hearts: number;
  soundEnabled: boolean;
  startTime: number;
  elapsedSeconds: number;
  cluesInspected: {
    tablet: boolean;
    chest: boolean;
    torch: boolean;
  };
  coinFound: boolean;
  blockBroken: boolean;
  buttonChaseCount: number;
}
