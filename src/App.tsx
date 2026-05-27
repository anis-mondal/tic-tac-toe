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
    try { navigator.vibrate(pattern); } catch (e) {}
  }
};

// --- Audio System ---
const audioState = { ctx: null as AudioContext | null };
const playEnhancedSound = (type: 'tap' | 'win' | 'pop', enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    if (!audioState.ctx) {
      audioState.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioState.ctx.state === 'suspended') audioState.ctx.resume();
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

// --- Material You Inspired Themes Data ---
const ORIGINAL_THEME = {
  name: 'Default (Classic)',
  light: '#f8f9fa', dark: '#000000', // Pitch black for AMOLED
  gridLight: '#e2e8f0', gridDark: '#1a1c1e', // Highly visible dark gray grid
  cellLight: '#ffffff', cellDark: '#2a2d31'  // Distinct raised cells in dark mode
};

// Colors designed similarly to Google's Material 3 Dynamic Tones
const CUSTOM_THEMES = [
  { name: 'M3 Blue', light: '#fdfbff', dark: '#1a1c1e', gridLight: '#e0e2ec', gridDark: '#3f4753', cellLight: '#d3e4ff', cellDark: '#004a77' },
  { name: 'M3 Green', light: '#fcfdf6', dark: '#1a1c18', gridLight: '#dfe4d6', gridDark: '#42493f', cellLight: '#b8f397', cellDark: '#0b3900' },
  { name: 'M3 Pink', light: '#fffbf9', dark: '#201a1b', gridLight: '#f4dddf', gridDark: '#524346', cellLight: '#ffd8e4', cellDark: '#633b4d' },
  { name: 'M3 Purple', light: '#fffbff', dark: '#1c1b1f', gridLight: '#e7e0ec', gridDark: '#49454f', cellLight: '#eaddff', cellDark: '#4f378b' },
  { name: 'M3 Orange', light: '#fffbff', dark: '#201a18', gridLight: '#f5dfd5', gridDark: '#53433c', cellLight: '#ffdbcc', cellDark: '#703715' },
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
  
  // Score Tracking System
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const [rotation, setRotation] = useState(0);
  const [isHoldingBanner, setIsHoldingBanner] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [useDefaultTheme, setUseDefaultTheme] = useState(true);
  const [themeIdx, setThemeIdx] = useState(0);
  const [xColorIdx, setXColorIdx] = useState(0);
  const [oColorIdx, setOColorIdx] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; 
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
    if (isResetting || winnerInfo || isDraw) return;
    
    let hasWinner = false;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a] as Player;
        setWinnerInfo({ winner, line: combination });
        setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 })); // Update Score
        hapticFeedback([100, 50, 100, 50, 300]); 
        playEnhancedSound('win', isSoundOn);
        fireConfetti(winner);
        hasWinner = true;
        break;
      }
    }
    if (!hasWinner && !board.includes(null)) {
      setIsDraw(true);
      setScores(prev => ({ ...prev, Draws: prev.Draws + 1 })); // Update Draw Score
      hapticFeedback([200, 100, 200]);
    }
  }, [board, isSoundOn, isResetting, xColorIdx, oColorIdx, winnerInfo, isDraw]);

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

  const resetGameForMode = (currentStartingPlayer: Player) => {
    if (isResetting) return; 
    hapticFeedback(40); 
    playEnhancedSound('pop', isSoundOn);
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setIsResetting(true);
    
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
        setScores({ X: 0, O: 0, Draws: 0 }); // Reset scores on mode switch
        return !prev;
      });
      resetGameForMode(startingPlayer); 
    }, 600);
  };

  const handleModeHoldEnd = () => {
    if (modeHoldTimer.current) clearTimeout(modeHoldTimer.current);
  };

  const switchModeClick = (single: boolean) => {
    if (isSinglePlayer === single) return;
    hapticFeedback(40);
    setIsSinglePlayer(single);
    setScores({ X: 0, O: 0, Draws: 0 }); // Reset scores on mode switch
    resetGameForMode(startingPlayer);
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
      } else if (!winnerInfo && !isResetting) {
        setLinePoints(null);
      }
    };
    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo, isResetting]);

  const activeTheme = useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[themeIdx];
  
  const semantics = {
    screenBackground: isDarkMode ? activeTheme.dark : activeTheme.light,
    mainGridBackground: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
    squareBackground: isDarkMode ? activeTheme.cellDark : activeTheme.cellLight,
    text: isDarkMode ? '#ffffff' : '#111111',
    modeSliderContainer: isDarkMode ? { bg: activeTheme.gridDark, border: 'transparent' } : { bg: activeTheme.gridLight, border: 'transparent' },
    bannerDefault: isDarkMode ? { bg: activeTheme.gridDark, text: '#ffffff' } : { bg: activeTheme.gridLight, text: '#111111' },
    scoreBg: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
  };

  // Material You Pill Button Style
  const navBtnClass = "w-[48px] h-[48px] rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center overflow-hidden relative border-none z-50";
  const getNavBtnStyle = () => ({
    backgroundColor: semantics.squareBackground,
    color: semantics.text,
    boxShadow: isDarkMode ? '0 2px 6px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.06)'
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; font-weight: 700; }
      `}</style>
      
      <div 
          style={{ backgroundColor: semantics.screenBackground }}
          className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 transition-colors duration-500 relative overflow-hidden font-nunito">
        
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />

        {/* Top Navigation Bar - Material Icons */}
        <nav className="fixed top-0 left-0 right-0 h-24 px-6 flex items-center justify-between z-50 w-full max-w-[420px] mx-auto">
          <button onClick={() => { hapticFeedback(40); setIsDarkMode(!isDarkMode); }} className={navBtnClass} style={getNavBtnStyle()} aria-label="Toggle Theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isDarkMode ? 'dark' : 'light'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {isDarkMode ? <Sun className="w-[20px] h-[20px]" /> : <Moon className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button onClick={() => { setRotation(prev => prev - 360); resetGameForMode(startingPlayer); }} className={navBtnClass} style={getNavBtnStyle()} aria-label="Restart">
            <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <RotateCcw className="w-[20px] h-[20px]" />
            </motion.div>
          </button>

          <button onClick={() => { hapticFeedback(40); setIsSoundOn(!isSoundOn); }} className={navBtnClass} style={getNavBtnStyle()} aria-label="Toggle Sound">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isSoundOn ? 'on' : 'off'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                {isSoundOn ? <Volume2 className="w-[20px] h-[20px]" /> : <VolumeX className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </button>
          
          <button onClick={() => { hapticFeedback(40); setIsSettingsOpen(true); }} className={navBtnClass} style={getNavBtnStyle()} aria-label="Settings">
            <MoreVertical className="w-[20px] h-[20px]" />
          </button>
        </nav>

        {/* Header & Modes */}
        <header className="text-center space-y-5 pt-16 z-10 relative w-full max-w-md">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ color: semantics.text }} className="text-[40px] sm:text-[44px] font-black tracking-tight drop-shadow-sm">
            Tic Tac Toe
          </motion.h1>

          {/* Material Segmented Button for Modes */}
          <div style={{ backgroundColor: semantics.modeSliderContainer.bg }} className="flex justify-center p-1.5 rounded-[28px] relative w-fit mx-auto shadow-sm">
            <button onClick={() => switchModeClick(true)} onPointerDown={handleModeHoldStart} onPointerUp={handleModeHoldEnd} onPointerLeave={handleModeHoldEnd} className={`relative px-6 py-3 rounded-[24px] text-[15px] font-bold z-10 transition-colors duration-300 select-none ${isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-[24px] -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{isSinglePlayer && aiMovesFirst ? '🤖 1 Player (AI First)' : '🤖 1 Player'}</span>
            </button>
            <button onClick={() => switchModeClick(false)} className={`relative px-6 py-3 rounded-[24px] text-[15px] font-bold z-10 transition-colors duration-300 select-none ${!isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {!isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-[24px] -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">👥 2 Players</span>
            </button>
          </div>

          {/* Turn Banner */}
          <motion.div onPointerDown={handleTurnHoldStart} onPointerUp={handleTurnHoldEnd} onPointerLeave={handleTurnHoldEnd} animate={{ scale: winnerInfo ? 1.05 : (isHoldingBanner ? 0.96 : 1) }} style={{ backgroundColor: semantics.bannerDefault.bg, color: semantics.bannerDefault.text }} className="mx-auto w-[200px] h-[52px] rounded-full text-[16px] flex flex-col items-center justify-center gap-1 shadow-sm transition-colors duration-300 select-none relative overflow-hidden cursor-pointer">
            <div className="flex items-center gap-2 relative z-10">
              {winnerInfo ? (
                <><Sparkles className="w-4 h-4 text-yellow-400" /><span className="font-bold">Winner: Player {winnerInfo.winner}!</span></>
              ) : isDraw ? (<span className="font-bold">It's a Stalemate!</span>) : (
                <>
                  {isAITurn ? (
                    <div className="flex items-center gap-1.5 h-8">
                      <span className="mr-1 font-bold">AI Thinking</span>
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    </div>
                  ) : (
                    <div className="flex items-center h-8 font-bold">
                      Player&nbsp;
                      <div className="relative h-8 w-5 overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                          <motion.span key={isXNext ? 'X' : 'O'} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="absolute font-black text-xl" style={{ color: isXNext ? X_COLORS[xColorIdx] : O_COLORS[oColorIdx] }}>
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

        {/* Scoreboard Feature */}
        <div className="flex gap-3 justify-center z-10 w-full max-w-[280px] sm:max-w-[320px]">
           <motion.div key={scores.X} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg, color: semantics.text }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-60">Player X</span>
              <span className="text-xl sm:text-2xl font-black" style={{ color: X_COLORS[xColorIdx] }}>{scores.X}</span>
           </motion.div>
           <motion.div key={scores.Draws} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg, color: semantics.text }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-60">Draws</span>
              <span className="text-xl sm:text-2xl font-black opacity-80">{scores.Draws}</span>
           </motion.div>
           <motion.div key={scores.O} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg, color: semantics.text }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-60">Player O</span>
              <span className="text-xl sm:text-2xl font-black" style={{ color: O_COLORS[oColorIdx] }}>{scores.O}</span>
           </motion.div>
        </div>

        {/* Game Board */}
        <div className="relative group z-10 mt-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: semantics.mainGridBackground }} className="relative p-4 sm:p-5 rounded-[36px] sm:rounded-[40px] shadow-lg backdrop-blur-md overflow-hidden">
            <div ref={boardRef} className="grid grid-cols-3 grid-rows-3 gap-3 relative z-10 w-[240px] sm:w-[280px] aspect-square">
              {board.map((value, i) => (
                <button key={i} id={`cell-${i}`} onClick={() => handleClick(i)} style={{ backgroundColor: semantics.squareBackground, boxShadow: isDarkMode && !value ? 'inset 0 2px 4px rgba(255,255,255,0.02)' : 'none' }} className={`w-full h-full rounded-[20px] flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-sm ${!value && !winnerInfo && !isAITurn && !isResetting ? 'hover:brightness-110 cursor-pointer active:scale-[0.92]' : 'cursor-default'}`} disabled={!!value || !!winnerInfo || isAITurn || isResetting}>
                  <AnimatePresence mode="wait">
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

              {/* Original Style Winning Line */}
              <AnimatePresence>
                {linePoints && winnerInfo && !isResetting && (
                  <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <mask id="hollow-mask" maskUnits="userSpaceOnUse">
                        <rect width="100%" height="100%" fill="white" />
                        <motion.line x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`} x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} stroke="black" strokeWidth="6" strokeLinecap="round" />
                      </mask>
                    </defs>
                    <motion.line x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`} x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} stroke="#004d00" strokeWidth="8" strokeLinecap="round" mask="url(#hollow-mask)" />
                    <motion.line x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`} x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} stroke="rgba(56, 142, 60, 0.55)" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Material Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-sm p-6 rounded-[36px] shadow-2xl relative border border-white/10">
                
                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-black mb-6">Appearance</h2>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  
                  <div>
                     <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Theme Style</h3>
                     <div className="flex gap-2 p-1.5 rounded-2xl" style={{ backgroundColor: semantics.scoreBg }}>
                        <button onClick={() => setUseDefaultTheme(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           Default
                        </button>
                        <button onClick={() => setUseDefaultTheme(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           Custom (M3)
                        </button>
                     </div>
                  </div>

                  {!useDefaultTheme && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold mt-4">Surface Colors</h3>
                      <div className="flex flex-wrap gap-3">
                        {CUSTOM_THEMES.map((theme, idx) => (
                          <button key={theme.name} onClick={() => { hapticFeedback(20); setThemeIdx(idx); }} style={{ backgroundColor: isDarkMode ? theme.cellDark : theme.cellLight, borderColor: themeIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90" aria-label={`Theme ${theme.name}`} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Player X Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {X_COLORS.map((color, idx) => (
                        <button key={color} onClick={() => { hapticFeedback(20); setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: xColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                           {xColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Player O Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {O_COLORS.map((color, idx) => (
                        <button key={color} onClick={() => { hapticFeedback(20); setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: oColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                          {oColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
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
