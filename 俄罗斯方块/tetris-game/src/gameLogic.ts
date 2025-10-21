import type { Board, Tetromino, Position } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from './constants';

export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
};

export const getRandomTetromino = (): Tetromino => {
  const types = Object.keys(TETROMINOES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  return { ...TETROMINOES[randomType] };
};

export const isValidMove = (
  board: Board,
  piece: Tetromino,
  position: Position
): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const mergePieceToBoard = (
  board: Board,
  piece: Tetromino,
  position: Position
): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== null)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
};

export const rotatePiece = (piece: Tetromino): Tetromino => {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  return { ...piece, shape: newShape };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};
