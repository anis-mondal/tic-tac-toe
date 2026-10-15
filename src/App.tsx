/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
// 🚀 জাইরোস্কোপের সব কিছু মুছে ফেলা হয়েছে। শুধু নিরাপদ framer-motion রাখা হয়েছে।
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { RotateCcw, Moon, Sun, Sparkles, UsersRound } from 'lucide-react';
import confetti from 'canvas-confetti';

// @ts-ignore
import nunitoFont from './Nunito-ExtraBold.ttf';
// @ts-ignore
import nunitoBlackFont from './Nunito-Black.ttf';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App as CapApp } from '@capacitor/app';

import SettingsModal, { PLAYER_COLORS, CUSTOM_THEMES, ORIGINAL_THEME, EXTRA_LINE_COLORS, ICONS_LIST } from './components/SettingsModal';
import AboutModal from './components/AboutModal';

import { Player, SquareValue, WINNING_COMBINATIONS, findBestMove } from './utils/gameLogic';
import { REFRESH_LOADERS } from './components/RefreshLoaders';

const CustomVolume2 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" /></svg>
);

const CustomVolumeX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" /><line x1="23" y1="9" x2="17" y2="15" fill="none" /><line x1="17" y1="9" x2="23" y2="15" fill="none" /></svg>
);

const CustomSettings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><mask id="settings-hole"><rect width="24" height="24" fill="white" /><circle cx="12" cy="12" r="3" fill="black" stroke="black" strokeWidth="1" /></mask><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="currentColor" mask="url(#settings-hole)" /><circle cx="12" cy="12" r="3" fill="none" /></svg>
);

export const SolidUsers = ({ className, color }: { className?: string, color?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" color={color} className={className}><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/></svg>;

const triggerNativeHaptic = (pattern: number | number[], isEnabled: boolean) => {
  if (!isEnabled) return;
  if (Capacitor.isNativePlatform()) {
     try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
  } else if (typeof window !== 'undefined' && navigator.vibrate) {
     try { navigator.vibrate(pattern); } catch (e) {}
  }
};

const AILogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" className="drop-shadow-sm shrink-0">
    <defs>
      <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF3B30" /><stop offset="25%" stopColor="#FF9500" /><stop offset="50%" stopColor="#4CD964" /><stop offset="75%" stopColor="#5AC8FA" /><stop offset="100%" stopColor="#007AFF" />  
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ai-grad)" strokeWidth="12" />
    <text x="50" y="68" fontFamily="NunitoCustom, sans-serif" fontWeight="900" fontSize="48" fill="url(#ai-grad)" textAnchor="middle">Ai</text>
  </svg>
);

