import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X as CloseIcon, Info, Moon, Target, Settings, RotateCcw,
  ChevronLeft, Plus, Trash2, Edit3
} from 'lucide-react';

import { EMOJI_LIST } from './emojiList'; 
import { REFRESH_LOADERS } from './RefreshLoaders';
import AdaptiveThemePicker, { generateAdaptiveTheme } from './AdaptiveThemePicker'; 
import AnimatedToggle from './AnimatedToggle';

// 🚀 আলাদা করা ফাইল থেকে ডেটা ইমপোর্ট করা হলো
import { 
  ICONS_LIST, PLAYER_COLORS, EXTRA_LINE_COLORS, ORIGINAL_THEME, 
  STATIC_THEMES, CUSTOM_THEMES, STATIC_COLORS_COUNT, 
  savedAdaptiveThemes, savedCustomColors 
} from './themeData';

// 🚀 App.tsx এর জন্য ডেটাগুলো রি-এক্সপোর্ট করা হলো যাতে অ্যাপ ক্র্যাশ না করে
export { 
  ICONS_LIST, PLAYER_COLORS, EXTRA_LINE_COLORS, ORIGINAL_THEME, 
  STATIC_THEMES, CUSTOM_THEMES, STATIC_COLORS_COUNT 
};

interface SettingsModalProps {
  isOpen: boolean; onClose: () => void; setIsAboutOpen: (val: boolean) => void; showAdvanced: boolean; setShowAdvanced: (val: boolean) => void;
  semantics: any; isDarkMode: boolean; isAmoled: boolean; setIsAmoled: (val: boolean) => void;
  useDefaultTheme: boolean; setUseDefaultTheme: (val: boolean) => void; themeIdx: number; setThemeIdx: (val: number) => void;
  p1Custom: boolean; setP1Custom: (val: boolean) => void; p1Idx: number; setP1Idx: (val: number) => void;
  p2Custom: boolean; setP2Custom: (val: boolean) => void; p2Idx: number; setP2Idx: (val: number) => void;
  p1Emoji: string | null; setP1Emoji: (val: string | null) => void; p2Emoji: string | null; setP2Emoji: (val: string | null) => void; 
  enableCustomLine: boolean; setEnableCustomLine: (val: boolean) => void; customLineIdx: number; setCustomLineIdx: (val: number) => void;
  enableCustomX: boolean; setEnableCustomX: (val: boolean) => void; xColorIdx: number; setXColorIdx: (val: number) => void;
  enableCustomO: boolean; setEnableCustomO: (val: boolean) => void; oColorIdx: number; setOColorIdx: (val: number) => void;
  isTargetScoreEnabled: boolean; setIsTargetScoreEnabled: (val: boolean) => void; setUserWantsTargetScore: (val: boolean) => void;
  targetScore: number; setTargetScore: any; maxScore: number; activeLineColor: string; currentXColor: string; currentOColor: string;
  hapticFeedback: (pattern: number | number[]) => void;
  enableHardRefreshTap: boolean; setEnableHardRefreshTap: (val: boolean) => void; enableHardPullToRefresh: boolean; setEnableHardPullToRefresh: (val: boolean) => void;
  isHapticEnabled: boolean; setIsHapticEnabled: (val: boolean) => void; isDragEnabled: boolean; setIsDragEnabled: (val: boolean) => void;
  soundPrefs: { xTap: number, oTap: number, pop: number, mode: number, refresh: number, win: number, overallWin: number, point: number };
  setSoundPrefs: React.Dispatch<React.SetStateAction<any>>; playPreviewSound: (key: string, val: number) => void;
  isIconsFilledX: number; setIsIconsFilledX: React.Dispatch<React.SetStateAction<number>>; isIconsFilledO: number; setIsIconsFilledO: React.Dispatch<React.SetStateAction<number>>;
  refreshLoaderIdx: number; setRefreshLoaderIdx: React.Dispatch<React.SetStateAction<number>>; showLoadersMenu: boolean; setShowLoadersMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const getRandomEmojis = (count: number) => {
    const list = Array.isArray(EMOJI_LIST) && EMOJI_LIST.length > 0 ? EMOJI_LIST : [];
    if (list.length === 0) return Array(count).fill('');
    return [...list].sort(() => 0.5 - Math.random()).slice(0, count);
};

export default function SettingsModal(props: SettingsModalProps) {
  
  const [localUseDefaultTheme, setLocalUseDefaultTheme] = useState(props.useDefaultTheme);
  const [localThemeIdx, setLocalThemeIdx] = useState(props.themeIdx);
  const [visualUseDefaultTheme, setVisualUseDefaultTheme] = useState(props.useDefaultTheme);
  const [visualThemeIdx, setVisualThemeIdx] = useState(props.themeIdx);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewLoaderIdx, setPreviewLoaderIdx] = useState<number | null>(null);

  const [userThemes, setUserThemes] = useState<any[]>(savedAdaptiveThemes);
  const [userColors, setUserColors] = useState<string[]>(savedCustomColors);
  
