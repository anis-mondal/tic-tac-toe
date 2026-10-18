import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X as CloseIcon, Info, Moon, Target, Check, Settings, RotateCcw,
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
  Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, 
  Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, 
  IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, 
  BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich, ChevronLeft
} from 'lucide-react';

import { EMOJI_LIST } from './emojiList'; 
import { REFRESH_LOADERS } from './RefreshLoaders';

export const ICONS_LIST = [
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, TargetIcon, Shield, Zap, Dna, Star, Heart, InfinityIcon, Puzzle, SparkleIcon, Gem, Crown, Trophy, Ghost, Leaf, Flame, Droplet, Flower2, Snowflake, Feather, SunIcon, MoonIcon, Cloud, Wind, Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail, Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5, Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer, Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck, Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage, Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor, Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid, Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer, Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets, ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt, Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard, Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper, Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
];

// 🚀 নতুন থিমগুলোর কালার প্লেয়ার এবং লাইনের কালারে যুক্ত করা হলো
export const PLAYER_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#22c55e', '#65a30d', '#a16207', '#d97706', '#ea580c', '#e11d48', '#db2777', '#c026d3', '#6366f1', '#0284c7',
  '#6A5687', '#D5BBFA', '#895130', '#FFB68D', '#775B1A', '#FEDF9E', // Purple, Orange, Yellow
  '#61692D', '#DFE895', '#3C6942', '#9BD49F', '#1E6A60', '#9EF2E3', // Chartreuse, Green, Teal
  '#23677A', '#B0EDFF', '#30436E', '#B0C6FF', '#413E6D', '#C4BFFF'  // Cyan, Blue, Indigo
];

export const EXTRA_LINE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#64748b',
  '#22c55e', '#65a30d', '#a16207', '#d97706', '#ea580c', '#e11d48', '#db2777', '#c026d3', '#6366f1', '#0284c7',
  '#6A5687', '#D5BBFA', '#895130', '#FFB68D', '#775B1A', '#FEDF9E', 
  '#61692D', '#DFE895', '#3C6942', '#9BD49F', '#1E6A60', '#9EF2E3', 
  '#23677A', '#B0EDFF', '#30436E', '#B0C6FF', '#413E6D', '#C4BFFF'
];

export const ORIGINAL_THEME = { name: 'Classic', light: '#f8f9fa', dark: '#000000', gridLight: '#e2e8f0', gridDark: '#1a1c1e', cellLight: '#ffffff', cellDark: '#2a2d31', indicatorLight: '#64748b', indicatorDark: '#94a3b8', linesLight: ['#22c55e', '#16a34a', '#15803d', '#10b981', '#059669'], linesDark: ['#22c55e', '#4ade80', '#86efac', '#34d399', '#6ee7b7'] };

