export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

export type Board = (string | null)[][];

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  position: Position;
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}
