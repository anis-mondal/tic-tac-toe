import React from 'react';
import { motion } from 'motion/react';
import { 
  Hourglass, Hexagon, Atom, Sparkles, Radar, Loader2, 
  Sun, Target, Compass, Asterisk, Triangle, Square, Ghost, 
  Snowflake, Zap, Command, Aperture
} from 'lucide-react';

// 🚀 20 Premium Loaders Collection
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
    name: 'Dots',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-1 items-center justify-center h-6" style={{ color }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-currentColor" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15, ease: "easeInOut" }} style={{ backgroundColor: 'currentColor' }} />
        ))}
      </div>
    )
  },
  {
    name: 'Bars',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-1 items-center justify-center h-6" style={{ color }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-3 bg-currentColor rounded-sm" animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }} style={{ backgroundColor: 'currentColor' }} />
        ))}
      </div>
    )
  },
  {
    name: 'Pulse',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <motion.div className="absolute w-full h-full rounded-full border-2 border-currentColor opacity-0" animate={{ scale: [0.5, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} style={{ borderColor: 'currentColor' }} />
        <div className="w-2 h-2 rounded-full bg-currentColor" style={{ backgroundColor: 'currentColor' }} />
      </div>
    )
  },
  {
    name: 'Orbit',
    component: ({ color }: { color: string }) => (
      <motion.div className="w-6 h-6 border-2 border-dashed rounded-full flex items-center justify-center" style={{ color, borderColor: 'currentColor' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
         <div className="w-1.5 h-1.5 rounded-full bg-currentColor absolute top-0" style={{ backgroundColor: 'currentColor' }} />
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
    name: 'Hourglass',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: [0, 180, 180, 360] }} transition={{ repeat: Infinity, duration: 2, times: [0, 0.4, 0.5, 0.9] }} style={{ color }}>
          <Hourglass className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Hexagon',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ scale: [1, 0.8, 1], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
          <Hexagon className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Atom',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ color }}>
          <Atom className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Sparkles',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} style={{ color }}>
          <Sparkles className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Radar',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
          <Radar className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Sun',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ color }}>
          <Sun className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Target',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ scale: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} style={{ color }}>
          <Target className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Compass',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
          <Compass className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Asterisk',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ color }}>
          <Asterisk className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Triangle',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotateY: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
          <Triangle className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Diamond',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: [45, 135, 225] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ color }}>
          <Square className="w-5 h-5" strokeWidth={3} />
       </motion.div>
    )
  },
  {
    name: 'Zap',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} style={{ color }}>
          <Zap className="w-6 h-6" strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />
       </motion.div>
    )
  },
  {
    name: 'Aperture',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ color }}>
          <Aperture className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  },
  {
    name: 'Ghost',
    component: ({ color }: { color: string }) => (
       <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} style={{ color }}>
          <Ghost className="w-6 h-6" strokeWidth={2.5} />
       </motion.div>
    )
  }
];
