import React from 'react';
import { Level } from '../data/levels';

interface InstructionsProps {
  level: Level;
}

export const Instructions: React.FC<InstructionsProps> = ({ level }) => {
  const instruction = level.instruction
  .replace(/直角/g, '<span class="animate-gradient">直角</span>')
  .replace(/平角/g, '<span class="animate-gradient">平角</span>')
  .replace(/优角/g, '<span class="animate-gradient">优角</span>')
  .replace(/周角/g, '<span class="animate-gradient">周角</span>')
  .replace(/(\d+)度角/g, '<span class="animate-gradient">$1度角</span>');

  return (
    <div className="bg-yellow-50 p-3 rounded-lg">
      <h2 className="text-lg font-bold mb-2">任务说明</h2>
      <p dangerouslySetInnerHTML={{ __html: instruction }} className="[&_.animate-gradient]:inline-block [&_.animate-gradient]:bg-gradient-to-r [&_.animate-gradient]:from-pink-500 [&_.animate-gradient]:via-purple-500 [&_.animate-gradient]:to-indigo-500 [&_.animate-gradient]:bg-clip-text [&_.animate-gradient]:text-transparent [&_.animate-gradient]:bg-[length:200%_auto] [&_.animate-gradient]:animate-gradient"></p>
      <p className="mt-2 text-sm text-gray-600">
        提示：拖动红色圆点或使用按钮调整角度，使红线与灰线重合。当重合的时候，红线就会变成绿色
      </p>
    </div>
  );
};