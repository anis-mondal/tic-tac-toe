import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Loader } from 'lucide-react';

// 🚀 65 Premium Authentic, Geometric & Cute Loading Animations
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
    name: 'Dual Ring', // 🚀 Fixed: Rounded Corners
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
    name: 'Ping Pong', // 🚀 Fixed: 100% Perfectly Centered
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
    name: 'Cube Wave',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-center justify-center h-6" style={{ color }}>
         {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 bg-current rounded-[3px]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: i * 0.1 }} />
         ))}
      </div>
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
    name: 'Tri-Spin',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-current origin-[50%_65%]" style={{ color }} />
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
  }
];
