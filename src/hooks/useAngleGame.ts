import { useState, useCallback, useRef } from 'react';
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
  totalRotation: 0, // 初始化累积旋转角度
  isCorrect: false,
  totalScore: 0,
  levelScores: initializeLevelScores(),
  isGameComplete: false
};

export const useAngleGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const lastAngleRef = useRef<number>(0); // 用于跟踪上一次的角度位置

  const handleAngleChange = useCallback((newAngle: number) => {
    const normalizedAngle = normalizeAngle(newAngle);
    const targetAngle = levels[gameState.currentLevel].targetAngle;
    
    // 计算旋转角度变化
    const lastAngle = lastAngleRef.current;
    const angleDiff = calculateAngleDifference(lastAngle, normalizedAngle);
    lastAngleRef.current = normalizedAngle;
    
    // 基本角度匹配检查
    // 对于360度（或者说是0度）的特殊情况进行处理
    let basicAngleMatched = false;
    if (targetAngle === 360 || targetAngle === 0) {
      // 对于360度目标，允许正负5度的误差范围
      const tolerance = GAME_CONFIG.angleTolerance;
      basicAngleMatched = (
        (normalizedAngle >= 360 - tolerance && normalizedAngle <= 360) || // 355-360度
        (normalizedAngle >= 0 && normalizedAngle <= tolerance) // 0-5度
      );
    } else {
      // 其他角度使用正常的匹配检查
      basicAngleMatched = checkAngleMatch(normalizedAngle, targetAngle, GAME_CONFIG.angleTolerance);
    }
    
    const currentLevelScore = gameState.levelScores[gameState.currentLevel];

    setGameState(prevState => {
      // 累计旋转角度
      const newTotalRotation = prevState.totalRotation + angleDiff;
      
      // 检查是否多转了圈
      // 计算累积旋转的完整圈数
      const completeTurns = Math.floor(Math.abs(newTotalRotation) / 360);
      
      // 检查旋转方向 - 只允许顺时针旋转（正值）
      const isClockwiseRotation = newTotalRotation >= 0;
      
      // 判断是否为最后一关（目标角度为360度）
      const isLastLevel = gameState.currentLevel === levels.length - 1;
      
      // 在最后一关中，如果用户稍微超过360度，也算作正确答案
      let isExactMatch = false;
      
      if (isLastLevel && targetAngle === 360) {
        // 对于最后一关，允许用户超过360度一点点
        // 但仍然要求顺时针旋转
        isExactMatch = basicAngleMatched && isClockwiseRotation && (
          completeTurns === 0 || // 正好一圈
          (completeTurns === 1 && newTotalRotation <= 370) // 允许超过一圈但不超过370度
        );
      } else {
        // 其他关卡仍然使用原来的规则
        isExactMatch = basicAngleMatched && completeTurns === 0 && isClockwiseRotation;
      }
      
      if (isExactMatch && !currentLevelScore.hasScored) {
        const updatedLevelScores = updateLevelScore(
          prevState.levelScores,
          prevState.currentLevel
        );

        return {
          ...prevState,
          angle: normalizedAngle,
          totalRotation: newTotalRotation,
          isCorrect: true,
          totalScore: calculateScore(updatedLevelScores),
          levelScores: updatedLevelScores
        };
      }

      return {
        ...prevState,
        angle: normalizedAngle,
        totalRotation: newTotalRotation,
        isCorrect: isExactMatch
      };
    });
  }, [gameState.currentLevel, gameState.levelScores]);

  const nextLevel = useCallback(() => {
    if (gameState.currentLevel < levels.length - 1) {
      setGameState(prevState => ({
        ...prevState,
        currentLevel: prevState.currentLevel + 1,
        angle: 0,
        totalRotation: 0, // 重置累积旋转角度
        isCorrect: false
      }));
      lastAngleRef.current = 0; // 重置上一次角度参考
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

  // 计算两个角度之间的最短旋转差值
  const calculateAngleDifference = (from: number, to: number): number => {
    // 确保角度在0-360范围内
    from = normalizeAngle(from);
    to = normalizeAngle(to);
    
    // 计算顺时针和逆时针方向的差值
    let clockwise = to - from;
    if (clockwise < 0) clockwise += 360;
    
    let counterClockwise = from - to;
    if (counterClockwise < 0) counterClockwise += 360;
    
    // 返回绝对值较小的差值，保留符号表示方向
    return clockwise <= counterClockwise ? clockwise : -counterClockwise;
  };

  return {
    currentLevel: gameState.currentLevel,
    angle: gameState.angle,
    totalRotation: gameState.totalRotation, // 暴露累积旋转角度
    isCorrect: gameState.isCorrect,
    score: gameState.totalScore,
    isGameComplete: gameState.isGameComplete,
    handleAngleChange,
    nextLevel,
    restartGame,
  };
};