import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Loader } from 'lucide-react';

// 🚀 72 Premium Authentic, Geometric & Cute Loading Animations
export const REFRESH_LOADERS = [
  {
    name: 'Material',
    component: ({ color }: { color: string }) => (
      <motion.svg viewBox="0 0 50 50" className="w-6 h-6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ color }}>
        <motion.circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" initial={{ strokeDasharray: "1, 150", strokeDashoffset: 0 }} animate={{ strokeDasharray: ["1, 150", "90, 150", "90, 150"], strokeDashoffset: [0, -35, -124] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
      </motion.svg>
    )
  },
  {
    name: 'Dual Ring', 
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <motion.svg viewBox="0 0 24 24" className="absolute w-6 h-6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 40" />
        </motion.svg>
        <motion.svg viewBox="0 0 24 24" className="absolute w-3.5 h-3.5" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 30" />
        </motion.svg>
      </div>
    )
  },
  {
    name: 'Ping Pong',
    component: ({ color }: { color: string }) => (
      <div className="w-[26px] h-[12px] rounded-full border-[2px] border-current flex items-center px-[2px]" style={{ color }}>
        <motion.div animate={{ x: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
      </div>
    )
  },
  {
    name: 'Dots',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15, ease: "easeInOut" }} />
        ))}
      </div>
    )
  },
  {
    name: 'Bars',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-3 bg-current rounded-full" animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }} />
        ))}
      </div>
    )
  },
  {
    name: 'Pulse',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <motion.div className="absolute w-full h-full rounded-full border-[2.5px] border-current opacity-0" animate={{ scale: [0.4, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} />
        <div className="w-2 h-2 rounded-full bg-current" />
      </div>
    )
  },
  {
    name: 'Orbit',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-6 h-6 border-[2px] border-dashed rounded-full flex items-center justify-center border-current" style={{ color }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
         <div className="w-1.5 h-1.5 rounded-full bg-current absolute -top-[3px]" />
      </motion.div>
    )
  },
  {
    name: 'Spinner',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ color }}>
          <Loader2 className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Dotted',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ color }}>
          <Loader className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Grid',
    component: ({ color }: { color: string }) => (
      <div className="w-[18px] h-[18px] grid grid-cols-2 gap-[2px]" style={{ color }}>
        {[0, 1, 2, 3].map(i => (
           <motion.div key={i} animate={{ scale: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: [0, 0.3, 0.9, 0.6][i] }} className="bg-current rounded-full w-full h-full" />
        ))}
      </div>
    )
  },
  {
    name: 'Breathe',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-4 h-4 rounded-full bg-current" style={{ color }} />
    )
  },
  {
    name: 'Flip',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotateX: [0, 180, 180], rotateY: [0, 0, 180] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-4 h-4 bg-current rounded-[4px]" style={{ color }} />
    )
  },
  {
    name: 'Echo',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <motion.div animate={{ scale: [0.2, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="absolute w-4 h-4 rounded-full border-[2px] border-current" />
        <motion.div animate={{ scale: [0.2, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }} className="absolute w-4 h-4 rounded-full border-[2px] border-current" />
      </div>
    )
  },
  {
    name: 'Dash Ring',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-6 h-6 rounded-full border-[2.5px] border-current border-dashed" style={{ color }} />
    )
  },
  {
    name: 'Stretch',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ width: ['6px', '24px', '6px'] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="h-1.5 bg-current rounded-full" style={{ color }} />
    )
  },
  {
    name: 'Wave',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[2px] overflow-hidden w-6 justify-center" style={{ color }}>
        {[0, 1, 2].map(i => (
           <motion.div key={i} animate={{ x: [6, -6], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full shrink-0" />
        ))}
      </div>
    )
  },
  {
    name: 'Morph',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ borderRadius: ['20%', '50%', '20%'], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-4 h-4 border-[2.5px] border-current" style={{ color }} />
    )
  },
  {
    name: 'Focus',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div animate={{ scale: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-6 h-6 rounded-full border-[2.5px] border-current opacity-40" />
         <motion.div animate={{ scale: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-2 h-2 bg-current rounded-full" />
      </div>
    )
  },
  {
    name: 'Stairs',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-end h-4" style={{ color }}>
         {[1, 2, 3].map((v, i) => (
            <motion.div key={i} animate={{ height: [`${v*30}%`, '100%', `${v*30}%`] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-1.5 bg-current rounded-full" />
         ))}
      </div>
    )
  },
  {
    name: 'Ring Glow',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <svg viewBox="0 0 24 24" className="absolute w-6 h-6 opacity-20"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
         <motion.svg viewBox="0 0 24 24" className="absolute w-6 h-6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 60" />
         </motion.svg>
      </div>
    )
  },
  {
    name: 'Worm',
    component: ({ color }: { color: string }) => (
      <motion.svg viewBox="0 0 24 24" className="w-6 h-6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ color }}>
        <motion.circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" animate={{ strokeDasharray: ["1 80", "40 80", "1 80"], strokeDashoffset: [0, -20, -80] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
      </motion.svg>
    )
  },
  {
    name: 'Typing',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-current" animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: "easeInOut" }} />
        ))}
      </div>
    )
  },
  {
    name: 'Bouncy',
    component: ({ color }: { color: string }) => (
      <div className="w-6 h-6 flex items-end justify-center pb-1" style={{ color }}>
        <motion.div className="w-2.5 h-2.5 bg-current rounded-full" animate={{ y: [0, -10, 0], scaleY: [0.8, 1.1, 0.8], scaleX: [1.2, 0.9, 1.2] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeOut" }} />
      </div>
    )
  },
  {
    name: 'Pendulum',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[2px] items-center justify-center h-6" style={{ color }}>
         <motion.div className="w-1.5 h-1.5 bg-current rounded-full" animate={{ x: [0, -6, 0, 0, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} />
         <div className="w-1.5 h-1.5 bg-current rounded-full" />
         <motion.div className="w-1.5 h-1.5 bg-current rounded-full" animate={{ x: [0, 0, 0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} />
      </div>
    )
  },
  {
    name: 'Concentric',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div className="absolute rounded-full border-[2.5px] border-current" animate={{ width: ['0px', '22px'], height: ['0px', '22px'], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} />
         <motion.div className="absolute rounded-full border-[2.5px] border-current" animate={{ width: ['0px', '22px'], height: ['0px', '22px'], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }} />
      </div>
    )
  },
  {
    name: 'Chase',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-5" style={{ color }}>
         {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute inset-0 flex justify-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: i * 0.2 }}>
               <div className="w-1.5 h-1.5 bg-current rounded-full" />
            </motion.div>
         ))}
      </div>
    )
  },
  {
    name: 'Smooth iOS',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
               <motion.div className="w-[2.5px] h-1.5 bg-current rounded-full mt-0.5" animate={{ opacity: [1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear", delay: i * 0.1 }} />
            </div>
         ))}
      </div>
    )
  },
  {
    name: 'Hex Pulse', // 🚀 Replaced "Cube Wave" to avoid looking like "Dots"
    component: ({ color }: { color: string }) => (
      <motion.svg viewBox="0 0 24 24" className="w-5 h-5" animate={{ scale: [1, 0.7, 1], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} style={{ color }}>
        <path d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    )
  },
  {
    name: 'Squish',
    component: ({ color }: { color: string }) => (
      <div className="w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div className="bg-current rounded-full" animate={{ width: ['6px', '18px', '6px'], height: ['6px', '4px', '6px'] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} />
      </div>
    )
  },
  {
    name: 'Helix',
    component: ({ color }: { color: string }) => (
      <div className="w-6 h-6 flex items-center justify-center relative" style={{ color }}>
         <motion.div className="absolute w-2 h-2 bg-current rounded-full" animate={{ x: [-6, 6, -6], scale: [1, 0.6, 1], zIndex: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
         <motion.div className="absolute w-2 h-2 bg-current rounded-full opacity-60" animate={{ x: [6, -6, 6], scale: [0.6, 1, 0.6], zIndex: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
      </div>
    )
  },
  {
    name: 'Flower',
    component: ({ color }: { color: string }) => (
      <motion.div className="relative w-4 h-4 grid grid-cols-2 gap-[2px]" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ color }}>
         {[0, 1, 2, 3].map(i => (
            <motion.div key={i} className="w-full h-full bg-current rounded-full" animate={{ scale: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} />
         ))}
      </motion.div>
    )
  },
  {
    name: 'Ripple',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div className="absolute w-full h-full rounded-full border-[2.5px] border-current" animate={{ scale: [0, 1], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeOut" }} />
      </div>
    )
  },
  {
    name: 'Dash',
    component: ({ color }: { color: string }) => (
       <div className="w-[20px] h-[3px] rounded-full overflow-hidden relative" style={{ color }}>
         <div className="absolute inset-0 opacity-20 bg-current" />
         <motion.div className="absolute h-full w-1/3 rounded-full bg-current" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
       </div>
    )
  },
  {
    name: 'Bounce Line',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
         {[0, 1, 2, 3].map(i => (
            <motion.div key={i} className="w-[3px] h-[3px] bg-current rounded-full" animate={{ height: ['3px', '12px', '3px'] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15, ease: "easeInOut" }} />
         ))}
      </div>
    )
  },
  {
    name: 'Fill Box',
    component: ({ color }: { color: string }) => (
       <div className="w-4 h-4 border-[2px] border-current rounded-[4px] relative overflow-hidden" style={{ color }}>
          <motion.div className="absolute bottom-0 left-0 right-0 bg-current" animate={{ height: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
       </div>
    )
  },
  {
    name: 'Equalizer',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[2px] items-center justify-center h-6" style={{ color }}>
         {[1, 2, 3, 2, 1].map((v, i) => (
            <motion.div key={i} className="w-1 bg-current rounded-full" animate={{ height: ['4px', `${v*4.5}px`, '4px'] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1, ease: "easeInOut" }} />
         ))}
      </div>
    )
  },
  {
    name: 'Dot Spin',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-5 h-5 flex justify-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ color }}>
         <div className="w-1.5 h-1.5 bg-current rounded-full" />
      </motion.div>
    )
  },
  {
    name: 'Twin Pulse',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-1.5 items-center justify-center h-6" style={{ color }}>
         <motion.div className="w-2 h-2 bg-current rounded-full" animate={{ scale: [0.5, 1.2, 0.5] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} />
         <motion.div className="w-2 h-2 bg-current rounded-full" animate={{ scale: [1.2, 0.5, 1.2] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} />
      </div>
    )
  },
  {
    name: 'Rotate Box',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-3.5 h-3.5 bg-current rounded-[4px]" style={{ color }} animate={{ rotate: [0, 180, 180, 360] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
    )
  },
  {
    name: 'Swing',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-6 h-6 flex justify-center origin-top" animate={{ rotate: [-40, 40, -40] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} style={{ color }}>
         <div className="w-1.5 h-1.5 mt-4 bg-current rounded-full" />
         <div className="absolute top-1 w-[2px] h-3 bg-current opacity-40 rounded-full" />
      </motion.div>
    )
  },
  {
    name: 'Pulse Bar',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-[18px] h-1.5 bg-current rounded-full" style={{ color }} />
    )
  },
  {
    name: 'Jump',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-5 flex justify-center" style={{ color }}>
         <motion.div className="w-1.5 h-1.5 bg-current rounded-full absolute" animate={{ y: [10, 0, 10] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeOut" }} />
         <div className="absolute bottom-0 w-4 h-[2px] bg-current rounded-full opacity-30" />
      </div>
    )
  },
  {
    name: 'Shrink',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-4 h-4 rounded-full border-current" style={{ color }} animate={{ borderWidth: ['2px', '8px', '2px'] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} />
    )
  },
  {
    name: 'Heartbeat',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[2px] items-center justify-center h-6" style={{ color }}>
         {[1, 2, 4, 2, 1].map((h, i) => (
            <motion.div key={i} className="w-[2px] bg-current rounded-full" animate={{ height: [`${h*2}px`, `${h*4}px`, `${h*2}px`] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1, ease: "easeInOut" }} />
         ))}
      </div>
    )
  },
  {
    name: 'Solar',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <div className="w-2 h-2 bg-current rounded-full" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute w-full h-full flex items-center">
           <div className="w-1.5 h-1.5 bg-current rounded-full" />
        </motion.div>
      </div>
    )
  },
  {
    name: 'Clockwork',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-5 rounded-full border-[2.5px] border-current flex items-center justify-center" style={{ color }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="absolute h-[8px] w-[2px] bg-current origin-bottom top-[1px] rounded-full" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }} className="absolute h-[6px] w-[2px] bg-current origin-bottom top-[3px] rounded-full" />
      </div>
    )
  },
  {
    name: 'Juggler',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 relative flex items-center justify-center" style={{ color }}>
        <div className="absolute top-0 w-1.5 h-1.5 bg-current rounded-full" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-current rounded-full" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-current rounded-full" />
      </motion.div>
    )
  },
  {
    name: 'Square Spin',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 0.7, 1, 0.7, 1], borderRadius: ['20%', '50%', '20%', '50%', '20%'] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-4 h-4 bg-current" style={{ color }} />
    )
  },
  {
    name: 'Cross Spin',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="relative w-5 h-5 flex items-center justify-center" style={{ color }}>
         <div className="w-1 h-5 bg-current rounded-full absolute" />
         <div className="w-5 h-1 bg-current rounded-full absolute" />
      </motion.div>
    )
  },
  {
    name: 'Cube Fold',
    component: ({ color }: { color: string }) => (
      <div className="w-4 h-4 grid grid-cols-2 gap-[2px]" style={{ color }}>
        {[0, 1, 3, 2].map((v, i) => (
           <motion.div key={i} animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: v * 0.3 }} className="bg-current rounded-[2px]" />
        ))}
      </div>
    )
  },
  {
    name: 'Double Bounce',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-5 flex items-center justify-center" style={{ color }}>
        <motion.div animate={{ y: [-8, 0, -8], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full top-0" />
        <motion.div animate={{ y: [8, 0, 8], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full bottom-0" />
      </div>
    )
  },
  {
    name: 'Flower Spin',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="relative w-5 h-5 flex items-center justify-center" style={{ color }}>
         <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full top-0 opacity-60" />
         <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full bottom-0 opacity-60" />
         <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full left-0 opacity-60" />
         <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute w-2 h-2 bg-current rounded-full right-0 opacity-60" />
      </motion.div>
    )
  },
  {
    name: 'Pinwheel',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 relative flex items-center justify-center" style={{ color }}>
         <div className="absolute w-2 h-2 bg-current rounded-tr-full rounded-bl-full top-0 left-0" />
         <div className="absolute w-2 h-2 bg-current rounded-tl-full rounded-br-full top-0 right-0" />
         <div className="absolute w-2 h-2 bg-current rounded-bl-full rounded-tr-full bottom-0 right-0" />
         <div className="absolute w-2 h-2 bg-current rounded-br-full rounded-tl-full bottom-0 left-0" />
      </motion.div>
    )
  },
  {
    name: 'Blink Grid',
    component: ({ color }: { color: string }) => (
      <div className="w-5 h-5 grid grid-cols-3 gap-[2px]" style={{ color }}>
        {[...Array(9)].map((_, i) => (
           <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: Math.random() * 1 }} className="bg-current rounded-full" />
        ))}
      </div>
    )
  },
  {
    name: 'Orbit Dots',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="relative w-5 h-5 flex items-center justify-center" style={{ color }}>
         <div className="w-1.5 h-1.5 bg-current rounded-full absolute top-0" />
         <div className="w-1.5 h-1.5 bg-current rounded-full absolute bottom-0" />
         <div className="w-1.5 h-1.5 bg-current rounded-full absolute left-0 opacity-50" />
         <div className="w-1.5 h-1.5 bg-current rounded-full absolute right-0 opacity-50" />
      </motion.div>
    )
  },
  {
    name: 'Tear Drop',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360, borderTopRightRadius: ['50%', '0%', '50%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-4 h-4 bg-current rounded-full" style={{ color }} />
    )
  },
  {
    name: 'Scale Ring',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ borderWidth: ['2px', '6px', '2px'] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-5 h-5 rounded-full border-current" style={{ color }} />
    )
  },
  {
    name: 'Corner Square',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-5 border-[1.5px] border-current border-opacity-30 rounded-[4px]" style={{ color }}>
         <motion.div animate={{ x: [0, 12, 12, 0, 0], y: [0, 0, 12, 12, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute w-1.5 h-1.5 bg-current rounded-full -top-[1.5px] -left-[1.5px]" />
      </div>
    )
  },
  {
    name: 'Tri-Spin', // 🚀 Fixed: Rounded Corners applied with SVG
    component: ({ color }: { color: string }) => (
      <motion.svg viewBox="0 0 24 24" className="w-5 h-5" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
        <path d="M12 2.5L21.5 19H2.5L12 2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    )
  },
  {
    name: 'Swing Dots',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6 w-6" style={{ color }}>
         <motion.div animate={{ y: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
         <motion.div animate={{ y: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
      </div>
    )
  },
  {
    name: 'Wave Dots',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6 w-6" style={{ color }}>
         {[0, 1, 2, 3].map(i => <motion.div key={i} animate={{ scale: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.15 }} className="w-1.5 h-1.5 bg-current rounded-full" />)}
      </div>
    )
  },
  {
    name: 'Bounce Scale',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ y: [0, -8, 0], scaleY: [0.8, 1.1, 0.8], scaleX: [1.2, 0.9, 1.2] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeOut" }} className="w-3 h-3 bg-current rounded-full" style={{ color }} />
    )
  },
  {
    name: 'Infinity Dot',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-4" style={{ color }}>
         <motion.div animate={{ x: [0, 12, 0, -12, 0], y: [0, -4, 0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute w-1.5 h-1.5 bg-current rounded-full top-1.5 left-2.5" />
      </div>
    )
  },
  {
    name: 'Bubble',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div animate={{ x: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="absolute w-3 h-3 bg-current rounded-full opacity-70" />
         <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="absolute w-3 h-3 bg-current rounded-full opacity-70" />
      </div>
    )
  },
  {
    name: 'Shift',
    component: ({ color }: { color: string }) => (
      <div className="relative w-5 h-4 flex flex-col justify-between" style={{ color }}>
         <motion.div animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-[3px] bg-current rounded-full self-start" />
         <motion.div animate={{ x: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-[3px] bg-current rounded-full self-end" />
      </div>
    )
  },
  // 🚀 New 7 Additions to make it exactly 72 (Perfectly fitting 4 columns)
  {
    name: 'Galaxy',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div className="absolute w-5 h-2 rounded-full border-[2px] border-current" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
         <motion.div className="absolute w-2 h-5 rounded-full border-[2px] border-current" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
      </motion.div>
    )
  },
  {
    name: 'Comet',
    component: ({ color }: { color: string }) => (
      <motion.svg viewBox="0 0 24 24" className="w-6 h-6" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ color }}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="30 40" />
        <circle cx="22" cy="12" r="2.5" fill="currentColor" />
      </motion.svg>
    )
  },
  {
    name: 'Jelly',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ scaleX: [1, 1.3, 0.8, 1], scaleY: [1, 0.8, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-4 h-4 bg-current rounded-full" style={{ color }} />
    )
  },
  {
    name: 'Radar Ping',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div animate={{ scale: [0, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} className="absolute w-full h-full rounded-full border-[2.5px] border-current" />
         <div className="w-2 h-2 rounded-full bg-current absolute" />
      </div>
    )
  },
  {
    name: 'Fan',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-5 h-5 flex flex-wrap gap-[1px]" style={{ color }}>
         <div className="w-[9px] h-[9px] bg-current rounded-tl-full rounded-br-full" />
         <div className="w-[9px] h-[9px] bg-current rounded-tr-full rounded-bl-full" />
         <div className="w-[9px] h-[9px] bg-current rounded-bl-full rounded-tr-full" />
         <div className="w-[9px] h-[9px] bg-current rounded-br-full rounded-tl-full" />
      </motion.div>
    )
  },
  {
    name: 'Spiral',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360, scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-5 h-5 border-[2.5px] border-current rounded-full border-t-transparent border-l-transparent" style={{ color }} />
    )
  },
  {
    name: 'DNA',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
         <motion.div animate={{ y: [-4, 4, -4], scale: [1, 0.6, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
         <motion.div animate={{ y: [4, -4, 4], scale: [0.6, 1, 0.6], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
         <motion.div animate={{ y: [-4, 4, -4], scale: [1, 0.6, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
      </div>
    )
  }
  ,
  {
    name: 'Clover',
    component: ({ color }: { color: string }) => (
      <motion.div
        className="relative w-6 h-6 flex items-center justify-center"
        style={{ color }}
        animate={{ rotate: [0, 12, -12, 0], scale: [0.9, 1.08, 0.9] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut"
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 bg-current rounded-full"
            style={{
              x: [0, 5, 0, -5][i],
              y: [-5, 0, 5, 0][i]
            }}
            animate={{ scale: [0.75, 1, 0.75] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.12,
              ease: "easeInOut"
            }}
          />
        ))}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-current" />
      </motion.div>
    )
  },
  {
    name: 'Candy Orbit',
    component: ({ color }: { color: string }) => (
      <div
        className="relative w-6 h-6 flex items-center justify-center"
        style={{ color }}
      >
        <motion.div
          className="absolute w-5 h-3 rounded-full border-2 border-current"
          animate={{ rotate: [0, 180, 360], scale: [1, 0.85, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-current"
          animate={{
            x: [0, 7, 0, -7, 0],
            y: [-5, 0, 5, 0, -5]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "linear"
          }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-current"
          animate={{ scale: [0.7, 1.2, 0.7] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "easeInOut"
          }}
        />
      </div>
    )
  },
  {
    name: 'Puffy Heart',
    component: ({ color }: { color: string }) => (
      <motion.svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        style={{ color }}
        animate={{
          scale: [1, 1.18, 0.95, 1],
          rotate: [0, -5, 5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut"
        }}
      >
        <path
          d="M12 21C10 18.8 3 14 3 8.8C3 3.5 9 2.5 12 7C15 2.5 21 3.5 21 8.8C21 14 14 18.8 12 21Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="8"
          cy="8"
          r="1.2"
          fill="white"
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
        />
      </motion.svg>
    )
  },
  {
    name: 'Moonbeam',
    component: ({ color }: { color: string }) => (
      <motion.svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        style={{ color }}
        animate={{ rotate: [0, -12, 12, 0], y: [0, -2, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <path
          d="M19.5 15.5A8.5 8.5 0 0 1 8.5 4.5A8.5 8.5 0 1 0 19.5 15.5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <motion.path
          d="M17 3.5L18 6L20.5 7L18 8L17 10.5L16 8L13.5 7L16 6Z"
          fill="currentColor"
          animate={{ scale: [0.7, 1.15, 0.7], rotate: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      </motion.svg>
    )
  },
  {
    name: 'Sparkle',
    component: ({ color }: { color: string }) => (
      <motion.div
        className="relative w-6 h-6 flex items-center justify-center"
        style={{ color }}
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut"
        }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          animate={{ rotate: [0, 90, 180], scale: [0.8, 1.1, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <path
            d="M12 1.5L14.8 9.2L22.5 12L14.8 14.8L12 22.5L9.2 14.8L1.5 12L9.2 9.2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeLinejoin="round"
          />
        </motion.svg>
        <motion.div
          className="absolute right-0 top-0 w-1.5 h-1.5 rounded-full bg-current"
          animate={{ scale: [0.4, 1.3, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
        />
      </motion.div>
    )
  },
  {
    name: 'Kitty Bounce',
    component: ({ color }: { color: string }) => (
      <motion.svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        style={{ color }}
        animate={{
          y: [0, -3, 0],
          scaleY: [1, 0.9, 1],
          scaleX: [1, 1.06, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut"
        }}
      >
        <path
          d="M4 10L3 3L9 7.2Q12 5.8 15 7.2L21 3L20 10Q22 13 20 17Q17.5 21 12 21Q6.5 21 4 17Q2 13 4 10Z"
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <ellipse cx="8.5" cy="12.5" rx="1" ry="1.5" fill="white" />
        <ellipse cx="15.5" cy="12.5" rx="1" ry="1.5" fill="white" />
        <path
          d="M11 15L12 16L13 15"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    )
  },
  {
    name: 'Flower Bloom',
    component: ({ color }: { color: string }) => (
      <motion.div
        className="relative w-6 h-6 flex items-center justify-center"
        style={{ color }}
        animate={{ rotate: [0, 45, 90, 135, 180] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear"
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-3.5 rounded-full bg-current"
            style={{ top: 0, left: "calc(50% - 5px)", transformOrigin: "50% 12px" }}
            animate={{
              scaleY: [0.65, 1, 0.65],
              opacity: [0.65, 1, 0.65]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.12,
              ease: "easeInOut"
            }}
          />
        ))}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-current border-2 border-white/70" />
      </motion.div>
    )
  },
  {
    name: 'Cloud Drift',
    component: ({ color }: { color: string }) => (
      <motion.svg
        viewBox="0 0 28 24"
        className="w-7 h-6"
        style={{ color }}
        animate={{ x: [-1, 1, -1], y: [0, -2, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "easeInOut"
        }}
      >
        <motion.path
          d="M7 19H21A5 5 0 0 0 21 9A7 7 0 0 0 7.2 8A5.5 5.5 0 0 0 7 19Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="10"
          cy="13"
          r="1"
          fill="white"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <motion.circle
          cx="18"
          cy="13"
          r="1"
          fill="white"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      </motion.svg>
    )
  }
];