// 🚀 DynamicIcon (Gyroscope Completely Removed to Fix Crash)
const DynamicIcon = React.memo(({ player, p1Custom, p1Idx, p1Emoji, p1Filled, p2Custom, p2Idx, p2Emoji, p2Filled, color, className }: any) => {
  if (!player) return null;
  const isP1 = player === 'X';
  const isCustomEnabled = isP1 ? p1Custom : p2Custom;
  const iconIndex = isP1 ? p1Idx : p2Idx;
  const emoji = isP1 ? p1Emoji : p2Emoji;
  const fillState = isP1 ? p1Filled : p2Filled; 

  if (isCustomEnabled) {
     if (iconIndex === -1 && emoji) {
         return (
            <div className={`flex items-center justify-center ${className}`}>
               <svg viewBox="0 0 24 24" className="w-full h-full" style={{ overflow: 'visible' }}>
                 <text x="50%" y="50%" dy=".35em" textAnchor="middle" fill={color} style={{ fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif', fontSize: '19px', fontWeight: 900 }}>{emoji}</text>
               </svg>
            </div>
         );
     }
     const SafeIndex = Math.max(0, iconIndex) % ICONS_LIST.length;
     const SelectedIcon = ICONS_LIST[SafeIndex];
     
     let fillVal = 'none'; let fillOp = 1; let strokeW = 2.5;
     if (fillState === 1) { fillVal = color; fillOp = 0.40; strokeW = 2.8; } 
     else if (fillState === 2) { fillVal = color; fillOp = 1; strokeW = 2.2; }

     return (
        <div className={`flex items-center justify-center ${className}`}>
           <SelectedIcon color={color} fill={fillVal} fillOpacity={fillOp} className="w-full h-full" strokeWidth={strokeW} />
        </div>
     );
  }
  
  if (isP1) {
     return (
        <div className={`flex items-center justify-center ${className}`}>
           <svg viewBox="0 0 24 24" className="w-full h-full" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
     );
  }
  return (
      <div className={`flex items-center justify-center ${className}`}>
         <svg viewBox="0 0 24 24" className="w-full h-full" fill="none"><circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="4.5" /></svg>
      </div>
  );
});

const audioState = { ctx: null as AudioContext | null };
const playEnhancedSound = (type: 'tap' | 'win' | 'overallWin' | 'pop' | 'point' | 'unmute' | 'mode' | 'refresh', variant: number) => {
  if (!variant || variant === 0 || typeof window === 'undefined') return;
  try {
    if (!audioState.ctx) audioState.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioState.ctx.state === 'suspended') audioState.ctx.resume();
    const ctx = audioState.ctx;
    const t = ctx.currentTime;
    
    const profiles = [
      { w: 'sine', f: 0, d: 0, s: 0 }, { w: 'sine', f: 600, d: 0.1, s: 1 }, { w: 'sine', f: 400, d: 0.1, s: 1.5 }, { w: 'triangle', f: 800, d: 0.05, s: 1 }, { w: 'sine', f: 1200, d: 0.15, s: 1 }, { w: 'sine', f: 300, d: 0.1, s: 0.5 }, { w: 'triangle', f: 600, d: 0.1, s: 1 }, { w: 'sine', f: 900, d: 0.08, s: 1 }, { w: 'triangle', f: 350, d: 0.15, s: 1 }, { w: 'sine', f: 1500, d: 0.05, s: 1 }, { w: 'sine', f: 500, d: 0.2, s: 1 }, { w: 'triangle', f: 1000, d: 0.05, s: 1 }, { w: 'sine', f: 800, d: 0.1, s: 0.5 }, { w: 'sine', f: 450, d: 0.15, s: 1 }, { w: 'triangle', f: 750, d: 0.08, s: 1.2 }, { w: 'sine', f: 200, d: 0.15, s: 1 }, { w: 'triangle', f: 550, d: 0.12, s: 1 }, { w: 'sine', f: 1800, d: 0.03, s: 1 }, { w: 'sine', f: 350, d: 0.1, s: 1.5 }, { w: 'triangle', f: 900, d: 0.1, s: 0.8 }, { w: 'sine', f: 700, d: 0.15, s: 1 }
    ];

    const p = profiles[variant] || profiles[1];
    const playOsc = (wave: string, freq: number, vol: number, attack: number, decay: number, sweep: number = 1, sweepDur: number = 0, delay: number = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave as OscillatorType;
        osc.frequency.setValueAtTime(freq, t + delay);
        if (sweep !== 1) osc.frequency.exponentialRampToValueAtTime(freq * sweep, t + delay + sweepDur);
        gain.gain.setValueAtTime(0, t + delay);
        gain.gain.linearRampToValueAtTime(vol, t + delay + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + attack + decay);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t + delay); osc.stop(t + delay + attack + decay);
    };

    if (type === 'tap') playOsc(p.w, p.f, 0.4, 0.01, p.d, p.s, 0.1);
    else if (type === 'pop') playOsc(p.w, p.f * 0.75, 0.4, 0.01, p.d * 1.5, p.s, 0.1);
    else if (type === 'point' || type === 'unmute') playOsc(p.w, p.f * 1.5, 0.3, 0.01, p.d * 1.2, p.s, 0.1);
    else if (type === 'mode') { playOsc(p.w, p.f * 0.8, 0.3, 0.02, p.d); playOsc(p.w, p.f * 1.2, 0.3, 0.02, p.d * 1.2, 1, 0, 0.15); }
    else if (type === 'refresh') { playOsc(p.w, p.f * 0.8, 0.3, 0.02, p.d); playOsc(p.w, p.f, 0.3, 0.02, p.d, 1, 0, 0.08); playOsc(p.w, p.f * 1.4, 0.3, 0.02, p.d * 1.5, 1, 0, 0.16); }
    else if (type === 'win') { playOsc(p.w, p.f, 0.3, 0.02, p.d); playOsc(p.w, p.f * 1.25, 0.3, 0.02, p.d, 1, 0, 0.15); playOsc(p.w, p.f * 1.5, 0.3, 0.02, p.d * 2, 1, 0, 0.3); }
    else if (type === 'overallWin') { playOsc(p.w, p.f * 0.8, 0.3, 0.05, p.d); playOsc(p.w, p.f * 1.0, 0.3, 0.05, p.d, 1, 0, 0.15); playOsc(p.w, p.f * 1.25, 0.3, 0.05, p.d, 1, 0, 0.3); playOsc(p.w, p.f * 1.5, 0.3, 0.05, p.d, 1, 0, 0.45); playOsc(p.w, p.f * 2.0, 0.4, 0.05, p.d * 3, 1, 0, 0.6); }
  } catch(e) {}
};

