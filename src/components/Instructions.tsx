import React, { useState } from 'react';
import { Level } from '../data/levels';

interface InstructionsProps {
  level: Level;
}

export const Instructions: React.FC<InstructionsProps> = ({ level }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const instruction = level.instruction
    .replace(/直角/g, '<span class="animate-gradient">直角</span>')
    .replace(/平角/g, '<span class="animate-gradient">平角</span>')
    .replace(/优角/g, '<span class="animate-gradient">优角</span>')
    .replace(/周角/g, '<span class="animate-gradient">周角</span>')
    .replace(/(\d+)度角/g, '<span class="animate-gradient">$1度角</span>');

  return (
    <div className="p-3">
      <div className="relative">
        {/* 移除了标题，保留提示功能 */}
        {showTooltip && (
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] p-2 bg-black/80 rounded-lg text-sm text-white text-center"
          >
            拖动红色圆点或使用微调按钮调整角度，使红线与灰线重合。当重合的时候，红线就会变成绿色
          </div>
        )}
      </div>
      <p className="text-yellow-400 text-2xl [&_.animate-gradient]:inline-block [&_.animate-gradient]:bg-gradient-to-r [&_.animate-gradient]:from-pink-500 [&_.animate-gradient]:via-purple-500 [&_.animate-gradient]:to-indigo-500 [&_.animate-gradient]:bg-clip-text [&_.animate-gradient]:text-transparent [&_.animate-gradient]:bg-[length:200%_auto] [&_.animate-gradient]:animate-gradient [&_.animate-gradient]:px-1 [&_.animate-gradient]:py-0.5">
        <span dangerouslySetInnerHTML={{ __html: instruction }}></span>
        <span 
          className="inline-flex items-center cursor-pointer ml-6 scale-[2.4]"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <svg 
            className="w-5 h-5 text-yellow-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
        </span>
      </p>
    </div>
  );
};