import { Capacitor } from '@capacitor/core';
import { generateAdaptiveTheme } from '../components/AdaptiveThemePicker';

export const getSystemDynamicTheme = (): Promise<any> => {
  return new Promise((resolve) => {
    // ওয়েব বা পিসিতে চললে ডায়নামিক থিম কাজ করবে না
    if (!Capacitor.isNativePlatform()) {
      resolve(null);
      return;
    }

    const DynamicColor = (window as any).DynamicColor;
    
    if (DynamicColor) {
      DynamicColor.isDynamicColorAvailable((available: boolean) => {
        if (available) {
          DynamicColor.colors((colors: any) => {
            // ইউজারের মোবাইলের ডায়নামিক প্রাইমারি কালারটি বের করা হচ্ছে
            const systemHex = colors.light.primary || '#007AFF';
            resolve(generateAdaptiveTheme(systemHex, 'System Dynamic'));
          });
        } else {
          resolve(null);
        }
      });
    } else {
      resolve(null);
    }
  });
};
