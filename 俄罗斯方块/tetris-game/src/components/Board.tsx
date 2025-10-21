import type { Board as BoardType, Tetromino, Position } from '../types';
import './Board.css';

interface BoardProps {
  board: BoardType;
  currentPiece: Tetromino | null;
  position: Position;
}

export const Board: React.FC<BoardProps> = ({ board, currentPiece, position }) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < displayBoard.length && boardX >= 0 && boardX < displayBoard[0].length) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const displayBoard = renderBoard();

  return (
    <div className="board">
      {displayBoard.map((row, y) => (
        <div key={y} className="board-row">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="board-cell"
              style={{ backgroundColor: cell || '#1a1a1a' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
