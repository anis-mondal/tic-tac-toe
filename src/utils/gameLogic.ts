
import { SquareValue, Player } from '../types';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const evaluateBoard = (squares: SquareValue[], aiPlayer: Player) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a] === aiPlayer ? 10 : -10;
  }
  return 0;
};

export const minimax = (squares: SquareValue[], depth: number, isMaximizing: boolean, aiPlayer: Player): number => {
  const score = evaluateBoard(squares, aiPlayer);
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!squares.includes(null)) return 0;
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = aiPlayer;
        best = Math.max(best, minimax(squares, depth + 1, false, aiPlayer));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = humanPlayer;
        best = Math.min(best, minimax(squares, depth + 1, true, aiPlayer));
        squares[i] = null;
      }
    }
    return best;
  }
};

export const findBestMove = (squares: SquareValue[], aiPlayer: Player) => {
  const availableMoves: number[] = [];
  for (let i = 0; i < 9; i++) if (!squares[i]) availableMoves.push(i);
  if (availableMoves.length === 9) return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
  
  let bestVal = -Infinity;
  let bestMove = availableMoves[0];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = aiPlayer;
      let moveVal = minimax(squares, 0, false, aiPlayer);
      squares[i] = null;
      if (moveVal > bestVal) { bestMove = i; bestVal = moveVal; }
    }
  }
  return bestMove;
};

export const blendDarker = (hex: string, factor: number) => {
    if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;
    let r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    let g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    let b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
