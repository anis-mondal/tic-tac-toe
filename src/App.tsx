/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Moon, Sun, Sparkles, Volume2, VolumeX, MoreVertical, X, Target, Info, RefreshCw } from 'lucide-react';
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
const playEnhancedSound = (type: 'tap' | 'win' | 'pop' | 'point', enabled: boolean) => {
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
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
      gain.gain.setValueAtTime(0.3, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.15);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { 
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, t + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.5);
      });
    } else if (type === 'point') {
       const osc = ctx.createOscillator();
       const gain = ctx.createGain();
       osc.type = 'sine'; osc.frequency.setValueAtTime(800, t);
       osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
       gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
       osc.connect(gain); gain.connect(ctx.destination);
       osc.start(t); osc.stop(t + 0.1);
    }
  } catch(e) {}
};

// --- Minimax AI ---
const evaluateBoard = (squares: SquareValue[], aiPlayer: Player) => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a] === aiPlayer ? 10 : -10;
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
  for (let i = 0; i < 9; i++) if (!squares[i]) availableMoves.push(i);
  if (availableMoves.length === 9) return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
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
  if (Math.random() < 0.25) return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  let bestVal = -Infinity, bestMove = availableMoves[0];
  const trickWeights = [0.2, 0.0, 0.2, 0.0, 0.3, 0.0, 0.2, 0.0, 0.2];
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      squares[i] = aiPlayer;
      let moveVal = minimax(squares, 0, false, aiPlayer);
      squares[i] = null;
      moveVal += trickWeights[i];
      if (moveVal > bestVal) { bestMove = i; bestVal = moveVal; }
    }
  }
  return bestMove;
};

// --- Authentic Material 3 Themes ---
const ORIGINAL_THEME = {
  name: 'Classic',
  light: '#f8f9fa', dark: '#000000',
  gridLight: '#e2e8f0', gridDark: '#1a1c1e',
  cellLight: '#ffffff', cellDark: '#2a2d31',
  indicatorLight: '#64748b', indicatorDark: '#94a3b8',
  linesLight: ['#22c55e'], linesDark: ['#22c55e'] 
};

