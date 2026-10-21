import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Play, RotateCcw, ShieldAlert, Zap } from 'lucide-react';

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
  const [lives, setLives] = useState(3); // Default lives
  const [level, setLevel] = useState(1);
  const [lifeCost, setLifeCost] = useState(100);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('brick_highscore') || '0'));

  // Colors
  const bgColor = isDarkMode ? semantics.mainGridBackground : semantics.gridDark;
  const paddleColor = activeLineColor;
  const ballColor = isDarkMode ? '#ffffff' : activeLineColor;
  
  // Solid bricks color (Material outlineVariant feel)
  const unbreakableColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)';

  // Physics Engine Refs
  const gameRef = useRef({
    ball: { x: 150, y: 300, vx: 0, vy: 0, radius: 8, baseSpeed: 250, currentSpeedMult: 1 },
    paddle: { x: 100, y: 400, w: 90, h: 14 },
    bricks: [] as any[],
    particles: [] as any[],
    canvasW: 300,
    canvasH: 450,
    physicsAccumulator: 0,
    lastFrameTime: 0
  });

  const FIXED_STEP = 1 / 120; // High-precision physics step
  const MAX_STEPS = 8;

  // 🚀 Initialize Level
  const initLevel = (currentLevel: number) => {
    const r = gameRef.current;
    r.bricks = [];
    r.particles = [];
    
    // Difficulty Scaling
    r.ball.currentSpeedMult = 1 + ((currentLevel - 1) * 0.15); // Speed increases 15% per level
    const widthFactor = Math.max(0.12, 0.30 - (currentLevel * 0.025)); 
    r.paddle.w = r.canvasW * widthFactor;

    const cols = 7;
    const rows = Math.min(4 + currentLevel, 9);
    const padding = 8;
    const offsetTop = 40;
    const brickW = Math.max((r.canvasW - (padding * (cols + 1))) / cols, 15);
    const brickH = 20;

    const hardProb = Math.min(0.10 * currentLevel, 0.4);
    const solidProb = currentLevel > 2 ? Math.min(0.05 * currentLevel, 0.2) : 0;

    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const rand = Math.random();
        // Skip some bricks for a scattered look
        if (rand < Math.min(0.05 * currentLevel, 0.2)) continue;

        let type = 1; let hits = 1;
        if (rIdx > 1 && rand < solidProb) {
           type = 3; hits = -1; // Unbreakable
        } else if (rand < solidProb + hardProb) {
           type = 2; hits = 2; // Hard
        }

        r.bricks.push({
          rect: {
             left: padding + c * (brickW + padding),
             top: offsetTop + rIdx * (brickH + padding),
             right: padding + c * (brickW + padding) + brickW,
             bottom: offsetTop + rIdx * (brickH + padding) + brickH,
             w: brickW, h: brickH
          },
          type, hits, maxHits: hits
        });
      }
    }
    resetBall();
  };

  const resetBall = () => {
    const r = gameRef.current;
    r.ball.x = r.paddle.x + r.paddle.w / 2;
    r.ball.y = r.paddle.y - r.ball.radius - 2;
    const speed = r.ball.baseSpeed * r.ball.currentSpeedMult;
    const angle = (Math.random() * (Math.PI / 4)) - (Math.PI / 8); 
    r.ball.vx = speed * Math.sin(angle);
    r.ball.vy = -speed * Math.cos(angle);
  };

  const createParticles = (x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 150 + 50;
      gameRef.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, color, size: Math.random() * 4 + 2
      });
    }
  };

  // Math Helpers
  const circleIntersectsRect = (cx: number, cy: number, radius: number, rect: any) => {
    const closestX = Math.max(rect.left, Math.min(cx, rect.right));
    const closestY = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) <= (radius * radius);
  };

  // 🚀 Fixed-Step Physics Engine (Similar to Compose Code)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let animationFrameId: number;

    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number, color: string) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    };

    const updateAndDraw = (time: number) => {
      const r = gameRef.current;
      if (r.lastFrameTime === 0) r.lastFrameTime = time;
      const dt = Math.min((time - r.lastFrameTime) / 1000, 0.05); // Cap dt
      r.lastFrameTime = time;

      if (gameState === 'playing' && !r.isPaused) {
        // --- Particles Physics ---
        for (let i = r.particles.length - 1; i >= 0; i--) {
          let p = r.particles[i];
          p.life -= dt * 1.5;
          if (p.life <= 0) { r.particles.splice(i, 1); continue; }
          const grav = 800;
          p.vy += grav * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }

        // --- Ball Fixed Step Physics ---
        r.physicsAccumulator += dt;
        let steps = 0;

        while (r.physicsAccumulator >= FIXED_STEP && steps < MAX_STEPS) {
          r.physicsAccumulator -= FIXED_STEP;
          steps++;

          let nextX = r.ball.x + (r.ball.vx * FIXED_STEP);
          let nextY = r.ball.y + (r.ball.vy * FIXED_STEP);
          let ballLost = false;

          // Wall Collision
          if (nextX - r.ball.radius <= 0) { nextX = r.ball.radius; r.ball.vx = Math.abs(r.ball.vx); }
          if (nextX + r.ball.radius >= r.canvasW) { nextX = r.canvasW - r.ball.radius; r.ball.vx = -Math.abs(r.ball.vx); }
          if (nextY - r.ball.radius <= 0) { nextY = r.ball.radius; r.ball.vy = Math.abs(r.ball.vy); }

          // Paddle Collision
          const paddleRect = { left: r.paddle.x, top: r.paddle.y, right: r.paddle.x + r.paddle.w, bottom: r.paddle.y + r.paddle.h };
          if (r.ball.vy > 0 && circleIntersectsRect(nextX, nextY, r.ball.radius, paddleRect)) {
              let hitPoint = (nextX - (paddleRect.left + r.paddle.w / 2)) / (r.paddle.w / 2);
              hitPoint = Math.max(-1, Math.min(hitPoint, 1));
              
              const currentSpeed = Math.max(Math.sqrt(r.ball.vx*r.ball.vx + r.ball.vy*r.ball.vy), r.ball.baseSpeed * 0.85);
              const newSpeed = Math.min(currentSpeed * 1.015, r.ball.baseSpeed * 3); // Slightly increase speed on paddle hit
              
              r.ball.vx = newSpeed * hitPoint * 0.82;
              r.ball.vy = -Math.sqrt(Math.max(0, (newSpeed * newSpeed) - (r.ball.vx * r.ball.vx)));
              nextY = paddleRect.top - r.ball.radius - 1;
              
              hapticFeedback(20);
              playPreviewSound('tap', soundPrefs.xTap);
          }

          // Brick Collision
          let breakableCount = 0;
          let hitBrick = false;

          for (let i = 0; i < r.bricks.length; i++) {
            let b = r.bricks[i];
            if (b.hits === 0) continue;
            if (b.type !== 3) breakableCount++;

            if (!hitBrick && circleIntersectsRect(nextX, nextY, r.ball.radius, b.rect)) {
               hitBrick = true;
               r.ball.vy *= -1; // Simple bounce
               
               if (b.type !== 3) {
                 b.hits--;
                 hapticFeedback(30);
                 playPreviewSound('tap', soundPrefs.oTap);
                 
                 const bColor = b.hits === 1 ? `${activeLineColor}80` : activeLineColor;
                 createParticles(nextX, nextY, bColor);
                 
                 if (b.hits === 0) {
                    setScore(s => s + (b.type === 2 ? 100 : 50)); // XP logic
                 }
               } else {
                 hapticFeedback(20);
                 playPreviewSound('point', soundPrefs.point); 
                 createParticles(nextX, nextY, unbreakableColor, 4);
               }
            }
          }

          // Level Clear
          if (breakableCount === 0 && r.bricks.length > 0) {
             setGameState('levelup');
             playPreviewSound('win', soundPrefs.win);
             hapticFeedback([50, 100, 50]);
             setLevel(l => l + 1);
             break;
          }

          // Bottom Drop
          if (nextY - r.ball.radius > r.canvasH) {
             ballLost = true;
             hapticFeedback([100, 50]);
             playPreviewSound('point', soundPrefs.point);
             
             setLives(prev => {
               const newLives = prev - 1;
               if (newLives <= 0) {
                  setGameState('gameover');
                  playPreviewSound('overallWin', soundPrefs.overallWin);
               } else {
                  resetBall();
               }
               return newLives;
             });
          } else {
             r.ball.x = nextX;
             r.ball.y = nextY;
          }

          if (ballLost) break;
        }
      }

      // --- DRAWING ---
      ctx.clearRect(0, 0, gameRef.current.canvasW, gameRef.current.canvasH);
      const r = gameRef.current;

      // Bricks
      r.bricks.forEach(b => {
        if (b.hits === 0) return;
        let color = activeLineColor;
        if (b.type === 3) color = unbreakableColor;
        else if (b.hits === 1 && b.maxHits === 2) color = `${activeLineColor}70`;
        
        drawRoundRect(b.rect.left, b.rect.top, b.rect.w, b.rect.h, 6, color);
      });

      // Particles
      for (let i = 0; i < r.particles.length; i++) {
        let p = r.particles[i];
        ctx.globalAlpha = p.life;
        drawRoundRect(p.x, p.y, p.size, p.size, 2, p.color);
        ctx.globalAlpha = 1;
      }

      // Paddle & Ball
      drawRoundRect(r.paddle.x, r.paddle.y, r.paddle.w, r.paddle.h, r.paddle.h / 2, paddleColor);
      
      ctx.beginPath();
      ctx.arc(r.ball.x, r.ball.y, r.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, activeLineColor, bgColor, ballColor, paddleColor]);

  // Handle Resize
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

  // Drag Control
  const handlePointerMove = (e: React.PointerEvent) => {
    if (gameState !== 'playing') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = e.clientX - rect.left;
    const r = gameRef.current;
    x = Math.max(r.paddle.w / 2, Math.min(x, r.canvasW - r.paddle.w / 2));
    r.paddle.x = x - r.paddle.w / 2;
  };

  // Menu Actions
  const startGame = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    setScore(0); setLives(3); setLevel(1); setLifeCost(100);
    initLevel(1); setGameState('playing');
  };

  const nextLevel = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    initLevel(level); setGameState('playing');
  };

  const buyLife = () => {
    if (score >= lifeCost) {
      hapticFeedback([50, 100, 50]); playPreviewSound('win', soundPrefs.win);
      setScore(s => s - lifeCost);
      setLifeCost(c => c + 50); 
      setLives(1);
      resetBall(); setGameState('playing');
    } else {
      hapticFeedback([100, 50, 100]); 
    }
  };

  useEffect(() => {
     if (score > highScore) { setHighScore(score); localStorage.setItem('brick_highscore', score.toString()); }
  }, [score]);

  return (
    <div className="w-full h-full flex flex-col max-w-md mx-auto relative select-none">
       {/* 🚀 Header & Stats (Compose Style) */}
       <div className="flex flex-col gap-3 px-1 mb-4">
          <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-3xl border-[2.5px] shadow-sm" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : activeLineColor }}>
            
            <div className="flex flex-col items-center">
               <span className="text-[11px] font-black uppercase opacity-60">XP Score</span>
               <span className="text-2xl font-black mt-1" style={{ color: semantics.text }}>{score}</span>
            </div>
            
            <div className="px-5 py-2.5 rounded-full font-black text-lg shadow-sm flex items-center justify-center min-w-[90px]" style={{ backgroundColor: activeLineColor, color: isDarkMode ? '#000' : '#fff' }}>
               LVL {level}
            </div>
            
            <div className="flex flex-col items-center">
               <span className="text-[11px] font-black uppercase opacity-60">Lives</span>
               <div className="flex items-center gap-1.5 mt-1">
                  <Heart className="w-5 h-5 text-red-500 fill-current drop-shadow-sm" />
                  <span className="text-2xl font-black" style={{ color: semantics.text }}>{lives}</span>
               </div>
            </div>
          </div>
       </div>

       {/* 🚀 Game Canvas Area */}
       <div 
          ref={containerRef}
          className="flex-1 relative rounded-[32px] overflow-hidden shadow-inner touch-none"
          style={{ backgroundColor: bgColor }}
          onPointerMove={handlePointerMove}
       >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          {/* Overlays */}
          <AnimatePresence>
             {gameState !== 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                   
                   {gameState === 'start' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                        <Star className="w-14 h-14 text-white fill-current drop-shadow-md mb-2" />
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-lg">Brick Breaker</h2>
                        
                        <div className="bg-black/30 px-5 py-2 rounded-full border border-white/20 mt-1">
                          <span className="text-sm font-bold text-white/90">HIGH SCORE: {highScore}</span>
                        </div>

                        <button onClick={startGame} className="mt-6 flex items-center gap-2 px-10 py-4 rounded-full font-black text-black text-lg shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: activeLineColor }}>
                           <Play className="w-6 h-6 fill-current" /> PLAY
                        </button>
                        <span className="text-xs text-white/60 font-bold mt-3 uppercase tracking-widest">Drag to move paddle</span>
                     </motion.div>
                   )}

                   {gameState === 'gameover' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                        <RotateCcw className="w-12 h-12 text-white/80 mb-1 drop-shadow-md" />
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-md">GAME OVER</h2>
                        
                        {/* 🚀 Revive Section */}
                        <div className="w-full bg-black/40 rounded-[24px] p-5 mt-3 border border-white/10 shadow-lg">
                           <h3 className="text-white/90 font-bold text-sm mb-4">Try Again?</h3>
                           <button 
                             onClick={buyLife} 
                             disabled={score < lifeCost}
                             className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 ${score >= lifeCost ? 'text-black active:scale-95' : 'bg-gray-600 text-white/50 cursor-not-allowed'}`}
                             style={{ backgroundColor: score >= lifeCost ? activeLineColor : undefined }}
                           >
                             <Heart className={`w-5 h-5 ${score >= lifeCost ? 'text-red-600 fill-current' : ''}`} /> 
                             BUY 1 LIFE (-{lifeCost} XP)
                           </button>
                           {score < lifeCost && <p className="text-[11px] text-red-300 mt-3 font-bold uppercase tracking-wider">Not enough XP! You need {lifeCost}</p>}
                        </div>

                        <button onClick={startGame} className="mt-4 text-white/60 hover:text-white font-bold text-sm underline active:scale-95 transition-colors">
                           Restart Game
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'levelup' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                        <Zap className="w-14 h-14 text-yellow-400 fill-current drop-shadow-lg mb-2" />
                        <h2 className="text-3xl font-nunito-black text-white drop-shadow-md">LEVEL {level} CLEARED!</h2>
                        <button onClick={nextLevel} className="mt-6 flex items-center gap-2 px-8 py-4 rounded-full font-black text-black text-lg shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: activeLineColor }}>
                           <Play className="w-6 h-6 fill-current" /> NEXT LEVEL
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
