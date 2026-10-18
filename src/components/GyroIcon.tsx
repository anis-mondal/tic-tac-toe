import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Motion } from '@capacitor/motion';

interface GyroIconProps {
  isEnabled: boolean;     
  children: React.ReactNode; 
  boundary?: number;      
}

export default function GyroIcon({ isEnabled, children, boundary = 8 }: GyroIconProps) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.8 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);
  
  const [hasSensor, setHasSensor] = useState(true);

  useEffect(() => {
    // 🚀 টগল অফ থাকলে বা সেন্সর না থাকলে এটি কাজ করবে না
    if (!isEnabled || !hasSensor) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    let accelListener: any = null;

    const startSensor = async () => {
      try {
        // 🚀 ১. ব্রাউজার বা সিস্টেম থেকে পারমিশন নেওয়ার চেষ্টা করা (iOS এবং কিছু আধুনিক Android ব্রাউজারের জন্য)
        try {
          if (typeof (DeviceMotionEvent as any) !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            const permissionState = await (DeviceMotionEvent as any).requestPermission();
            if (permissionState !== 'granted') {
               console.warn("Motion permission denied by user.");
               setHasSensor(false);
               return; // পারমিশন না দিলে সেন্সর চালু হবে না
            }
          }
        } catch (permError) {
           // পারমিশন প্রম্পট সাপোর্টেড না হলে সাধারণভাবেই কাজ চালিয়ে যাবে (যেমন সাধারণ Android এ)
           console.warn("Permission check skipped or not needed.");
        }

        // 🚀 ২. ক্যাপাসিটর দিয়ে সেন্সরের ডেটা রিড করা
        accelListener = await Motion.addListener('accel', (event) => {
          if (!event.accelerationIncludingGravity) return;

          const accelX = event.accelerationIncludingGravity.x || 0;
          const accelY = event.accelerationIncludingGravity.y || 0;

          // সেনসিটিভিটি (কতটা দ্রুত নড়বে)
          const sensitivity = 2.5; 
          
          let targetX = accelX * -sensitivity; 
          let targetY = accelY * sensitivity;

          // 🚀 দেয়ালের গ্যাপ মেইনটেইন করা
          if (targetX > boundary) targetX = boundary;
          if (targetX < -boundary) targetX = -boundary;
          if (targetY > boundary) targetY = boundary;
          if (targetY < -boundary) targetY = -boundary;

          // GPU-তে ডেটা পাঠানো (0% Re-render)
          rawX.set(targetX);
          rawY.set(targetY);
        });
      } catch (error) {
        console.warn("Gyroscope sensor not available or permission denied.");
        setHasSensor(false); 
        rawX.set(0);
        rawY.set(0);
      }
    };

    startSensor();

    return () => {
      if (accelListener && accelListener.remove) {
        accelListener.remove();
      } else {
        Motion.removeAllListeners();
      }
    };
  }, [isEnabled, boundary, rawX, rawY, hasSensor]);

  return (
    <motion.div 
      style={{ x: springX, y: springY }} 
      className="w-full h-full flex items-center justify-center relative pointer-events-none"
    >
      {children}
    </motion.div>
  );
}