  const [pickerState, setPickerState] = useState<{isOpen: boolean, editIndex: number | null, target: 'theme'|'line'|'x'|'o'|'color', initialColor: string}>({isOpen: false, editIndex: null, target: 'theme', initialColor: '#007AFF'});
  const [longPressState, setLongPressState] = useState<{isOpen: boolean, index: number | null, type: 'theme'|'color'}>({isOpen: false, index: null, type: 'theme'});

  useEffect(() => { setLocalUseDefaultTheme(props.useDefaultTheme); setVisualUseDefaultTheme(props.useDefaultTheme); }, [props.useDefaultTheme]);
  useEffect(() => { setLocalThemeIdx(props.themeIdx); setVisualThemeIdx(props.themeIdx); }, [props.themeIdx]);

  // 🚀 CRASH FIX: Safe Fallback for Arrays
  const safeTheme = CUSTOM_THEMES[localThemeIdx] || CUSTOM_THEMES[0];
  const activeTheme = localUseDefaultTheme ? ORIGINAL_THEME : safeTheme;
  
  const availableLinesDark = [...(activeTheme.linesDark || []), ...EXTRA_LINE_COLORS];
  const availableLinesLight = [...(activeTheme.linesLight || []), ...EXTRA_LINE_COLORS];
  
  const cardBorderColor = props.isDarkMode ? 'rgba(255,255,255,0.08)' : props.activeLineColor;
  const cancelBtnColor = '#ea4335'; 
  const doneBtnColor = localUseDefaultTheme ? '#22c55e' : props.activeLineColor; 

  const updateSound = (key: string, val: number) => {
    props.setSoundPrefs((prev: any) => ({ ...prev, [key]: val }));
    props.playPreviewSound(key, val);
  };

  const renderSoundControl = (label: string, key: keyof typeof props.soundPrefs) => {
    const value = props.soundPrefs[key];
    return (
      <div className="flex items-center justify-between py-2 border-b last:border-0 border-black/5 dark:border-white/5">
        <span className="text-[13px] font-bold opacity-80">{label}</span>
        <div className="flex items-center gap-2">
           <button onClick={() => { props.hapticFeedback(20); updateSound(key, value === 0 ? 20 : value - 1); }} className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black active:scale-90 transition-transform">-</button>
           <span className="w-8 text-center text-[13px] font-black">{value === 0 ? 'Off' : value}</span>
           <button onClick={() => { props.hapticFeedback(20); updateSound(key, value === 20 ? 0 : value + 1); }} className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center font-black active:scale-90 transition-transform">+</button>
        </div>
      </div>
    );
  };

  const [xEmojiQueue, setXEmojiQueue] = useState<string[]>(getRandomEmojis(9));
  const [oEmojiQueue, setOEmojiQueue] = useState<string[]>(getRandomEmojis(9));
  const [emojiModal, setEmojiModal] = useState<{isOpen: boolean, target: 'X' | 'O'}>({isOpen: false, target: 'X'});
  const [emojiInput, setEmojiInput] = useState('');

  const handleRefreshEmojis = (player: 'X' | 'O') => { props.hapticFeedback(20); if (player === 'X') setXEmojiQueue(getRandomEmojis(9)); else setOEmojiQueue(getRandomEmojis(9)); };

  const handleAddCustomEmoji = () => {
      const newEmoji = emojiInput.trim(); if (!newEmoji) return;
      props.hapticFeedback(30);
      if (emojiModal.target === 'X') { setXEmojiQueue(prev => { const updated = [...prev]; updated.shift(); updated.push(newEmoji); return updated; }); props.setP1Emoji(newEmoji); props.setP1Idx(-1); } 
      else { setOEmojiQueue(prev => { const updated = [...prev]; updated.shift(); updated.push(newEmoji); return updated; }); props.setP2Emoji(newEmoji); props.setP2Idx(-1); }
      setEmojiModal({isOpen: false, target: 'X'}); setEmojiInput('');
  };

  const handleThemeToggleChange = (isClassic: boolean) => {
     if (visualUseDefaultTheme === isClassic || isUpdating) return;
     props.hapticFeedback(20); setIsUpdating(true); setVisualUseDefaultTheme(isClassic);
     setTimeout(() => { setLocalUseDefaultTheme(isClassic); props.setUseDefaultTheme(isClassic); setIsUpdating(false); }, 300);
  };

  const handleColorChange = (idx: number) => {
     if (visualThemeIdx === idx || isUpdating) return;
     props.hapticFeedback(20); setIsUpdating(true); setVisualThemeIdx(idx);
     setTimeout(() => { setLocalThemeIdx(idx); props.setCustomLineIdx(0); props.setThemeIdx(idx); setIsUpdating(false); }, 300);
  };

  const handleLoaderSelect = (idx: number) => { props.hapticFeedback(20); props.setRefreshLoaderIdx(idx); setPreviewLoaderIdx(idx); setTimeout(() => setPreviewLoaderIdx(null), 1500); };

