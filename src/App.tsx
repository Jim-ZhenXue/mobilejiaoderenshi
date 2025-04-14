import { GameCanvas } from './components/GameCanvas';
import { Instructions } from './components/Instructions';
import { Controls } from './components/Controls';
import { Celebration } from './components/Celebration';
import { FinalScore } from './components/FinalScore';
import { levels } from './data/levels';
import { useAngleGame } from './hooks/useAngleGame';
import { useState, useEffect } from 'react';
import soundManager from './utils/soundManager';

function App() {
  const {
    currentLevel,
    angle,
    totalRotation, // 获取累积旋转角度
    isCorrect,
    score,
    isGameComplete,
    handleAngleChange,
    nextLevel,
  } = useAngleGame();

  const [showFinalScore, setShowFinalScore] = useState(false);

  // Play sounds based on game state changes
  useEffect(() => {
    if (isCorrect) {
      soundManager.play('correct');
    }
  }, [isCorrect]);

  useEffect(() => {
    if (isGameComplete) {
      soundManager.play('gameComplete');
    }
  }, [isGameComplete]);

  const handleNextLevel = () => {
    soundManager.play('levelComplete');
    nextLevel();
  };

  const handleAngleChangeWithSound = (newAngle: number) => {
    // Only play rotate sound occasionally to avoid too many sounds
    if (Math.abs(newAngle - angle) > 10) {
      soundManager.play('rotate');
    }
    handleAngleChange(newAngle);
  };

  if (showFinalScore) {
    return <FinalScore />;
  }

  return (
    <div className="min-h-screen bg-black p-5 flex flex-col">
      <div className="w-full max-w-[1440px] mx-auto rounded-xl p-5">
        {/* 任务标签单独占一行且居中显示 */}
        <div className="flex justify-center mb-8">
          <div className="max-w-[800px]">
            <Instructions level={levels[currentLevel]} />
          </div>
        </div>
        
        {/* 游戏主要内容区域 */}
        <div className="flex justify-center gap-12 items-start translate-x-[25px]">
          <div className="w-[600px] flex flex-col">
            <div className="mt-auto">
              <Controls 
                angle={angle}
                onAngleChange={handleAngleChangeWithSound}
                onNextLevel={handleNextLevel}
                isCorrect={isCorrect}
                score={score}
                level={currentLevel + 1}
              />
            </div>
          </div>

          <div className="w-[600px] flex items-center justify-center">
            <GameCanvas 
              angle={angle}
              totalRotation={totalRotation} // 传递累积旋转角度
              targetAngle={levels[currentLevel].targetAngle}
              isCorrect={isCorrect}
              onDragMove={handleAngleChangeWithSound}
            />
          </div>
        </div>
      </div>

      {isGameComplete && (
        <Celebration 
          onFinish={() => {
            soundManager.play('click');
            setShowFinalScore(true);
          }}
          score={score}
        />
      )}
    </div>
  );
}

export default App;