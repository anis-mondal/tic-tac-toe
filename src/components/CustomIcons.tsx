import React from 'react';
import { motion } from 'motion/react';

export const CustomVolume2 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" />
  </svg>
);

export const CustomVolumeX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <line x1="23" y1="9" x2="17" y2="15" fill="none" />
    <line x1="17" y1="9" x2="23" y2="15" fill="none" />
  </svg>
);

export const CustomSettings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <mask id="solid-gear-hole">
      <rect width="24" height="24" fill="white" />
      <circle cx="12" cy="12" r="4.2" fill="black" />
    </mask>
    <path 
      d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z" 
      mask="url(#solid-gear-hole)" 
      /* 🚀 আরও নিখুঁত রাউন্ডেড শেপের জন্য পরিবর্তন করা হলো */
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinejoin="round" 
      strokeLinecap="round"
    />
  </svg>
);


export const SolidUsers = ({ className, color }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" color={color} className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
  </svg>
);

export const MaterialSpinner = ({ color }: { color: string }) => (
  <motion.svg viewBox="0 0 50 50" className="w-[22px] h-[22px]" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ color }}>
    <motion.circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" initial={{ strokeDasharray: "1, 150", strokeDashoffset: 0 }} animate={{ strokeDasharray: ["1, 150", "90, 150", "90, 150"], strokeDashoffset: [0, -35, -124] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
  </motion.svg>
);

export const AILogo = () => (
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
