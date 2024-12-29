import React from 'react';

interface StageProps {
  angle: number;
  targetAngle: number;
  isCorrect: boolean;
}

export const Stage: React.FC<StageProps> = ({ angle, targetAngle, isCorrect }) => {
  return (
    <div className="relative w-64 h-64 border-4 border-gray-200 rounded-full">
      {/* 中心点标记 */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* 当前角度线 */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-32 bg-blue-500 origin-bottom transform -translate-x-1/2 transition-transform duration-200"
        style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
      />
      
      {/* 目标角度线 */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-32 bg-gray-300 origin-bottom opacity-30 transform -translate-x-1/2"
        style={{ transform: `translate(-50%, -100%) rotate(${targetAngle}deg)` }}
      />
      
      {/* 正确提示 */}
      {isCorrect && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-4xl">🎉</span>
        </div>
      )}
    </div>
  );
};