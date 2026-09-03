/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, Moon, Sun, Sparkles, Volume2, VolumeX, MoreVertical, X as CloseIcon, Target, Info, UsersRound,
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, Target as TargetIcon, Shield, Zap,
  Dna, Star, Heart, Infinity as InfinityIcon, Puzzle, Sparkles as SparkleIcon, Gem, Crown, Trophy, Ghost,
  Leaf, Flame, Droplet, Flower2, Snowflake, Feather, Sun as SunIcon, Moon as MoonIcon, Cloud, Wind,
  Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail,
  Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5,
  Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer,
  Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck,
  Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage,
  Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor,
  Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid,
  Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer,
  Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets,
  ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt,
  Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard,
  Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper,
  Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, 
  Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, Drum, Dumbbell, 
  Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, IceCream, Keyboard, 
  Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, 
  BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
} from 'lucide-react';

import confetti from 'canvas-confetti';

// @ts-ignore
import nunitoFont from './Nunito-ExtraBold.ttf';
// @ts-ignore
import nunitoBlackFont from './Nunito-Black.ttf';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App as CapApp } from '@capacitor/app';

// আপনার তৈরি করা AboutModal ইমপোর্ট করা হলো
import AboutModal from './components/AboutModal';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const ICONS_LIST = [
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, TargetIcon, Shield, Zap,
  Dna, Star, Heart, InfinityIcon, Puzzle, SparkleIcon, Gem, Crown, Trophy, Ghost,
  Leaf, Flame, Droplet, Flower2, Snowflake, Feather, SunIcon, MoonIcon, Cloud, Wind,
  Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail,
  Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5,
  Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer,
  Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck,
  Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage,
  Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor,
  Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid,
  Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer,
  Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets,
  ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt,
  Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard,
  Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper,
  Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, 
  Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, 
  Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, 
  IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, 
  BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
];

const hapticFeedback = (pattern: number | number[]) => {
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
        <stop offset="0%" stopColor="#FF3B30" />    
        <stop offset="25%" stopColor="#FF9500" />   
        <stop offset="50%" stopColor="#4CD964" />   
        <stop offset="75%" stopColor="#5AC8FA" />   
        <stop offset="100%" stopColor="#007AFF" />  
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ai-grad)" strokeWidth="12" />
    <text x="50" y="68" fontFamily="NunitoCustom, sans-serif" fontWeight="900" fontSize="48" fill="url(#ai-grad)" textAnchor="middle">Ai</text>
  </svg>
);

const DynamicIcon = ({ 
  player, p1Custom, p1Idx, p2Custom, p2Idx, color, className 
}: { 
  player: Player | null, p1Custom: boolean, p1Idx: number, p2Custom: boolean, p2Idx: number, color: string, className?: string 
}) => {
  if (!player) return null;
  
  const isP1 = player === 'X';
  const isCustomEnabled = isP1 ? p1Custom : p2Custom;
  const iconIndex = isP1 ? p1Idx : p2Idx;

  if (isCustomEnabled) {
     const SelectedIcon = ICONS_LIST[iconIndex % ICONS_LIST.length];
     return <SelectedIcon color={color} fill={color} className={className} strokeWidth={2.5} />;
  }
  
  if (isP1) {
     return (
       <svg viewBox="0 0 24 24" className={className} fill="none">
         <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
     );
  }
  return (
     <svg viewBox="0 0 24 24" className={className} fill="none">
       <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="4.5" />
     </svg>
  );
};

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

