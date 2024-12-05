import { useState, useEffect } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  const className = value ? `square ${value}` : 'square';  // 根据棋子的值动态添加 'X' 或 'O'
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const boardSize = 15;  // 15x15的五子棋棋盘

  const handleClick = (i, event) => {
    // 阻止浏览器的默认滚动行为
    event.preventDefault();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    return <Square key={i} value={squares[i]} onSquareClick={(event) => handleClick(i, event)} />;
  };

  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const cols = [];
    for (let col = 0; col < boardSize; col++) {
      cols.push(renderSquare(row * boardSize + col));
    }
    rows.push(
      <div key={row} className="board-row">
        {cols}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]); // 15x15棋盘，总共有225个格子
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // 页面加载或每次移动后滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0); // 强制页面滚动到顶部
  }, [currentMove]);

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const boardSize = 15;
  const directions = [
    { x: 1, y: 0 }, // 水平
    { x: 0, y: 1 }, // 垂直
    { x: 1, y: 1 }, // 主对角线
    { x: 1, y: -1 }, // 副对角线
  ];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const currentPlayer = squares[i * boardSize + j];
      if (!currentPlayer) continue; // 如果当前位置没有棋子，跳过

      for (let { x, y } of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
          const nx = i + step * x;
          const ny = j + step * y;
          if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && squares[nx * boardSize + ny] === currentPlayer) {
            count++;
          } else {
            break;
          }
        }
        for (let step = 1; step < 5; step++) {
          const nx = i - step * x;
          const ny = j - step * y;
          if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && squares[nx * boardSize + ny] === currentPlayer) {
            count++;
          } else {
            break;
          }
        }
        if (count >= 5) {
          return currentPlayer;
        }
      }
    }
  }

  return null;
}
