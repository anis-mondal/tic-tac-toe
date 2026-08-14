
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const hapticFeedback = (pattern: number | number[]) => {
  if (Capacitor.isNativePlatform()) {
     try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
  } else if (typeof window !== 'undefined' && navigator.vibrate) {
     try { navigator.vibrate(pattern as any); } catch (e) {}
  }
};

export const getSaved = (key: string, defaultVal: any) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : defaultVal;
  } catch (e) { return defaultVal; }
};

export const blendDarker = (hex: string, factor: number) => {
    if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;
    let r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    let g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    let b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
