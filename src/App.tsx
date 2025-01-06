import { GameCanvas } from './components/GameCanvas';
import { Instructions } from './components/Instructions';
import { Controls } from './components/Controls';
import { Celebration } from './components/Celebration';
import { FinalScore } from './components/FinalScore';
import { levels } from './data/levels';
import { useAngleGame } from './hooks/useAngleGame';
import { useState } from 'react';

function App() {
  const {
    currentLevel,
    angle,
    isCorrect,
    score,
    isGameComplete,
    handleAngleChange,
    nextLevel,
  } = useAngleGame();

  const [showFinalScore, setShowFinalScore] = useState(false);

  if (showFinalScore) {
    return <FinalScore />;
  }

  return (
    <div className="min-h-screen bg-black p-5">
      <div className="max-w-4xl mx-auto rounded-xl p-5">
        <h1 className="text-2xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient">
            转转乐
          </span>
          <span className="text-purple-600">角度探险</span>
        </h1>
        
        <div className="mb-4">
          <Instructions level={levels[currentLevel]} />
        </div>

        <div className="flex justify-center mb-4">
          <GameCanvas 
            angle={angle}
            targetAngle={levels[currentLevel].targetAngle}
            isCorrect={isCorrect}
            onDragMove={handleAngleChange}
          />
        </div>

        <Controls 
          angle={angle}
          onAngleChange={handleAngleChange}
          onNextLevel={nextLevel}
          isCorrect={isCorrect}
          score={score}
          level={currentLevel + 1}
        />
      </div>

      {isGameComplete && (
        <Celebration 
          onFinish={() => setShowFinalScore(true)}
          score={score}
        />
      )}
    </div>
  );
}

export default App;