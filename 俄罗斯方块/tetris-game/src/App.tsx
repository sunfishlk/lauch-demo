import { useEffect } from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { useGameLogic } from './hooks/useGameLogic';
import './App.css';

function App() {
  const {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    startGame,
    pauseGame,
    resetGame,
  } = useGameLogic();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.isPaused, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  return (
    <div className="app">
      <div className="game-container">
        <Board
          board={gameState.board}
          currentPiece={gameState.currentPiece}
          position={gameState.position}
        />
        <GameInfo
          score={gameState.score}
          level={gameState.level}
          gameOver={gameState.gameOver}
          isPaused={gameState.isPaused}
          onStart={startGame}
          onPause={pauseGame}
          onReset={resetGame}
        />
      </div>
    </div>
  );
}

export default App;
