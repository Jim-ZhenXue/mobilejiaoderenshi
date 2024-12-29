import React from 'react';

interface ScoreDisplayProps {
  score: number;
  level: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, level }) => {
  return (
    <div className="flex gap-6 items-center">
      <div className="text-lg bg-purple-100 px-4 py-2 rounded-lg">
        关卡: <span className="font-bold">{level}</span>
      </div>
      <div className="text-lg bg-green-100 px-4 py-2 rounded-lg">
        得分: <span className="font-bold">{score}</span>
      </div>
    </div>
  );
};