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
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const hapticFeedback = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
    }
  }
};

const evaluateBoard = (squares: SquareValue[], aiPlayer: Player) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] === aiPlayer ? 10 : -10;
    }
  }
  return 0;
};

const minimax = (squares: SquareValue[], depth: number, isMaximizing: boolean, aiPlayer: Player): number => {
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

const findBestMove = (squares: SquareValue[], aiPlayer: Player) => {
  const availableMoves: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) availableMoves.push(i);
  }

  if (availableMoves.length === 9) {
    const firstMoves = [0, 2, 4, 6, 8];
    return firstMoves[Math.floor(Math.random() * firstMoves.length)];
  }

  if (Math.random() < 0.3) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = aiPlayer;
      let moveVal = minimax(squares, 0, false, aiPlayer);
      squares[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
};

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  const [isXNext, setIsXNext] = useState(true);
  
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [aiMovesFirst, setAiMovesFirst] = useState(false); 
  const [linePoints, setLinePoints] = useState<{ origin: { x: number; y: number }; start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const myConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const turnHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const modeHoldTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    hapticFeedback(40);
    setIsDarkMode(!isDarkMode);
  };

  const fireConfetti = (winner: Player) => {
    if (!canvasRef.current) return;
    
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    myConfettiRef.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });

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
        
        hapticFeedback([100, 50, 100, 50, 300]); 
        
        fireConfetti(winner);
        hasWinner = true;
        break;
      }
    }

    if (!hasWinner && !board.includes(null)) {
      hapticFeedback([200, 100, 200]);
      setIsDraw(true);
    }
  }, [board]);

  const aiPlayerSymbol = isSinglePlayer 
    ? (aiMovesFirst ? startingPlayer : (startingPlayer === 'X' ? 'O' : 'X')) 
    : null;

  const isAITurn = isSinglePlayer && 
                   aiPlayerSymbol && 
                   ((isXNext && aiPlayerSymbol === 'X') || (!isXNext && aiPlayerSymbol === 'O'));

  useEffect(() => {
    if (isAITurn && !winnerInfo && !isDraw) {
      const aiTimer = setTimeout(() => {
        const bestMove = findBestMove([...board], aiPlayerSymbol);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = aiPlayerSymbol;
          
          hapticFeedback(50); 
          
          setBoard(newBoard);
          setIsXNext(aiPlayerSymbol === 'O');
          setLastMoveIndex(bestMove);
        }
      }, 500); 
      
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw, aiPlayerSymbol, isAITurn]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo) return;
    if (isAITurn) return; 

    hapticFeedback(50); 

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setLastMoveIndex(index);
  };

  const resetGameForMode = (currentStartingPlayer: Player) => {
    hapticFeedback(40); 
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setBoard(Array(9).fill(null));
    setIsXNext(currentStartingPlayer === 'X');
    setWinnerInfo(null);
    setIsDraw(false);
    setLinePoints(null);
    setLastMoveIndex(null); 
  };

  const handleTurnHoldStart = () => {
    const isBoardEmpty = board.every((cell) => cell === null);
    if (isBoardEmpty && !winnerInfo) {
      turnHoldTimer.current = setTimeout(() => {
        setStartingPlayer((prev) => {
          const nextPlayer = prev === 'X' ? 'O' : 'X';
          setIsXNext(nextPlayer === 'X');
          return nextPlayer;
        });
        hapticFeedback([80, 40, 80]); 
      }, 600);
    }
  };

  const handleTurnHoldEnd = () => {
    if (turnHoldTimer.current) {
      clearTimeout(turnHoldTimer.current);
      turnHoldTimer.current = null;
    }
  };

  const handleModeHoldStart = () => {
    modeHoldTimer.current = setTimeout(() => {
      setAiMovesFirst(prev => {
        const nextVal = !prev;
        hapticFeedback([80, 40, 80]); 
        setIsSinglePlayer(true);
        return nextVal;
      });
      resetGameForMode(startingPlayer); 
    }, 600);
  };

  const handleModeHoldEnd = () => {
    if (modeHoldTimer.current) {
      clearTimeout(modeHoldTimer.current);
      modeHoldTimer.current = null;
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

        const [a, b, c] = winnerInfo.line;
        
        let originIdx = a;
        if (lastMoveIndex === c) originIdx = c;
        else if (lastMoveIndex === b) originIdx = b;
        else if (lastMoveIndex === a) originIdx = a;

        setLinePoints({ 
          origin: getCellCenter(originIdx), 
          start: getCellCenter(a), 
          end: getCellCenter(c) 
        });
      } else {
        setLinePoints(null);
      }
    };

    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo, lastMoveIndex]);

  const navBtnClass = "w-14 h-14 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline/20 transition-all active:scale-95 shadow-sm border border-outline/10 flex items-center justify-center";

  const getLineAnimProps = (points: { origin: { x: number, y: number }, start: { x: number, y: number }, end: { x: number, y: number } } | null) => {
    if (!points) return { initial: {}, animate: {} };
    return {
      initial: {
        x1: `${points.origin.x}%`,
        y1: `${points.origin.y}%`,
        x2: `${points.origin.x}%`,
        y2: `${points.origin.y}%`,
        opacity: 0
      },
      animate: {
        x1: `${points.start.x}%`,
        y1: `${points.start.y}%`,
        x2: `${points.end.x}%`,
        y2: `${points.end.y}%`,
        opacity: 1
      }
    };
  };

  const lineAnim = getLineAnimProps(linePoints);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 bg-surface selection:bg-primary/20 transition-colors duration-300 relative overflow-hidden font-sans">
      
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-[100]" 
      />

      <nav className="fixed top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => resetGameForMode(startingPlayer)}
            className={navBtnClass}
            aria-label="Restart Game"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={toggleDarkMode}
            className={navBtnClass}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <header className="mb-2 text-center space-y-6 pt-16 z-10 relative w-full max-w-md">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-black tracking-tighter text-on-surface drop-shadow-sm"
        >
          Tic Tac Toe
        </motion.h1>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { 
              hapticFeedback(40);
              setIsSinglePlayer(true); 
              resetGameForMode(startingPlayer); 
            }}
            onPointerDown={handleModeHoldStart}
            onPointerUp={handleModeHoldEnd}
            onPointerLeave={handleModeHoldEnd}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none ${
              isSinglePlayer 
                ? 'bg-[#6750A4] text-white shadow-md scale-105' 
                : 'bg-surface-variant text-on-surface-variant hover:bg-outline/10'
            }`}
          >
            {isSinglePlayer && aiMovesFirst ? '🤖 1 Player (AI First)' : '🤖 1 Player'}
          </button>
          
          <button
            onClick={() => { 
              hapticFeedback(40);
              setIsSinglePlayer(false); 
              resetGameForMode(startingPlayer); 
            }}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              !isSinglePlayer 
                ? 'bg-[#6750A4] text-white shadow-md scale-105' 
                : 'bg-surface-variant text-on-surface-variant hover:bg-outline/10'
            }`}
          >
            👥 2 Players
          </button>
        </div>

        <motion.div 
          onPointerDown={handleTurnHoldStart}
          onPointerUp={handleTurnHoldEnd}
          onPointerLeave={handleTurnHoldEnd}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            mx-auto w-fit px-8 py-4 rounded-[2rem] text-lg font-bold flex flex-col items-center gap-1 shadow-sm transition-all duration-300 select-none
            ${winnerInfo 
              ? 'bg-success-container text-on-success-container border-2 border-transparent scale-105' 
              : 'bg-container text-on-container border border-outline/10'}
            ${board.every(cell => cell === null) && !winnerInfo ? 'cursor-pointer active:scale-95 hover:bg-surface-variant/80' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {winnerInfo ? (
              <>
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span>Winner: Player {winnerInfo.winner}!</span>
              </>
            ) : isDraw ? (
              "It's a Stalemate!"
            ) : (
              <>
                {isAITurn ? 'AI is thinking...' : (
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
            <span className="text-[11px] opacity-70 font-medium tracking-wide uppercase mt-1">Hold to switch first player</span>
          )}
        </motion.div>
      </header>

      <div className="relative group z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-surface-variant/50 p-5 sm:p-6 rounded-[40px] shadow-lg border border-outline/20 backdrop-blur-md"
        >
          <div 
            ref={boardRef} 
            className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 relative z-10 w-[280px] sm:w-[340px] aspect-square"
          >
            {board.map((value, i) => {
              const isWinningCell = winnerInfo?.line.includes(i);
              
              const cellBg = isWinningCell 
                ? 'bg-green-100/50 dark:bg-green-900/30'
                : 'bg-surface';

              return (
                <button
                  key={i}
                  id={`cell-${i}`}
                  onClick={() => handleClick(i)}
                  className={`
                    w-full h-full rounded-[24px] flex items-center justify-center
                    transition-all duration-300 relative overflow-hidden
                    shadow-sm border border-outline/10
                    ${cellBg}
                    ${!value && !winnerInfo && !isAITurn ? 'hover:bg-surface-variant/80 hover:shadow-md cursor-pointer active:scale-95' : 'cursor-default'}
                  `}
                  disabled={!!value || !!winnerInfo || isAITurn}
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
                            className="text-mark-x drop-shadow-sm"
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
                            className="text-mark-o drop-shadow-sm"
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
                className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <mask id="hollow-mask" maskUnits="userSpaceOnUse">
                    <rect width="100%" height="100%" fill="white" />
                    <motion.line
                      initial={lineAnim.initial}
                      animate={{ ...lineAnim.animate, opacity: 1 }}
                      stroke="black"
                      strokeWidth="6"
                      strokeLinecap="round"
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </mask>
                </defs>

                <motion.line
                  initial={lineAnim.initial}
                  animate={lineAnim.animate}
                  stroke="#004d00" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  mask="url(#hollow-mask)"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                <motion.line
                  initial={lineAnim.initial}
                  animate={lineAnim.animate}
                  stroke="rgba(56, 142, 60, 0.40)"
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
