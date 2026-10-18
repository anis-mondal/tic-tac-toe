import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

// 🚀 Google Material Color Utilities Import
import { argbFromHex, themeFromSourceColor, hexFromArgb } from '@material/material-color-utilities';

// ==========================================
// 🚀 1. Google Material You (M3) Theme Engine
// ==========================================

export const generateAdaptiveTheme = (baseHex: string, themeName: string = 'Adaptive Theme') => {
  // হেক্স কোড থেকে ম্যাটেরিয়াল থিমের কোর প্যালেট জেনারেট করা
  const argb = argbFromHex(baseHex);
  const theme = themeFromSourceColor(argb);
  const p = theme.palettes; // Tonal Palettes (Primary, Secondary, Tertiary, Neutral)

  return {
    name: themeName,
    baseColor: baseHex,
    
    // ☀️ Light Mode Shades
    light: hexFromArgb(p.neutral.tone(98)),           // খুব হালকা ব্যাকগ্রাউন্ড
    gridLight: hexFromArgb(p.primary.tone(90)),       // ছকের ব্যাকগ্রাউন্ড (হালকা থিম কালার)
    cellLight: '#ffffff',                             // ভেতরের ঘর (বিশুদ্ধ সাদা)
    indicatorLight: hexFromArgb(p.primary.tone(40)),  // আইকন এবং টেক্সট কালার
    linesLight: [
      hexFromArgb(p.primary.tone(40)),
      hexFromArgb(p.secondary.tone(40)),
      hexFromArgb(p.tertiary.tone(40)),
      hexFromArgb(p.error.tone(40)),
      hexFromArgb(p.primary.tone(30))
    ],

    // 🌙 Dark Mode Shades
    dark: hexFromArgb(p.neutral.tone(6)),             // একদম গাঢ় ডার্ক ব্যাকগ্রাউন্ড
    gridDark: hexFromArgb(p.neutralVariant.tone(15)), // ছকের ব্যাকগ্রাউন্ড (Darker)
    cellDark: hexFromArgb(p.neutralVariant.tone(25)), // ভেতরের ঘর (উজ্জ্বল আভার জন্য Lighter Tone)
    indicatorDark: hexFromArgb(p.primary.tone(80)),   // আইকন এবং টেক্সট কালার
    linesDark: [
      hexFromArgb(p.primary.tone(80)),
      hexFromArgb(p.secondary.tone(80)),
      hexFromArgb(p.tertiary.tone(80)),
      hexFromArgb(p.error.tone(80)),
      hexFromArgb(p.primary.tone(90))
    ]
  };
};

// ==========================================
// 🚀 2. Smooth Color Picker UI Logic
// ==========================================

// UI এর জন্য HSL থেকে Hex রূপান্তরকারী (শুধুমাত্র কালার পিকার স্লাইডারের জন্য)
const hexToHSL = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255;
    g = parseInt(hex.substring(3, 5), 16) / 255;
    b = parseInt(hex.substring(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
};

// ==========================================
// 🚀 3. The Modal Component
// ==========================================

interface AdaptiveThemePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hex: string) => void;
  initialColor?: string;
  isDarkMode: boolean;
  semantics: any;
}

