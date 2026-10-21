import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Play, RotateCcw, Zap, ShieldAlert } from 'lucide-react';

interface BrickBreakerProps {
  semantics: any;
  isDarkMode: boolean;
  activeLineColor: string;
  hapticFeedback: (pattern: number | number[]) => void;
  playPreviewSound: (key: string, val: number) => void;
  soundPrefs: any;
}

export default function BrickBreaker({
  semantics, isDarkMode, activeLineColor, hapticFeedback, playPreviewSound, soundPrefs
}: BrickBreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'levelup'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [level, setLevel] = useState(1);
  const [lifeCost, setLifeCost] = useState(100); // 🚀 প্রথম লাইফ কেনার খরচ ১০০ XP
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('brick_highscore') || '0'));

  // Physics & Game Refs (60FPS Loop)
  const gameRef = useRef({
    ball: { x: 150, y: 300, dx: 3, dy: -3, radius: 6, speed: 4.5, baseSpeed: 4.5 },
    paddle: { x: 100, y: 400, w: 80, h: 12 }, // Base width 80
    bricks: [] as any[],
    particles: [] as any[],
    isPaused: false,
    canvasW: 300,
    canvasH: 450
  });

  const bgColor = isDarkMode ? semantics.mainGridBackground : semantics.gridDark;
  const paddleColor = activeLineColor;
  const ballColor = isDarkMode ? '#ffffff' : activeLineColor;
  const unbreakableColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)';

  // 🚀 Pro Algorithm: Dynamic Difficulty Scaling
  const initLevel = (currentLevel: number) => {
    const r = gameRef.current;
    const cols = 7;
    // সারি বাড়বে লেভেলের সাথে
    const rows = Math.min(4 + Math.floor(currentLevel / 1.5), 10); 
    const padding = 8;
    const offsetTop = 45;
    const offsetLeft = 16;
    const brickW = (r.canvasW - (offsetLeft * 2) - (padding * (cols - 1))) / cols;
    const brickH = 16;

    // প্যাডেল ছোট হবে লেভেলের সাথে (সর্বনিম্ন 45)
    r.paddle.w = Math.max(45, 80 - (currentLevel * 2)); 
    // বলের প্রাথমিক স্পিড বাড়বে
    r.ball.baseSpeed = Math.min(4.5 + (currentLevel * 0.3), 8.5);
    r.ball.speed = r.ball.baseSpeed;

    // শক্ত এবং না-ভাঙা ইটের সম্ভাবনা (Probability Curve)
    const hardProb = Math.min(0.15 + (currentLevel * 0.08), 0.7);
    const unbreakProb = currentLevel >= 3 ? Math.min(0.05 + (currentLevel * 0.04), 0.25) : 0;

    let newBricks = [];
    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        let type = 1; let hits = 1;
        const rand = Math.random();

        if (rand < unbreakProb) {
          type = 3; hits = -1; // Unbreakable
        } else if (rand < unbreakProb + hardProb && currentLevel >= 2) {
          type = 2; hits = 2; // Hard (2 hits)
        }

        newBricks.push({
          x: c * (brickW + padding) + offsetLeft,
          y: rIdx * (brickH + padding) + offsetTop,
          w: brickW, h: brickH, type, hits, maxHits: hits
        });
      }
    }
    r.bricks = newBricks;
    resetBall();
  };

  const resetBall = () => {
    const r = gameRef.current;
    r.ball.x = r.paddle.x + r.paddle.w / 2;
    r.ball.y = r.paddle.y - r.ball.radius - 2;
    const angle = (Math.random() * (Math.PI / 4)) - (Math.PI / 8); 
    r.ball.dx = r.ball.speed * Math.sin(angle);
    r.ball.dy = -r.ball.speed * Math.cos(angle);
  };

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      gameRef.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1, color, size: Math.random() * 3 + 1.5
      });
    }
  };

  // 🚀 60FPS Render Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let animationFrameId: number;

    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number, color: string, glow: boolean = false) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      
      if (glow) {
         ctx.shadowBlur = 10;
         ctx.shadowColor = color;
      } else {
         ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0; // reset
    };

    const updateAndDraw = () => {
      if (gameState !== 'playing' || gameRef.current.isPaused) return;
      const r = gameRef.current;
      ctx.clearRect(0, 0, r.canvasW, r.canvasH);

      // --- PHYSICS ---
      r.ball.x += r.ball.dx;
      r.ball.y += r.ball.dy;

      // Gradual Speed Increase during play
      if (r.ball.speed < r.ball.baseSpeed + 2.5) {
          r.ball.speed += 0.0005; 
          const currentSpeed = Math.sqrt(r.ball.dx*r.ball.dx + r.ball.dy*r.ball.dy);
          r.ball.dx = (r.ball.dx / currentSpeed) * r.ball.speed;
          r.ball.dy = (r.ball.dy / currentSpeed) * r.ball.speed;
      }

      // Walls
      if (r.ball.x + r.ball.radius > r.canvasW || r.ball.x - r.ball.radius < 0) r.ball.dx *= -1;
      if (r.ball.y - r.ball.radius < 0) r.ball.dy *= -1;

      // Bottom (Lose Life)
      if (r.ball.y + r.ball.radius > r.canvasH) {
        hapticFeedback([100, 50]);
        playPreviewSound('point', soundPrefs.point);
        
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
             setGameState('gameover');
             playPreviewSound('overallWin', soundPrefs.overallWin);
          } else {
             r.ball.speed = r.ball.baseSpeed; 
             resetBall();
          }
          return newLives;
        });
      }

      // Paddle Collision
      if (r.ball.y + r.ball.radius > r.paddle.y && r.ball.y - r.ball.radius < r.paddle.y + r.paddle.h &&
          r.ball.x > r.paddle.x && r.ball.x < r.paddle.x + r.paddle.w) {
         playPreviewSound('tap', soundPrefs.xTap);
         hapticFeedback(20);
         
         let hitPoint = r.ball.x - (r.paddle.x + r.paddle.w / 2);
         hitPoint = hitPoint / (r.paddle.w / 2);
         const angle = hitPoint * (Math.PI / 2.5); // Dynamic angle based on hit position
         
         r.ball.dx = r.ball.speed * Math.sin(angle);
         r.ball.dy = -Math.abs(r.ball.speed * Math.cos(angle)); // Always bounce up
      }

      // Brick Collision
      let breakableCount = 0;
      for (let i = 0; i < r.bricks.length; i++) {
        let b = r.bricks[i];
        if (b.hits !== 0) {
          if (b.type !== 3) breakableCount++; 
          
          if (r.ball.x + r.ball.radius > b.x && r.ball.x - r.ball.radius < b.x + b.w && 
              r.ball.y + r.ball.radius > b.y && r.ball.y - r.ball.radius < b.y + b.h) {
            
            // Simple physics bounce
            r.ball.dy *= -1; 
            
            if (b.type !== 3) {
              b.hits--;
              hapticFeedback(30);
              playPreviewSound('tap', soundPrefs.oTap);
              
              const bColor = b.hits === 1 ? `${activeLineColor}80` : activeLineColor;
              createParticles(r.ball.x, r.ball.y, bColor);
              
              // 🚀 ১ ইট সম্পূর্ণ ভাঙলে ১ পয়েন্ট (XP)
              if (b.hits === 0) setScore(s => s + 1);
            } else {
              hapticFeedback(20);
              playPreviewSound('point', soundPrefs.point); 
            }
          }
        }
      }

      // Level Clear
      if (breakableCount === 0 && r.bricks.length > 0) {
         setGameState('levelup');
         playPreviewSound('win', soundPrefs.win);
         hapticFeedback([50, 100, 50]);
         setLevel(l => l + 1);
      }

      // --- DRAWING ---
      r.bricks.forEach(b => {
        if (b.hits === 0) return;
        let color = activeLineColor;
        if (b.type === 3) color = unbreakableColor;
        else if (b.hits === 1 && b.maxHits === 2) color = `${activeLineColor}60`;
        drawRoundRect(b.x, b.y, b.w, b.h, 4, color);
      });

      for (let i = r.particles.length - 1; i >= 0; i--) {
        let p = r.particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.04;
        if (p.life <= 0) { r.particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        drawRoundRect(p.x, p.y, p.size, p.size, 2, p.color);
        ctx.globalAlpha = 1;
      }

      // Draw Paddle & Ball with Glow
      drawRoundRect(r.paddle.x, r.paddle.y, r.paddle.w, r.paddle.h, 6, paddleColor, true);
      
      ctx.beginPath();
      ctx.arc(r.ball.x, r.ball.y, r.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = ballColor;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    if (gameState === 'playing') animationFrameId = requestAnimationFrame(updateAndDraw);
    else ctx.clearRect(0, 0, gameRef.current.canvasW, gameRef.current.canvasH);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, activeLineColor, bgColor, ballColor, paddleColor]);

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      gameRef.current.canvasW = rect.width;
      gameRef.current.canvasH = rect.height;
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      gameRef.current.paddle.y = rect.height - 40;
    }
  }, [gameState]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== 'playing') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = e.clientX - rect.left;
    const r = gameRef.current;
    x = Math.max(r.paddle.w / 2, Math.min(x, r.canvasW - r.paddle.w / 2));
    r.paddle.x = x - r.paddle.w / 2;
  };

  const startGame = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    setScore(0); setLives(4); setLevel(1); setLifeCost(100);
    initLevel(1); setGameState('playing');
  };

  const nextLevel = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    initLevel(level); setGameState('playing');
  };

  // 🚀 রিভাইভ লজিক (XP দিয়ে লাইফ কেনা)
  const buyLife = () => {
    if (score >= lifeCost) {
      hapticFeedback([50, 100, 50]);
      playPreviewSound('win', soundPrefs.win);
      setScore(s => s - lifeCost);
      setLifeCost(c => c + 50); // পরেরবার ৫০ XP বেশি লাগবে
      setLives(1);
      resetBall();
      setGameState('playing');
    } else {
      hapticFeedback([100, 50, 100]); // এরর হ্যাপটিক
    }
  };

  useEffect(() => {
     if (score > highScore) { setHighScore(score); localStorage.setItem('brick_highscore', score.toString()); }
  }, [score]);

  return (
    <div className="w-full h-[65vh] flex flex-col gap-4 max-w-md mx-auto relative select-none">
       {/* 🚀 Top Status Bar */}
       <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-[24px] shadow-sm" style={{ border: `2.5px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : activeLineColor}` }}>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase opacity-60">XP Score</span>
             <span className="text-xl font-black" style={{ color: semantics.text }}>{score}</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase opacity-60">High Score</span>
             <span className="text-lg font-black opacity-80" style={{ color: activeLineColor }}>{highScore}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black uppercase opacity-60">Lives</span>
             <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span className="text-xl font-black" style={{ color: semantics.text }}>{lives}</span>
             </div>
          </div>
       </div>

       {/* 🚀 Game Area */}
       <div 
          ref={containerRef}
          className="flex-1 relative rounded-[28px] overflow-hidden shadow-inner touch-none"
          style={{ backgroundColor: bgColor }}
          onPointerMove={handlePointerMove}
       >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          <AnimatePresence>
             {gameState !== 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md p-6 text-center">
                   
                   {gameState === 'start' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: activeLineColor }}>
                           <Zap className="w-8 h-8 text-white fill-current" />
                        </div>
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-md">Brick Breaker</h2>
                        <span className="text-sm font-bold text-white/80 bg-black/20 px-4 py-1 rounded-full">Level Up Auto-Scales Difficulty</span>
                        <button onClick={startGame} className="mt-4 flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-black shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: activeLineColor }}>
                           <Play className="w-5 h-5 fill-current" /> START GAME
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'gameover' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                        <ShieldAlert className="w-12 h-12 text-red-400 mb-1 drop-shadow-md" />
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-md">GAME OVER</h2>
                        
                        {/* 🚀 রিভাইভ (Buy Life) সেকশন */}
                        <div className="w-full bg-black/30 rounded-2xl p-4 mt-2 border border-white/10">
                           <h3 className="text-white/90 font-bold mb-3">Want to continue?</h3>
                           <button 
                             onClick={buyLife} 
                             disabled={score < lifeCost}
                             className={`w-full py-3 rounded-xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 ${score >= lifeCost ? 'text-black active:scale-95' : 'bg-gray-600 text-white/50 cursor-not-allowed'}`}
                             style={{ backgroundColor: score >= lifeCost ? activeLineColor : undefined }}
                           >
                             <Heart className={`w-4 h-4 ${score >= lifeCost ? 'text-red-600 fill-current' : ''}`} /> 
                             BUY 1 LIFE (-{lifeCost} XP)
                           </button>
                           {score < lifeCost && <p className="text-[10px] text-red-300 mt-2 font-bold uppercase">Not enough XP! You need {lifeCost}</p>}
                        </div>

                        <button onClick={startGame} className="mt-2 text-white/70 font-bold text-sm underline active:scale-95">
                           Restart from Level 1
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'levelup' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                        <Star className="w-14 h-14 text-yellow-400 fill-current drop-shadow-lg mb-2" />
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-md">LEVEL {level} CLEARED!</h2>
                        <span className="text-sm font-bold text-white/80 bg-black/20 px-3 py-1 rounded-full">Speed & Difficulty Increased</span>
                        <button onClick={nextLevel} className="mt-4 flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-black shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: activeLineColor }}>
                           <Play className="w-5 h-5 fill-current" /> START LEVEL {level + 1}
                        </button>
                     </motion.div>
                   )}

                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
}
