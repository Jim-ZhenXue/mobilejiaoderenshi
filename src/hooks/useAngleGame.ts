import { useState, useCallback } from 'react';
import { levels } from '../data/levels';
import { checkAngleMatch, normalizeAngle } from '../utils/angleUtils';
import { calculateScore, updateLevelScore } from '../utils/scoreUtils';
import { GameState, LevelScore } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

const initializeLevelScores = (): LevelScore[] => {
  return levels.map((_, index) => ({
    levelId: index,
    hasScored: false,
    attempts: 0
  }));
};

const initialGameState: GameState = {
  currentLevel: 0,
  angle: 0,
  isCorrect: false,
  totalScore: 0,
  levelScores: initializeLevelScores(),
  isGameComplete: false
};

export const useAngleGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const handleAngleChange = useCallback((newAngle: number) => {
    const normalizedAngle = normalizeAngle(newAngle);
    const targetAngle = levels[gameState.currentLevel].targetAngle;
    
    const matched = checkAngleMatch(normalizedAngle, targetAngle, GAME_CONFIG.angleTolerance);
    const currentLevelScore = gameState.levelScores[gameState.currentLevel];

    setGameState(prevState => {
      if (matched && !currentLevelScore.hasScored) {
        const updatedLevelScores = updateLevelScore(
          prevState.levelScores,
          prevState.currentLevel
        );

        return {
          ...prevState,
          angle: normalizedAngle,
          isCorrect: true,
          totalScore: calculateScore(updatedLevelScores),
          levelScores: updatedLevelScores
        };
      }

      return {
        ...prevState,
        angle: normalizedAngle,
        isCorrect: matched
      };
    });
  }, [gameState.currentLevel, gameState.levelScores]);

  const nextLevel = useCallback(() => {
    if (gameState.currentLevel < levels.length - 1) {
      setGameState(prevState => ({
        ...prevState,
        currentLevel: prevState.currentLevel + 1,
        angle: 0,
        isCorrect: false
      }));
    } else {
      setGameState(prevState => ({
        ...prevState,
        isGameComplete: true
      }));
    }
  }, [gameState.currentLevel]);

  const restartGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return {
    currentLevel: gameState.currentLevel,
    angle: gameState.angle,
    isCorrect: gameState.isCorrect,
    score: gameState.totalScore,
    isGameComplete: gameState.isGameComplete,
    handleAngleChange,
    nextLevel,
    restartGame,
  };
};