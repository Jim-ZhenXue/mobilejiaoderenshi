import { GameConfig, CanvasConfig } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  pointsPerLevel: 20,
  angleTolerance: 5,
  angleAdjustment: 1
} as const;

export const CANVAS_CONFIG: CanvasConfig = {
  width: 360,
  height: 360,
  radius: 135,
  tickCount: 36,
  mainTickInterval: 9,
  tickLengths: {
    main: 20,
    minor: 10
  }
} as const;