import React from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { GAME_CONFIG } from '../constants/game';
import soundManager from '../utils/soundManager';

interface ControlsProps {
  angle: number;
  onAngleChange: (angle: number) => void;
  onNextLevel: () => void;
  isCorrect: boolean;
  score: number;
  level: number;
}

export const Controls: React.FC<ControlsProps> = ({
  angle,
  onAngleChange,
  onNextLevel,
  isCorrect,
  score,
  level
}) => {
  const handleAngleDecrease = () => {
    soundManager.play('click');
    onAngleChange(angle - GAME_CONFIG.angleAdjustment);
  };

  const handleAngleIncrease = () => {
    soundManager.play('click');
    onAngleChange(angle + GAME_CONFIG.angleAdjustment);
  };

  const handleNextLevel = () => {
    soundManager.play('click');
    onNextLevel();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          onClick={handleAngleDecrease}
        >
          ↺ 微调
        </button>
        <span className="text-xl font-bold min-w-[80px] text-center">{Math.round(angle)}°</span>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          onClick={handleAngleIncrease}
        >
          微调 ↻
        </button>
      </div>
      
      <ScoreDisplay score={score} level={level} />

      {isCorrect && (
        <button
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors animate-fast-pulse"
          onClick={handleNextLevel}
        >
          下一关 →
        </button>
      )}
    </div>
  );
};