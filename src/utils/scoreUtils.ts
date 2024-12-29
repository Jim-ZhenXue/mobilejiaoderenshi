import { LevelScore } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

export const calculateScore = (levelScores: LevelScore[]): number => {
  return levelScores.reduce((total, level) => {
    return level.hasScored ? total + GAME_CONFIG.pointsPerLevel : total;
  }, 0);
};

export const updateLevelScore = (
  levelScores: LevelScore[],
  currentLevel: number
): LevelScore[] => {
  return levelScores.map((score, index) => {
    if (index === currentLevel && !score.hasScored) {
      return {
        ...score,
        hasScored: true,
        attempts: score.attempts + 1
      };
    }
    return score;
  });
};