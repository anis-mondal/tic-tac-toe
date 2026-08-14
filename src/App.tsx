/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// খেয়াল করুন: এখানে আমরা শুধু UI-তে ব্যবহার করা ১১টি আইকন ইমপোর্ট করেছি! বাকি ১৫০টি আইকন themeData.ts-এ আছে।
import { 
  RotateCcw, Moon, Sun, Sparkles, Volume2, VolumeX, MoreVertical, X as CloseIcon, Target, Info, UsersRound 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Local Fonts ---
// @ts-ignore
import nunitoFont from './Nunito-ExtraBold.ttf';
// @ts-ignore
import nunitoBlackFont from './Nunito-Black.ttf';

// --- Capacitor Plugins ---
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';

// --- আমাদের নতুন তৈরি করা মডিউলগুলো (Importing from split files) ---
import { Player, SquareValue } from './types';
import { ICONS_LIST, ORIGINAL_THEME, CUSTOM_THEMES, PLAYER_COLORS, EXTRA_LINE_COLORS } from './constants/themeData';
import { hapticFeedback, getSaved, blendDarker } from './utils/helpers';
import { WINNING_COMBINATIONS, findBestMove } from './utils/gameLogic';
import DynamicIcon from './components/DynamicIcon';
import AILogo from './components/AILogo';

const audioState = { ctx: null as AudioContext | null };
const playEnhancedSound = (type: 'tap' | 'win' | 'overall-win' | 'pop' | 'point' | 'unmute' | 'mode', enabled: boolean) => {
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
      osc.frequency.setValueAtTime(800, t); 
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.05); 
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05); 
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.05);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'mode') {
      [600, 800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.2, t + i * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.15 + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.1);
      });
    } else if (type === 'win') {
      [440, 554.37, 659.25].forEach((freq, i) => { 
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, t + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.5);
      });
    } else if (type === 'overall-win') {
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => { 
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, t + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.6);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.6);
      });
    } else if (type === 'point' || type === 'unmute') {
       const osc = ctx.createOscillator();
       const gain = ctx.createGain();
       osc.type = 'sine'; osc.frequency.setValueAtTime(800, t);
       osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);
       gain.gain.setValueAtTime(0, t);
       gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
       gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
       osc.connect(gain); gain.connect(ctx.destination);
       osc.start(t); osc.stop(t + 0.1);
    }
  } catch(e) {}
};

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(() => getSaved('board', Array(9).fill(null)));
  const [humanSymbol, setHumanSymbol] = useState<Player>(() => getSaved('humanSymbol', 'O'));
  const [startingPlayer, setStartingPlayer] = useState<Player>(() => getSaved('startingPlayer', 'O'));
  const [isXNext, setIsXNext] = useState(() => getSaved('isXNext', false));
  const [scores, setScores] = useState(() => getSaved('scores', { X: 0, O: 0, Draws: 0 }));
  const [isSinglePlayer, setIsSinglePlayer] = useState(() => getSaved('isSinglePlayer', true));
  
  const [isSoundOn, setIsSoundOn] = useState(() => getSaved('isSoundOn', true));
  const [useDefaultTheme, setUseDefaultTheme] = useState(() => getSaved('useDefaultTheme', true));
  const [themeIdx, setThemeIdx] = useState(() => getSaved('themeIdx', 0));
  const [xColorIdx, setXColorIdx] = useState(() => getSaved('xColorIdx', 0));
  const [oColorIdx, setOColorIdx] = useState(() => getSaved('oColorIdx', 9));
  const [customLineIdx, setCustomLineIdx] = useState(() => getSaved('customLineIdx', 0));
  
  const [p1Custom, setP1Custom] = useState(() => getSaved('p1Custom', false));
  const [p1Idx, setP1Idx] = useState(() => getSaved('p1Idx', 0));
  const [p2Custom, setP2Custom] = useState(() => getSaved('p2Custom', false));
  const [p2Idx, setP2Idx] = useState(() => getSaved('p2Idx', 1));
  
  const [targetScore, setTargetScore] = useState(() => getSaved('targetScore', 5));
  const [userWantsTargetScore, setUserWantsTargetScore] = useState(() => getSaved('userWantsTargetScore', true));
  const [isTargetScoreEnabled, setIsTargetScoreEnabled] = useState(() => getSaved('isTargetScoreEnabled', true));

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = getSaved('isDarkMode', null);
    if (saved !== null) return saved;
    if (typeof window !== 'undefined') return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    return true; 
  });
  
  const [uiDarkMode, setUiDarkMode] = useState(() => isDarkMode); 
  const [isAmoled, setIsAmoled] = useState(() => getSaved('isAmoled', false));

  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(() => getSaved('winnerInfo', null));
  const [isDraw, setIsDraw] = useState(() => getSaved('isDraw', false));
  
  const [overallWinner, setOverallWinner] = useState<Player | null>(() => getSaved('overallWinner', null));
  const [showWinnerModal, setShowWinnerModal] = useState(() => {
      const ow = getSaved('overallWinner', null);
      return ow !== null;
  });

  const lastMoveIdxRef = useRef<number | null>(getSaved('lastMoveIdx', null));
  const [linePoints, setLinePoints] = useState<{ type: 'normal' | 'center-out', start: { x: number; y: number }; end: { x: number; y: number }, mid: { x: number; y: number } } | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isHoldingBanner, setIsHoldingBanner] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [activeCell, setActiveCell] = useState<number | null>(null);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const myConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const modeHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const restartHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const turnHoldTimer = useRef<NodeJS.Timeout | null>(null);
  const restartPointerDown = useRef(false);
  
  const isTransitioning = useRef(false);
  const isGameEnding = useRef(false);

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('humanSymbol', JSON.stringify(humanSymbol));
    localStorage.setItem('startingPlayer', JSON.stringify(startingPlayer));
    localStorage.setItem('isXNext', JSON.stringify(isXNext));
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('isSinglePlayer', JSON.stringify(isSinglePlayer));
    localStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
    localStorage.setItem('useDefaultTheme', JSON.stringify(useDefaultTheme));
    localStorage.setItem('themeIdx', JSON.stringify(themeIdx));
    localStorage.setItem('xColorIdx', JSON.stringify(xColorIdx));
    localStorage.setItem('oColorIdx', JSON.stringify(oColorIdx));
    localStorage.setItem('customLineIdx', JSON.stringify(customLineIdx));
    localStorage.setItem('p1Custom', JSON.stringify(p1Custom));
    localStorage.setItem('p1Idx', JSON.stringify(p1Idx));
    localStorage.setItem('p2Custom', JSON.stringify(p2Custom));
    localStorage.setItem('p2Idx', JSON.stringify(p2Idx));
    localStorage.setItem('targetScore', JSON.stringify(targetScore));
    localStorage.setItem('userWantsTargetScore', JSON.stringify(userWantsTargetScore));
    localStorage.setItem('isTargetScoreEnabled', JSON.stringify(isTargetScoreEnabled));
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('isAmoled', JSON.stringify(isAmoled));
    localStorage.setItem('winnerInfo', JSON.stringify(winnerInfo));
    localStorage.setItem('isDraw', JSON.stringify(isDraw));
    localStorage.setItem('overallWinner', JSON.stringify(overallWinner));
    localStorage.setItem('lastMoveIdx', JSON.stringify(lastMoveIdxRef.current));
  }, [board, humanSymbol, startingPlayer, isXNext, scores, isSinglePlayer, isSoundOn, useDefaultTheme, themeIdx, xColorIdx, oColorIdx, customLineIdx, p1Custom, p1Idx, p2Custom, p2Idx, targetScore, userWantsTargetScore, isTargetScoreEnabled, isDarkMode, isAmoled, winnerInfo, isDraw, overallWinner]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const backSub = CapApp.addListener('backButton', () => {
      if (isAboutOpen) setIsAboutOpen(false);
      else if (isSettingsOpen) setIsSettingsOpen(false);
      else CapApp.exitApp();
    });
    return () => { backSub.then(sub => sub.remove()); };
  }, [isAboutOpen, isSettingsOpen]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        const activeBgColor = isDarkMode && isAmoled 
          ? '#000000' 
          : (useDefaultTheme 
              ? (isDarkMode ? ORIGINAL_THEME.dark : ORIGINAL_THEME.light) 
              : (isDarkMode ? CUSTOM_THEMES[themeIdx].dark : CUSTOM_THEMES[themeIdx].light));
        
        StatusBar.setBackgroundColor({ color: activeBgColor });
        StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light });
      } catch (e) {
        console.warn("Status bar customization failed:", e);
      }
    }
    
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode, isAmoled, themeIdx, useDefaultTheme]);

  const handleThemeToggle = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const nextDark = !isDarkMode;
    setUiDarkMode(nextDark); 
    hapticFeedback([80]); 
    playEnhancedSound('pop', isSoundOn);

    setTimeout(() => {
        setIsDarkMode(nextDark);
        
        setTimeout(() => {
            isTransitioning.current = false; 
        }, 1000);
    }, 400); 
  };

  const toggleSound = () => {
    hapticFeedback(80);
    if (!isSoundOn) playEnhancedSound('unmute', true);
    setIsSoundOn(!isSoundOn);
  };

  const fireConfetti = (winner: Player) => {
    if (!canvasRef.current) return;
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    myConfettiRef.current = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    
    const colors = winner === 'X' ? [PLAYER_COLORS[xColorIdx]] : [PLAYER_COLORS[oColorIdx]]; 
    
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
    if (isResetting) {
        isGameEnding.current = false;
        return;
    }
    if (winnerInfo || isDraw || overallWinner || isGameEnding.current) return;
    
    let hasWinner = false;
    let winningLine: number[] = [];
    let winner: Player | null = null;

    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        hasWinner = true;
        winner = board[a] as Player;
        winningLine = combination;
        break;
      }
    }

    if (hasWinner && winner) {
        isGameEnding.current = true;
        setTimeout(() => {
            setWinnerInfo({ winner: winner as Player, line: winningLine });
            
            setScores(prev => {
                const currentScore = prev[winner as Player];
                const newScore = currentScore + 1;
                
                if (isTargetScoreEnabled && newScore >= targetScore) {
                   setOverallWinner(winner);
                   playEnhancedSound('overall-win', isSoundOn);
                   setTimeout(() => setShowWinnerModal(true), 1200); 
                } else {
                   playEnhancedSound('win', isSoundOn);
                }
                return { ...prev, [winner as Player]: newScore };
            }); 
            
            hapticFeedback([100, 50, 100, 50, 300]); 
            fireConfetti(winner);
        }, 450); 
    } else if (!board.includes(null)) {
        isGameEnding.current = true;
        setTimeout(() => {
            setIsDraw(true);
            setScores(prev => ({ ...prev, Draws: prev.Draws + 1 })); 
            playEnhancedSound('point', isSoundOn);
            hapticFeedback([200, 50, 200, 50, 300]); 
        }, 450);
    }
  }, [board, isSoundOn, isResetting, xColorIdx, oColorIdx, targetScore, isTargetScoreEnabled, winnerInfo, isDraw, overallWinner]);

  const aiPlayerSymbol = isSinglePlayer ? (humanSymbol === 'X' ? 'O' : 'X') : null;
  const isAITurn = isSinglePlayer && aiPlayerSymbol && ((isXNext && aiPlayerSymbol === 'X') || (!isXNext && aiPlayerSymbol === 'O'));

  useEffect(() => {
    if (isAITurn && !winnerInfo && !isDraw && !isResetting && !overallWinner && !isGameEnding.current) {
      const aiTimer = setTimeout(() => {
        const humanScore = scores[humanSymbol];
        const bestMove = findBestMove(
           [...board], 
           aiPlayerSymbol, 
           humanScore, 
           targetScore, 
           isTargetScoreEnabled
        );
        
        if (bestMove !== -1) {
          setActiveCell(bestMove);
          hapticFeedback(50);
          
          setTimeout(() => {
              const newBoard = [...board];
              newBoard[bestMove] = aiPlayerSymbol;
              setActiveCell(null);
              hapticFeedback(80); 
              playEnhancedSound('tap', isSoundOn);
              lastMoveIdxRef.current = bestMove;
              setBoard(newBoard);
              setIsXNext(aiPlayerSymbol === 'O');
          }, 150);
        }
      }, 500); 
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw, aiPlayerSymbol, isAITurn, isSoundOn, isResetting, overallWinner, scores, humanSymbol, targetScore, isTargetScoreEnabled]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo || isAITurn || isResetting || overallWinner || isGameEnding.current || activeCell !== null) return;
    hapticFeedback(80); 
    playEnhancedSound('tap', isSoundOn);
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    lastMoveIdxRef.current = index;
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const isGameCompletelyFresh = scores.X === 0 && scores.O === 0 && scores.Draws === 0 && board.every(c => c === null);

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
      setShowWinnerModal(false);
      isGameEnding.current = false;
      setIsResetting(false);
      if (userWantsTargetScore) setIsTargetScoreEnabled(true);
  };

  const resetGameForMode = (currentStartingPlayer: Player) => {
    hapticFeedback(60); 
    playEnhancedSound('pop', isSoundOn);
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();

    setIsResetting(true);
    isGameEnding.current = false;
    
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setIsXNext(currentStartingPlayer === 'X');
      setWinnerInfo(null);
      setIsDraw(false);
      setLinePoints(null);
      lastMoveIdxRef.current = null;
      setIsResetting(false);
    }, 450); 
  };

  const handleTurnHoldStart = () => {
    if (isGameCompletelyFresh && !winnerInfo) {
      setIsHoldingBanner(true);
      turnHoldTimer.current = setTimeout(() => {
        hapticFeedback([80, 40, 80]); 
        playEnhancedSound('mode', isSoundOn); 
        setHumanSymbol(prev => {
          const next = prev === 'X' ? 'O' : 'X';
          setStartingPlayer(next);
          setIsXNext(next === 'X');
          return next;
        });
        setIsHoldingBanner(false);
      }, 600);
    }
  };
  
  const handleTurnHoldEnd = () => {
    setIsHoldingBanner(false);
    if (turnHoldTimer.current) clearTimeout(turnHoldTimer.current);
  };

  const handleTurnBannerClick = () => {
    if (!isGameCompletelyFresh && board.every(c => c === null) && !winnerInfo && !overallWinner) {
       hapticFeedback(60);
       playEnhancedSound('mode', isSoundOn); 
       setStartingPlayer(prev => {
          const next = prev === 'X' ? 'O' : 'X';
          setIsXNext(next === 'X');
          return next;
       });
    }
  };

  const handleModeHoldStart = () => {
    modeHoldTimer.current = setTimeout(() => {
      hapticFeedback([80, 40, 80]); 
      playEnhancedSound('mode', isSoundOn);
      setIsSinglePlayer(true);
      
      setStartingPlayer(prevStarter => {
         const aiSym = humanSymbol === 'X' ? 'O' : 'X';
         const newStarter = prevStarter === humanSymbol ? aiSym : humanSymbol;
         setTimeout(() => performHardReset(newStarter), 0);
         return newStarter;
      });
    }, 600);
  };
  
  const handleModeHoldEnd = () => {
    if (modeHoldTimer.current) clearTimeout(modeHoldTimer.current);
  };
  
  const switchModeClick = (single: boolean) => {
    if (isSinglePlayer === single) return;
    hapticFeedback(60);
    playEnhancedSound('mode', isSoundOn);
    setIsSinglePlayer(single);
    performHardReset(humanSymbol); 
  };

  const handleRestartPointerDown = () => {
    restartPointerDown.current = true;
    restartHoldTimer.current = setTimeout(() => {
      if (!restartPointerDown.current) return;
      hapticFeedback([100, 50, 100, 50]); 
      setRotation(prev => prev - 720);
      performHardReset(startingPlayer); 
    }, 600);
  };
  
  const handleRestartPointerUp = () => {
    restartPointerDown.current = false;
    if (restartHoldTimer.current) {
        clearTimeout(restartHoldTimer.current);
        const holdTime = restartHoldTimer.current as any;
        if (Date.now() - holdTime._calledAt > 600) return;
    }
    setRotation(prev => prev - 360);
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
        const [a, b, c] = winnerInfo.line;
        
        let pA = getCellCenter(a);
        let pC = getCellCenter(c);
        
        if (Math.abs(pA.x - pC.x) < 0.1) pC.x += 0.01;
        if (Math.abs(pA.y - pC.y) < 0.1) pC.y += 0.01;

        const pB = { x: (pA.x + pC.x) / 2, y: (pA.y + pC.y) / 2 };

        if (lastMoveIdxRef.current === b) {
           setLinePoints({ type: 'center-out', start: pA, end: pC, mid: pB });
        } else if (lastMoveIdxRef.current === a) {
           setLinePoints({ type: 'normal', start: pA, end: pC, mid: pB });
        } else {
           setLinePoints({ type: 'normal', start: pC, end: pA, mid: pB });
        }
      } else if (!winnerInfo && !isResetting) {
        setLinePoints(null);
      }
    };
    setTimeout(updatePoints, 50);
    window.addEventListener('resize', updatePoints);
    return () => window.removeEventListener('resize', updatePoints);
  }, [winnerInfo, isResetting]);

  const activeTheme = useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[themeIdx];
  const availableLinesLight = [...activeTheme.linesLight, ...EXTRA_LINE_COLORS];
  const availableLinesDark = [...activeTheme.linesDark, ...EXTRA_LINE_COLORS];
  const activeLineColor = isDarkMode ? availableLinesDark[customLineIdx] : availableLinesLight[customLineIdx];
  const themeIndicatorColor = isDarkMode ? activeTheme.indicatorDark : activeTheme.indicatorLight;
  
  const baseTextColor = isDarkMode ? '#ffffff' : '#111111';
  const tintedTextColor = !useDefaultTheme ? `color-mix(in srgb, ${baseTextColor} 60%, ${themeIndicatorColor})` : baseTextColor;

  const semantics = {
    screenBackground: isDarkMode && isAmoled ? '#000000' : (isDarkMode ? activeTheme.dark : activeTheme.light),
    mainGridBackground: isDarkMode && isAmoled ? (useDefaultTheme ? '#0c0c0c' : blendDarker(activeTheme.gridDark, 0.6)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
    squareBackground: isDarkMode && isAmoled ? (useDefaultTheme ? '#171717' : blendDarker(activeTheme.cellDark, 0.6)) : (isDarkMode ? activeTheme.cellDark : activeTheme.cellLight),
    text: tintedTextColor,
    modeSliderContainer: { bg: isDarkMode && isAmoled ? (useDefaultTheme ? '#0c0c0c' : blendDarker(activeTheme.gridDark, 0.6)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight) },
    bannerDefault: isDarkMode ? { bg: isAmoled ? (useDefaultTheme ? '#0c0c0c' : blendDarker(activeTheme.gridDark, 0.6)) : activeTheme.gridDark, text: tintedTextColor } : { bg: activeTheme.gridLight, text: tintedTextColor },
    scoreBg: isDarkMode && isAmoled ? (useDefaultTheme ? '#0c0c0c' : blendDarker(activeTheme.gridDark, 0.6)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
    topNavBtn: isDarkMode && isAmoled ? (useDefaultTheme ? '#0c0c0c' : blendDarker(activeTheme.gridDark, 0.6)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
  };

  const navBtnClass = "w-[48px] h-[48px] rounded-full active:scale-95 shadow-sm flex items-center justify-center overflow-hidden relative border-none z-50 cursor-pointer transition-colors duration-1000";
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
        @font-face {
          font-family: 'NunitoCustom';
          src: url('${nunitoFont}') format('truetype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NunitoBlack';
          src: url('${nunitoBlackFont}') format('truetype');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        .font-nunito { font-family: 'NunitoCustom', sans-serif; font-weight: 700; }
        .font-nunito-black { font-family: 'NunitoBlack', sans-serif; font-weight: 900; }
        
        .m3-scrollbar::-webkit-scrollbar { width: 6px; }
        .m3-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .m3-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; 
          border-radius: 10px; 
        }
      `}</style>
      
      <div 
          style={{ 
            backgroundColor: semantics.screenBackground,
            paddingTop: 'max(24px, env(safe-area-inset-top))',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))'
          }}
          className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 transition-colors duration-1000 relative overflow-hidden font-nunito">
        
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />

        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.4 }}
          style={{ top: 'max(16px, env(safe-area-inset-top))' }}
          className="absolute left-0 right-0 h-20 px-6 flex items-center justify-between z-50 w-full max-w-[420px] mx-auto">
          
          <motion.button whileTap={{ scale: 0.85, y: 2 }} onClick={handleThemeToggle} className={navBtnClass} style={getNavBtnStyle()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={uiDarkMode ? 'dark' : 'light'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                {uiDarkMode ? <Sun className="w-[20px] h-[20px]" /> : <Moon className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button 
             whileTap={{ scale: 0.85, y: 2 }}
             onPointerDown={handleRestartPointerDown} 
             onPointerUp={handleRestartPointerUp}
             onPointerLeave={handleRestartPointerUp}
             className={navBtnClass} style={getNavBtnStyle()}
          >
            <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <RotateCcw className="w-[20px] h-[20px]" />
            </motion.div>
          </motion.button>

          <motion.button whileTap={{ scale: 0.85, y: 2 }} onClick={toggleSound} className={navBtnClass} style={getNavBtnStyle()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={isSoundOn ? 'on' : 'off'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                {isSoundOn ? <Volume2 className="w-[20px] h-[20px]" /> : <VolumeX className="w-[20px] h-[20px]" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          <motion.button whileTap={{ scale: 0.85, y: 2 }} onClick={() => { hapticFeedback(60); playEnhancedSound('pop', isSoundOn); setIsSettingsOpen(true); }} className={navBtnClass} style={getNavBtnStyle()}>
            <MoreVertical className="w-[20px] h-[20px]" />
          </motion.button>
        </motion.nav>

        <motion.div 
           initial={{ opacity: 0, scale: 0.9, y: 15 }} 
           animate={{ opacity: 1, scale: 1, y: 0 }} 
           transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
           className="w-full max-w-md mx-auto flex flex-col items-center gap-4 relative"
        >
                    <header className="text-center space-y-5 pt-24 z-10 relative w-full overflow-visible">
            <motion.h1 style={{ color: semantics.text }} className="font-nunito-black text-[40px] sm:text-[44px] tracking-tight drop-shadow-sm transition-colors duration-1000">
              Tic Tac Toe
            </motion.h1>

            <div style={{ backgroundColor: semantics.modeSliderContainer.bg }} className="flex p-1.5 rounded-[28px] relative w-[272px] mx-auto shadow-sm transition-colors duration-1000">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[130px] rounded-[24px] shadow-sm transition-colors duration-1000"
                style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff' }}
                animate={{ x: isSinglePlayer ? 0 : 130 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
              />
              <button onClick={() => switchModeClick(true)} onPointerDown={handleModeHoldStart} onPointerUp={handleModeHoldEnd} onPointerLeave={handleModeHoldEnd} style={{ color: semantics.text, opacity: isSinglePlayer ? 1 : 0.5 }} className="relative w-[130px] h-[48px] rounded-[24px] text-[15px] font-bold z-10 select-none flex items-center justify-center gap-1.5 transition-all duration-1000">
                <span className="relative z-10 flex items-center gap-1.5">{isSinglePlayer && startingPlayer !== humanSymbol ? <><AILogo /> AI First</> : <><AILogo /> 1 Player</>}</span>
              </button>
              <button onClick={() => switchModeClick(false)} style={{ color: semantics.text, opacity: !isSinglePlayer ? 1 : 0.5 }} className="relative w-[130px] h-[48px] rounded-[24px] text-[15px] font-bold z-10 select-none flex items-center justify-center gap-1.5 transition-all duration-1000">
                <span className="relative z-10 flex items-center gap-1.5"><UsersRound color="currentColor" className="w-[18px] h-[18px]" strokeWidth={2.5}/> 2 Players</span>
              </button>
            </div>

            <motion.div 
              onClick={handleTurnBannerClick}
              onPointerDown={handleTurnHoldStart} onPointerUp={handleTurnHoldEnd} onPointerLeave={handleTurnHoldEnd} 
              animate={{ scale: winnerInfo ? 1.05 : 1 }} 
              style={{ backgroundColor: semantics.bannerDefault.bg, color: semantics.bannerDefault.text }} 
              className={`mx-auto w-[210px] h-[52px] rounded-full text-[16px] flex flex-col items-center justify-center gap-1 shadow-sm select-none relative overflow-hidden transition-colors duration-1000 ${isGameCompletelyFresh || (!isGameCompletelyFresh && board.every(c => c === null) && !winnerInfo && !overallWinner) ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-2 relative z-10">
                {winnerInfo ? (
                  <><Sparkles className="w-4 h-4" style={{ color: activeLineColor }} /><span className="font-bold">Winner: Player {winnerInfo.winner}!</span></>
                ) : isDraw ? (<span className="font-bold">It's a Stalemate!</span>) : (
                  <>
                    {isAITurn ? (
                      <div className="flex items-center gap-1.5 h-8">
                        <span className="mr-1 font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3B30] via-[#4CD964] to-[#007AFF]">AI Thinking</span>
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF3B30' }} />
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#4CD964' }} />
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#007AFF' }} />
                      </div>
                    ) : (
                      <div className="flex items-center h-8 font-bold">
                        Player&nbsp;
                        <div className="relative h-8 w-6 overflow-hidden flex items-center justify-center">
                          <AnimatePresence mode="popLayout">
                            <motion.div key={isXNext ? 'X' : 'O'} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute flex items-center justify-center">
                              <DynamicIcon player={isXNext ? 'X' : 'O'} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={isXNext ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[oColorIdx]} className="w-5 h-5 drop-shadow-sm" />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        &nbsp;'s turn
                      </div>
                    )}
                  </>
                )}
              </div>
              {isGameCompletelyFresh && (
                <div className={`absolute bottom-1.5 w-full flex flex-col items-center z-10 transition-opacity duration-300 pointer-events-none opacity-100`}>
                  <div className="h-[2px] w-12 bg-transparent rounded-full overflow-hidden relative">
                     <motion.div
                       initial={{ x: "-100%" }} animate={{ x: isHoldingBanner ? "0%" : "-100%" }}
                       transition={{ duration: isHoldingBanner ? 0.6 : 0, ease: "linear" }}
                       className="absolute inset-0 bg-gray-500 dark:bg-gray-300"
                     />
                  </div>
                </div>
              )}
            </motion.div>
          </header>

          <div className="flex gap-3 justify-center z-10 w-full max-w-[280px] sm:max-w-[320px] relative overflow-visible select-none">
             <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                <div className="flex items-center justify-center mb-0.5 opacity-90">
                   <DynamicIcon player="X" p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={PLAYER_COLORS[xColorIdx]} className="w-3.5 h-3.5" />
                </div>
                <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={displayScore(scores.X)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: PLAYER_COLORS[xColorIdx] }}>
                      {displayScore(scores.X)}
                    </motion.span>
                  </AnimatePresence>
                </div>
             </div>

             <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg, color: semantics.text }}>
                <span className="text-[10px] sm:text-xs font-black uppercase opacity-60">Draws</span>
                <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={scores.Draws} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black opacity-80">
                      {scores.Draws}
                    </motion.span>
                  </AnimatePresence>
                </div>
             </div>

             <div className="flex-1 flex flex-col items-center py-2 rounded-[20px] shadow-sm transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                <div className="flex items-center justify-center mb-0.5 opacity-90">
                   <DynamicIcon player="O" p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={PLAYER_COLORS[oColorIdx]} className="w-3.5 h-3.5" />
                </div>
                <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={displayScore(scores.O)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: PLAYER_COLORS[oColorIdx] }}>
                      {displayScore(scores.O)}
                    </motion.span>
                  </AnimatePresence>
                </div>
             </div>
          </div>

          <div className="relative group z-10 mt-2">
            <motion.div 
              animate={isDraw ? { x: [-12, 12, -12, 12, -6, 6, 0], opacity: 1, scale: 1 } : { x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              initial={{ opacity: 0, scale: 0.95 }} 
              style={{ backgroundColor: semantics.mainGridBackground }} 
              className="relative p-4 sm:p-5 rounded-[36px] sm:rounded-[40px] shadow-lg backdrop-blur-md overflow-hidden transition-colors duration-1000"
            >
              <div ref={boardRef} className="grid grid-cols-3 grid-rows-3 gap-3 relative z-10 w-[240px] sm:w-[280px] aspect-square">
                                {board.map((value, i) => {
                  const isWinningCell = winnerInfo && winnerInfo.line.includes(i);
                  const isSquished = activeCell === i;
                  return (
                  <motion.button 
                    key={i} id={`cell-${i}`} onClick={() => handleClick(i)} 
                    style={{ backgroundColor: semantics.squareBackground, boxShadow: isDarkMode && !value && (!isAmoled || !useDefaultTheme) ? 'inset 0 2px 4px rgba(255,255,255,0.015)' : 'none', borderRadius: '24px' }} 
                    whileTap={!value && !winnerInfo && !isAITurn && !isResetting && !overallWinner ? { borderRadius: '50%', scale: 0.85 } : {}}
                    animate={isSquished ? { borderRadius: '50%', scale: 0.85 } : { borderRadius: '24px', scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className={`w-full h-full flex items-center justify-center relative overflow-hidden shadow-sm transition-colors duration-1000 ${!value && !winnerInfo && !isAITurn && !isResetting && !overallWinner ? 'hover:brightness-110 cursor-pointer' : 'cursor-default'}`} disabled={!!value || !!winnerInfo || isAITurn || isResetting || overallWinner}
                  >
                    <AnimatePresence>
                      {value && !isResetting && (
                        <motion.div 
                           key={value}
                           initial={{ scale: 0, rotate: -180, opacity: 0 }} 
                           animate={
                               isWinningCell 
                               ? { scale: [1, 1.4, 0.85, 1.15, 1], rotate: 0, opacity: 1 } 
                               : { scale: 1, rotate: 0, opacity: 1 }
                           } 
                           exit={{ scale: 0, rotate: 180, opacity: 0 }} 
                           transition={
                               isWinningCell
                               ? { duration: 0.65, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] }
                               : { type: 'spring', stiffness: 500, damping: 14, mass: 1 } 
                           } 
                           className="w-full h-full flex items-center justify-center"
                        >
                           <DynamicIcon player={value} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={value === 'X' ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[oColorIdx]} className="w-3/5 h-3/5 drop-shadow-sm" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )})}


                <AnimatePresence>
                  {linePoints && winnerInfo && (
                    <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <filter id="win-blur" x="-50" y="-50" width="200" height="200" filterUnits="userSpaceOnUse">
                          <feGaussianBlur stdDeviation="3" />
                        </filter>
                        <mask id="hollow-mask" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200">
                          <rect x="-50" y="-50" width="200" height="200" fill="white" />
                          {linePoints.type === 'center-out' ? (
                             <>
                               <motion.line
                                 initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                                 transition={{ duration: 0.45, ease: "easeInOut" }}
                                 x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                                 x2={`${linePoints.start.x}%`} y2={`${linePoints.start.y}%`}
                                 stroke="black" strokeWidth="6" strokeLinecap="round"
                               />
                               <motion.line
                                 initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                                 transition={{ duration: 0.45, ease: "easeInOut" }}
                                 x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                                 x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                                 stroke="black" strokeWidth="6" strokeLinecap="round"
                               />
                             </>
                          ) : (
                             <motion.line
                               initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                               transition={{ duration: 0.45, ease: "easeInOut" }}
                               x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                               x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                               stroke="black" strokeWidth="6" strokeLinecap="round"
                             />
                          )}
                        </mask>
                      </defs>

                      {linePoints.type === 'center-out' ? (
                         <>
                           <motion.line
                             initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                             transition={{ duration: 0.45, ease: "easeInOut" }}
                             x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                             x2={`${linePoints.start.x}%`} y2={`${linePoints.start.y}%`}
                             stroke={activeLineColor} strokeWidth="8" strokeLinecap="round" mask="url(#hollow-mask)"
                           />
                           <motion.line
                             initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                             transition={{ duration: 0.45, ease: "easeInOut" }}
                             x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                             x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                             stroke={activeLineColor} strokeWidth="8" strokeLinecap="round" mask="url(#hollow-mask)"
                           />
                         </>
                      ) : (
                         <motion.line
                           initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                           transition={{ duration: 0.45, ease: "easeInOut" }}
                           x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                           x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                           stroke={activeLineColor} strokeWidth="8" strokeLinecap="round" mask="url(#hollow-mask)"
                         />
                      )}

                      {linePoints.type === 'center-out' ? (
                         <>
                           <motion.line
                             initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                             transition={{ duration: 0.45, ease: "easeInOut" }}
                             x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                             x2={`${linePoints.start.x}%`} y2={`${linePoints.start.y}%`}
                             stroke={activeLineColor} strokeWidth="6" strokeLinecap="round" opacity={0.35} filter="url(#win-blur)"
                           />
                           <motion.line
                             initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                             transition={{ duration: 0.45, ease: "easeInOut" }}
                             x1={`${linePoints.mid.x}%`} y1={`${linePoints.mid.y}%`}
                             x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                             stroke={activeLineColor} strokeWidth="6" strokeLinecap="round" opacity={0.35} filter="url(#win-blur)"
                           />
                         </>
                      ) : (
                         <motion.line
                           initial={{ pathLength: 0 }} animate={{ pathLength: isResetting ? 0 : 1 }}
                           transition={{ duration: 0.45, ease: "easeInOut" }}
                           x1={`${linePoints.start.x}%`} y1={`${linePoints.start.y}%`}
                           x2={`${linePoints.end.x}%`} y2={`${linePoints.end.y}%`}
                           stroke={activeLineColor} strokeWidth="6" strokeLinecap="round" opacity={0.35} filter="url(#win-blur)"
                         />
                      )}
                    </svg>
                  )}
                </AnimatePresence>

              </div>
              
                <AnimatePresence>
          {showWinnerModal && overallWinner && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/15 backdrop-blur-sm">
              
              <motion.div initial={{ scale: 0.8, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 10 }} style={{ color: semantics.text }} className="w-full max-w-[280px] flex flex-col items-center justify-center gap-3 text-center">
                 
                   <div className="flex flex-col items-center gap-1 z-10 w-full">
                   <h2 className="font-nunito-black text-3xl tracking-tight leading-tight drop-shadow-md" style={{ color: semantics.text }}>
                     Winner!
                   </h2>

                   <motion.span animate={{ scale: [1, 1.2, 0.9, 1] }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="drop-shadow-xl flex justify-center mt-2 mb-1">
                     <DynamicIcon player={overallWinner} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={overallWinner === 'X' ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[oColorIdx]} className="w-16 h-16" />
                   </motion.span>
                 </div>
                 
                 <div className="flex flex-col w-full gap-2.5 pt-1 z-10">
                    <motion.button onClick={() => { hapticFeedback(50); performHardReset(startingPlayer); }} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none bg-black/10 backdrop-blur-md" style={{ border: `2px solid ${activeLineColor}`, color: semantics.text }}>
                       Start a New Game
                    </motion.button>
                    <motion.button onClick={() => { hapticFeedback(30); setIsTargetScoreEnabled(false); resetGameForMode(startingPlayer, false); setOverallWinner(null); setShowWinnerModal(false); }} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none" style={{ backgroundColor: activeLineColor, color: (isDarkMode && !useDefaultTheme && activeTheme.indicatorDark === '#ffffff') ? '#000000' : '#ffffff' }}>
                       Continue This Game
                    </motion.button>
                 </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


                            
            </motion.div>
          </div>
          
        </motion.div>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div onClick={() => setIsSettingsOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-sm p-6 rounded-[36px] shadow-2xl relative border border-white/5 transition-colors duration-1000">
                
                <button onClick={() => setIsSettingsOpen(false)} className="absolute top-5 right-5 p-2 transition-opacity hover:opacity-70 z-[160]">
                  <CloseIcon className="w-6 h-6" />
                </button>
                
                   <div className="flex gap-3 items-center mb-6">
                    <button onClick={() => setIsAboutOpen(true)} className="p-2 transition-opacity hover:opacity-70">
                        <Info className="w-6 h-6" />
                    </button>
                    <h2 className="font-nunito-black text-2xl">Appearance</h2>
                </div>

                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 m3-scrollbar">
                  
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-5 h-5 flex items-center justify-center opacity-70">
                              <DynamicIcon player="X" p1Custom={false} p1Idx={0} p2Custom={false} p2Idx={0} color="currentColor" className="w-4 h-4"/>
                           </div>
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player X</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setP1Custom(!p1Custom); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: p1Custom ? activeLineColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: p1Custom ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {p1Custom && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto m3-scrollbar p-1">
                              {ICONS_LIST.map((IconComponent, idx) => (
                                 <button key={idx} onClick={() => { hapticFeedback(20); setP1Idx(idx); }} className={`p-2 rounded-xl flex items-center justify-center border-2 transition-colors ${p1Idx === idx ? 'border-sky-500 bg-sky-500/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <IconComponent className="w-6 h-6" color={PLAYER_COLORS[xColorIdx]} fill={PLAYER_COLORS[xColorIdx]} strokeWidth={2.5} />
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-5 h-5 flex items-center justify-center opacity-70">
                              <DynamicIcon player="O" p1Custom={false} p1Idx={0} p2Custom={false} p2Idx={0} color="currentColor" className="w-4 h-4"/>
                           </div>
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player O</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setP2Custom(!p2Custom); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: p2Custom ? activeLineColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: p2Custom ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {p2Custom && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto m3-scrollbar p-1">
                              {ICONS_LIST.map((IconComponent, idx) => (
                                 <button key={idx} onClick={() => { hapticFeedback(20); setP2Idx(idx); }} className={`p-2 rounded-xl flex items-center justify-center border-2 transition-colors ${p2Idx === idx ? 'border-sky-500 bg-sky-500/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <IconComponent className="w-6 h-6" color={PLAYER_COLORS[oColorIdx]} fill={PLAYER_COLORS[oColorIdx]} strokeWidth={2.5} />
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  <div>
                     <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Theme Style</h3>
                     <div className="flex gap-2 p-1.5 rounded-2xl transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                        <button onClick={() => { hapticFeedback(20); setUseDefaultTheme(true); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           {ORIGINAL_THEME.name}
                        </button>
                        <button onClick={() => { hapticFeedback(20); setUseDefaultTheme(false); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!useDefaultTheme ? 'bg-white text-black shadow-sm' : 'opacity-70 text-current'}`}>
                           Custom (M3)
                        </button>
                     </div>
                  </div>
                  
                  <AnimatePresence>
                    {isDarkMode && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <div className="flex items-center justify-between rounded-2xl p-4 transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                              <div className="flex items-center gap-2.5">
                                 <Moon className="w-5 h-5 opacity-70" />
                                 <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Pure Black (AMOLED)</h3>
                              </div>
                              <motion.button onClick={() => { hapticFeedback(30); setIsAmoled(!isAmoled); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: isAmoled ? activeLineColor : '#3f4753' }}>
                                  <motion.div animate={{ x: isAmoled ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                              </motion.button>
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <Target className="w-5 h-5 opacity-70" />
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Target Point Win</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setIsTargetScoreEnabled(!isTargetScoreEnabled); setUserWantsTargetScore(!isTargetScoreEnabled); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: isTargetScoreEnabled ? activeLineColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: isTargetScoreEnabled ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
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
                    </motion.div>
                  )}
                  
                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold mt-4">Winning Line Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {(isDarkMode ? availableLinesDark : availableLinesLight).map((color, idx) => (
                        <button key={`line-${idx}`} onClick={() => { hapticFeedback(20); setCustomLineIdx(idx); }} style={{ backgroundColor: color, borderColor: customLineIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                          {customLineIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Player X Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {PLAYER_COLORS.map((color, idx) => (
                        <button key={`x-${idx}`} onClick={() => { hapticFeedback(20); setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: xColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                           {xColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Player O Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {PLAYER_COLORS.map((color, idx) => (
                        <button key={`o-${idx}`} onClick={() => { hapticFeedback(20); setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: oColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
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
        
        <AnimatePresence>
          {isAboutOpen && (
            <motion.div onClick={() => setIsAboutOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-[420px] p-7 rounded-[36px] shadow-2xl relative border border-white/5 transition-colors duration-1000">
                
                <button onClick={() => setIsAboutOpen(false)} className="absolute top-5 right-5 p-2 transition-opacity hover:opacity-70 z-[170]">
                  <CloseIcon className="w-6 h-6" />
                </button>
                
                  <div className="flex items-center gap-2.5 mb-6 opacity-80">
                    <Info className="w-6 h-6 mr-1" />
                    <h2 className="font-nunito-black text-3xl">About Game</h2>
                </div>

                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-3 m3-scrollbar font-nunito font-normal text-[15px] opacity-80">
                  <p>This is a premium <span className="font-bold">Tic Tac Toe</span> game crafted with Google's <span className="font-bold text-sky-500">Material You (M3)</span> design system. Customize themes, colors, and target scores for a personalized experience.</p>
                  
                  <div className="space-y-3.5">
                    <h4 className="text-lg font-extrabold tracking-tight opacity-90 pt-2">Key Features</h4>
                    <p>🤖 <span className="font-bold">1 Player (AI):</span> Play against an intelligent AI.</p>
                    <p>👥 <span className="font-bold">2 Players:</span> Switch modes with one tap and play with a friend on the same device.</p>
                    <p>🎯 <span className="font-bold">Target Score Win:</span> Set a custom point target (1-20) to win the full match. Note: You cannot set the target below the current highest score.</p>
                    <p>🎨 <span className="font-bold">Material You Themes:</span> Choose from 15 beautiful color schemes, and customize the Player colors and Winning Line colors.</p>
                    <p>✨ <span className="font-bold">Custom Shapes:</span> Choose up to 50 unique geometric and nature-inspired shapes for each player.</p>
                    
                    <h4 className="text-lg font-extrabold tracking-tight opacity-90 pt-3">Controls</h4>
                    <p>🔄 <span className="font-bold text-sky-500">Soft Reset:</span> Tap the Restart button to clear the board and start a new round.</p>
                    <p>⚠️ <span className="font-bold text-sky-500">Hard Reset:</span> <strong>Press and hold</strong> the Restart button to wipe all scores and start completely fresh. This will also re-enable the Target Score logic if it was previously disabled.</p>
                    <p>✨ <span className="font-bold text-sky-500">Change Player Symbol:</span> <strong>Press and hold</strong> the turn banner when the game is hard reset to switch your symbol.</p>
                    <p>✨ <span className="font-bold text-sky-500">Change Turn:</span> <strong>Tap</strong> the turn banner before starting a new round to swap who goes first. In 1-Player mode, holding the "1 Player" button lets AI play first.</p>
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