const CUSTOM_THEMES = [
  { name: 'M3 Blue', light: '#eff6ff', dark: '#0f172a', gridLight: '#bfdbfe', gridDark: '#1e3a8a', cellLight: '#ffffff', cellDark: '#111827', indicatorLight: '#2563eb', indicatorDark: '#60a5fa', linesLight: ['#2563eb', '#1d4ed8', '#3b82f6', '#4f46e5', '#0284c7'], linesDark: ['#60a5fa', '#93c5fd', '#3b82f6', '#818cf8', '#38bdf8'] },
  { name: 'M3 Green', light: '#ecfdf5', dark: '#022c22', gridLight: '#a7f3d0', gridDark: '#064e3b', cellLight: '#ffffff', cellDark: '#065f46', indicatorLight: '#16a34a', indicatorDark: '#4ade80', linesLight: ['#16a34a', '#15803d', '#059669', '#65a30d', '#10b981'], linesDark: ['#4ade80', '#86efac', '#34d399', '#a3e635', '#22c55e'] },
  { name: 'M3 Purple', light: '#f5f3ff', dark: '#2e1065', gridLight: '#d8b4fe', gridDark: '#581c87', cellLight: '#ffffff', cellDark: '#1e1b4b', indicatorLight: '#9333ea', indicatorDark: '#c084fc', linesLight: ['#9333ea', '#7e22ce', '#a855f7', '#c026d3', '#db2777'], linesDark: ['#c084fc', '#e9d5ff', '#d8b4fe', '#f472b6', '#fb7185'] },
  { name: 'M3 Orange', light: '#fff7ed', dark: '#431407', gridLight: '#fdba74', gridDark: '#7c2d12', cellLight: '#ffffff', cellDark: '#2a1200', indicatorLight: '#ea580c', indicatorDark: '#fb923c', linesLight: ['#ea580c', '#c2410c', '#d97706', '#dc2626', '#b45309'], linesDark: ['#fb923c', '#fcd34d', '#fca5a5', '#f87171', '#fdba74'] },
  { name: 'M3 Rose', light: '#fff1f2', dark: '#4c0519', gridLight: '#fecdd3', gridDark: '#881337', cellLight: '#ffffff', cellDark: '#240000', indicatorLight: '#e11d48', indicatorDark: '#fb7185', linesLight: ['#e11d48', '#be123c', '#9f1239', '#db2777', '#f43f5e'], linesDark: ['#fb7185', '#fda4af', '#fecdd3', '#fbcfe8', '#f9a8d4'] },
  { name: 'M3 Cyan', light: '#ecfeff', dark: '#083344', gridLight: '#67e8f9', gridDark: '#164e63', cellLight: '#ffffff', cellDark: '#0b2e59', indicatorLight: '#0891b2', indicatorDark: '#22d3ee', linesLight: ['#0891b2', '#0e7490', '#0369a1', '#0f766e', '#115e59'], linesDark: ['#22d3ee', '#67e8f9', '#7dd3fc', '#5eead4', '#99f6e4'] },
  { name: 'M3 Yellow', light: '#fffcf2', dark: '#1e1c16', gridLight: '#e7e2d0', gridDark: '#4a473a', cellLight: '#ffffff', cellDark: '#16140e', indicatorLight: '#d97706', indicatorDark: '#fbbf24', linesLight: ['#d97706', '#ca8a04', '#b45309', '#a16207', '#ea580c'], linesDark: ['#fbbf24', '#fef08a', '#fcd34d', '#fdba74', '#fde047'] },
  { name: 'M3 Crimson', light: '#fef2f2', dark: '#450a0a', gridLight: '#fca5a5', gridDark: '#7f1d1d', cellLight: '#ffffff', cellDark: '#1a0505', indicatorLight: '#dc2626', indicatorDark: '#f87171', linesLight: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#e11d48'], linesDark: ['#f87171', '#fca5a5', '#ef4444', '#fb7185', '#f87171'] },
  { name: 'M3 Indigo', light: '#eef2ff', dark: '#1e1b4b', gridLight: '#c7d2fe', gridDark: '#312e81', cellLight: '#ffffff', cellDark: '#111827', indicatorLight: '#4f46e5', indicatorDark: '#818cf8', linesLight: ['#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e3a8a'], linesDark: ['#818cf8', '#a5b4fc', '#93c5fd', '#bfdbfe', '#60a5fa'] },
  { name: 'M3 Mint', light: '#f0fdfa', dark: '#042f2e', gridLight: '#99f6e4', gridDark: '#134e4a', cellLight: '#ffffff', cellDark: '#021a1a', indicatorLight: '#0d9488', indicatorDark: '#5eead4', linesLight: ['#0d9488', '#0f766e', '#0b1d1d', '#14532d', '#065f46'], linesDark: ['#5eead4', '#6ee7b7', '#a7f3d0', '#86efac', '#69dba8'] },
];

const X_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
const O_COLORS = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#d946ef'];

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [startingPlayer, setStartingPlayer] = useState<Player>('O'); 
  const [isXNext, setIsXNext] = useState(false);
  
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [aiMovesFirst, setAiMovesFirst] = useState(false); 
  
  const lastMoveIdxRef = useRef<number | null>(null);
  const [linePoints, setLinePoints] = useState<{ type: 'normal' | 'center-out', start: { x: number; y: number }; end: { x: number; y: number }, mid: { x: number; y: number } } | null>(null);
  
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHoldingBanner, setIsHoldingBanner] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isLongPressRestart, setIsLongPressRestart] = useState(false);
  
  const [isOverallWinModalOpen, setIsOverallWinModalOpen] = useState(false);
  const [overallWinner, setOverallWinner] = useState<Player | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [useDefaultTheme, setUseDefaultTheme] = useState(true);
  const [themeIdx, setThemeIdx] = useState(0);
  const [xColorIdx, setXColorIdx] = useState(0);
  const [oColorIdx, setOColorIdx] = useState(0);
  const [customLineIdx, setCustomLineIdx] = useState(0);
  
  const [targetScore, setTargetScore] = useState(5);
  const [userWantsTargetScore, setUserWantsTargetScore] = useState(true);
  const [isTargetScoreEnabled, setIsTargetScoreEnabled] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    return true; 
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const myConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const turnHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const modeHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const restartHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isResetting || winnerInfo || isDraw || overallWinner) return;
    
    let hasWinner = false;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a] as Player;
        setWinnerInfo({ winner, line: combination });
        
        setScores(prev => {
            const newScore = prev[winner] + 1;
            if (isTargetScoreEnabled && newScore === targetScore) {
               setOverallWinner(winner);
               playEnhancedSound('win', isSoundOn);
               setTimeout(() => setIsOverallWinModalOpen(true), 1200); 
            } else {
               playEnhancedSound('point', isSoundOn);
            }
            return { ...prev, [winner]: newScore };
        }); 
        
        hapticFeedback([100, 50, 100, 50, 300]); 
        fireConfetti(winner);
        hasWinner = true;
        break;
      }
    }
    if (!hasWinner && !board.includes(null)) {
      setIsDraw(true);
      setScores(prev => ({ ...prev, Draws: prev.Draws + 1 })); 
      playEnhancedSound('point', isSoundOn);
      hapticFeedback([200, 100, 200]);
    }
  }, [board, isSoundOn, isResetting, xColorIdx, oColorIdx, winnerInfo, isDraw, overallWinner, targetScore, isTargetScoreEnabled]);

  const aiPlayerSymbol = isSinglePlayer ? 'X' : null;
  const isAITurn = isSinglePlayer && aiPlayerSymbol && ((isXNext && aiPlayerSymbol === 'X') || (!isXNext && aiPlayerSymbol === 'O'));

  useEffect(() => {
    if (isAITurn && !winnerInfo && !isDraw && !isResetting && !overallWinner) {
      const aiTimer = setTimeout(() => {
        const bestMove = findBestMove([...board], aiPlayerSymbol);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = aiPlayerSymbol;
          hapticFeedback(50); 
          playEnhancedSound('tap', isSoundOn);
          lastMoveIdxRef.current = bestMove;
          setBoard(newBoard);
          setIsXNext(aiPlayerSymbol === 'O');
        }
      }, 500); 
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw, aiPlayerSymbol, isAITurn, isSoundOn, isResetting, overallWinner]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo || isAITurn || isResetting || overallWinner) return;
    hapticFeedback(50); 
    playEnhancedSound('tap', isSoundOn);
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    lastMoveIdxRef.current = index;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const isGameCompletelyFresh = scores.X === 0 && scores.O === 0 && scores.Draws === 0 && board.every(c => c === null);

  const resetGameForMode = (currentStartingPlayer: Player, hardReset: boolean = false) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    hapticFeedback(40); 
    playEnhancedSound('pop', isSoundOn);
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setIsResetting(true);
    
    resetTimerRef.current = setTimeout(() => {
      setBoard(Array(9).fill(null));
      setIsXNext(currentStartingPlayer === 'X');
      setWinnerInfo(null);
      setIsDraw(false);
      setLinePoints(null);
      lastMoveIdxRef.current = null;
      if (hardReset) {
         setScores({ X: 0, O: 0, Draws: 0 });
         setOverallWinner(null);
         if (userWantsTargetScore) setIsTargetScoreEnabled(true);
      }
      setIsResetting(false);
    }, 450); 
  };

  const handleTurnHoldStart = () => {
    if (isGameCompletelyFresh && !winnerInfo) {
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

  const switchModeClick = (single: boolean) => {
    if (isSinglePlayer === single) return;
    hapticFeedback(40);
    setIsSinglePlayer(single);
    resetGameForMode(startingPlayer, true); 
  };

  const performHardReset = (startingPlayerOverride: Player) => {
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      if (myConfettiRef.current) myConfettiRef.current.reset();
      setScores({ X: 0, O: 0, Draws: 0 });
      setStartingPlayer(startingPlayerOverride);
      setBoard(Array(9).fill(null));
      setIsXNext(startingPlayerOverride === 'X');
      setWinnerInfo(null);
      setIsDraw(false);
      setLinePoints(null);
      lastMoveIdxRef.current = null;
      setOverallWinner(null);
      setIsOverallWinModalOpen(false);
      setIsResetting(false);
      if (userWantsTargetScore) setIsTargetScoreEnabled(true);
  };

  const handleRestartPointerDown = () => {
    setIsLongPressRestart(false);
    restartHoldTimer.current = setTimeout(() => {
      setIsLongPressRestart(true);
      hapticFeedback([100, 50, 100, 50]); 
      setRotation(prev => prev - 720);
      performHardReset(startingPlayer); 
    }, 800);
  };
  
  const handleRestartPointerUp = () => {
    if (restartHoldTimer.current) clearTimeout(restartHoldTimer.current);
    if (!isLongPressRestart) {
      setRotation(prev => prev - 360);
      resetGameForMode(startingPlayer, false); 
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
        if (lastMoveIdxRef.current === c) originIdx = c;
        else if (lastMoveIdxRef.current === b) originIdx = b;
        else if (lastMoveIdxRef.current === a) originIdx = a;

        setLinePoints({ 
          type: lastMoveIdxRef.current === b ? 'center-out' : 'normal',
          start: getCellCenter(a), 
          end: getCellCenter(c),
          mid: getCellCenter(b)
        });
      } else if (!winnerInfo && !isResetting) {
        setLinePoints(null);
      }
    };
    updatePoints();
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo, isResetting]);

  const activeTheme = useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[themeIdx];
  const activeLineColor = useDefaultTheme 
    ? (isDarkMode ? ORIGINAL_THEME.linesDark[0] : ORIGINAL_THEME.linesLight[0]) 
    : (isDarkMode ? activeTheme.linesDark[customLineIdx] : activeTheme.linesLight[customLineIdx]);
  
  const semantics = {
    screenBackground: isDarkMode ? activeTheme.dark : activeTheme.light,
    mainGridBackground: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
    squareBackground: isDarkMode ? activeTheme.cellDark : activeTheme.cellLight,
    text: isDarkMode ? '#ffffff' : '#111111',
    modeSliderContainer: { bg: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight },
    bannerDefault: isDarkMode ? { bg: activeTheme.gridDark, text: '#ffffff' } : { bg: activeTheme.gridLight, text: '#111111' },
    scoreBg: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
    topNavBtn: isDarkMode ? activeTheme.gridDark : activeTheme.gridLight,
  };

  const navBtnClass = "w-[48px] h-[48px] rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center overflow-hidden relative border-none z-50 cursor-pointer";
  const getNavBtnStyle = () => ({
    backgroundColor: semantics.topNavBtn,
    color: semantics.text,
    boxShadow: isDarkMode ? '0 2px 6px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.06)'
  });

  const displayScore = (score: number) => {
     return isTargetScoreEnabled ? `${score} / ${targetScore}` : score;
  };

  const maxScore = Math.max(scores.X, scores.O);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; font-weight: 700; }
        .m3-scrollbar::-webkit-scrollbar { width: 6px; }
        .m3-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .m3-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; 
          border-radius: 10px; 
        }
      `}</style>
      
      <div 
          style={{ backgroundColor: semantics.screenBackground }}
          className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 transition-colors duration-500 relative overflow-hidden font-nunito">
        
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />

        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 h-24 px-6 flex items-center justify-between z-50 w-full max-w-[420px] mx-auto">
          <button onClick={() => { hapticFeedback(40); setIsDarkMode(!isDarkMode); }} className={navBtnClass} style={getNavBtnStyle()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isDarkMode ? 'dark' : 'light'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {isDarkMode ? <Sun className="w-[20px] h-[20px]" /> : <Moon className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button 
             onPointerDown={handleRestartPointerDown} 
             onPointerUp={handleRestartPointerUp}
             onPointerLeave={handleRestartPointerUp}
             className={navBtnClass} style={getNavBtnStyle()}
          >
            <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <RotateCcw className="w-[20px] h-[20px]" />
            </motion.div>
          </button>

          <button onClick={() => { hapticFeedback(40); setIsSoundOn(!isSoundOn); }} className={navBtnClass} style={getNavBtnStyle()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isSoundOn ? 'on' : 'off'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                {isSoundOn ? <Volume2 className="w-[20px] h-[20px]" /> : <VolumeX className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </button>
          
          <button onClick={() => { hapticFeedback(40); setIsSettingsOpen(true); }} className={navBtnClass} style={getNavBtnStyle()}>
            <MoreVertical className="w-[20px] h-[20px]" />
          </button>
        </nav>

        {/* Header & Modes */}
        <header className="text-center space-y-5 pt-16 z-10 relative w-full max-w-md overflow-visible">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ color: semantics.text }} className="text-[40px] sm:text-[44px] font-black tracking-tight drop-shadow-sm">
            Tic Tac Toe
          </motion.h1>

          <div style={{ backgroundColor: semantics.modeSliderContainer.bg }} className="flex justify-center p-1.5 rounded-[28px] relative w-fit mx-auto shadow-sm">
            <button onClick={() => switchModeClick(true)} className={`relative px-6 py-3 rounded-[24px] text-[15px] font-bold z-10 transition-colors duration-300 select-none ${isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-[24px] -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">🤖 1 Player</span>
            </button>
            <button onClick={() => switchModeClick(false)} className={`relative px-6 py-3 rounded-[24px] text-[15px] font-bold z-10 transition-colors duration-300 select-none ${!isSinglePlayer ? (isDarkMode ? 'text-white' : 'text-black') : 'text-gray-500'}`}>
              {!isSinglePlayer && <motion.div layoutId="modeSwitch" className="absolute inset-0 rounded-[24px] -z-10 shadow-sm" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">👥 2 Players</span>
            </button>
          </div>

          <motion.div 
            onPointerDown={handleTurnHoldStart} onPointerUp={handleTurnHoldEnd} onPointerLeave={handleTurnHoldEnd} 
            animate={{ scale: winnerInfo ? 1.05 : (isHoldingBanner ? 0.96 : 1) }} 
            style={{ backgroundColor: semantics.bannerDefault.bg, color: semantics.bannerDefault.text }} 
            className={`mx-auto w-[210px] h-[52px] rounded-full text-[16px] flex flex-col items-center justify-center gap-1 shadow-sm transition-colors duration-300 select-none relative overflow-hidden ${isGameCompletelyFresh ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center gap-2 relative z-10">
              {winnerInfo ? (
                <><Sparkles className="w-4 h-4" style={{ color: activeLineColor }} /><span className="font-bold">Winner: Player {winnerInfo.winner}!</span></>
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
                          <motion.span key={isXNext ? 'X' : 'O'} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute font-black text-xl" style={{ color: isXNext ? X_COLORS[xColorIdx] : O_COLORS[oColorIdx] }}>
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
        <div className="flex gap-3 justify-center z-10 w-full max-w-[280px] sm:max-w-[320px] relative overflow-visible">
           <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-90" style={{ color: X_COLORS[xColorIdx] }}>Player X</span>
              <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                <AnimatePresence mode="popLayout">
                  <motion.span key={displayScore(scores.X)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: X_COLORS[xColorIdx] }}>
                    {displayScore(scores.X)}
                  </motion.span>
                </AnimatePresence>
              </div>
           </div>

           <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg, color: semantics.text }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-60">Draws</span>
              <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                <AnimatePresence mode="popLayout">
                  <motion.span key={scores.Draws} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black opacity-80">
                    {scores.Draws}
                  </motion.span>
                </AnimatePresence>
              </div>
           </div>

           <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm" style={{ backgroundColor: semantics.scoreBg }}>
              <span className="text-[10px] sm:text-xs font-black uppercase opacity-90" style={{ color: O_COLORS[oColorIdx] }}>Player O</span>
              <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                <AnimatePresence mode="popLayout">
                  <motion.span key={displayScore(scores.O)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: O_COLORS[oColorIdx] }}>
                    {displayScore(scores.O)}
                  </motion.span>
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Game Board */}
        <div className="relative group z-10 mt-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: semantics.mainGridBackground }} className="relative p-4 sm:p-5 rounded-[36px] sm:rounded-[40px] shadow-lg backdrop-blur-md overflow-hidden">
            <div ref={boardRef} className="grid grid-cols-3 grid-rows-3 gap-3 relative z-10 w-[240px] sm:w-[280px] aspect-square">
              {board.map((value, i) => (
                <button key={i} id={`cell-${i}`} onClick={() => handleClick(i)} style={{ backgroundColor: semantics.squareBackground, boxShadow: isDarkMode && !value ? 'inset 0 2px 4px rgba(255,255,255,0.015)' : 'none' }} className={`w-full h-full rounded-[20px] flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-sm ${!value && !winnerInfo && !isAITurn && !isResetting && !overallWinner ? 'hover:brightness-110 cursor-pointer active:scale-[0.92]' : 'cursor-default'}`} disabled={!!value || !!winnerInfo || isAITurn || isResetting || overallWinner}>
                  <AnimatePresence mode="wait">
                    {value === 'X' && !isResetting && (
                      <motion.div initial={{ scale: 0, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 180, opacity: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }} className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke={X_COLORS[xColorIdx]} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                        </svg>
                      </motion.div>
                    )}
                    {value === 'O' && !isResetting && (
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }} className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8.5" stroke={O_COLORS[oColorIdx]} strokeWidth="4.5" className="drop-shadow-sm" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}

              {/* Hollow Winning Line: Transparent center (masked) + 70% opacity colored border */}
              <AnimatePresence>
                {linePoints && winnerInfo && (
                  <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <mask id="hollow-mask" maskUnits="userSpaceOnUse">
                        <rect width="100%" height="100%" fill="white" />
                        <motion.line
                          x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                          x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          stroke="black" strokeWidth="6" strokeLinecap="round"
                        />
                      </mask>
                    </defs>
                    
                    {/* Outer Stroke with 70% opacity */}
                    <motion.line
                      x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                      x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      stroke={activeLineColor} strokeWidth="12" strokeLinecap="round" mask="url(#hollow-mask)" opacity={0.7}
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
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-sm p-6 rounded-[36px] shadow-2xl relative border border-white/5">
                
                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors z-[160]">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex gap-3 items-center mb-6">
                    <button onClick={() => setIsAboutOpen(true)} className="p-2.5 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors">
                        <Info className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black">Appearance</h2>
                </div>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 m3-scrollbar">
                  <div>
                     <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Theme Style</h3>
                     <div className="flex gap-2 p-1.5 rounded-2xl" style={{ backgroundColor: semantics.scoreBg }}>
                        <button onClick={() => { hapticFeedback(20); setUseDefaultTheme(true); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           {ORIGINAL_THEME.name}
                        </button>
                        <button onClick={() => { hapticFeedback(20); setUseDefaultTheme(false); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           Custom (M3)
                        </button>
                     </div>
                  </div>
                  
                  <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <Target className="w-5 h-5 opacity-70" />
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Target Point Win</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setIsTargetScoreEnabled(!isTargetScoreEnabled); setUserWantsTargetScore(!isTargetScoreEnabled); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: isTargetScoreEnabled ? '#0ea5e9' : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: isTargetScoreEnabled ? 20 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     
                     <AnimatePresence>
                     {isTargetScoreEnabled && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-4 overflow-hidden pt-1">
                           <span className="text-sm opacity-80 font-medium">Points to Win:</span>
                           <div className="flex gap-2.5 items-center bg-transparent/10 p-1 rounded-xl">
                              <button onClick={() => { hapticFeedback(20); setTargetScore(s => Math.max(Math.max(1, maxScore), s-1)); }} disabled={targetScore <= Math.max(1, maxScore)} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black disabled:opacity-30 disabled:cursor-not-allowed">-</button>
                              <span className="text-lg font-black w-8 text-center">{targetScore}</span>
                              <button onClick={() => { hapticFeedback(20); setTargetScore(s => Math.min(20, s+1)); }} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black">+</button>
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  {!useDefaultTheme && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold mt-4">Surface Colors</h3>
                      <div className="flex flex-wrap gap-3">
                        {CUSTOM_THEMES.map((theme, idx) => (
                          <button key={theme.name} onClick={() => { hapticFeedback(20); setThemeIdx(idx); setCustomLineIdx(0); }} style={{ backgroundColor: isDarkMode ? theme.indicatorDark : theme.indicatorLight, borderColor: themeIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center" aria-label={`Theme ${theme.name}`}>
                            {themeIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                          </button>
                        ))}
                      </div>

                      <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold mt-6">Winning Line Color</h3>
                      <div className="flex flex-wrap gap-3">
                        {(isDarkMode ? CUSTOM_THEMES[themeIdx].linesDark : CUSTOM_THEMES[themeIdx].linesLight).map((color, idx) => (
                          <button key={`line-${idx}`} onClick={() => { hapticFeedback(20); setCustomLineIdx(idx); }} style={{ backgroundColor: color, borderColor: customLineIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                            {customLineIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* About Modal */}
        <AnimatePresence>
          {isAboutOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-[420px] p-7 rounded-[36px] shadow-2xl relative border border-white/5">
                <button onClick={() => setIsAboutOpen(false)} className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors z-[170]">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black mb-6">About Game</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 m3-scrollbar">
                  <p>Welcome to our Premium Tic-Tac-Toe! Built with Google Material You (M3) design principles.</p>
                  <p><strong>Controls:</strong></p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><b>Tap Restart:</b> Resets the board for a new round.</li>
                    <li><b>Long Press Restart:</b> Performs a "Hard Reset" which clears all scores, target points, and game data.</li>
                    <li><b>Switch Starting Player:</b> Long press the "1 Player" button to allow the AI to move first.</li>
                    <li><b>Target Score:</b> In settings, you can define a target score (1-20). The first player to reach it wins the match. You cannot lower the target score below current top score.</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
