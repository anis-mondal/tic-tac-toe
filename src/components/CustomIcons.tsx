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
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <mask id="settings-hole">
      <rect width="24" height="24" fill="white" />
      {/* মাঝের গোল অংশটি r="3" থেকে বাড়িয়ে r="4.1" করা হলো */}
      <circle cx="12" cy="12" r="4.1" fill="black" stroke="black" strokeWidth="1" />
    </mask>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="currentColor" mask="url(#settings-hole)" />
    <circle cx="12" cy="12" r="4.5" fill="none" />
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
