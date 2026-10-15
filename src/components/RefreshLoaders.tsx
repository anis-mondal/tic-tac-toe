import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Loader } from 'lucide-react';

// 🚀 20 Premium Authentic Loading Animations
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
      <div className="flex gap-1 items-center justify-center h-6" style={{ color }}>
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
      <motion.div className="w-6 h-6 border-2 border-dashed rounded-full flex items-center justify-center border-current" style={{ color }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
         <div className="w-1.5 h-1.5 rounded-full bg-current absolute -top-1" />
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
    name: 'Dual Ring',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="absolute inset-0 rounded-full border-[2.5px] border-current border-t-transparent" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="absolute w-3 h-3 rounded-full border-[2.5px] border-current border-b-transparent" />
      </div>
    )
  },
  {
    name: 'Grid',
    component: ({ color }: { color: string }) => (
      <div className="w-[18px] h-[18px] grid grid-cols-2 gap-1" style={{ color }}>
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
    name: 'Ping Pong',
    component: ({ color }: { color: string }) => (
      <div className="w-[26px] h-2.5 rounded-full border-[1.5px] border-current relative p-[1.5px]" style={{ color }}>
        <motion.div animate={{ x: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-current rounded-full" />
      </div>
    )
  },
  {
    name: 'Dash Ring',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-6 h-6 rounded-full border-2 border-current border-dashed" style={{ color }} />
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
      <div className="flex gap-1 overflow-hidden w-6 justify-center" style={{ color }}>
        {[0, 1, 2].map(i => (
           <motion.div key={i} animate={{ x: [6, -6], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full shrink-0" />
        ))}
      </div>
    )
  },
  {
    name: 'Morph',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ borderRadius: ['20%', '50%', '20%'], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-5 h-5 border-[2.5px] border-current" style={{ color }} />
    )
  },
  {
    name: 'Focus',
    component: ({ color }: { color: string }) => (
      <div className="relative w-6 h-6 flex items-center justify-center" style={{ color }}>
         <motion.div animate={{ scale: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-6 h-6 rounded-full border-[2px] border-current opacity-40" />
         <motion.div animate={{ scale: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-2 h-2 bg-current rounded-full" />
      </div>
    )
  },
  {
    name: 'Stairs',
    component: ({ color }: { color: string }) => (
      <div className="flex gap-[3px] items-end h-5" style={{ color }}>
         {[1, 2, 3].map((v, i) => (
            <motion.div key={i} animate={{ height: [`${v*30}%`, '100%', `${v*30}%`] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-1.5 bg-current rounded-full" />
         ))}
      </div>
    )
  },
  {
    name: 'Pulse Bar',
    component: ({ color }: { color: string }) => (
      <motion.div animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-[22px] h-1.5 bg-current rounded-full" style={{ color }} />
    )
  }
];
