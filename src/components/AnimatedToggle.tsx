import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X as CloseIcon } from 'lucide-react';

interface AnimatedToggleProps {
  enabled: boolean;
  onToggle: () => void;
  activeColor: string;
  isDarkMode: boolean;
}

export default function AnimatedToggle({ enabled, onToggle, activeColor, isDarkMode }: AnimatedToggleProps) {
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
}