export const CUSTOM_THEMES = [
  // 🚀 ৯টি নতুন M3 কাস্টম থিম (Purple, Orange, Yellow + ৬টি নতুন)
  { 
    name: 'M3 Custom Purple', 
    light: '#F8F4FF', dark: '#140D1C', 
    gridLight: '#DDC4FD', gridDark: '#3C255B', 
    cellLight: '#ffffff', cellDark: '#533C74', 
    indicatorLight: '#6A5687', indicatorDark: '#D5BBFA', 
    linesLight: ['#6A5687', '#4E3B68', '#7D516A', '#9F7AEA', '#FDC4E4'], 
    linesDark: ['#D5BBFA', '#EDDCFF', '#FFD8E0', '#643B43', '#B794F4'] 
  },
  { 
    name: 'M3 Custom Orange', 
    light: '#FEEAE1', dark: '#1F1005', 
    gridLight: '#FCB38A', gridDark: '#6F3712', 
    cellLight: '#ffffff', cellDark: '#4A2208', 
    indicatorLight: '#895130', indicatorDark: '#FFB68D', 
    linesLight: ['#895130', '#A66A42', '#C48355', '#FCB38A', '#E4BEA9'], 
    linesDark: ['#FFB68D', '#FFCAAA', '#E4BEA9', '#D2A180', '#FCB38A'] 
  },
  { 
    name: 'M3 Custom Yellow', 
    light: '#F8ECDE', dark: '#1A1405', 
    gridLight: '#FAD688', gridDark: '#5B4400', 
    cellLight: '#ffffff', cellDark: '#3D2E00', 
    indicatorLight: '#775B1A', indicatorDark: '#FEDF9E', 
    linesLight: ['#775B1A', '#6C5D40', '#8F712A', '#A8883B', '#FAD688'], 
    linesDark: ['#FEDF9E', '#E9C16C', '#D8C4A1', '#EED888', '#F5E499'] 
  },
  { 
    name: 'M3 Custom Chartreuse', 
    light: '#F8FAE6', dark: '#171810', 
    gridLight: '#E1E99E', gridDark: '#444B05', 
    cellLight: '#ffffff', cellDark: '#2E330D', 
    indicatorLight: '#61692D', indicatorDark: '#DFE895', 
    linesLight: ['#61692D', '#64674A', '#4A5021', '#7A843C', '#E1E99E'], 
    linesDark: ['#DFE895', '#C4CD7C', '#C8C9A7', '#B6C25B', '#444B05'] 
  },
  { 
    name: 'M3 Custom Green', 
    light: '#EAF8EB', dark: '#0E170F', 
    gridLight: '#BEF0BF', gridDark: '#1D5228', 
    cellLight: '#ffffff', cellDark: '#263B29', 
    indicatorLight: '#3C6942', indicatorDark: '#9BD49F', 
    linesLight: ['#3C6942', '#526351', '#284B2E', '#4F8857', '#BEF0BF'], 
    linesDark: ['#9BD49F', '#B8CBB5', '#7BC481', '#1D5228', '#A2D9A6'] 
  },
  { 
    name: 'M3 Custom Teal', 
    light: '#E2F9F5', dark: '#071715', 
    gridLight: '#A9F0E2', gridDark: '#005047', 
    cellLight: '#ffffff', cellDark: '#133833', 
    indicatorLight: '#1E6A60', indicatorDark: '#9EF2E3', 
    linesLight: ['#1E6A60', '#4B6460', '#134D45', '#2A8F82', '#A9F0E2'], 
    linesDark: ['#9EF2E3', '#83D5C7', '#B1CCC7', '#6BD8C6', '#005047'] 
  },
  { 
    name: 'M3 Custom Cyan', 
    light: '#E3F6FE', dark: '#0A161A', 
    gridLight: '#A8E6FD', gridDark: '#014E60', 
    cellLight: '#ffffff', cellDark: '#163540', 
    indicatorLight: '#23677A', indicatorDark: '#B0EDFF', 
    linesLight: ['#23677A', '#4B626A', '#164B59', '#3288A0', '#A8E6FD'], 
    linesDark: ['#B0EDFF', '#87D1EA', '#B3C9D4', '#5BC1E3', '#014E60'] 
  },
  { 
    name: 'M3 Custom Blue', 
    light: '#EAF0FF', dark: '#0E121A', 
    gridLight: '#B7CBFE', gridDark: '#2E4577', 
    cellLight: '#ffffff', cellDark: '#1C2945', 
    indicatorLight: '#30436E', indicatorDark: '#B0C6FF', 
    linesLight: ['#30436E', '#4B5D8B', '#585F72', '#223254', '#B7CBFE'], 
    linesDark: ['#B0C6FF', '#D9E2FF', '#BFC5DB', '#87A8FF', '#2E4577'] 
  },
  { 
    name: 'M3 Custom Indigo', 
    light: '#EFEEFF', dark: '#12111A', 
    gridLight: '#CBC6FF', gridDark: '#434077', 
    cellLight: '#ffffff', cellDark: '#28254A', 
    indicatorLight: '#413E6D', indicatorDark: '#C4BFFF', 
    linesLight: ['#413E6D', '#5D598B', '#5F5D72', '#2C2A4F', '#CBC6FF'], 
    linesDark: ['#C4BFFF', '#E3E0FF', '#C8C4DB', '#A299FF', '#434077'] 
  },
  // 🚀 অন্যান্য ডিফল্ট থিম
  { name: 'Dynamic M3', light: '#fdf8fd', dark: '#141218', gridLight: '#e8def8', gridDark: '#2b2930', cellLight: '#ffffff', cellDark: '#36343b', indicatorLight: '#6750a4', indicatorDark: '#d0bcff', linesLight: ['#6750a4', '#b3261e', '#9c4146', '#316934', '#006a6a'], linesDark: ['#d0bcff', '#f2b8b5', '#ffb4ab', '#82c986', '#4cdada'] },
  { name: 'M3 Emerald', light: '#ecfdf5', dark: '#020f0a', gridLight: '#a7f3d0', gridDark: '#052115', cellLight: '#ffffff', cellDark: '#0a3321', indicatorLight: '#16a34a', indicatorDark: '#22c55e', linesLight: ['#166534', '#059669', '#15803d', '#10b981', '#16a34a'], linesDark: ['#4ade80', '#22c55e', '#34d399', '#86efac', '#8dd999'] },
  { name: 'Vibrant Coral', light: '#fff1f2', dark: '#4c0519', gridLight: '#fecdd3', gridDark: '#881337', cellLight: '#ffffff', cellDark: '#9f1239', indicatorLight: '#e11d48', indicatorDark: '#fb7185', linesLight: ['#be123c', '#e11d48', '#f43f5e', '#fda4af', '#fecdd3'], linesDark: ['#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239'] },
  { name: 'Vibrant Fuchsia', light: '#faf5ff', dark: '#3b0764', gridLight: '#e9d5ff', gridDark: '#6b21a8', cellLight: '#ffffff', cellDark: '#86198f', indicatorLight: '#c026d3', indicatorDark: '#e879f9', linesLight: ['#a21caf', '#c026d3', '#d946ef', '#f0abfc', '#f5d0fe'], linesDark: ['#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f'] }
];