  // ==========================================
  // 🚀 ADAPTIVE THEME & COLOR LOGIC
  // ==========================================
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);

  const handleThemeDown = (idx: number) => {
     isLongPressTriggered.current = false;
     if (idx >= STATIC_THEMES.length) { 
        longPressTimer.current = setTimeout(() => { isLongPressTriggered.current = true; props.hapticFeedback([50, 50]); setLongPressState({ isOpen: true, index: idx, type: 'theme' }); }, 500); 
     }
  };
  const handleThemeUp = (idx: number) => { if (longPressTimer.current) clearTimeout(longPressTimer.current); if (!isLongPressTriggered.current) { handleColorChange(idx); } };

  const handleColorDown = (idx: number) => {
     isLongPressTriggered.current = false;
     if (idx >= STATIC_COLORS_COUNT) { 
        longPressTimer.current = setTimeout(() => { isLongPressTriggered.current = true; props.hapticFeedback([50, 50]); setLongPressState({ isOpen: true, index: idx, type: 'color' }); }, 500); 
     }
  };
  const handleLineColorDown = (idx: number) => {
     isLongPressTriggered.current = false;
     if (idx >= 5 + STATIC_COLORS_COUNT) { 
        longPressTimer.current = setTimeout(() => { isLongPressTriggered.current = true; props.hapticFeedback([50, 50]); setLongPressState({ isOpen: true, index: idx - 5, type: 'color' }); }, 500); 
     }
  };
  
  const handleColorUp = (idx: number, target: 'x'|'o'|'line') => { 
     if (longPressTimer.current) clearTimeout(longPressTimer.current); 
     if (!isLongPressTriggered.current) { props.hapticFeedback(20); if (target === 'x') props.setXColorIdx(idx); else if (target === 'o') props.setOColorIdx(idx); else props.setCustomLineIdx(idx); } 
  };
  const handlePressLeave = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

  const handleSaveAdaptiveTheme = (hex: string) => {
     if (pickerState.target === 'theme') {
        const newTheme = generateAdaptiveTheme(hex);
        if (pickerState.editIndex !== null) {
           CUSTOM_THEMES[pickerState.editIndex] = newTheme;
           const localIdx = pickerState.editIndex - STATIC_THEMES.length;
           const updatedUserThemes = [...userThemes];
           updatedUserThemes[localIdx] = newTheme;
           setUserThemes(updatedUserThemes);
           localStorage.setItem('userAdaptiveThemes', JSON.stringify(updatedUserThemes));
           props.setThemeIdx(pickerState.editIndex);
        } else {
           CUSTOM_THEMES.push(newTheme);
           const updatedUserThemes = [...userThemes, newTheme];
           setUserThemes(updatedUserThemes);
           localStorage.setItem('userAdaptiveThemes', JSON.stringify(updatedUserThemes));
           props.setThemeIdx(CUSTOM_THEMES.length - 1);
        }
     } else {
        if (pickerState.editIndex !== null) {
           PLAYER_COLORS[pickerState.editIndex] = hex;
           EXTRA_LINE_COLORS[pickerState.editIndex] = hex;
           const localIdx = pickerState.editIndex - STATIC_COLORS_COUNT;
           savedCustomColors[localIdx] = hex;
           localStorage.setItem('userCustomColors', JSON.stringify(savedCustomColors));
           setUserColors([...savedCustomColors]);
        } else {
           PLAYER_COLORS.push(hex);
           EXTRA_LINE_COLORS.push(hex);
           savedCustomColors.push(hex);
           const newSaved = [...savedCustomColors];
           setUserColors(newSaved);
           localStorage.setItem('userCustomColors', JSON.stringify(newSaved));
           const newIdx = PLAYER_COLORS.length - 1;
           if (pickerState.target === 'line') props.setCustomLineIdx(newIdx);
           if (pickerState.target === 'x') props.setXColorIdx(newIdx);
           if (pickerState.target === 'o') props.setOColorIdx(newIdx);
        }
     }
  };

  const handleDeleteItem = () => {
     const idx = longPressState.index;
     if (idx !== null) {
        props.hapticFeedback(30);
        if (longPressState.type === 'theme') {
           if (props.themeIdx === idx) { props.setThemeIdx(0); } else if (props.themeIdx > idx) { props.setThemeIdx(props.themeIdx - 1); }
           setTimeout(() => {
               CUSTOM_THEMES.splice(idx, 1);
               const updatedUserThemes = [...userThemes];
               updatedUserThemes.splice(idx - STATIC_THEMES.length, 1);
               setUserThemes(updatedUserThemes);
               localStorage.setItem('userAdaptiveThemes', JSON.stringify(updatedUserThemes));
           }, 50);
        } else {
           PLAYER_COLORS.splice(idx, 1);
           EXTRA_LINE_COLORS.splice(idx, 1);
           const localIdx = idx - STATIC_COLORS_COUNT;
           savedCustomColors.splice(localIdx, 1);
           const updatedUserColors = [...savedCustomColors];
           setUserColors(updatedUserColors);
           localStorage.setItem('userCustomColors', JSON.stringify(updatedUserColors));
        }
     }
     setLongPressState({ isOpen: false, index: null, type: 'theme' });
  };

  const handleDeleteAllAdaptiveThemes = () => {
     props.hapticFeedback(50);
     if (props.themeIdx >= STATIC_THEMES.length) props.setThemeIdx(0); 
     setTimeout(() => {
         CUSTOM_THEMES.splice(STATIC_THEMES.length, CUSTOM_THEMES.length - STATIC_THEMES.length);
         setUserThemes([]); localStorage.setItem('userAdaptiveThemes', '[]');
     }, 100); 
  };

  const handleDeleteAllCustomColors = () => {
     props.hapticFeedback(50);
     props.setCustomLineIdx(0); props.setXColorIdx(0); props.setOColorIdx(9);
     setTimeout(() => {
         PLAYER_COLORS.length = STATIC_COLORS_COUNT;
         EXTRA_LINE_COLORS.length = STATIC_COLORS_COUNT;
         savedCustomColors.length = 0;
         setUserColors([]);
         localStorage.setItem('userCustomColors', '[]');
     }, 100);
  };

  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div onClick={props.onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[150] flex items-center justify-center md:justify-start bg-black/70 backdrop-blur-md">
          <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
             <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.85, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.85, y: 50, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 350, mass: 0.8 }} style={{ backgroundColor: props.semantics.screenBackground, color: props.semantics.text }} className="w-full max-w-[420px] pt-7 pb-4 px-1 rounded-[36px] shadow-2xl relative border-[3px] border-gray-200 dark:border-white/10 transition-colors duration-1000 overflow-hidden">
                <button onClick={props.onClose} className="absolute top-6 right-7 p-2 transition-opacity hover:opacity-70 z-[160] bg-black/5 dark:bg-white/5 rounded-full active:scale-90 border border-black/10 dark:border-white/10"><CloseIcon className="w-5 h-5" /></button>
                <div className="flex items-center gap-3 mb-6 px-7"><Settings className="w-7 h-7 opacity-90" /><h2 className="font-nunito-black text-3xl tracking-tight">Settings</h2></div>

                <div className="relative w-full overflow-hidden px-4">
                  <div className="max-h-[66vh] overflow-y-auto m3-scrollbar pr-3 space-y-4 pb-6">
                    
                    {/* Theme Style Box */}
                    <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Theme Style</h3>
                       <div className="relative flex p-1.5 rounded-[28px] w-full shadow-sm transition-colors duration-300" style={{ backgroundColor: props.isDarkMode ? (props.isAmoled ? '#0f0f0f' : props.semantics.modeSliderContainer.bg) : props.activeLineColor }}>
                          <div className="relative flex w-full">
                              <div className="absolute top-0 bottom-0 w-1/2 rounded-[24px] shadow-sm" style={{ backgroundColor: props.isDarkMode ? 'rgba(255,255,255,0.12)' : '#ffffff', transform: visualUseDefaultTheme ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)', willChange: 'transform' }} />
                              <button onClick={() => handleThemeToggleChange(true)} className="relative flex-1 h-[40px] rounded-[24px] text-[13px] font-black uppercase tracking-wider z-10 flex items-center justify-center transition-colors duration-300" style={{ color: visualUseDefaultTheme ? (props.isDarkMode ? '#ffffff' : props.activeLineColor) : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)') }}><span className="relative z-10">Classic</span></button>
                              <button onClick={() => handleThemeToggleChange(false)} className="relative flex-1 h-[40px] rounded-[24px] text-[13px] font-black uppercase tracking-wider z-10 flex items-center justify-center transition-colors duration-300" style={{ color: !visualUseDefaultTheme ? (props.isDarkMode ? '#ffffff' : props.activeLineColor) : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)') }}><span className="relative z-10">Custom</span></button>
                          </div>
                       </div>
                    </div>
                    
                    {/* Surface Colors Box */}
                    <AnimatePresence>
                      {!localUseDefaultTheme && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 overflow-hidden transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black">Surface Colors</h3>
                             {userThemes.length > 0 && (
                                <button onClick={handleDeleteAllAdaptiveThemes} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 active:scale-90 transition-transform">
                                   <RotateCcw className="w-4 h-4 opacity-80" style={{ color: props.activeLineColor }} strokeWidth={3} />
                                </button>
                             )}
                          </div>
                          <div className="relative w-full rounded-[16px] overflow-hidden">
                             <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                  {CUSTOM_THEMES.map((theme, idx) => (
                                    <button 
                                      key={`${theme.name}-${idx}`} 
                                      onPointerDown={() => handleThemeDown(idx)} onPointerUp={() => handleThemeUp(idx)} onPointerLeave={handlePressLeave}
                                      style={{ backgroundColor: props.isDarkMode ? theme.indicatorDark : theme.indicatorLight, borderColor: visualThemeIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} 
                                      className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110 relative"
                                    >
                                      {visualThemeIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                    </button>
                                  ))}
                                  <button onClick={() => { props.hapticFeedback(20); setPickerState({isOpen: true, target: 'theme', editIndex: null, initialColor: '#007AFF'}); }} className="w-8 h-8 rounded-full border-[2.5px] border-transparent shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110 relative overflow-hidden">
                                     <div className="absolute inset-0" style={{ background: 'conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
                                     <div className="absolute inset-[2px] rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center"><Plus className="w-4 h-4 text-black dark:text-white drop-shadow-md" strokeWidth={3.5} /></div>
                                  </button>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AMOLED */}
                    <AnimatePresence>
                      {props.isDarkMode && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center justify-between rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                                <div className="flex items-center gap-3"><Moon className="w-5 h-5 opacity-70" /><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Pure Black (AMOLED)</h3></div>
                                <AnimatedToggle enabled={props.isAmoled} onToggle={() => { props.hapticFeedback(30); props.setIsAmoled(!props.isAmoled); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} />
                            </div>
                         </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Target Point Win */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3"><Target className="w-5 h-5 opacity-70" /><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Target Point Win</h3></div>
                          <AnimatedToggle enabled={props.isTargetScoreEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsTargetScoreEnabled(!props.isTargetScoreEnabled); props.setUserWantsTargetScore(!props.isTargetScoreEnabled); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} />
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
                    
                    {/* Line Colors */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Winning Line Color</h3>
                          <AnimatedToggle enabled={props.enableCustomLine} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomLine(!props.enableCustomLine); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomLine && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="flex justify-between items-center mb-2 px-1 mt-2">
                                <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Colors</span>
                                {userColors.length > 0 && (
                                   <button onClick={handleDeleteAllCustomColors} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 active:scale-90 transition-transform">
                                      <RotateCcw className="w-4 h-4 opacity-80" style={{ color: props.activeLineColor }} strokeWidth={3} />
                                   </button>
                                )}
                             </div>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {(props.isDarkMode ? availableLinesDark : availableLinesLight).map((color, idx) => (
                                        <button 
                                          key={`line-${idx}`} 
                                          onPointerDown={() => handleLineColorDown(idx)} onPointerUp={() => handleColorUp(idx, 'line')} onPointerLeave={handlePressLeave}
                                          style={{ backgroundColor: color, borderColor: props.customLineIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} 
                                          className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110"
                                        >
                                          {props.customLineIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                      <button onClick={() => { props.hapticFeedback(20); setPickerState({isOpen: true, target: 'line', editIndex: null, initialColor: '#007AFF'}); }} className="w-8 h-8 rounded-full border-[2.5px] border-transparent shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110 relative overflow-hidden">
                                         <div className="absolute inset-0" style={{ background: 'conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
                                         <div className="absolute inset-[2px] rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center"><Plus className="w-4 h-4 text-black dark:text-white drop-shadow-md" strokeWidth={3.5} /></div>
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                       </AnimatePresence>
                    </div>

                    {/* X Color */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player X Color</h3>
                          <AnimatedToggle enabled={props.enableCustomX} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomX(!props.enableCustomX); }} activeColor={props.currentXColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomX && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="flex justify-between items-center mb-2 px-1 mt-1">
                                <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Colors</span>
                                {userColors.length > 0 && (
                                   <button onClick={handleDeleteAllCustomColors} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 active:scale-90 transition-transform">
                                      <RotateCcw className="w-4 h-4 opacity-80" style={{ color: props.activeLineColor }} strokeWidth={3} />
                                   </button>
                                )}
                             </div>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {PLAYER_COLORS.map((color, idx) => (
                                        <button 
                                          key={`x-col-${idx}`} 
                                          onPointerDown={() => handleColorDown(idx)} onPointerUp={() => handleColorUp(idx, 'x')} onPointerLeave={handlePressLeave}
                                          style={{ backgroundColor: color, borderColor: props.xColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} 
                                          className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110"
                                        >
                                           {props.xColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                      <button onClick={() => { props.hapticFeedback(20); setPickerState({isOpen: true, target: 'x', editIndex: null, initialColor: '#007AFF'}); }} className="w-8 h-8 rounded-full border-[2.5px] border-transparent shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110 relative overflow-hidden">
                                         <div className="absolute inset-0" style={{ background: 'conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
                                         <div className="absolute inset-[2px] rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center"><Plus className="w-4 h-4 text-black dark:text-white drop-shadow-md" strokeWidth={3.5} /></div>
                                      </button>
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
                                     <button onClick={() => handleRefreshEmojis('X')} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10"><RotateCcw className="w-3.5 h-3.5 opacity-70" /></button>
                                 </div>
                                 <div className="grid grid-cols-5 gap-y-3 gap-x-2 place-items-center">
                                     <AnimatePresence mode="popLayout">
                                         {xEmojiQueue.map((emj, idx) => (
                                            <motion.button key={`${emj}-${idx}`} layout initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => { props.hapticFeedback(20); props.setP1Emoji(emj); props.setP1Idx(-1); }} className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl transition-all border-[2.5px] ${props.p1Emoji === emj && props.p1Idx === -1 ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p1Emoji === emj && props.p1Idx === -1 ? props.currentXColor : 'transparent' }}>
                                                <span style={{ fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif' }}>{emj}</span>
                                            </motion.button>
                                         ))}
                                     </AnimatePresence>
                                     <motion.button layout onClick={() => { props.hapticFeedback(20); setEmojiModal({isOpen: true, target: 'X'}); setEmojiInput(''); }} className="w-[38px] h-[38px] rounded-xl flex items-center justify-center border-[2.5px] border-dashed border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-xl font-black opacity-60 hover:opacity-100"><Plus className="w-5 h-5"/></motion.button>
                                 </div>
                             </div>

                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="flex justify-between items-center mb-2 px-1">
                                   <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Icons</span>
                                   <button onClick={() => { props.hapticFeedback(20); props.setIsIconsFilledX(prev => (prev + 1) % 3); }} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10"><RotateCcw className="w-3.5 h-3.5 opacity-70" /></button>
                                </div>
                                <div className="max-h-[185px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {ICONS_LIST.map((IconComponent, idx) => {
                                         let fillVal = 'none'; let fillOp = 1; let strokeW = 2.5;
                                         if (props.isIconsFilledX === 1) { fillVal = props.currentXColor; fillOp = 0.40; strokeW = 2.8; }
                                         else if (props.isIconsFilledX === 2) { fillVal = props.currentXColor; fillOp = 1; strokeW = 2.2; }
                                         return (
                                         <button key={idx} onClick={() => { props.hapticFeedback(20); props.setP1Idx(idx); props.setP1Emoji(null); }} className={`w-9 h-9 rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p1Idx === idx ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p1Idx === idx ? props.currentXColor : 'transparent' }}>
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

                    {/* O Color Box */}
                    <div className="rounded-[24px] p-5 space-y-4 border-[2.5px] bg-black/5 dark:bg-white/5 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                       <div className="flex items-start justify-between">
                          <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player O Color</h3>
                          <AnimatedToggle enabled={props.enableCustomO} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomO(!props.enableCustomO); }} activeColor={props.currentOColor} isDarkMode={props.isDarkMode} />
                       </div>
                       <AnimatePresence>
                       {props.enableCustomO && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                             <div className="flex justify-between items-center mb-2 px-1 mt-1">
                                <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Colors</span>
                                {userColors.length > 0 && (
                                   <button onClick={handleDeleteAllCustomColors} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 active:scale-90 transition-transform">
                                      <RotateCcw className="w-4 h-4 opacity-80" style={{ color: props.activeLineColor }} strokeWidth={3} />
                                   </button>
                                )}
                             </div>
                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="max-h-[135px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {PLAYER_COLORS.map((color, idx) => (
                                        <button 
                                          key={`o-col-${idx}`} 
                                          onPointerDown={() => handleColorDown(idx)} onPointerUp={() => handleColorUp(idx, 'o')} onPointerLeave={handlePressLeave}
                                          style={{ backgroundColor: color, borderColor: props.oColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} 
                                          className="w-8 h-8 rounded-full border-[2.5px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110"
                                        >
                                          {props.oColorIdx === idx && <div className="w-3 h-3 rounded-full bg-white shadow-sm" />}
                                        </button>
                                      ))}
                                      <button onClick={() => { props.hapticFeedback(20); setPickerState({isOpen: true, target: 'o', editIndex: null, initialColor: '#007AFF'}); }} className="w-8 h-8 rounded-full border-[2.5px] border-transparent shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-110 relative overflow-hidden">
                                         <div className="absolute inset-0" style={{ background: 'conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)' }} />
                                         <div className="absolute inset-[2px] rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center"><Plus className="w-4 h-4 text-black dark:text-white drop-shadow-md" strokeWidth={3.5} /></div>
                                      </button>
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
                                     <button onClick={() => handleRefreshEmojis('O')} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10"><RotateCcw className="w-3.5 h-3.5 opacity-70" /></button>
                                 </div>
                                 <div className="grid grid-cols-5 gap-y-3 gap-x-2 place-items-center">
                                     <AnimatePresence mode="popLayout">
                                         {oEmojiQueue.map((emj, idx) => (
                                            <motion.button key={`${emj}-${idx}`} layout initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => { props.hapticFeedback(20); props.setP2Emoji(emj); props.setP2Idx(-1); }} className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl transition-all border-[2.5px] ${props.p2Emoji === emj && props.p2Idx === -1 ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p2Emoji === emj && props.p2Idx === -1 ? props.currentOColor : 'transparent' }}>
                                                <span style={{ fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif' }}>{emj}</span>
                                            </motion.button>
                                         ))}
                                     </AnimatePresence>
                                     <motion.button layout onClick={() => { props.hapticFeedback(20); setEmojiModal({isOpen: true, target: 'O'}); setEmojiInput(''); }} className="w-[38px] h-[38px] rounded-xl flex items-center justify-center border-[2.5px] border-dashed border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-all text-xl font-black opacity-60 hover:opacity-100"><Plus className="w-5 h-5" /></motion.button>
                                 </div>
                             </div>

                             <div className="relative w-full rounded-[16px] overflow-hidden pt-1">
                                <div className="flex justify-between items-center mb-2 px-1">
                                   <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Icons</span>
                                   <button onClick={() => { props.hapticFeedback(20); props.setIsIconsFilledO(prev => (prev + 1) % 3); }} className="p-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all border border-black/10 dark:border-white/10"><RotateCcw className="w-3.5 h-3.5 opacity-70" /></button>
                                </div>
                                <div className="max-h-[185px] overflow-y-auto m3-scrollbar pr-3">
                                   <div className="grid grid-cols-5 place-items-center gap-y-4 gap-x-2 pb-2 pt-1">
                                      {ICONS_LIST.map((IconComponent, idx) => {
                                         let fillVal = 'none'; let fillOp = 1; let strokeW = 2.5;
                                         if (props.isIconsFilledO === 1) { fillVal = props.currentOColor; fillOp = 0.40; strokeW = 2.8; }
                                         else if (props.isIconsFilledO === 2) { fillVal = props.currentOColor; fillOp = 1; strokeW = 2.2; }
                                         return (
                                         <button key={idx} onClick={() => { props.hapticFeedback(20); props.setP2Idx(idx); props.setP2Emoji(null); }} className={`w-9 h-9 rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p2Idx === idx ? 'bg-black/10 dark:bg-white/10 shadow-sm' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p2Idx === idx ? props.currentOColor : 'transparent' }}>
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

                    {/* 🚀 Refresh Animations Button */}
                    <div className="pt-2 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setShowLoadersMenu(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <RotateCcw className="w-[20px] h-[20px] opacity-70" style={{ color: props.activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5 opacity-80" style={{ color: props.activeLineColor }}>Refresh Animations</span>
                       </button>
                    </div>
                    
                    {/* 🚀 Advanced Settings Button */}
                    <div className="pt-1 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setShowAdvanced(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <Settings className="w-[20px] h-[20px] opacity-70" style={{ color: props.activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5 opacity-80" style={{ color: props.activeLineColor }}>Advanced Settings</span>
                       </button>
                    </div>

                    <div className="pt-1 pb-2 flex justify-center w-full">
                       <button onClick={() => { props.hapticFeedback(30); props.setIsAboutOpen(true); }} className="w-[85%] py-[15px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[2.5px] hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                         <Info className="w-[22px] h-[22px]" style={{ color: props.activeLineColor }} /> 
                         <span className="font-black uppercase tracking-widest text-[14px] mt-0.5" style={{ color: props.activeLineColor }}>About Game</span>
                       </button>
                    </div>

                  </div>
                </div>

                {/* 🚀 Long Press Edit/Delete Modal */}
                <AnimatePresence>
                  {longPressState.isOpen && (
                     <motion.div 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xl transform-gpu"
                       onClick={() => setLongPressState({ isOpen: false, index: null, type: 'theme' })}
                     >
                        <motion.div 
                          initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                          className="bg-white dark:bg-[#1a1a1a] rounded-[28px] p-5 flex flex-col gap-3 w-[200px] shadow-2xl border-[2px] border-black/10 dark:border-white/10"
                          onClick={e => e.stopPropagation()}
                        >
                           <button onClick={() => { 
                              if (longPressState.type === 'theme') {
                                 setPickerState({ isOpen: true, target: 'theme', editIndex: longPressState.index, initialColor: CUSTOM_THEMES[longPressState.index!].baseColor || '#007AFF' }); 
                              } else {
                                 setPickerState({ isOpen: true, target: 'color', editIndex: longPressState.index, initialColor: PLAYER_COLORS[longPressState.index!] || '#007AFF' }); 
                              }
                              setLongPressState({ isOpen: false, index: null, type: 'theme' }); 
                           }} className="flex items-center gap-3 font-bold p-3.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-colors text-black dark:text-white">
                              <Edit3 className="w-5 h-5 opacity-70" /> Edit {longPressState.type === 'theme' ? 'Theme' : 'Color'}
                           </button>
                           <button onClick={handleDeleteItem} className="flex items-center gap-3 font-bold p-3.5 text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-colors shadow-sm">
                              <Trash2 className="w-5 h-5 opacity-90" /> Delete
                           </button>
                        </motion.div>
                     </motion.div>
                  )}
                </AnimatePresence>

                {/* Refresh Loaders Overlay */}
                <AnimatePresence>
                  {props.showLoadersMenu && (
                    <motion.div initial={{ x: '100%', opacity: 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute inset-0 z-[170] flex flex-col bg-inherit" style={{ backgroundColor: props.semantics.screenBackground }}>
                       <div className="flex items-center gap-2 mb-2 px-6 pt-6 pb-2 border-b border-black/10 dark:border-white/10">
                          <button onClick={() => { props.hapticFeedback(20); props.setShowLoadersMenu(false); }} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-90"><ChevronLeft className="w-6 h-6" /></button>
                          <h2 className="font-nunito-black text-2xl tracking-tight mt-0.5">Animations</h2>
                       </div>
                       <div className="flex-1 overflow-y-auto m3-scrollbar px-5 pb-6 pt-2 space-y-4">
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-5 gap-x-2 pt-4 pb-2">
                              {REFRESH_LOADERS.map((loader, idx) => {
                                 const isSelected = props.refreshLoaderIdx === idx;
                                 const animationKey = isSelected ? `animating-${idx}-${previewLoaderIdx}` : `static-${idx}`;
                                 return (
                                    <div key={loader.name} className="flex flex-col items-center gap-2">
                                       <motion.button whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => handleLoaderSelect(idx)} className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all overflow-hidden ${isSelected ? 'shadow-md' : 'shadow-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`} style={{ border: isSelected ? `2.5px solid ${props.activeLineColor}` : '2.5px solid transparent', color: isSelected ? props.activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)') }}>
                                          {isSelected && <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: props.activeLineColor, opacity: 0.15 }} />}
                                          {!isSelected && <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: props.activeLineColor, opacity: 0.05 }} />}
                                          <div className="relative z-10" key={animationKey}>{React.createElement(loader.component, { color: isSelected ? props.activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)') })}</div>
                                       </motion.button>
                                       <span className="text-[10px] font-black uppercase tracking-wider text-center w-full truncate px-1" style={{ color: isSelected ? props.activeLineColor : (props.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)') }}>{loader.name}</span>
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
                    <motion.div initial={{ x: '100%', opacity: 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute inset-0 z-[170] flex flex-col bg-inherit" style={{ backgroundColor: props.semantics.screenBackground }}>
                       <div className="flex items-center gap-2 mb-2 px-6 pt-6 pb-2 border-b border-black/10 dark:border-white/10">
                          <button onClick={() => { props.hapticFeedback(20); props.setShowAdvanced(false); }} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-90"><ChevronLeft className="w-6 h-6" /></button>
                          <h2 className="font-nunito-black text-2xl tracking-tight mt-0.5">Advanced</h2>
                       </div>
                       <div className="flex-1 overflow-y-auto m3-scrollbar px-5 pb-6 pt-2 space-y-4">
                          <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 space-y-4 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                              <div className="flex items-center justify-between"><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 w-3/4">Enable Haptic Feedback</h3><AnimatedToggle enabled={props.isHapticEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsHapticEnabled(!props.isHapticEnabled); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} /></div>
                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between"><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Interactive Icon Drag</h3><AnimatedToggle enabled={props.isDragEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsDragEnabled(!props.isDragEnabled); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} /></div>
                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between"><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Hard Refresh on Bar Tap</h3><AnimatedToggle enabled={props.enableHardRefreshTap} onToggle={() => { props.hapticFeedback(30); props.setEnableHardRefreshTap(!props.enableHardRefreshTap); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} /></div>
                              <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                              <div className="flex items-center justify-between"><h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/4">Hard Pull to Refresh</h3><AnimatedToggle enabled={props.enableHardPullToRefresh} onToggle={() => { props.hapticFeedback(30); props.setEnableHardPullToRefresh(!props.enableHardPullToRefresh); }} activeColor={props.activeLineColor} isDarkMode={props.isDarkMode} /></div>
                          </div>
                          <div className="rounded-[24px] p-5 border-[2.5px] bg-black/5 dark:bg-white/5 space-y-2 transition-colors duration-300" style={{ borderColor: cardBorderColor }}>
                              <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Sound Customization</h3>
                              {renderSoundControl('Player X Tap', 'xTap')}{renderSoundControl('Player O Tap', 'oTap')}{renderSoundControl('Mode Switch', 'mode')}{renderSoundControl('Refresh App', 'refresh')}{renderSoundControl('Win Round', 'win')}{renderSoundControl('Overall Match Win', 'overallWin')}{renderSoundControl('Draw / Other', 'point')}
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Smart Emoji Popup */}
                <AnimatePresence>
                  {emojiModal.isOpen && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEmojiModal({isOpen: false, target: 'X'})} className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xl transform-gpu">
                        <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-[80%] max-w-[280px] p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-5 border-[2px] border-white/10" style={{ backgroundColor: props.semantics.screenBackground }}>
                           <h3 className="font-black text-xl opacity-90 tracking-tight">New Symbol</h3>
                           <input type="text" maxLength={5} value={emojiInput} onChange={(e) => setEmojiInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && emojiInput.trim()) handleAddCustomEmoji(); }} enterKeyHint="done" autoFocus className="w-[84px] h-[84px] text-center text-[44px] rounded-[24px] bg-black/5 dark:bg-white/5 border-[3px] outline-none transition-colors shadow-inner" style={{ borderColor: emojiInput.trim() ? doneBtnColor : (props.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), fontFamily: '"NunitoBlack", "Noto Color Emoji", sans-serif' }} />
                           <div className="flex w-full gap-3 mt-1">
                              <button onClick={() => setEmojiModal({isOpen: false, target: 'X'})} className="flex-1 py-3.5 rounded-[18px] font-black text-white shadow-sm active:scale-95 transition-transform" style={{ backgroundColor: cancelBtnColor }}>Cancel</button>
                              <AnimatePresence>
                                 {emojiInput.trim().length > 0 && <motion.button initial={{ opacity: 0, width: 0, padding: 0 }} animate={{ opacity: 1, width: '100%', padding: '14px' }} exit={{ opacity: 0, width: 0, padding: 0 }} onClick={handleAddCustomEmoji} className="flex-1 rounded-[18px] font-black text-white shadow-sm active:scale-95 transition-transform overflow-hidden" style={{ backgroundColor: doneBtnColor }}>Done</motion.button>}
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

      {/* 🚀 Adaptive Theme Picker Modal */}
      <AdaptiveThemePicker 
         isOpen={pickerState.isOpen} 
         onClose={() => setPickerState({isOpen: false, editIndex: null, target: 'theme', initialColor: ''})} 
         onSave={handleSaveAdaptiveTheme} 
         initialColor={pickerState.initialColor} 
         isDarkMode={props.isDarkMode} 
         semantics={props.semantics} 
         mode={pickerState.target === 'theme' ? 'theme' : 'color'}
      />
    </AnimatePresence>
  );
}
