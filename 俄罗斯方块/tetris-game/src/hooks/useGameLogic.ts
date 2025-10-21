import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Position } from '../types';
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  calculateScore,
} from '../gameLogic';

const INITIAL_POSITION: Position = { x: 3, y: 0 };

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    position: INITIAL_POSITION,
    score: 0,
    level: 0,
    gameOver: false,
    isPaused: true,
  });

  const gameLoopRef = useRef<number>(0);

  const spawnNewPiece = useCallback(() => {
    const newPiece = getRandomTetromino();
    const startPosition = INITIAL_POSITION;

    setGameState(prev => {
      if (!isValidMove(prev.board, newPiece, startPosition)) {
        return { ...prev, gameOver: true, isPaused: true };
      }
      return {
        ...prev,
        currentPiece: newPiece,
        position: startPosition,
      };
    });
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { x: prev.position.x, y: prev.position.y + 1 };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      }

      const newBoard = mergePieceToBoard(prev.board, prev.currentPiece, prev.position);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + calculateScore(linesCleared, prev.level);
      const newLevel = Math.floor(newScore / 1000);

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: null,
        score: newScore,
        level: newLevel,
      };
    });
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { x: prev.position.x - 1, y: prev.position.y };
      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      }
      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { x: prev.position.x + 1, y: prev.position.y };
      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      }
      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const rotatedPiece = rotatePiece(prev.currentPiece);
      if (isValidMove(prev.board, rotatedPiece, prev.position)) {
        return { ...prev, currentPiece: rotatedPiece };
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      let newY = prev.position.y;
      while (isValidMove(prev.board, prev.currentPiece, { x: prev.position.x, y: newY + 1 })) {
        newY++;
      }

      const newBoard = mergePieceToBoard(prev.board, prev.currentPiece, { x: prev.position.x, y: newY });
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + calculateScore(linesCleared, prev.level);
      const newLevel = Math.floor(newScore / 1000);

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: null,
        score: newScore,
        level: newLevel,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: null,
      position: INITIAL_POSITION,
      score: 0,
      level: 0,
      gameOver: false,
      isPaused: true,
    });
  }, []);

  useEffect(() => {
    if (!gameState.currentPiece && !gameState.gameOver && !gameState.isPaused) {
      spawnNewPiece();
    }
  }, [gameState.currentPiece, gameState.gameOver, gameState.isPaused, spawnNewPiece]);

  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    const speed = Math.max(100, 1000 - gameState.level * 100);
    gameLoopRef.current = setInterval(moveDown, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, gameState.gameOver, gameState.level, moveDown]);

  return {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    startGame,
    pauseGame,
    resetGame,
  };
};
