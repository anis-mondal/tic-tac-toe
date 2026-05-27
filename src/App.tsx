/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Moon, Sun, Sparkles, Volume2, VolumeX, MoreVertical, X } from 'lucide-react';
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
    } catch (e) {}
  }
};

// --- Enhanced Sound System ---
const audioState = { ctx: null as AudioContext | null };
const playEnhancedSound = (type: 'tap' | 'win' | 'pop', enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    if (!audioState.ctx) {
      audioState.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioState.ctx.state === 'suspended') {
      audioState.ctx.resume();
    }
    const ctx = audioState.ctx;
    const t = ctx.currentTime;
    
    if (type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { 
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, t + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.5);
      });
    }
  } catch(e) {}
};

// --- Minimax AI ---
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
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (!squares[a] && squares[b] === aiPlayer && squares[c] === aiPlayer) return a;
    if (squares[a] === aiPlayer && !squares[b] && squares[c] === aiPlayer) return b;
    if (squares[a] === aiPlayer && squares[b] === aiPlayer && !squares[c]) return c;
  }
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (!squares[a] && squares[b] === humanPlayer && squares[c] === humanPlayer) return a;
    if (squares[a] === humanPlayer && !squares[b] && squares[c] === humanPlayer) return b;
    if (squares[a] === humanPlayer && squares[b] === humanPlayer && !squares[c]) return c;
  }
  if (Math.random() < 0.25) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  let bestVal = -Infinity;
  let bestMove = availableMoves[0];
  const trickWeights = [0.2, 0.0, 0.2, 0.0, 0.3, 0.0, 0.2, 0.0, 0.2];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = aiPlayer;
      let moveVal = minimax(squares, 0, false, aiPlayer);
      squares[i] = null;
      moveVal += trickWeights[i];
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
};

// --- Customization Data ---
const THEMES = [
  { name: 'Default', light: '#f4f7fb', dark: '#000000', gridLight: '#e2e8f0', gridDark: '#0c0c0c', cellLight: '#c0e9f8', cellDark: '#225b6c' },
  { name: 'Blue', light: '#e0f2fe', dark: '#020617', gridLight: '#bae6fd', gridDark: '#0f172a', cellLight: '#7dd3fc', cellDark: '#1e3a8a' },
  { name: 'Mint', light: '#f0fdfa', dark: '#042f2e', gridLight: '#ccfbf1', gridDark: '#134e4a', cellLight: '#99f6e4', cellDark: '#0f766e' },
  { name: 'Rose', light: '#fff1f2', dark: '#4c0519', gridLight: '#ffe4e6', gridDark: '#881337', cellLight: '#fecdd3', cellDark: '#e11d48' },
  { name: 'Purple', light: '#faf5ff', dark: '#2e1065', gridLight: '#f3e8ff', gridDark: '#4c1d95', cellLight: '#e9d5ff', cellDark: '#7e22ce' },
  { name: 'Sunset', light: '#fff7ed', dark: '#431407', gridLight: '#ffedd5', gridDark: '#7c2d12', cellLight: '#fed7aa', cellDark: '#c2410c' },
  { name: 'Forest', light: '#f0fdf4', dark: '#052e16', gridLight: '#dcfce7', gridDark: '#14532d', cellLight: '#bbf7d0', cellDark: '#15803d' },
  { name: 'Amber', light: '#fffbeb', dark: '#451a03', gridLight: '#fef3c7', gridDark: '#78350f', cellLight: '#fde68a', cellDark: '#d97706' },
  { name: 'Slate', light: '#f8fafc', dark: '#020617', gridLight: '#f1f5f9', gridDark: '#0f172a', cellLight: '#cbd5e1', cellDark: '#334155' },
  { name: 'Cherry', light: '#fef2f2', dark: '#450a0a', gridLight: '#fee2e2', gridDark: '#7f1d1d', cellLight: '#fca5a5', cellDark: '#b91c1c' },
];

const X_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
const O_COLORS = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#d946ef'];