const blendDarker = (hex: string, factor: number) => {
    if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;
    let r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    let g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    let b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getSaved = (key: string, defaultVal: any) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export default function App() {
  const [board, setBoard] = useState<SquareValue[]>(() => getSaved('board', Array(9).fill(null)));
  const [humanSymbol, setHumanSymbol] = useState<Player>(() => getSaved('humanSymbol', 'O'));
  const [startingPlayer, setStartingPlayer] = useState<Player>(() => getSaved('startingPlayer', 'O'));
  const [isXNext, setIsXNext] = useState(() => getSaved('isXNext', false));
  const [scores, setScores] = useState(() => getSaved('scores', { X: 0, O: 0, Draws: 0 }));
  const [isSinglePlayer, setIsSinglePlayer] = useState(() => getSaved('isSinglePlayer', true));
  
  const [isSoundOn, setIsSoundOn] = useState(() => getSaved('isSoundOn', true));
  const [isHapticEnabled, setIsHapticEnabled] = useState(() => getSaved('isHapticEnabled', true));
  
  // 🚀 Drag Animation State - DEFAULT OFF
  const [isDragEnabled, setIsDragEnabled] = useState(() => getSaved('isDragEnabled', false));
  
  const [soundPrefs, setSoundPrefs] = useState(() => getSaved('soundPrefs', { xTap: 1, oTap: 2, pop: 1, mode: 1, refresh: 1, win: 1, overallWin: 1, point: 1 }));

  const [useDefaultTheme, setUseDefaultTheme] = useState(() => getSaved('useDefaultTheme', true));
  const [themeIdx, setThemeIdx] = useState(() => getSaved('themeIdx', 0));
  const [xColorIdx, setXColorIdx] = useState(() => getSaved('xColorIdx', 0));
  const [oColorIdx, setOColorIdx] = useState(() => getSaved('oColorIdx', 9));
  const [customLineIdx, setCustomLineIdx] = useState(() => getSaved('customLineIdx', 0));
  
  const [p1Custom, setP1Custom] = useState(() => getSaved('p1Custom', false));
  const [p1Idx, setP1Idx] = useState(() => getSaved('p1Idx', 0));
  const [p2Custom, setP2Custom] = useState(() => getSaved('p2Custom', false));
  const [p2Idx, setP2Idx] = useState(() => getSaved('p2Idx', 1));
  
  const [p1Emoji, setP1Emoji] = useState<string | null>(() => getSaved('p1Emoji', null));
  const [p2Emoji, setP2Emoji] = useState<string | null>(() => getSaved('p2Emoji', null));
  
  const [isIconsFilledX, setIsIconsFilledX] = useState<number>(() => getSaved('isIconsFilledX', 0));
  const [isIconsFilledO, setIsIconsFilledO] = useState<number>(() => getSaved('isIconsFilledO', 0));

  const [enableCustomLine, setEnableCustomLine] = useState(() => getSaved('enableCustomLine', false));
  const [enableCustomX, setEnableCustomX] = useState(() => getSaved('enableCustomX', false));
  const [enableCustomO, setEnableCustomO] = useState(() => getSaved('enableCustomO', false));

  const [targetScore, setTargetScore] = useState(() => getSaved('targetScore', 5));
  const [userWantsTargetScore, setUserWantsTargetScore] = useState(() => getSaved('userWantsTargetScore', true));
  const [isTargetScoreEnabled, setIsTargetScoreEnabled] = useState(() => getSaved('isTargetScoreEnabled', true));
  
  const [enableHardRefreshTap, setEnableHardRefreshTap] = useState(() => getSaved('enableHardRefreshTap', false));
  const [enableHardPullToRefresh, setEnableHardPullToRefresh] = useState(() => getSaved('enableHardPullToRefresh', true));

  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [isLoadersMenuOpen, setIsLoadersMenuOpen] = useState(false);
  const [refreshLoaderIdx, setRefreshLoaderIdx] = useState(() => getSaved('refreshLoaderIdx', 0));

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
  const [showWinnerModal, setShowWinnerModal] = useState(() => getSaved('overallWinner', null) !== null);

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
  const turnWasHeld = useRef(false);
  
  const isTransitioning = useRef(false);
  const isGameEnding = useRef(false);

  const triggerHaptic = (pattern: number | number[]) => { triggerNativeHaptic(pattern, isHapticEnabled); };
  const playPreviewSound = (key: string, val: number) => { playEnhancedSound((key === 'xTap' || key === 'oTap') ? 'tap' : key as any, val); };

  const mainBouncer = useAnimation();
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && !isRefreshing && !isSettingsOpen && !isAboutOpen) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
       const resistance = deltaY * 0.35; 
       setPullProgress(resistance);
       mainBouncer.set({ y: resistance, scale: Math.max(1 - (resistance * 0.0003), 0.96), gap: `${20 + (resistance * 0.25)}px` });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || isRefreshing) return;
    isDragging.current = false;
    
    if (pullProgress > 75) {
       setIsRefreshing(true); triggerHaptic([100, 50, 100]);
       if (isSoundOn) playEnhancedSound('refresh', soundPrefs.refresh);
       mainBouncer.start({ y: 0, scale: 1, gap: "20px", transition: { type: 'spring', stiffness: 150, damping: 10, mass: 1.2 } });
       
       setTimeout(() => {
          if (enableHardPullToRefresh) performHardReset(startingPlayer);
          else resetGameForMode(startingPlayer, true); 
       }, 400);

       setTimeout(() => { setIsRefreshing(false); setPullProgress(0); }, 1500);
    } else {
       mainBouncer.start({ y: 0, scale: 1, gap: "20px", transition: { type: 'spring', stiffness: 200, damping: 14 } });
       setPullProgress(0);
    }
  };

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('humanSymbol', JSON.stringify(humanSymbol));
    localStorage.setItem('startingPlayer', JSON.stringify(startingPlayer));
    localStorage.setItem('isXNext', JSON.stringify(isXNext));
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('isSinglePlayer', JSON.stringify(isSinglePlayer));
    localStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
    localStorage.setItem('isHapticEnabled', JSON.stringify(isHapticEnabled));
    localStorage.setItem('isDragEnabled', JSON.stringify(isDragEnabled));
    localStorage.setItem('soundPrefs', JSON.stringify(soundPrefs));
    localStorage.setItem('useDefaultTheme', JSON.stringify(useDefaultTheme));
    localStorage.setItem('themeIdx', JSON.stringify(themeIdx));
    localStorage.setItem('xColorIdx', JSON.stringify(xColorIdx));
    localStorage.setItem('oColorIdx', JSON.stringify(oColorIdx));
    localStorage.setItem('customLineIdx', JSON.stringify(customLineIdx));
    localStorage.setItem('p1Custom', JSON.stringify(p1Custom));
    localStorage.setItem('p1Idx', JSON.stringify(p1Idx));
    localStorage.setItem('p2Custom', JSON.stringify(p2Custom));
    localStorage.setItem('p2Idx', JSON.stringify(p2Idx));
    localStorage.setItem('p1Emoji', JSON.stringify(p1Emoji));
    localStorage.setItem('p2Emoji', JSON.stringify(p2Emoji));
    localStorage.setItem('isIconsFilledX', JSON.stringify(isIconsFilledX));
    localStorage.setItem('isIconsFilledO', JSON.stringify(isIconsFilledO));
    localStorage.setItem('enableCustomLine', JSON.stringify(enableCustomLine));
    localStorage.setItem('enableCustomX', JSON.stringify(enableCustomX));
    localStorage.setItem('enableCustomO', JSON.stringify(enableCustomO));
    localStorage.setItem('targetScore', JSON.stringify(targetScore));
    localStorage.setItem('userWantsTargetScore', JSON.stringify(userWantsTargetScore));
    localStorage.setItem('isTargetScoreEnabled', JSON.stringify(isTargetScoreEnabled));
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('isAmoled', JSON.stringify(isAmoled));
    localStorage.setItem('winnerInfo', JSON.stringify(winnerInfo));
    localStorage.setItem('isDraw', JSON.stringify(isDraw));
    localStorage.setItem('overallWinner', JSON.stringify(overallWinner));
    localStorage.setItem('lastMoveIdx', JSON.stringify(lastMoveIdxRef.current));
    localStorage.setItem('enableHardRefreshTap', JSON.stringify(enableHardRefreshTap));
    localStorage.setItem('enableHardPullToRefresh', JSON.stringify(enableHardPullToRefresh));
    localStorage.setItem('refreshLoaderIdx', JSON.stringify(refreshLoaderIdx));
  }, [board, humanSymbol, startingPlayer, isXNext, scores, isSinglePlayer, isSoundOn, isHapticEnabled, isDragEnabled, soundPrefs, useDefaultTheme, themeIdx, xColorIdx, oColorIdx, customLineIdx, p1Custom, p1Idx, p2Custom, p2Idx, p1Emoji, p2Emoji, isIconsFilledX, isIconsFilledO, enableCustomLine, enableCustomX, enableCustomO, targetScore, userWantsTargetScore, isTargetScoreEnabled, isDarkMode, isAmoled, winnerInfo, isDraw, overallWinner, enableHardRefreshTap, enableHardPullToRefresh, refreshLoaderIdx]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const backSub = CapApp.addListener('backButton', () => {
      if (isAboutOpen) setIsAboutOpen(false);
      else if (isLoadersMenuOpen) setIsLoadersMenuOpen(false); 
      else if (isAdvancedSettingsOpen) setIsAdvancedSettingsOpen(false);
      else if (isSettingsOpen) { setIsSettingsOpen(false); setIsAdvancedSettingsOpen(false); setIsLoadersMenuOpen(false); }
      else CapApp.exitApp();
    });
    return () => { backSub.then(sub => sub.remove()); };
  }, [isAboutOpen, isSettingsOpen, isAdvancedSettingsOpen, isLoadersMenuOpen]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        const activeBgColor = isDarkMode && isAmoled ? '#000000' : (useDefaultTheme ? (isDarkMode ? ORIGINAL_THEME.dark : ORIGINAL_THEME.light) : (isDarkMode ? CUSTOM_THEMES[themeIdx].dark : CUSTOM_THEMES[themeIdx].light));
        StatusBar.setBackgroundColor({ color: activeBgColor }); StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light });
      } catch (e) { console.warn(e); }
    }
    if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }, [isDarkMode, isAmoled, themeIdx, useDefaultTheme]);

  const activeTheme = useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[themeIdx];
  const availableLinesDark = [...activeTheme.linesDark, ...EXTRA_LINE_COLORS];
  const availableLinesLight = [...activeTheme.linesLight, ...EXTRA_LINE_COLORS];
  const activeLineColor = isDarkMode ? (enableCustomLine ? availableLinesDark[customLineIdx] : availableLinesDark[0]) : (enableCustomLine ? availableLinesLight[customLineIdx] : availableLinesLight[0]);
  const currentXColor = enableCustomX ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[0];
  const currentOColor = enableCustomO ? PLAYER_COLORS[oColorIdx] : PLAYER_COLORS[9];

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning.current) return;
    triggerHaptic([80]); if (isSoundOn) playEnhancedSound('pop', soundPrefs.pop);
    const nextDark = !isDarkMode; const targetBtn = e.currentTarget;

    if (!document.startViewTransition) { setIsDarkMode(nextDark); return; }
    isTransitioning.current = true;
    const rect = targetBtn.getBoundingClientRect();
    document.documentElement.style.setProperty('--tx', `${rect.left + rect.width / 2}px`);
    document.documentElement.style.setProperty('--ty', `${rect.top + rect.height / 2}px`);

    if (nextDark) { document.documentElement.classList.add('transition-to-dark'); document.documentElement.classList.remove('transition-to-light'); }
    else { document.documentElement.classList.add('transition-to-light'); document.documentElement.classList.remove('transition-to-dark'); }

    const transition = document.startViewTransition(() => { flushSync(() => { setIsDarkMode(nextDark); }); });
    transition.finished.then(() => { document.documentElement.classList.remove('transition-to-dark', 'transition-to-light'); isTransitioning.current = false; });
  };

  const toggleSound = () => { triggerHaptic(80); if (!isSoundOn) playEnhancedSound('unmute', soundPrefs.point); setIsSoundOn(!isSoundOn); };

  const fireConfetti = (winner: Player) => {
    if (!canvasRef.current) return;
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (myConfettiRef.current) myConfettiRef.current.reset();
    myConfettiRef.current = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    
    const colors = winner === 'X' ? [currentXColor] : [currentOColor]; 
    const duration = 6000; const animationEnd = Date.now() + duration;

    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) { if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current); return; }
      myConfettiRef.current?.({ particleCount: 60 * (timeLeft / duration), startVelocity: 35, spread: 360, ticks: 60, zIndex: 0, colors: colors, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.3 + 0.1 } });
    }, 250);
  };

  useEffect(() => {
    if (isResetting) { isGameEnding.current = false; return; }
    if (winnerInfo || isDraw || overallWinner || isGameEnding.current) return;
    
    let hasWinner = false; let winningLine: number[] = []; let winner: Player | null = null;
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) { hasWinner = true; winner = board[a] as Player; winningLine = combination; break; }
    }

    if (hasWinner && winner) {
        isGameEnding.current = true;
        setTimeout(() => {
            setWinnerInfo({ winner: winner as Player, line: winningLine });
            setScores(prev => {
                const newScore = prev[winner as Player] + 1;
                if (isTargetScoreEnabled && newScore >= targetScore) {
                   setOverallWinner(winner); if (isSoundOn) playEnhancedSound('overallWin', soundPrefs.overallWin);
                   setTimeout(() => setShowWinnerModal(true), 1200); 
                } else { if (isSoundOn) playEnhancedSound('win', soundPrefs.win); }
                return { ...prev, [winner as Player]: newScore };
            }); 
            triggerHaptic([100, 50, 100, 50, 300]); fireConfetti(winner);
        }, 450); 
    } else if (!board.includes(null)) {
        isGameEnding.current = true;
        setTimeout(() => {
            setIsDraw(true); setScores(prev => ({ ...prev, Draws: prev.Draws + 1 })); 
            if (isSoundOn) playEnhancedSound('point', soundPrefs.point); triggerHaptic([200, 50, 200, 50, 300]); 
        }, 450);
    }
  }, [board, isSoundOn, isResetting, currentXColor, currentOColor, targetScore, isTargetScoreEnabled, winnerInfo, isDraw, overallWinner, soundPrefs]);

  const aiPlayerSymbol = isSinglePlayer ? (humanSymbol === 'X' ? 'O' : 'X') : null;
  const isAITurn = isSinglePlayer && aiPlayerSymbol && ((isXNext && aiPlayerSymbol === 'X') || (!isXNext && aiPlayerSymbol === 'O'));

  useEffect(() => {
    if (isAITurn && !winnerInfo && !isDraw && !isResetting && !overallWinner && !isGameEnding.current) {
      const aiTimer = setTimeout(() => {
        const bestMove = findBestMove([...board], aiPlayerSymbol, scores[humanSymbol], targetScore, isTargetScoreEnabled);
        if (bestMove !== -1) {
          setActiveCell(bestMove); triggerHaptic(50);
          setTimeout(() => {
              const newBoard = [...board]; newBoard[bestMove] = aiPlayerSymbol;
              setActiveCell(null); triggerHaptic(80); 
              if (isSoundOn) playEnhancedSound('tap', aiPlayerSymbol === 'X' ? soundPrefs.xTap : soundPrefs.oTap);
              lastMoveIdxRef.current = bestMove; setBoard(newBoard); setIsXNext(aiPlayerSymbol === 'O');
          }, 150);
        }
      }, 500); 
      return () => clearTimeout(aiTimer);
    }
  }, [isXNext, isSinglePlayer, board, winnerInfo, isDraw, aiPlayerSymbol, isAITurn, isSoundOn, isResetting, overallWinner, scores, humanSymbol, targetScore, isTargetScoreEnabled, soundPrefs]);

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo || isAITurn || isResetting || overallWinner || isGameEnding.current || activeCell !== null) return;
    triggerHaptic(80); if (isSoundOn) playEnhancedSound('tap', isXNext ? soundPrefs.xTap : soundPrefs.oTap);
    const newBoard = [...board]; newBoard[index] = isXNext
