import './GameInfo.css';

interface GameInfoProps {
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  score,
  level,
  gameOver,
  isPaused,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="game-info">
      <h2>俄罗斯方块</h2>
      <div className="stats">
        <div className="stat">
          <span>得分:</span>
          <span>{score}</span>
        </div>
        <div className="stat">
          <span>等级:</span>
          <span>{level}</span>
        </div>
      </div>
      <div className="controls">
        {gameOver ? (
          <button onClick={onReset}>重新开始</button>
        ) : (
          <>
            <button onClick={onStart}>开始</button>
            <button onClick={onPause}>{isPaused ? '继续' : '暂停'}</button>
            <button onClick={onReset}>重置</button>
          </>
        )}
      </div>
      {gameOver && <div className="game-over">游戏结束!</div>}
      {isPaused && !gameOver && <div className="paused">已暂停</div>}
      <div className="instructions">
        <h3>控制说明:</h3>
        <p>← → : 移动</p>
        <p>↑ : 旋转</p>
        <p>↓ : 加速下落</p>
        <p>空格 : 直接落地</p>
      </div>
    </div>
  );
};