export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  const [isXNext, setIsXNext] = useState(true);
  
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [aiMovesFirst, setAiMovesFirst] = useState(false); 
  const [linePoints, setLinePoints] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  
  const [rotation, setRotation] = useState(0);
  const [isHoldingBanner, setIsHoldingBanner] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [xColorIdx, setXColorIdx] = useState(0);
  const [oColorIdx, setOColorIdx] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark as per preference
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const myConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const turnHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const modeHoldTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const fireConfetti = (winner: Player) => {
    if (!canvasRef.current) return;
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    myConfettiRef.current = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    const colors = winner === 'X' ? [X_COLORS[xColorIdx], '#ffffff'] : [O_COLORS[oColorIdx], '#ffffff']; 
    const duration = 6000;
    const animationEnd = Date.now() + duration;

    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
        return;
      }
      myConfettiRef.current?.({
        particleCount: 60 * (timeLeft / duration),
        startVelocity: 35, spread: 360, ticks: 60, zIndex: 0, colors: colors,
        origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.3 + 0.1 }
      });
    }, 250);
  };

  useEffect(() => {
    if (isResetting) return;
    let hasWinner = false;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a] as Player;
        setWinnerInfo({ winner, line: combination });
        hapticFeedback([100, 50, 100, 50, 300]); 
        playEnhancedSound('win', isSoundOn);
        fireConfetti(winner);
        hasWinner = true;
        break;
      }
    }
    if (!hasWinner && !board.includes(null)) {
      hapticFeedback([200, 100, 200]);
      setIsDraw(true);
    }
  }, [board, isSoundOn, isResetting, xColorIdx, oColorIdx]);

  const aiPlayerSymbol = isSinglePlayer ? (aiMovesFirst ? startingPlayer : (startingPlayer === 'X' ? 'O' : 'X')) : null;
  const isAITurn = isSinglePlayer && aiPlayerSymbol && ((isXNext && aiPlayerSymbol === 'X') || (!isXNext && aiPlayerSymbol === 'O'));

  useEffect(() => {
    if (isAITurn && !winnerInfo && !isDraw && !isResetting) {
      const aiTimer = setTimeout(() => {
        const bestMove = findBestMove([...board], aiPlayerSymbol);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = aiPlayerSymbol;
          hapticFeedback(50); 
          playEnhancedSound('tap', isSoundOn);
          setBoard(newBoard);
          setIsXNext(aiPlayerSymbol === 'O');
        }
      }, 500); 
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw, aiPlayerSymbol, isAITurn, isSoundOn, isResetting]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo || isAITurn || isResetting) return;
    hapticFeedback(50); 
    playEnhancedSound('tap', isSoundOn);
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Reverse Animation Reset Logic
  const resetGameForMode = (currentStartingPlayer: Player) => {
    hapticFeedback(40); 
    playEnhancedSound('pop', isSoundOn);
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setIsResetting(true);
    
    // Wait for reverse animation to finish before clearing state
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setIsXNext(currentStartingPlayer === 'X');
      setWinnerInfo(null);
      setIsDraw(false);
      setLinePoints(null);
      setIsResetting(false);
    }, 550);
  };

  const handleTurnHoldStart = () => {
    if (board.every(cell => cell === null) && !winnerInfo) {
      setIsHoldingBanner(true);
      turnHoldTimer.current = setTimeout(() => {
        setStartingPlayer(prev => {
          const next = prev === 'X' ? 'O' : 'X';
          setIsXNext(next === 'X');
          return next;
        });
        hapticFeedback([80, 40, 80]); 
        setIsHoldingBanner(false);
      }, 600);
    }
  };

  const handleTurnHoldEnd = () => {
    setIsHoldingBanner(false);
    if (turnHoldTimer.current) clearTimeout(turnHoldTimer.current);
  };

  const handleModeHoldStart = () => {
    modeHoldTimer.current = setTimeout(() => {
      setAiMovesFirst(prev => {
        hapticFeedback([80, 40, 80]); 
        setIsSinglePlayer(true);
        return !prev;
      });
      resetGameForMode(startingPlayer); 
    }, 600);
  };

  const handleModeHoldEnd = () => {
    if (modeHoldTimer.current) clearTimeout(modeHoldTimer.current);
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
        const [a, , c] = winnerInfo.line;
        setLinePoints({ start: getCellCenter(a), end: getCellCenter(c) });
      } else {
        setLinePoints(null);
      }
    };
    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo]);

  const activeTheme = THEMES[themeIdx];
  const semantics = {
    screenBackground: isDarkMode ? activeTheme.dark : activeTheme.light,
    mainGridBackground: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
    squareBackground: isDarkMode ? activeTheme.cellDark : activeTheme.cellLight,
    text: isDarkMode ? '#ffffff' : '#000000',
    modeSliderContainer: isDarkMode ? { bg: activeTheme.gridDark, border: 'rgba(255, 255, 255, 0.1)' } : { bg: activeTheme.gridLight, border: 'rgba(0, 0, 0, 0.05)' },
    bannerDefault: isDarkMode ? { bg: activeTheme.gridDark, text: '#ffffff' } : { bg: activeTheme.gridLight, text: '#000000' },
  };

  const navBtnClass = "w-12 h-12 rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center overflow-hidden relative border";
  const getNavBtnStyle = () => ({
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    color: isDarkMode ? '#ffffff' : '#000000'
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; font-weight: 700; }
      `}</style>
      
      <div 
          style={{ backgroundColor: semantics.screenBackground }}
          className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 transition-colors duration-500 relative overflow-hidden font-nunito">
        
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />

        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 h-20 px-4 flex items-center justify-between z-50 w-full">
          {/* Left: Dark Mode Toggle */}
          <button onClick={() => { hapticFeedback(40); setIsDarkMode(!isDarkMode); }} className={navBtnClass} style={getNavBtnStyle()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isDarkMode ? 'dark' : 'light'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Center: Restart */}
          <button onClick={() => { setRotation(prev => prev - 360); resetGameForMode(startingPlayer); }} className={navBtnClass} style={getNavBtnStyle()}>
            <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <RotateCcw className="w-5 h-5" />
            </motion.div>
          </button>

          {/* Right: Sound & Settings */}
          <div className="flex gap-2 items-center">
            <button onClick={() => { hapticFeedback(40); setIsSoundOn(!isSoundOn); }} className={navBtnClass} style={getNavBtnStyle()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={isSoundOn ? 'on' : 'off'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <button onClick={() => { hapticFeedback(40); setIsSettingsOpen(true); }} className={navBtnClass} style={getNavBtnStyle()}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Header & Modes */}
        <header className="mb-2 text-center space-y-6 pt-12 z-10 relative w-full max-w-md">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ color: semantics.text }} className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
            Tic Tac Toe
          </motion.h1>

          <div style={{ backgroundColor: semantics.modeSliderContainer.bg, borderColor: semantics.modeSliderContainer.border, borderWidth: '2px' }} className="flex gap-2 justify-center p-1.5 rounded-full relative w-fit mx-auto shadow-inner">
            <button onClick={() => { hapticFeedback(40); setIsSinglePlayer(true); resetGameForMode(startingPlayer); }} onPointerDown={handleModeHoldStart} onPointerUp={handleModeHoldEnd} onPointerLeave={handleModeHoldEnd} className={`relative px-5 py-2.5 rounded-full text-sm z-10 transition-colors duration-300 select-none ${isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-full -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{isSinglePlayer && aiMovesFirst ? '🤖 1 Player (AI First)' : '🤖 1 Player'}</span>
            </button>
            <button onClick={() => { hapticFeedback(40); setIsSinglePlayer(false); resetGameForMode(startingPlayer); }} className={`relative px-5 py-2.5 rounded-full text-sm z-10 transition-colors duration-300 select-none ${!isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {!isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-full -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">👥 2 Players</span>
            </button>
          </div>

          <motion.div onPointerDown={handleTurnHoldStart} onPointerUp={handleTurnHoldEnd} onPointerLeave={handleTurnHoldEnd} animate={{ scale: winnerInfo ? 1.05 : (isHoldingBanner ? 0.96 : 1) }} style={{ backgroundColor: semantics.bannerDefault.bg, color: semantics.bannerDefault.text }} className="mx-auto w-[240px] h-[80px] rounded-[24px] text-lg flex flex-col items-center justify-center gap-1 shadow-sm transition-colors duration-300 select-none relative overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 relative z-10">
              {winnerInfo ? (
                <><Sparkles className="w-5 h-5 text-yellow-400" /><span>Winner: Player {winnerInfo.winner}!</span></>
              ) : isDraw ? ("It's a Stalemate!") : (
                <>
                  {isAITurn ? (
                    <div className="flex items-center gap-1.5 h-8">
                      <span className="mr-1">AI Thinking</span>
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    </div>
                  ) : (
                    <div className="flex items-center h-8">
                      Player&nbsp;
                      <div className="relative h-8 w-6 overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                          <motion.span key={isXNext ? 'X' : 'O'} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="absolute font-black text-2xl" style={{ color: isXNext ? X_COLORS[xColorIdx] : O_COLORS[oColorIdx] }}>
                            {isXNext ? 'X' : 'O'}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      &nbsp;'s turn
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </header>

        {/* Game Board */}
        <div className="relative group z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: semantics.mainGridBackground }} className="relative p-4 sm:p-5 rounded-[32px] sm:rounded-[36px] shadow-lg border border-white/5 backdrop-blur-md overflow-hidden">
            <div ref={boardRef} className="grid grid-cols-3 grid-rows-3 gap-3 relative z-10 w-[240px] sm:w-[280px] aspect-square">
              {board.map((value, i) => (
                <button key={i} id={`cell-${i}`} onClick={() => handleClick(i)} style={{ backgroundColor: semantics.squareBackground }} className={`w-full h-full rounded-[20px] flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-sm ${!value && !winnerInfo && !isAITurn && !isResetting ? 'hover:brightness-110 cursor-pointer active:scale-95' : 'cursor-default'}`} disabled={!!value || !!winnerInfo || isAITurn || isResetting}>
                  <AnimatePresence mode="wait">
                    {/* Only show 'X' or 'O' if it exists AND we are not resetting. If resetting, trigger exit animation. */}
                    {value === 'X' && !isResetting && (
                      <motion.div initial={{ scale: 0, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 180, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke={X_COLORS[xColorIdx]} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                        </svg>
                      </motion.div>
                    )}
                    {value === 'O' && !isResetting && (
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8.5" stroke={O_COLORS[oColorIdx]} strokeWidth="4.5" className="drop-shadow-sm" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}

              {/* Winning Line with Reverse Animation via pathLength */}
              <AnimatePresence>
                {linePoints && winnerInfo && !isResetting && (
                  <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.line
                      x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                      x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      stroke="#22c55e" strokeWidth="8" strokeLinecap="round"
                    />
                  </svg>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }} className="w-full max-w-sm p-6 rounded-[32px] shadow-2xl relative">
                
                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/20 hover:bg-gray-200/40 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-black mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  {/* Theme Selector */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3">Background Theme</h3>
                    <div className="flex flex-wrap gap-3">
                      {THEMES.map((theme, idx) => (
                        <button key={theme.name} onClick={() => { hapticFeedback(20); setThemeIdx(idx); }} style={{ backgroundColor: isDarkMode ? theme.dark : theme.light, borderColor: themeIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[3px] shadow-sm transition-transform active:scale-90" aria-label={`Theme ${theme.name}`} />
                      ))}
                    </div>
                  </div>

                  {/* X Color Selector */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3">Player X Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {X_COLORS.map((color, idx) => (
                        <button key={color} onClick={() => { hapticFeedback(20); setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: xColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                           {xColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* O Color Selector */}
                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3">Player O Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {O_COLORS.map((color, idx) => (
                        <button key={color} onClick={() => { hapticFeedback(20); setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: oColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                          {oColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