const findBestMove = (squares: SquareValue[], aiPlayer: Player, humanScore: number, targetScore: number, isTargetScoreEnabled: boolean) => {
  const availableMoves: number[] = [];
  for (let i = 0; i < 9; i++) if (!squares[i]) availableMoves.push(i);
  
  if (availableMoves.length === 9) return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
  
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  const accuracy = 0.75; 

  if (Math.random() > accuracy) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

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
  
  let bestVal = -Infinity;
  let bestMove = availableMoves[0];
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

const blendDarker = (hex: string, factor: number) => {
    if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;
    let r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    let g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    let b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const ORIGINAL_THEME = {
  name: 'Classic',
  light: '#f8f9fa', dark: '#000000',
  gridLight: '#e2e8f0', gridDark: '#1a1c1e',
  cellLight: '#ffffff', cellDark: '#2a2d31',
  indicatorLight: '#64748b', indicatorDark: '#94a3b8',
  linesLight: ['#22c55e', '#16a34a', '#15803d', '#10b981', '#059669'], 
  linesDark: ['#22c55e', '#4ade80', '#86efac', '#34d399', '#6ee7b7']
};

const CUSTOM_THEMES = [
  { name: 'Dynamic M3', light: '#fdf8fd', dark: '#141218', gridLight: '#e8def8', gridDark: '#2b2930', cellLight: '#ffffff', cellDark: '#36343b', indicatorLight: '#6750a4', indicatorDark: '#d0bcff', linesLight: ['#6750a4', '#b3261e', '#9c4146', '#316934', '#006a6a'], linesDark: ['#d0bcff', '#f2b8b5', '#ffb4ab', '#82c986', '#4cdada'] },
  { name: 'M3 Blue', light: '#eff6ff', dark: '#040b17', gridLight: '#bfdbfe', gridDark: '#0a1229', cellLight: '#ffffff', cellDark: '#121e38', indicatorLight: '#2563eb', indicatorDark: '#3b82f6', linesLight: ['#1e3a8a', '#1d4ed8', '#0891b2', '#4f46e5', '#3b82f6'], linesDark: ['#60a5fa', '#93c5fd', '#3b82f6', '#818cf8', '#7dd3fc'] },
  { name: 'M3 Emerald', light: '#ecfdf5', dark: '#020f0a', gridLight: '#a7f3d0', gridDark: '#052115', cellLight: '#ffffff', cellDark: '#0a3321', indicatorLight: '#16a34a', indicatorDark: '#22c55e', linesLight: ['#166534', '#059669', '#15803d', '#10b981', '#16a34a'], linesDark: ['#4ade80', '#22c55e', '#34d399', '#86efac', '#8dd999'] },
  { name: 'M3 Purple', light: '#f5f3ff', dark: '#0b0412', gridLight: '#d8b4fe', gridDark: '#160826', cellLight: '#ffffff', cellDark: '#200e33', indicatorLight: '#9333ea', indicatorDark: '#a855f7', linesLight: ['#7e22ce', '#9333ea', '#a855f7', '#c026d3', '#db2777'], linesDark: ['#c084fc', '#d8b4fe', '#e879f9', '#f472b6', '#fb7185'] },
  { name: 'M3 Orange', light: '#fff7ed', dark: '#120701', gridLight: '#fdba74', gridDark: '#240d02', cellLight: '#ffffff', cellDark: '#331304', indicatorLight: '#ea580c', indicatorDark: '#f97316', linesLight: ['#c2410c', '#ea580c', '#d97706', '#dc2626', '#b45309'], linesDark: ['#fb923c', '#fcd34d', '#fca5a5', '#f87171', '#fdba74'] },
  { name: 'M3 Rose', light: '#fff1f2', dark: '#140306', gridLight: '#fecdd3', gridDark: '#2e0a13', cellLight: '#ffffff', cellDark: '#400e1c', indicatorLight: '#e11d48', indicatorDark: '#f43f5e', linesLight: ['#be123c', '#e11d48', '#9f1239', '#db2777', '#f43f5e'], linesDark: ['#fb7185', '#fda4af', '#fecdd3', '#fbcfe8', '#f9a8d4'] },
  { name: 'M3 Cyan', light: '#ecfeff', dark: '#020d12', gridLight: '#67e8f9', gridDark: '#051f2b', cellLight: '#ffffff', cellDark: '#093142', indicatorLight: '#0891b2', indicatorDark: '#06b6d4', linesLight: ['#0e7490', '#0891b2', '#0369a1', '#0f766e', '#115e59'], linesDark: ['#4cdada', '#67e8f9', '#7dd3fc', '#5eead4', '#99f6e4'] },
  { name: 'M3 Amber', light: '#fffbeb', dark: '#140b01', gridLight: '#fde047', gridDark: '#291702', cellLight: '#ffffff', cellDark: '#3d2304', indicatorLight: '#d97706', indicatorDark: '#f59e0b', linesLight: ['#ca8a04', '#d97706', '#b45309', '#a16207', '#ea580c'], linesDark: ['#f59e0b', '#fbbf24', '#fcd34d', '#fdba74', '#fde047'] },
  { name: 'M3 Crimson', light: '#fef2f2', dark: '#140303', gridLight: '#fca5a5', gridDark: '#290707', cellLight: '#ffffff', cellDark: '#400c0c', indicatorLight: '#dc2626', indicatorDark: '#ef4444', linesLight: ['#b91c1c', '#dc2626', '#991b1b', '#7f1d1d', '#e11d48'], linesDark: ['#ef4444', '#f87171', '#fca5a5', '#fb7185', '#f87171'] },
  { name: 'M3 Indigo', light: '#eef2ff', dark: '#050512', gridLight: '#c7d2fe', gridDark: '#0e0c29', cellLight: '#ffffff', cellDark: '#161340', indicatorLight: '#4f46e5', indicatorDark: '#6366f1', linesLight: ['#4338ca', '#4f46e5', '#3730a3', '#312e81', '#1e3a8a'], linesDark: ['#6366f1', '#818cf8', '#a5b4fc', '#93c5fd', '#bfdbfe'] },
  { name: 'M3 Mint', light: '#f0fdfa', dark: '#01120f', gridLight: '#99f6e4', gridDark: '#03241d', cellLight: '#ffffff', cellDark: '#06362c', indicatorLight: '#0d9488', indicatorDark: '#14b8a6', linesLight: ['#0f766e', '#0d9488', '#0b1d1d', '#14532d', '#065f46'], linesDark: ['#6ab5ab', '#84c9bf', '#a0c7bb', '#8cc4a8', '#7bb89d'] },
  { name: 'M3 Pink', light: '#fdf2f8', dark: '#170312', gridLight: '#fbcfe8', gridDark: '#330a28', cellLight: '#ffffff', cellDark: '#4a0f3a', indicatorLight: '#ec4899', indicatorDark: '#f472b6', linesLight: ['#db2777', '#ec4899', '#f472b6', '#be185d', '#9d174d'], linesDark: ['#f472b6', '#f9a8d4', '#ec4899', '#fbcfe8', '#db2777'] },
  { name: 'M3 Yellow', light: '#fefce8', dark: '#141000', gridLight: '#fef08a', gridDark: '#332800', cellLight: '#ffffff', cellDark: '#4a3a00', indicatorLight: '#eab308', indicatorDark: '#facc15', linesLight: ['#ca8a04', '#eab308', '#facc15', '#a16207', '#854d0e'], linesDark: ['#facc15', '#fef08a', '#eab308', '#fef9c3', '#ca8a04'] },
  { name: 'M3 Lime', light: '#f7fee7', dark: '#0f1402', gridLight: '#d9f99d', gridDark: '#1d2905', cellLight: '#ffffff', cellDark: '#2a3b07', indicatorLight: '#84cc16', indicatorDark: '#a3e635', linesLight: ['#65a30d', '#84cc16', '#a3e635', '#4d7c0f', '#3f6212'], linesDark: ['#a3e635', '#d9f99d', '#84cc16', '#ecfccb', '#65a30d'] },
  { name: 'M3 Teal', light: '#f0fdfa', dark: '#041414', gridLight: '#ccfbf1', gridDark: '#0f3333', cellLight: '#ffffff', cellDark: '#144040', indicatorLight: '#14b8a6', indicatorDark: '#2dd4bf', linesLight: ['#0d9488', '#14b8a6', '#2dd4bf', '#0f766e', '#115e59'], linesDark: ['#2dd4bf', '#99f6e4', '#14b8a6', '#ccfbf1', '#0d9488'] },
  { name: 'Custom Pastel Green', light: '#f8fbf8', dark: '#081208', gridLight: '#e4f5e4', gridDark: '#162e16', cellLight: '#ffffff', cellDark: '#1a381a', indicatorLight: '#78dd77', indicatorDark: '#78dd77', linesLight: ['#78dd77', '#5ec85d', '#45b445', '#2a9b2a', '#148214'], linesDark: ['#78dd77', '#93f592', '#b2ffb2', '#ccffcc', '#e5ffe5'] },
  { name: 'Custom Light Green', light: '#f8fdf2', dark: '#0d1405', gridLight: '#eef8dc', gridDark: '#223812', cellLight: '#ffffff', cellDark: '#284215', indicatorLight: '#9fd75c', indicatorDark: '#9fd75c', linesLight: ['#9fd75c', '#85c242', '#6ba829', '#529111', '#3b7800'], linesDark: ['#9fd75c', '#bbf276', '#d6ff94', '#eaffb2', '#f6ffcf'] },
  { name: 'Custom Lime Yellow', light: '#fcfee6', dark: '#161a02', gridLight: '#f4facb', gridDark: '#36400a', cellLight: '#ffffff', cellDark: '#404d0c', indicatorLight: '#c1d02d', indicatorDark: '#c1d02d', linesLight: ['#c1d02d', '#a8b515', '#8f9c00', '#778200', '#5e6b00'], linesDark: ['#c1d02d', '#dbe84a', '#f5ff6b', '#ffff8c', '#ffffa8'] },
  { name: 'Custom Bright Amber', light: '#fffaf0', dark: '#1f1600', gridLight: '#ffefc2', gridDark: '#4d3700', cellLight: '#ffffff', cellDark: '#594000', indicatorLight: '#fabd00', indicatorDark: '#fabd00', linesLight: ['#fabd00', '#e0a300', '#c78a00', '#ad7200', '#945c00'], linesDark: ['#fabd00', '#ffdb33', '#fff466', '#ffff99', '#ffffcc'] },
  { name: 'Custom Peach', light: '#fff8f2', dark: '#1f150a', gridLight: '#ffe6cd', gridDark: '#4d3319', cellLight: '#ffffff', cellDark: '#593c1d', indicatorLight: '#ffb86e', indicatorDark: '#ffb86e', linesLight: ['#ffb86e', '#e69e55', '#cc853d', '#b36d26', '#995611'], linesDark: ['#ffb86e', '#ffd28a', '#ffecab', '#ffffcc', '#ffffe5'] },
  { name: 'Custom Salmon', light: '#fff7f5', dark: '#1f1311', gridLight: '#ffdfd9', gridDark: '#4d2d27', cellLight: '#ffffff', cellDark: '#59352e', indicatorLight: '#feb4a7', indicatorDark: '#feb4a7', linesLight: ['#feb4a7', '#e3998d', '#c97f74', '#b0675c', '#965045'], linesDark: ['#feb4a7', '#ffcec2', '#ffe9df', '#fffffc', '#ffffff'] },
  { name: 'Custom Pastel Pink', light: '#fff7f9', dark: '#1f1215', gridLight: '#ffe0e7', gridDark: '#4d2c33', cellLight: '#ffffff', cellDark: '#59333b', indicatorLight: '#ffb3c0', indicatorDark: '#ffb3c0', linesLight: ['#ffb3c0', '#e699a6', '#cc808d', '#b36875', '#99505e'], linesDark: ['#ffb3c0', '#ffd0db', '#ffecf2', '#ffffff', '#ffffff'] },
  { name: 'Custom Light Magenta', light: '#fff6ff', dark: '#1e0e1f', gridLight: '#feddfa', gridDark: '#4d234d', cellLight: '#ffffff', cellDark: '#592959', indicatorLight: '#fcaaff', indicatorDark: '#fcaaff', linesLight: ['#fcaaff', '#e18fe6', '#c676cd', '#ad5eb5', '#95469d'], linesDark: ['#fcaaff', '#ffc7ff', '#ffe4ff', '#ffffff', '#ffffff'] },
  { name: 'Custom Periwinkle', light: '#f7f8ff', dark: '#11131f', gridLight: '#e4e7ff', gridDark: '#2c334d', cellLight: '#ffffff', cellDark: '#343c59', indicatorLight: '#b9c3ff', indicatorDark: '#b9c3ff', linesLight: ['#b9c3ff', '#9ca7e6', '#808ccd', '#6571b5', '#4a589d'], linesDark: ['#b9c3ff', '#d6deff', '#f0f5ff', '#ffffff', '#ffffff'] },
  { name: 'Custom Sky Blue', light: '#f2fbff', dark: '#06171f', gridLight: '#d1f1ff', gridDark: '#12415c', cellLight: '#ffffff', cellDark: '#154c6b', indicatorLight: '#62d3ff', indicatorDark: '#62d3ff', linesLight: ['#62d3ff', '#45b8e6', '#2b9dcd', '#1084b5', '#006c9d'], linesDark: ['#62d3ff', '#82e8ff', '#a3fcff', '#c7ffff', '#e5ffff'] }
];
  
const PLAYER_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#78dd77', '#9fd75c', '#c1d02d', '#fabd00', '#ffb86e', 
  '#feb4a7', '#ffb3c0', '#fcaaff', '#b9c3ff', '#62d3ff'
];

const EXTRA_LINE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#06b6d4', 
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#64748b',
  '#78dd77', '#9fd75c', '#c1d02d', '#fabd00', '#ffb86e', 
  '#feb4a7', '#ffb3c0', '#fcaaff', '#b9c3ff', '#62d3ff'
];

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
  const [useDefaultTheme, setUseDefaultTheme] = useState(() => getSaved('useDefaultTheme', true));
  const [themeIdx, setThemeIdx] = useState(() => getSaved('themeIdx', 0));
  const [xColorIdx, setXColorIdx] = useState(() => getSaved('xColorIdx', 0));
  const [oColorIdx, setOColorIdx] = useState(() => getSaved('oColorIdx', 9));
  const [customLineIdx, setCustomLineIdx] = useState(() => getSaved('customLineIdx', 0));
  
  const [p1Custom, setP1Custom] = useState(() => getSaved('p1Custom', false));
  const [p1Idx, setP1Idx] = useState(() => getSaved('p1Idx', 0));
  const [p2Custom, setP2Custom] = useState(() => getSaved('p2Custom', false));
  const [p2Idx, setP2Idx] = useState(() => getSaved('p2Idx', 1));
  
  // নতুন টগলগুলোর স্টেট (রঙের জন্য)
  const [enableCustomLine, setEnableCustomLine] = useState(() => getSaved('enableCustomLine', false));
  const [enableCustomX, setEnableCustomX] = useState(() => getSaved('enableCustomX', false));
  const [enableCustomO, setEnableCustomO] = useState(() => getSaved('enableCustomO', false));

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
  const turnWasHeld = useRef(false);
  
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
  }, [board, humanSymbol, startingPlayer, isXNext, scores, isSinglePlayer, isSoundOn, useDefaultTheme, themeIdx, xColorIdx, oColorIdx, customLineIdx, p1Custom, p1Idx, p2Custom, p2Idx, enableCustomLine, enableCustomX, enableCustomO, targetScore, userWantsTargetScore, isTargetScoreEnabled, isDarkMode, isAmoled, winnerInfo, isDraw, overallWinner]);

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

  // ডাইনামিক কালার ক্যালকুলেশন (টগলের ওপর ভিত্তি করে)
  const activeTheme = useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[themeIdx];
  const availableLinesLight = [...activeTheme.linesLight, ...EXTRA_LINE_COLORS];
  const availableLinesDark = [...activeTheme.linesDark, ...EXTRA_LINE_COLORS];
  
  const activeLineColor = isDarkMode 
    ? (enableCustomLine ? availableLinesDark[customLineIdx] : availableLinesDark[0]) 
    : (enableCustomLine ? availableLinesLight[customLineIdx] : availableLinesLight[0]);

  const currentXColor = enableCustomX ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[0];
  const currentOColor = enableCustomO ? PLAYER_COLORS[oColorIdx] : PLAYER_COLORS[9];

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
    
    const colors = winner === 'X' ? [currentXColor] : [currentOColor]; 
    
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
  }, [board, isSoundOn, isResetting, currentXColor, currentOColor, targetScore, isTargetScoreEnabled, winnerInfo, isDraw, overallWinner]);

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
    if (board.every(c => c === null) && !winnerInfo && !overallWinner) {
      setIsHoldingBanner(true);
      turnWasHeld.current = false; 
      turnHoldTimer.current = setTimeout(() => {
        turnWasHeld.current = true; 
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
    if (turnWasHeld.current) {
      turnWasHeld.current = false;
      return; 
    }
    if (board.every(c => c === null) && !winnerInfo && !overallWinner) {
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

  const themeIndicatorColor = isDarkMode ? activeTheme.indicatorDark : activeTheme.indicatorLight;
  const baseTextColor = isDarkMode ? '#ffffff' : '#111111';
  const tintedTextColor = !useDefaultTheme ? `color-mix(in srgb, ${baseTextColor} 60%, ${themeIndicatorColor})` : baseTextColor;

  const semantics = {
    screenBackground: isDarkMode && isAmoled ? '#000000' : (isDarkMode ? activeTheme.dark : activeTheme.light),
    mainGridBackground: isDarkMode && isAmoled ? (useDefaultTheme ? '#080808' : blendDarker(activeTheme.gridDark, 0.25)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
    squareBackground: isDarkMode && isAmoled ? (useDefaultTheme ? '#101010' : blendDarker(activeTheme.cellDark, 0.25)) : (isDarkMode ? activeTheme.cellDark : activeTheme.cellLight),
    text: tintedTextColor,
    modeSliderContainer: { bg: isDarkMode && isAmoled ? (useDefaultTheme ? '#080808' : blendDarker(activeTheme.gridDark, 0.25)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight) },
    bannerDefault: isDarkMode ? { bg: isAmoled ? (useDefaultTheme ? '#080808' : blendDarker(activeTheme.gridDark, 0.25)) : activeTheme.gridDark, text: tintedTextColor } : { bg: activeTheme.gridLight, text: tintedTextColor },
    scoreBg: isDarkMode && isAmoled ? (useDefaultTheme ? '#080808' : blendDarker(activeTheme.gridDark, 0.25)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
    topNavBtn: isDarkMode && isAmoled ? (useDefaultTheme ? '#080808' : blendDarker(activeTheme.gridDark, 0.25)) : (isDarkMode ? activeTheme.gridDark : activeTheme.gridLight),
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
              className={`mx-auto w-[210px] h-[52px] rounded-full text-[16px] flex flex-col items-center justify-center gap-1 shadow-sm select-none relative overflow-hidden transition-colors duration-1000 ${board.every(c => c === null) && !winnerInfo && !overallWinner ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-2 relative z-10">
                {winnerInfo ? (
                  <>
                    <Sparkles className="w-4 h-4" style={{ color: activeLineColor }} />
                    <span className="font-bold flex items-center">
                      Winner: Player
                      <DynamicIcon 
                        player={winnerInfo.winner} 
                        p1Custom={p1Custom} p1Idx={p1Idx} 
                        p2Custom={p2Custom} p2Idx={p2Idx} 
                        color={winnerInfo.winner === 'X' ? currentXColor : currentOColor} 
                        className="w-5 h-5 ml-1.5 drop-shadow-sm" 
                      />
                    </span>
                  </>
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
                              <DynamicIcon player={isXNext ? 'X' : 'O'} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={isXNext ? currentXColor : currentOColor} className="w-5 h-5 drop-shadow-sm" />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        &nbsp;'s turn
                      </div>
                    )}
                  </>
                )}
              </div>
              {board.every(c => c === null) && !winnerInfo && !overallWinner && (
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
                   <DynamicIcon player="X" p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={currentXColor} className="w-3.5 h-3.5" />
                </div>
                <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={displayScore(scores.X)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: currentXColor }}>
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
                   <DynamicIcon player="O" p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={currentOColor} className="w-3.5 h-3.5" />
                </div>
                <div className="relative h-7 sm:h-8 overflow-hidden w-full flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={displayScore(scores.O)} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -25, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute text-lg sm:text-xl font-black" style={{ color: currentOColor }}>
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
                             <DynamicIcon player={value} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={value === 'X' ? currentXColor : currentOColor} className="w-3/5 h-3/5 drop-shadow-sm" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}

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
                           <DynamicIcon player={overallWinner} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={overallWinner === 'X' ? currentXColor : currentOColor} className="w-16 h-16" />
                         </motion.span>
                       </div>
                       
                       <div className="flex flex-col w-full gap-2.5 pt-1 z-10">
                          <motion.button onClick={() => { hapticFeedback(50); performHardReset(startingPlayer); }} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none bg-black/10 backdrop-blur-md" style={{ border: `2px solid ${activeLineColor}`, color: semantics.text }}>
                             Start a New Game
                          </motion.button>
                          <motion.button onClick={() => { hapticFeedback(30); setIsTargetScoreEnabled(false); resetGameForMode(startingPlayer); setOverallWinner(null); setShowWinnerModal(false); }} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none" style={{ backgroundColor: activeLineColor, color: (isDarkMode && !useDefaultTheme && activeTheme.indicatorDark === '#ffffff') ? '#000000' : '#ffffff' }}>
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
                
                {/* আপডেট করা হেডার (Info আইকন সরানো এবং About বাটন যুক্ত করা হয়েছে) */}
                <div className="flex flex-col mb-6 mt-2 relative">
                    <h2 className="font-nunito-black text-2xl mb-3">Appearance</h2>
                    <button onClick={() => setIsAboutOpen(true)} className="w-max px-5 py-2 rounded-full border border-black/10 dark:border-white/10 flex items-center gap-2 text-[13px] font-black uppercase tracking-wider opacity-80 hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 shadow-sm bg-black/5 dark:bg-white/5">
                        <Info className="w-4 h-4" /> About Game <span className="text-lg leading-none ml-1">&rarr;</span>
                    </button>
                </div>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 m3-scrollbar">
                  
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-5 h-5 flex items-center justify-center opacity-70">
                              <DynamicIcon player="X" p1Custom={false} p1Idx={0} p2Custom={false} p2Idx={0} color="currentColor" className="w-4 h-4"/>
                           </div>
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player X Shape</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setP1Custom(!p1Custom); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: p1Custom ? currentXColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: p1Custom ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {p1Custom && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto m3-scrollbar p-1">
                              {ICONS_LIST.map((IconComponent, idx) => (
                                 <button key={idx} onClick={() => { hapticFeedback(20); setP1Idx(idx); }} className={`p-2 rounded-xl flex items-center justify-center border-2 transition-colors ${p1Idx === idx ? 'border-sky-500 bg-sky-500/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <IconComponent className="w-6 h-6" color={currentXColor} fill={currentXColor} strokeWidth={2.5} />
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-5 h-5 flex items-center justify-center opacity-70">
                              <DynamicIcon player="O" p1Custom={false} p1Idx={0} p2Custom={false} p2Idx={0} color="currentColor" className="w-4 h-4"/>
                           </div>
                           <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player O Shape</h3>
                        </div>
                        <motion.button onClick={() => { hapticFeedback(30); setP2Custom(!p2Custom); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: p2Custom ? currentOColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: p2Custom ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {p2Custom && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto m3-scrollbar p-1">
                              {ICONS_LIST.map((IconComponent, idx) => (
                                 <button key={idx} onClick={() => { hapticFeedback(20); setP2Idx(idx); }} className={`p-2 rounded-xl flex items-center justify-center border-2 transition-colors ${p2Idx === idx ? 'border-sky-500 bg-sky-500/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <IconComponent className="w-6 h-6" color={currentOColor} fill={currentOColor} strokeWidth={2.5} />
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Theme Style</h3>
                     <div className="flex gap-2 p-1.5 rounded-2xl transition-colors duration-1000 bg-black/5 dark:bg-white/5">
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
                          <div className="flex items-center justify-between rounded-2xl p-4 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                              <div className="flex items-center gap-2.5">
                                 <Moon className="w-5 h-5 opacity-70" />
                                 <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Pure Black (AMOLED)</h3>
                              </div>
                              <motion.button onClick={() => { hapticFeedback(30); setIsAmoled(!isAmoled); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: isAmoled ? activeLineColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                                  <motion.div animate={{ x: isAmoled ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                              </motion.button>
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
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
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-2xl p-4 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                      <h3 className="text-sm uppercase tracking-wider opacity-70 mb-3 font-bold">Surface Colors</h3>
                      <div className="flex flex-wrap gap-3">
                        {CUSTOM_THEMES.map((theme, idx) => (
                          <button key={theme.name} onClick={() => { hapticFeedback(20); setThemeIdx(idx); setCustomLineIdx(0); }} style={{ backgroundColor: isDarkMode ? theme.indicatorDark : theme.indicatorLight, borderColor: themeIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center" aria-label={`Theme ${theme.name}`}>
                            {themeIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* নতুন কাস্টম উইনিং লাইন বক্স */}
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Winning Line Color</h3>
                        <motion.button onClick={() => { hapticFeedback(30); setEnableCustomLine(!enableCustomLine); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: enableCustomLine ? activeLineColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: enableCustomLine ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {enableCustomLine && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="flex flex-wrap gap-3 max-h-[180px] overflow-y-auto m3-scrollbar p-1">
                              {(isDarkMode ? availableLinesDark : availableLinesLight).map((color, idx) => (
                                <button key={`line-${idx}`} onClick={() => { hapticFeedback(20); setCustomLineIdx(idx); }} style={{ backgroundColor: color, borderColor: customLineIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                                  {customLineIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                                </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  {/* নতুন কাস্টম Player X Color বক্স */}
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player X Color</h3>
                        <motion.button onClick={() => { hapticFeedback(30); setEnableCustomX(!enableCustomX); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: enableCustomX ? currentXColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: enableCustomX ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {enableCustomX && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="flex flex-wrap gap-3 max-h-[180px] overflow-y-auto m3-scrollbar p-1">
                              {PLAYER_COLORS.map((color, idx) => (
                                <button key={`x-${idx}`} onClick={() => { hapticFeedback(20); setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: xColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                                   {xColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                                </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>

                  {/* নতুন কাস্টম Player O Color বক্স */}
                  <div className="rounded-2xl p-4 space-y-3 transition-colors duration-1000 border border-black/10 dark:border-white/10" style={{ backgroundColor: semantics.scoreBg }}>
                     <div className="flex items-center justify-between">
                        <h3 className="text-sm uppercase tracking-wider opacity-90 font-bold">Custom Player O Color</h3>
                        <motion.button onClick={() => { hapticFeedback(30); setEnableCustomO(!enableCustomO); }} className="w-12 h-6.5 rounded-full p-1.5 flex items-center shadow-inner relative overflow-hidden" style={{ backgroundColor: enableCustomO ? currentOColor : (isDarkMode ? '#3f4753' : '#e0e2ec') }}>
                            <motion.div animate={{ x: enableCustomO ? 22 : 0 }} className="w-4.5 h-4.5 rounded-full bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                     </div>
                     <AnimatePresence>
                     {enableCustomO && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                           <div className="flex flex-wrap gap-3 max-h-[180px] overflow-y-auto m3-scrollbar p-1">
                              {PLAYER_COLORS.map((color, idx) => (
                                <button key={`o-${idx}`} onClick={() => { hapticFeedback(20); setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: oColorIdx === idx ? (isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center">
                                  {oColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                                </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                     </AnimatePresence>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AboutModal কম্পোনেন্ট রেন্ডার করা হচ্ছে */}
        <AboutModal 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
          semantics={semantics} 
          useDefaultTheme={useDefaultTheme} 
          activeLineColor={activeLineColor} 
        />

      </div>
    </>
  );
}