const AnimatedToggle = ({ enabled, onToggle, activeColor, isDarkMode }: { enabled: boolean, onToggle: () => void, activeColor: string, isDarkMode: boolean }) => {
  const offBgColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  return (
    <motion.button 
      onClick={onToggle}
      className="w-[50px] h-[28px] rounded-full p-1 flex items-center shrink-0 relative transition-colors duration-300 cursor-pointer"
      style={{ backgroundColor: enabled ? activeColor : offBgColor }}
    >
      <motion.div 
        layout
        animate={{ x: enabled ? 22 : 0 }} 
        className="w-[20px] h-[20px] rounded-full bg-white shadow-sm flex items-center justify-center z-10"
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {enabled 
            ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-3 h-3" style={{ color: activeColor }} strokeWidth={4} /></motion.div>
            : <motion.div key="close" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CloseIcon className="w-3 h-3 text-gray-500" strokeWidth={4} /></motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

interface SettingsModalProps {
  isOpen: boolean; onClose: () => void; setIsAboutOpen: (val: boolean) => void;
  showAdvanced: boolean; setShowAdvanced: (val: boolean) => void;
  semantics: any; isDarkMode: boolean; isAmoled: boolean; setIsAmoled: (val: boolean) => void;
  useDefaultTheme: boolean; setUseDefaultTheme: (val: boolean) => void;
  themeIdx: number; setThemeIdx: (val: number) => void;
  p1Custom: boolean; setP1Custom: (val: boolean) => void; p1Idx: number; setP1Idx: (val: number) => void;
  p2Custom: boolean; setP2Custom: (val: boolean) => void; p2Idx: number; setP2Idx: (val: number) => void;
  p1Emoji: string | null; setP1Emoji: (val: string | null) => void; 
  p2Emoji: string | null; setP2Emoji: (val: string | null) => void; 
  enableCustomLine: boolean; setEnableCustomLine: (val: boolean) => void; customLineIdx: number; setCustomLineIdx: (val: number) => void;
  enableCustomX: boolean; setEnableCustomX: (val: boolean) => void; xColorIdx: number; setXColorIdx: (val: number) => void;
  enableCustomO: boolean; setEnableCustomO: (val: boolean) => void; oColorIdx: number; setOColorIdx: (val: number) => void;
  isTargetScoreEnabled: boolean; setIsTargetScoreEnabled: (val: boolean) => void; setUserWantsTargetScore: (val: boolean) => void;
  targetScore: number; setTargetScore: any; maxScore: number;
  activeLineColor: string; currentXColor: string; currentOColor: string;
  hapticFeedback: (pattern: number | number[]) => void;
  enableHardRefreshTap: boolean; setEnableHardRefreshTap: (val: boolean) => void;
  enableHardPullToRefresh: boolean; setEnableHardPullToRefresh: (val: boolean) => void;
  isHapticEnabled: boolean; setIsHapticEnabled: (val: boolean) => void;
  
  isDragEnabled: boolean; setIsDragEnabled: (val: boolean) => void;

  soundPrefs: { xTap: number, oTap: number, pop: number, mode: number, refresh: number, win: number, overallWin: number, point: number };
  setSoundPrefs: React.Dispatch<React.SetStateAction<any>>;
  playPreviewSound: (key: string, val: number) => void;
  isIconsFilledX: number; setIsIconsFilledX: React.Dispatch<React.SetStateAction<number>>;
  isIconsFilledO: number; setIsIconsFilledO: React.Dispatch<React.SetStateAction<number>>;
  refreshLoaderIdx: number; setRefreshLoaderIdx: React.Dispatch<React.SetStateAction<number>>;
  showLoadersMenu: boolean; setShowLoadersMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const getRandomEmojis = (count: number) => {
    const list = Array.isArray(EMOJI_LIST) && EMOJI_LIST.length > 0 ? EMOJI_LIST : [];
    if (list.length === 0) return Array(count).fill('');
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default function SettingsModal(props: SettingsModalProps) {
  
  const [localUseDefaultTheme, setLocalUseDefaultTheme] = useState(props.useDefaultTheme);
  const [localThemeIdx, setLocalThemeIdx] = useState(props.themeIdx);
  const [visualUseDefaultTheme, setVisualUseDefaultTheme] = useState(props.useDefaultTheme);
  const [visualThemeIdx, setVisualThemeIdx] = useState(props.themeIdx);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [previewLoaderIdx, setPreviewLoaderIdx] = useState<number | null>(null);

  useEffect(() => { 
      setLocalUseDefaultTheme(props.useDefaultTheme); 
      setVisualUseDefaultTheme(props.useDefaultTheme);
  }, [props.useDefaultTheme]);
  
  useEffect(() => { 
      setLocalThemeIdx(props.themeIdx); 
      setVisualThemeIdx(props.themeIdx);
  }, [props.themeIdx]);

  const activeTheme = localUseDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[localThemeIdx];
  const availableLinesDark = [...activeTheme.linesDark, ...EXTRA_LINE_COLORS];
  const availableLinesLight = [...activeTheme.linesLight, ...EXTRA_LINE_COLORS];
  
  const activeLineColor = props.isDarkMode 
    ? (props.enableCustomLine ? availableLinesDark[props.customLineIdx] : availableLinesDark[0]) 
    : (props.enableCustomLine ? availableLinesLight[props.customLineIdx] : availableLinesLight[0]);

  const cardBorderColor = props.isDarkMode ? 'rgba(255,255,255,0.08)' : activeLineColor;
  const cancelBtnColor = '#ea4335'; 
  const doneBtnColor = localUseDefaultTheme ? '#22c55e' : activeLineColor; 

  const updateSound = (key: string, val: number) => {
    props.setSoundPrefs((prev: any) => ({ ...prev, [key]: val }));
    props.playPreviewSound(key, val);
  };

  const renderSoundControl = (label: string, key: keyof typeof props.soundPrefs) => {
    const value = props.soundPrefs[key];
    const handleDec = () => {
       props.hapticFeedback(20);
       updateSound(key, value === 0 ? 20 : value - 1);
    };
    const handleInc = () => {
       props.hapticFeedback(20);
       updateSound(key, value === 20 ? 0 : value + 1);
    };

    return (
      <div className="flex items-center justify-between py-2 border-b last:border-0 border-black/5 dark:border-white/5">
        <span className="text-[13px] font-bold opacity-80">{label}</span>
        <div className="flex items-center gap-2">
           <button onClick={handleDec} className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black active:scale-90 transition-transform">-</button>
           <span className="w-8 text-center text-[13px] font-black">{value === 0 ? 'Off' : value}</span>
           <button onClick={handleInc} className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black active:scale-90 transition-transform">+</button>
        </div>
      </div>
    );
  };

  const [xEmojiQueue, setXEmojiQueue] = useState<string[]>(getRandomEmojis(9));
  const [oEmojiQueue, setOEmojiQueue] = useState<string[]>(getRandomEmojis(9));
  const [emojiModal, setEmojiModal] = useState<{isOpen: boolean, target: 'X' | 'O'}>({isOpen: false, target: 'X'});
  const [emojiInput, setEmojiInput] = useState('');

  const handleRefreshEmojis = (player: 'X' | 'O') => {
      props.hapticFeedback(20);
      const newRandoms = getRandomEmojis(9);
      if (player === 'X') setXEmojiQueue(newRandoms);
      else setOEmojiQueue(newRandoms);
  };

  const handleAddCustomEmoji = () => {
      const newEmoji = emojiInput.trim();
      if (!newEmoji) return;
      props.hapticFeedback(30);

      if (emojiModal.target === 'X') {
          setXEmojiQueue(prev => {
              const updated = [...prev];
              updated.shift(); 
              updated.push(newEmoji);
              return updated;
          });
          props.setP1Emoji(newEmoji);
          props.setP1Idx(-1);
      } else {
          setOEmojiQueue(prev => {
              const updated = [...prev];
              updated.shift(); 
              updated.push(newEmoji);
              return updated;
          });
          props.setP2Emoji(newEmoji);
          props.setP2Idx(-1);
      }
      setEmojiModal({isOpen: false, target: 'X'});
      setEmojiInput('');
  };

  const handleThemeToggleChange = (isClassic: boolean) => {
     if (visualUseDefaultTheme === isClassic || isUpdating) return;
     props.hapticFeedback(20);
     setIsUpdating(true);
     setVisualUseDefaultTheme(isClassic);
     setTimeout(() => {
         setLocalUseDefaultTheme(isClassic); 
         props.setUseDefaultTheme(isClassic); 
         setIsUpdating(false);
     }, 300);
  };

  const handleColorChange = (idx: number) => {
     if (visualThemeIdx === idx || isUpdating) return;
     props.hapticFeedback(20);
     setIsUpdating(true);
     setVisualThemeIdx(idx);
     setTimeout(() => {
         setLocalThemeIdx(idx);
         props.setCustomLineIdx(0); 
         props.setThemeIdx(idx);
         setIsUpdating(false);
     }, 300);
  };

  const handleLoaderSelect = (idx: number) => {
     props.hapticFeedback(20);
     props.setRefreshLoaderIdx(idx);
     setPreviewLoaderIdx(idx);
     setTimeout(() => {
         setPreviewLoaderIdx(null);
     }, 1500);
  };

  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div 
           onClick={props.onClose} 
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
           transition={{ duration: 0.2 }}
           className="fixed inset-0 z-[150] flex items-center justify-center md:justify-start bg-black/70 backdrop-blur-md"
        >
          <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
             <motion.div 
                onClick={(e) => e.stopPropagation()} 
                initial={{ scale: 0.85, y: 50, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.85, y: 50, opacity: 0 }} 
                transition={{ type: "spring", damping: 20, stiffness: 350, mass: 0.8 }}
                style={{ backgroundColor: props.semantics.screenBackground, color: props.semantics.text }} 
                className="w-full max-w-[420px] pt-7 pb-4 px-1 rounded-[36px] shadow-2xl relative border-[3px] border-gray-200 dark:border-white/10 transition-colors duration-1000 overflow-hidden"
             >
                <button onClick={props.onClose} className="absolute top-6 right-7 p-2 transition-opacity hover:opacity-70 z-[160] bg-black/5 dark:bg-white/5 rounded-full active:scale-90 border border-black/10 dark:border-white/10">
                  <CloseIcon className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-6 px-7">
                  <Settings className="w-7 h-7 opacity-90" />
                  <h2 className="font-nunito-black text-3xl tracking-tight">Settings</h2>
                </div>

                <div className="relative w-full overflow-hidden px-4">
                  <div className="max-h-[66vh] overflow-y-auto m3-scrollbar pr-3 space-y-4 pb-6">
                    
                    {/* 1. Theme Style Box */}
                    <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Theme Style</h3>
                       
                       <div 
                          className="relative flex p-1.5 rounded-[28px] w-full shadow-sm transition-colors duration-300"
                          style={{ 
                             backgroundColor: props.isDarkMode ? (props.isAmoled ? '#0f0f0f' : props.semantics.modeSliderContainer.bg) : activeLineColor 
                          }}
                       >
                          <div className="relative flex w-full">
                              <div 
                                className="absolute top-0 bottom-0 w-1/2 rounded-[24px] shadow-sm"
                                style={{ 
                                   backgroundColor: props.isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff',
                                   transform: visualUseDefaultTheme ? 'translateX(0)' : 'translateX(100%)',
                                   transition: 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)',
                                   willChange: 'transform' 
                                }}
                              />
                              <button 
                                  onClick={() => handleThemeToggleChange(true)} 
                                  className="relative flex-1 h-[40px] rounded-[24px] text-[13px] font-black uppercase tracking-wider z-10 flex items-center justify-center transition-colors duration-300"
                                  style={{ 
                                     color: visualUseDefaultTheme 
                                        ? (props.isDarkMode ? '#ffffff' : activeLineColor) 
                                        : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)')
                                  }}
                              >
                                  <span className="relative z-10">Classic</span>
                              </button>
                              <button 
                                  onClick={() => handleThemeToggleChange(false)} 
                                  className="relative flex-1 h-[40px] rounded-[24px] text-[13px] font-black uppercase tracking-wider z-10 flex items-center justify-center transition-colors duration-300"
                                  style={{ 
                                     color: !visualUseDefaultTheme 
                                        ? (props.isDarkMode ? '#ffffff' : activeLineColor) 
                                        : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)')
                                  }}
                              >
                                  <span className="relative z-10">Custom</span>
                              </button>
                          </div>
                       </div>
                    </div>
                    
                    {/* 2. Surface Colors Box */}
                    <AnimatePresence>
                      {!localUseDefaultTheme && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 overflow-hidden transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Surface Colors</h3>
                          <div className="relative w-full rounded-[16px] overflow-hidden">
                             <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                  {CUSTOM_THEMES.map((theme, idx) => (
                                    <button key={theme.name} onClick={() => handleColorChange(idx)} style={{ backgroundColor: props.isDarkMode ? theme.indicatorDark : theme.indicatorLight, borderColor: visualThemeIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110">
                                      {visualThemeIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3. Pure Black AMOLED Box */}
                    <AnimatePresence>
                      {props.isDarkMode && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center justify-between rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                                <div className="flex items-center gap-3">
                                   <Moon className="w-5 h-5 opacity-70" />
                                   <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Pure Black (AMOLED)</h3>
                                </div>
                                <AnimatedToggle enabled={props.isAmoled} onToggle={() => { props.hapticFeedback(30); props.setIsAmoled(!props.isAmoled); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                            </div>
                         </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* 4. Target Point Win Box */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Target className="w-5 h-5 opacity-70" />
                             <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Target Point Win</h3>
                          </div>
                          <AnimatedToggle enabled={props.isTargetScoreEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsTargetScoreEnabled(!props.isTargetScoreEnabled); props.setUserWantsTargetScore(!props.isTargetScoreEnabled); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.isTargetScoreEnabled && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-4 overflow-hidden pt-1">
                             <span className="text-[13px] opacity-80 font-black uppercase tracking-wider">Points to Win:</span>
                             <div className="flex gap-2.5 items-center bg-transparent/10 p-1 rounded-xl">
                                <button onClick={() => { props.hapticFeedback(20); props.setTargetScore((s: number) => Math.max(Math.max(1, props.maxScore), s-1)); }} disabled={props.targetScore <= Math.max(1, props.maxScore)} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/10">-</button>
                                <span className="text-xl font-black w-8 text-center">{props.targetScore}</span>
                                <button onClick={() => { props.hapticFeedback(20); props.setTargetScore((s: number) => Math.min(20, s+1)); }} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg font-black hover:bg-black/10 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/10">+</button>
                             </div>
                          </motion.div>
                       )}
                       </AnimatePresence>
                    </div>
                    
                    {/* 5. Custom Winning Line Box */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Winning Line Color</h3>
                          <AnimatedToggle enabled={props.enableCustomLine} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomLine(!props.enableCustomLine); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomLine && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-2">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {(props.isDarkMode ? availableLinesDark : availableLinesLight).map((color, idx) => (
                                        <button key={`line-${idx}`} onClick={() => { props.hapticFeedback(20); props.setCustomLineIdx(idx); }} style={{ backgroundColor: color, borderColor: props.customLineIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110">
                                          {props.customLineIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                       </AnimatePresence>
                    </div>

                    {/* 6. Custom Player X Box */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player X Color</h3>
                          <AnimatedToggle enabled={props.enableCustomX} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomX(!props.enableCustomX); }} activeColor={props.currentXColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomX && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {PLAYER_COLORS.map((color, idx) => (
                                        <button key={`x-col-${idx}`} onClick={() => { props.hapticFeedback(20); props.setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: props.xColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110">
                                           {props.xColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                       </AnimatePresence>

                       <div className="flex items-start justify-between pt-3 border-t border-black/10 dark:border-white/10">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1.5 leading-snug w-3/5">Custom Player X Shape</h3>
                          <div className="mt-0.5"><AnimatedToggle enabled={props.p1Custom} onToggle={() => { props.hapticFeedback(30); props.setP1Custom(!props.p1Custom); }} activeColor={props.currentXColor} isDarkMode={props.isDarkMode} /></div>
                       </div>
                       
                       <AnimatePresence>
                       {props.p1Custom && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             
                             <div className="w-full pt-4 pb-2 border-b border-black/10 dark:border-white/10 mb-3 overflow-hidden">
                                 <div className="flex justify-between items-center mb-2.5 px-1">
                                     <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Emojis</span>
                                     <button onClick={() => handleRefreshEmojis('X')} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10">
                                         <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                                     </button>
                                 </div>
                                 
                                 <div className="grid grid-cols-5 gap-y-3 gap-x-2 place-items-center">
                                     <AnimatePresence mode="popLayout">
                                         {xEmojiQueue.map((emj, idx) => (
                                            <motion.button 
                                                key={`${emj}-${idx}`} 
                                                layout 
                                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                onClick={() => { 
                                                   props.hapticFeedback(20); 
                                                   props.setP1Emoji(emj);
                                                   props.setP1Idx(-1);
                                                }} 
                                                className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl transition-all border-[2.5px] ${props.p1Emoji === emj && props.p1Idx === -1 ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} 
                                                style={{ borderColor: props.p1Emoji === emj && props.p1Idx === -1 ? props.currentXColor : 'transparent' }}
                                            >
                                                <span style={{ fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif' }}>{emj}</span>
                                            </motion.button>
                                         ))}
                                     </AnimatePresence>
                                     <motion.button layout onClick={() => { props.hapticFeedback(20); setEmojiModal({isOpen: true, target: 'X'}); setEmojiInput(''); }} className="w-[38px] h-[38px] rounded-xl flex items-center justify-center border-[2.5px] border-dashed border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-xl font-black opacity-60 hover:opacity-100">
                                        +
                                     </motion.button>
                                 </div>
                             </div>

                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="flex justify-between items-center mb-2 px-1">
                                   <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Icons</span>
                                   <button onClick={() => { props.hapticFeedback(20); props.setIsIconsFilledX(prev => (prev + 1) % 3); }} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10">
                                      <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                                   </button>
                                </div>
                                <div className="max-h-[185px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {ICONS_LIST.map((IconComponent, idx) => {
                                         let fillVal = 'none'; let fillOp = 1; let strokeW = 2.5;
                                         if (props.isIconsFilledX === 1) { fillVal = props.currentXColor; fillOp = 0.40; strokeW = 2.8; }
                                         else if (props.isIconsFilledX === 2) { fillVal = props.currentXColor; fillOp = 1; strokeW = 2.2; }
                                         
                                         return (
                                         <button key={idx} onClick={() => { 
                                            props.hapticFeedback(20); props.setP1Idx(idx); props.setP1Emoji(null);
                                         }} className={`w-9 h-9 rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p1Idx === idx ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p1Idx === idx ? props.currentXColor : 'transparent' }}>
                                            <IconComponent className="w-[22px] h-[22px]" color={props.currentXColor} fill={fillVal} fillOpacity={fillOp} strokeWidth={strokeW} />
                                         </button>
                                      )})}
                                   </div>
                                </div>
                             </div>

                          </motion.div>
                       )}
                       </AnimatePresence>
                    </div>

                    {/* 7. Custom Player O Box */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player O Color</h3>
                          <AnimatedToggle enabled={props.enableCustomO} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomO(!props.enableCustomO); }} activeColor={props.currentOColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomO && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {PLAYER_COLORS.map((color, idx) => (
                                        <button key={`o-col-${idx}`} onClick={() => { props.hapticFeedback(20); props.setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: props.oColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110">
                                          {props.oColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                       </AnimatePresence>

                       <div className="flex items-start justify-between pt-3 border-t border-black/10 dark:border-white/10">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1.5 leading-snug w-3/5">Custom Player O Shape</h3>
                          <div className="mt-0.5"><AnimatedToggle enabled={props.p2Custom} onToggle={() => { props.hapticFeedback(30); props.setP2Custom(!props.p2Custom); }} activeColor={props.currentOColor} isDarkMode={props.isDarkMode} /></div>
                       </div>
                       <AnimatePresence>
                       {props.p2Custom && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             
                             <div className="w-full pt-4 pb-2 border-b border-black/10 dark:border-white/10 mb-3 overflow-hidden">
                                 <div className="flex justify-between items-center mb-2.5 px-1">
                                     <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Emojis</span>
                                     <button onClick={() => handleRefreshEmojis('O')} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10">
                                         <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                                     </button>
                                 </div>
                                 
                                 <div className="grid grid-cols-5 gap-y-3 gap-x-2 place-items-center">
                                     <AnimatePresence mode="popLayout">
                                         {oEmojiQueue.map((emj, idx) => (
                                            <motion.button 
                                                key={`${emj}-${idx}`} 
                                                layout 
                                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                onClick={() => { 
                                                   props.hapticFeedback(20); 
                                                   props.setP2Emoji(emj);
                                                   props.setP2Idx(-1);
                                                }} 
                                                className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl transition-all border-[2.5px] ${props.p2Emoji === emj && props.p2Idx === -1 ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} 
                                                style={{ borderColor: props.p2Emoji === emj && props.p2Idx === -1 ? props.currentOColor : 'transparent' }}
                                            >
                                                <span style={{ fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif' }}>{emj}</span>
                                            </motion.button>
                                         ))}
                                     </AnimatePresence>
                                     <motion.button layout onClick={() => { props.hapticFeedback(20); setEmojiModal({isOpen: true, target: 'O'}); setEmojiInput(''); }} className="w-[38px] h-[38px] rounded-xl flex items-center justify-center border-[2.5px] border-dashed border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-xl font-black opacity-60 hover:opacity-100">
                                        +
                                     </motion.button>
                                 </div>
                             </div>

                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="flex justify-between items-center mb-2 px-1">
                                   <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Icons</span>
                                   <button onClick={() => { props.hapticFeedback(20); props.setIsIconsFilledO(prev => (prev + 1) % 3); }} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10">
                                      <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                                   </button>
                                </div>
                                <div className="max-h-[185px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {ICONS_LIST.map((IconComponent, idx) => {
                                         let fillVal = 'none'; let fillOp = 1; let strokeW = 2.5;
                                         if (props.isIconsFilledO === 1) { fillVal = props.currentOColor; fillOp = 0.40; strokeW = 2.8; }
                                         else if (props.isIconsFilledO === 2) { fillVal = props.currentOColor; fillOp = 1; strokeW = 2.2; }

                                         return (
                                         <button key={idx} onClick={() => { 
                                            props.hapticFeedback(20); props.setP2Idx(idx); props.setP2Emoji(null);
                                         }} className={`w-9 h-9 rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p2Idx === idx ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p2Idx === idx ? props.currentOColor : 'transparent' }}>
                                            <IconComponent className="w-[22px] h-[22px]" color={props.currentOColor} fill={fillVal} fillOpacity={fillOp} strokeWidth={strokeW} />
                                         </button>
                                      )})}
                                   </div>
                                </div>
                             </div>

                          </motion.div>
                       )}
                       </AnimatePresence>
                    </div>

                    {/* 🚀 8. Refresh Animations Button (New Menu) */}
                    <div className="pt-2 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setShowLoadersMenu(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <RotateCcw className="w-[20px] h-[20px] opacity-70" style={{ color: activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5 opacity-80" style={{ color: activeLineColor }}>Refresh Animations</span>
                       </button>
                    </div>
                    
                    {/* 9. Advanced Settings Button */}
                    <div className="pt-1 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setShowAdvanced(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <Settings className="w-[20px] h-[20px] opacity-70" style={{ color: activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5 opacity-80" style={{ color: activeLineColor }}>Advanced Settings</span>
                       </button>
                    </div>

                    {/* 10. About Game Button */}
                    <div className="pt-1 pb-2 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setIsAboutOpen(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <Info className="w-[22px] h-[22px]" style={{ color: activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5" style={{ color: activeLineColor }}>About Game</span>
                       </button>
                    </div>

                  </div>
                </div>

                {/* 🚀 Refresh Loaders Overlay (New Page for Animations with Magic Tint Fix) */}
                <AnimatePresence>
                  {props.showLoadersMenu && (
                    <motion.div 
                       initial={{ x: '100%', opacity: 1 }} 
                       animate={{ x: 0, opacity: 1 }} 
                       exit={{ x: '100%', opacity: 1 }} 
                       transition={{ type: "spring", damping: 25, stiffness: 300 }}
                       className="absolute inset-0 z-[170] flex flex-col bg-inherit"
                       style={{ backgroundColor: props.semantics.screenBackground }} 
                    >
                       <div className="flex items-center gap-2 mb-2 px-6 pt-6 pb-2 border-b border-black/10 dark:border-white/10">
                          <button onClick={() => { props.hapticFeedback(20); props.setShowLoadersMenu(false); }} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-90">
                             <ChevronLeft className="w-6 h-6" />
                          </button>
                          <h2 className="font-nunito-black text-2xl tracking-tight mt-0.5">Animations</h2>
                       </div>

                       <div className="flex-1 overflow-y-auto m3-scrollbar px-5 pb-6 pt-2 space-y-4">
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-5 gap-x-2 pt-4 pb-2">
                              {REFRESH_LOADERS.map((loader, idx) => {
                                 const isSelected = props.refreshLoaderIdx === idx;
                                 const animationKey = isSelected ? `animating-${idx}-${previewLoaderIdx}` : `static-${idx}`;
                                 
                                 return (
                                    <div key={loader.name} className="flex flex-col items-center gap-2">
                                       <motion.button 
                                          whileTap={{ scale: 0.8 }}
                                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                          onClick={() => handleLoaderSelect(idx)}
                                          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all overflow-hidden ${isSelected ? 'shadow-md' : 'shadow-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}
                                          style={{ 
                                             border: isSelected ? `2.5px solid ${activeLineColor}` : '2.5px solid transparent',
                                             color: isSelected ? activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)') 
                                          }}
                                       >
                                          {/* 🚀 Magic Fix: থিম কালারের হালকা আভা (Tint) */}
                                          {isSelected && (
                                              <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: activeLineColor, opacity: 0.15 }} />
                                          )}
                                          {!isSelected && (
                                              <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: activeLineColor, opacity: 0.05 }} />
                                          )}

                                          <div className="relative z-10" key={animationKey}>
                                              {React.createElement(loader.component, { color: isSelected ? activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)') })}
                                          </div>
                                       </motion.button>
                                       <span className="text-[10px] font-black uppercase tracking-wider text-center w-full truncate px-1" style={{ color: isSelected ? activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)') }}>
                                          {loader.name}
                                       </span>
                                    </div>
                                 );
                              })}
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Advanced Settings Overlay */}
                <AnimatePresence>
                  {props.showAdvanced && (
                    <motion.div 
                       initial={{ x: '100%', opacity: 1 }} 
                       animate={{ x: 0, opacity: 1 }} 
                       exit={{ x: '100%', opacity: 1 }} 
                       transition={{ type: "spring", damping: 25, stiffness: 300 }}
                       className="absolute inset-0 z-[170] flex flex-col bg-inherit"
                       style={{ backgroundColor: props.semantics.screenBackground }} 
                    >
                       <div className="flex items-center gap-2 mb-2 px-6 pt-6 pb-2 border-b border-black/10 dark:border-white/10">
                          <button onClick={() => { props.hapticFeedback(20); props.setShowAdvanced(false); }} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-90">
                             <ChevronLeft className="w-6 h-6" />
                          </button>
                          <h2 className="font-nunito-black text-2xl tracking-tight mt-0.5">Advanced</h2>
                       </div>

                       <div className="flex-1 overflow-y-auto m3-scrollbar px-5 pb-6 pt-2 space-y-4">
                          
                          {/* Toggles */}
                          <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 space-y-4 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                              <div className="flex items-center justify-between">
                                 <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 w-3/4">Enable Haptic Feedback</h3>
                                 <AnimatedToggle enabled={props.isHapticEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsHapticEnabled(!props.isHapticEnabled); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                              </div>

                              {/* 🚀 Drag & Bounce Physics টগল */}
                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between">
                                 <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Interactive Icon Drag</h3>
                                 <AnimatedToggle enabled={props.isDragEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsDragEnabled(!props.isDragEnabled); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                              </div>

                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between">
                                 <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Hard Refresh on Bar Tap</h3>
                                 <AnimatedToggle enabled={props.enableHardRefreshTap} onToggle={() => { props.hapticFeedback(30); props.setEnableHardRefreshTap(!props.enableHardRefreshTap); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                              </div>
                              
                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between">
                                 <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Hard Pull to Refresh</h3>
                                 <AnimatedToggle enabled={props.enableHardPullToRefresh} onToggle={() => { props.hapticFeedback(30); props.setEnableHardPullToRefresh(!props.enableHardPullToRefresh); }} activeColor={activeLineColor} isDarkMode={props.isDarkMode} />
                              </div>
                          </div>

                          {/* Sound Customization */}
                          <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 space-y-2 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                              <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Sound Customization</h3>
                              {renderSoundControl('Player X Tap', 'xTap')}
                              {renderSoundControl('Player O Tap', 'oTap')}
                              {renderSoundControl('Mode Switch', 'mode')}
                              {renderSoundControl('Refresh App', 'refresh')}
                              {renderSoundControl('Win Round', 'win')}
                              {renderSoundControl('Overall Match Win', 'overallWin')}
                              {renderSoundControl('Draw / Other', 'point')}
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Smart Emoji Popup */}
                <AnimatePresence>
                  {emojiModal.isOpen && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setEmojiModal({isOpen: false, target: 'X'})}
                        className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[36px]"
                     >
                        <motion.div 
                           initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }}
                           onClick={(e) => e.stopPropagation()}
                           className="w-[80%] max-w-[280px] p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-5 border-[2px] border-white/10"
                           style={{ backgroundColor: props.semantics.screenBackground }}
                        >
                           <h3 className="font-black text-xl opacity-90 tracking-tight">New Symbol</h3>
                           
                           <input 
                              type="text"
                              maxLength={5} 
                              value={emojiInput}
                              onChange={(e) => setEmojiInput(e.target.value)}
                              onKeyDown={(e) => { if(e.key === 'Enter' && emojiInput.trim()) handleAddCustomEmoji(); }}
                              enterKeyHint="done" 
                              autoFocus
                              className="w-[84px] h-[84px] text-center text-[44px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[3px] outline-none transition-colors shadow-inner"
                              style={{ 
                                 borderColor: emojiInput.trim() ? doneBtnColor : (props.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                 fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif'
                              }}
                           />
                           
                           <div className="flex w-full gap-3 mt-1">
                              <button onClick={() => setEmojiModal({isOpen: false, target: 'X'})} className="flex-1 py-3.5 rounded-[18px] font-black text-white shadow-sm active:scale-95 transition-transform" style={{ backgroundColor: cancelBtnColor }}>
                                 Cancel
                              </button>
                              <AnimatePresence>
                                 {emojiInput.trim().length > 0 && (
                                    <motion.button 
                                       initial={{ opacity: 0, width: 0, padding: 0 }} 
                                       animate={{ opacity: 1, width: '100%', padding: '14px' }} 
                                       exit={{ opacity: 0, width: 0, padding: 0 }} 
                                       onClick={handleAddCustomEmoji} 
                                       className="flex-1 rounded-[18px] font-black text-white shadow-sm active:scale-95 transition-transform overflow-hidden" 
                                       style={{ backgroundColor: doneBtnColor }}
                                    >
                                       Done
                                    </motion.button>
                                 )}
                              </AnimatePresence>
                           </div>
                        </motion.div>
                     </motion.div>
                  )}
                </AnimatePresence>

             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
