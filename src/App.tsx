/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Moon, Sun, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- Minimax AI Logic Start ---
const evaluateBoard = (squares: SquareValue[]) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] === 'O' ? 10 : -10;
    }
  }
  return 0;
};

const minimax = (squares: SquareValue[], depth: number, isMaximizing: boolean): number => {
  const score = evaluateBoard(squares);

  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!squares.includes(null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        best = Math.max(best, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'X';
        best = Math.min(best, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return best;
  }
};

const findBestMove = (squares: SquareValue[]) => {
  const availableMoves: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) availableMoves.push(i);
  }

  if (availableMoves.length === 9) {
    const firstMoves = [0, 2, 4, 6, 8];
    return firstMoves[Math.floor(Math.random() * firstMoves.length)];
  }

  // 30% randomness to give the player a chance to win
  if (Math.random() < 0.3) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = 'O';
      let moveVal = minimax(squares, 0, false);
      squares[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
};
// --- Minimax AI Logic End ---

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [linePoints, setLinePoints] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const myConfettiRef = useRef<confetti.CreateTypes | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // 6 seconds precise fireworks animation
  const fireConfetti = (winner: Player) => {
    if (!canvasRef.current) return;
    
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    myConfettiRef.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });

    // Specific colors based on winner
    const colors = winner === 'X' 
      ? ['#ba1a1a', '#ff0000', '#ff4d4d', '#990000'] 
      : ['#0b57d0', '#0000ff', '#4d4dff', '#000099']; 

    const duration = 6000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
        return;
      }

      const particleCount = 60 * (timeLeft / duration);
      
      myConfettiRef.current?.({
        particleCount,
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: colors,
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.4) }
      });
    }, 250);
  };

  useEffect(() => {
    let hasWinner = false;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a] as Player;
        setWinnerInfo({ winner, line: combination });
        fireConfetti(winner);
        hasWinner = true;
        break;
      }
    }

    if (!hasWinner && !board.includes(null)) {
      setIsDraw(true);
    }
  }, [board]);

  // AI Turn Handling
  useEffect(() => {
    if (isSinglePlayer && !isXNext && !winnerInfo && !isDraw) {
      const aiTimer = setTimeout(() => {
        const bestMove = findBestMove([...board]);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 500); 
      
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo) return;
    if (isSinglePlayer && !isXNext) return; 

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
    setIsDraw(false);
    setLinePoints(null); 
  };

  const handlePointerDown = () => {
    const isBoardEmpty = board.every((cell) => cell === null);
    if (isBoardEmpty && !winnerInfo) {
      pressTimer.current = setTimeout(() => {
        setIsXNext((prev) => !prev);
        if (navigator.vibrate) navigator.vibrate(50);
      }, 600); 
    }
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  useEffect(() => {
    const updatePoints = () => {
      if (winnerInfo && boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const getCellCenter = (idx: number) => {
          const cell = boardRef.current?.querySelector(`#cell-${idx}`);
          if (!cell) return { x: 50, y: 50 };
          const rect = cell.getBoundingClientRect();
          return {
            x: ((rect.left + rect.width / 2) - boardRect.left) / boardRect.width * 100,
            y: ((rect.top + rect.height / 2) - boardRect.top) / boardRect.height * 100
          };
        };

        const [start, , end] = winnerInfo.line;
        setLinePoints({ start: getCellCenter(start), end: getCellCenter(end) });
      } else {
        setLinePoints(null);
      }
    };

    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 bg-surface selection:bg-primary/20 transition-colors duration-300 relative overflow-hidden">
      
      {/* Full screen canvas that doesn't block touch events */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-[100]" 
      />

      <nav className="fixed top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={resetGame}
            className="p-3 px-5 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline/20 transition-all active:scale-95 shadow-md border border-outline/20 flex items-center gap-2 font-bold text-sm"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">New Match</span>
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline/20 transition-all active:scale-95 shadow-md border border-outline/20"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <header className="mb-4 text-center space-y-5 pt-16 z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight text-on-surface font-display drop-shadow-sm"
        >
          Tic-Tac-Toe
        </motion.h1>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setIsSinglePlayer(true); resetGame(); }}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border border-outline/20 ${isSinglePlayer ? 'bg-mark-o text-white shadow-md scale-105' : 'bg-surface-variant text-on-surface-variant hover:bg-outline/10'}`}
          >
            🤖 1 Player (AI)
          </button>
          <button
            onClick={() => { setIsSinglePlayer(false); resetGame(); }}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border border-outline/20 ${!isSinglePlayer ? 'bg-mark-x text-white shadow-md scale-105' : 'bg-surface-variant text-on-surface-variant hover:bg-outline/10'}`}
          >
            👥 2 Players
          </button>
        </div>

        <motion.div 
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            px-8 py-3 rounded-full text-xl font-semibold inline-flex flex-col items-center gap-1 shadow-sm transition-all duration-300 select-none
            ${winnerInfo ? 'bg-success-container text-on-success-container border-2 border-mark-o scale-105' : 'bg-container text-on-container border border-outline/10'}
            ${board.every(cell => cell === null) && !winnerInfo ? 'cursor-pointer active:scale-95' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {winnerInfo ? (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Winner: Player {winnerInfo.winner}!</span>
              </>
            ) : isDraw ? (
              "It's a Stalemate!"
            ) : (
              <>
                {isSinglePlayer && !isXNext ? 'AI is thinking...' : (
                  <>
                    Player{' '}
                    <span className={`inline-block font-black text-2xl px-1 ${isXNext ? 'text-mark-x' : 'text-mark-o'}`}>
                      {isXNext ? 'X' : 'O'}
                    </span>
                    's turn
                  </>
                )}
              </>
            )}
          </div>
          
          {board.every(cell => cell === null) && !winnerInfo && (
            <span className="text-xs opacity-60 font-normal">Hold to switch first player</span>
          )}
        </motion.div>
      </header>

      <div className="relative group z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-surface-variant p-5 sm:p-6 rounded-[32px] shadow-lg border border-outline/20"
        >
          <div 
            ref={boardRef} 
            className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 relative z-10 w-[280px] sm:w-[340px] aspect-square"
          >
            {board.map((value, i) => {
              const isWinningCell = winnerInfo?.line.includes(i);
              
              const cellBg = isWinningCell 
                ? (winnerInfo.winner === 'X' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30')
                : 'bg-surface';

              return (
                <button
                  key={i}
                  id={`cell-${i}`}
                  onClick={() => handleClick(i)}
                  className={`
                    w-full h-full rounded-[20px] flex items-center justify-center
                    transition-all duration-200 relative overflow-hidden
                    shadow-sm border border-outline/10
                    ${cellBg}
                    ${!value && !winnerInfo && (!isSinglePlayer || isXNext) ? 'hover:bg-surface-variant/60 cursor-pointer active:scale-95' : 'cursor-default'}
                  `}
                  disabled={!!value || !!winnerInfo || (isSinglePlayer && !isXNext)}
                >
                  <AnimatePresence mode="wait">
                    {value === 'X' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M18 6L6 18M6 6L18 18" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-mark-x"
                          />
                        </svg>
                      </motion.div>
                    )}
                    {value === 'O' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle 
                            cx="12" cy="12" r="9" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            className="text-mark-o"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {linePoints && winnerInfo && (
              <svg 
                className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  x1={`${linePoints.start.x}%`}
                  y1={`${linePoints.start.y}%`}
                  x2={`${linePoints.end.x}%`}
                  y2={`${linePoints.end.y}%`}
                  stroke={winnerInfo.winner === 'X' ? '#ba1a1a' : '#0b57d0'} 
                  strokeWidth="6"
                  strokeLinecap="round"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
