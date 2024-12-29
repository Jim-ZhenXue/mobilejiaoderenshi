export interface LevelScore {
  levelId: number;
  hasScored: boolean;
  attempts: number;
}

export interface GameState {
  currentLevel: number;
  angle: number;
  isCorrect: boolean;
  totalScore: number;
  levelScores: LevelScore[];
  isGameComplete: boolean;
}

export interface GameConfig {
  pointsPerLevel: number;
  angleTolerance: number;
  angleAdjustment: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  radius: number;
  tickCount: number;
  mainTickInterval: number;
  tickLengths: {
    main: number;
    minor: number;
  };
}