export default function AdaptiveThemePicker({ isOpen, onClose, onSave, initialColor = '#007AFF', isDarkMode, semantics }: AdaptiveThemePickerProps) {
  
  const [h, setH] = useState(0);
  const [s, setS] = useState(100);
  const [l, setL] = useState(50);
  const [hexInput, setHexInput] = useState(initialColor);

  const wheelRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const hsl = hexToHSL(initialColor);
      setH(hsl.h); setS(hsl.s); setL(hsl.l);
      setHexInput(initialColor.toUpperCase());
    }
  }, [isOpen, initialColor]);

  useEffect(() => {
    const newHex = hslToHex(h, s, l);
    if (newHex !== hexInput) setHexInput(newHex);
  }, [h, s, l]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (!val.startsWith('#')) val = '#' + val;
    setHexInput(val);
    
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const hsl = hexToHSL(val);
      setH(hsl.h); setS(hsl.s); setL(hsl.l);
    }
  };

  const handleWheelPointer = (e: React.PointerEvent | PointerEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    const radius = rect.width / 2;
    let distance = Math.sqrt(x * x + y * y);
    if (distance > radius) distance = radius; 
    
    const saturation = (distance / radius) * 100;
    setH(Math.round(angle));
    setS(Math.round(saturation));
  };

  const handleSliderPointer = (e: React.PointerEvent | PointerEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const lightness = (x / rect.width) * 100;
    setL(Math.round(lightness));
  };

  const handlePointerDown = (type: 'wheel' | 'slider') => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (type === 'wheel') handleWheelPointer(e);
    else handleSliderPointer(e);

    const onMove = (moveEvent: PointerEvent) => {
      if (type === 'wheel') handleWheelPointer(moveEvent);
      else handleSliderPointer(moveEvent);
    };

    const onUp = (upEvent: PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(upEvent.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  if (!isOpen) return null;

  const angleRad = (h - 90) * (Math.PI / 180);
  const thumbRadius = (s / 100) * 100; 
  const thumbX = 100 + thumbRadius * Math.cos(angleRad);
  const thumbY = 100 + thumbRadius * Math.sin(angleRad);

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
           initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
           className="w-full max-w-[340px] rounded-[36px] shadow-2xl flex flex-col items-center border-[2px] border-white/10 overflow-hidden relative"
           style={{ backgroundColor: semantics.screenBackground, color: semantics.text }}
        >
           <div className="w-full flex items-center justify-between p-6 pb-2">
              <h3 className="font-nunito-black text-xl tracking-tight opacity-90">Adaptive Color</h3>
              <button onClick={onClose} className="p-2 rounded-full bg-black/5 dark:bg-white/5 active:scale-90 transition-transform">
                 <X className="w-5 h-5 opacity-70" />
              </button>
           </div>

           <div className="w-full px-6 mb-6 mt-2">
              <div className="flex items-center justify-center gap-3">
                 <div className="w-11 h-11 rounded-full shadow-inner border-[3px] border-black/10 dark:border-white/10" style={{ backgroundColor: hexInput }} />
                 <input 
                    type="text" 
                    value={hexInput} 
                    onChange={handleHexChange}
                    maxLength={7}
                    className="flex-1 h-12 bg-black/5 dark:bg-white/5 rounded-2xl px-4 font-black text-lg tracking-widest text-center outline-none border-[2.5px] transition-colors"
                    style={{ color: semantics.text, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                 />
              </div>
           </div>

           {/* 🚀 Smooth Color Wheel (Dot-free) */}
           <div className="relative w-[200px] h-[200px] mb-8" onPointerDown={handlePointerDown('wheel')}>
              <div 
                 ref={wheelRef}
                 className="absolute inset-0 rounded-full shadow-inner cursor-crosshair"
                 style={{ background: 'conic-gradient(from 90deg, red, yellow, lime, aqua, blue, magenta, red)' }}
              >
                 <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle closest-side, #ffffff, transparent)' }} />
              </div>
              
              <div 
                 className="absolute w-7 h-7 rounded-full border-[3px] border-white shadow-md pointer-events-none"
                 style={{
                    backgroundColor: hslToHex(h, s, 50),
                    left: `${thumbX}px`, top: `${thumbY}px`,
                    transform: 'translate(-50%, -50%)'
                 }}
              />
           </div>

           {/* 🚀 Brightness Slider */}
           <div className="w-full px-8 mb-8">
              <div className="flex justify-between text-[11px] font-black uppercase opacity-50 mb-2">
                 <span>Dark</span>
                 <span>Light</span>
              </div>
              <div 
                 ref={sliderRef}
                 onPointerDown={handlePointerDown('slider')}
                 className="w-full h-8 rounded-full relative cursor-pointer shadow-inner border-[2px] border-black/5 dark:border-white/5"
                 style={{ background: `linear-gradient(to right, #000000, ${hslToHex(h, s, 50)}, #ffffff)` }}
              >
                 <div 
                    className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-md border-[2px] border-gray-200 pointer-events-none"
                    style={{ left: `${l}%`, transform: 'translate(-50%, -50%)' }}
                 />
              </div>
           </div>

           <div className="w-full p-4 pt-0">
              <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => { onSave(hexInput); onClose(); }}
                 className="w-full h-[52px] rounded-[20px] font-black text-[15px] uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2"
                 style={{ backgroundColor: hexInput }}
              >
                 <Check className="w-5 h-5" /> Apply Theme
              </motion.button>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
