import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Play, RotateCcw, Zap, Coins } from 'lucide-react';
import { argbFromHex, themeFromSourceColor, hexFromArgb } from '@material/material-color-utilities';

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
  const [points, setPoints] = useState(0); 
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [lifeCost, setLifeCost] = useState(100);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('brick_highscore') || '0'));

  // 🚀 Monet Engine - Dynamic Colors Generation
  const monetTheme = themeFromSourceColor(argbFromHex(activeLineColor));
  const p = monetTheme.palettes;

  const topBarBg = isDarkMode ? hexFromArgb(p.neutralVariant.tone(15)) : hexFromArgb(p.neutralVariant.tone(90));
  const paddleColor = isDarkMode ? hexFromArgb(p.primary.tone(80)) : hexFromArgb(p.primary.tone(40));
  const ballColor = isDarkMode ? hexFromArgb(p.tertiary.tone(80)) : hexFromArgb(p.tertiary.tone(40)); 
  const heartColor = isDarkMode ? hexFromArgb(p.error.tone(70)) : hexFromArgb(p.error.tone(40)); 
  const coinColor = isDarkMode ? hexFromArgb(p.tertiary.tone(70)) : hexFromArgb(p.tertiary.tone(40)); 
  
  const normalBrickColor = paddleColor; // 🚀 ব্রিকস প্রাইমারি কালারে করা হলো
  const hardBrickColor = isDarkMode ? hexFromArgb(p.secondary.tone(60)) : hexFromArgb(p.secondary.tone(40));
  const unbreakableColor = isDarkMode ? hexFromArgb(p.neutralVariant.tone(30)) : hexFromArgb(p.neutralVariant.tone(80));

  // 🚀 গেমের বোর্ড আরও ডার্ক করা হলো
  const bgColor = isDarkMode ? hexFromArgb(p.neutralVariant.tone(8)) : hexFromArgb(p.neutralVariant.tone(95));

  // Physics Engine Refs
  const gameRef = useRef({
    ball: { x: 150, y: 300, vx: 0, vy: 0, radius: 9, baseSpeed: 260, currentSpeedMult: 1 }, // 🚀 বল একটু বড় করা হলো
    paddle: { x: 100, y: 400, w: 100, h: 16 }, // 🚀 প্যাডেল বড় করা হলো
    bricks: [] as any[],
    particles: [] as any[],
    canvasW: 300,
    canvasH: 450,
    physicsAccumulator: 0,
    lastFrameTime: 0
  });

  const FIXED_STEP = 1 / 120; 
  const MAX_STEPS = 8;

  // 🚀 Initialize Level (Perfect Alignment)
  const initLevel = (currentLevel: number) => {
    const r = gameRef.current;
    r.bricks = [];
    r.particles = [];
    
    r.ball.currentSpeedMult = 1 + ((currentLevel - 1) * 0.15); 
    const widthFactor = Math.max(0.15, 0.35 - (currentLevel * 0.025)); 
    r.paddle.w = r.canvasW * widthFactor;

    const cols = 7;
    const rows = Math.min(4 + currentLevel, 9);
    const padding = 10;
    const offsetTop = 45;
    
    // 🚀 ডান-বাম সমান গ্যাপ রাখার লজিক
    const totalPadding = padding * (cols + 1);
    const brickW = Math.max((r.canvasW - totalPadding) / cols, 15);
    const brickH = 22;

    const hardProb = Math.min(0.10 * currentLevel, 0.4);
    const solidProb = currentLevel > 2 ? Math.min(0.05 * currentLevel, 0.2) : 0;

    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const rand = Math.random();
        if (rand < Math.min(0.05 * currentLevel, 0.2)) continue;

        let type = 1; let hits = 1;
        if (rIdx > 1 && rand < solidProb) {
           type = 3; hits = -1; 
        } else if (rand < solidProb + hardProb) {
           type = 2; hits = 2; 
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

  const createParticles = (x: number, y: number, color: string, count: number = 6) => {
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

  const circleIntersectsRect = (cx: number, cy: number, radius: number, rect: any) => {
    const closestX = Math.max(rect.left, Math.min(cx, rect.right));
    const closestY = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) <= (radius * radius);
  };

  // 🚀 Physics & Draw Loop
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
      const state = gameRef.current;
      if (state.lastFrameTime === 0) state.lastFrameTime = time;
      const dt = Math.min((time - state.lastFrameTime) / 1000, 0.05); 
      state.lastFrameTime = time;

      if (gameState === 'playing') {
        for (let i = state.particles.length - 1; i >= 0; i--) {
          let p = state.particles[i];
          p.life -= dt * 1.5;
          if (p.life <= 0) { state.particles.splice(i, 1); continue; }
          const grav = 800;
          p.vy += grav * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }

        state.physicsAccumulator += dt;
        let steps = 0;

        while (state.physicsAccumulator >= FIXED_STEP && steps < MAX_STEPS) {
          state.physicsAccumulator -= FIXED_STEP;
          steps++;

          let nextX = state.ball.x + (state.ball.vx * FIXED_STEP);
          let nextY = state.ball.y + (state.ball.vy * FIXED_STEP);
          let ballLost = false;

          if (nextX - state.ball.radius <= 0) { nextX = state.ball.radius; state.ball.vx = Math.abs(state.ball.vx); }
          if (nextX + state.ball.radius >= state.canvasW) { nextX = state.canvasW - state.ball.radius; state.ball.vx = -Math.abs(state.ball.vx); }
          if (nextY - state.ball.radius <= 0) { nextY = state.ball.radius; state.ball.vy = Math.abs(state.ball.vy); }

          const paddleRect = { left: state.paddle.x, top: state.paddle.y, right: state.paddle.x + state.paddle.w, bottom: state.paddle.y + state.paddle.h };
          if (state.ball.vy > 0 && circleIntersectsRect(nextX, nextY, state.ball.radius, paddleRect)) {
              let hitPoint = (nextX - (paddleRect.left + state.paddle.w / 2)) / (state.paddle.w / 2);
              hitPoint = Math.max(-1, Math.min(hitPoint, 1));
              
              const currentSpeed = Math.max(Math.sqrt(state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy), state.ball.baseSpeed * 0.85);
              const newSpeed = Math.min(currentSpeed * 1.015, state.ball.baseSpeed * 3); 
              
              state.ball.vx = newSpeed * hitPoint * 0.82;
              state.ball.vy = -Math.sqrt(Math.max(0, (newSpeed * newSpeed) - (state.ball.vx * state.ball.vx)));
              nextY = paddleRect.top - state.ball.radius - 1;
              
              hapticFeedback(20);
              playPreviewSound('tap', soundPrefs.xTap);
          }

          let breakableCount = 0;
          let hitBrick = false;

          for (let i = 0; i < state.bricks.length; i++) {
            let b = state.bricks[i];
            if (b.hits === 0) continue;
            if (b.type !== 3) breakableCount++;

            if (!hitBrick && circleIntersectsRect(nextX, nextY, state.ball.radius, b.rect)) {
               hitBrick = true;
               state.ball.vy *= -1; 
               
               if (b.type !== 3) {
                 b.hits--;
                 hapticFeedback(30);
                 playPreviewSound('tap', soundPrefs.oTap);
                 
                 const bColor = b.type === 2 ? hardBrickColor : normalBrickColor;
                 createParticles(nextX, nextY, bColor);
                 
                 if (b.hits === 0) {
                    setPoints(p => p + 1); 
                 }
               } else {
                 hapticFeedback(20);
                 playPreviewSound('point', soundPrefs.point); 
                 createParticles(nextX, nextY, unbreakableColor, 3);
               }
            }
          }

          if (breakableCount === 0 && state.bricks.length > 0) {
             setGameState('levelup');
             playPreviewSound('win', soundPrefs.win);
             hapticFeedback([50, 100, 50]);
             setLevel(l => l + 1);
             break;
          }

          if (nextY - state.ball.radius > state.canvasH) {
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
             state.ball.x = nextX;
             state.ball.y = nextY;
          }

          if (ballLost) break;
        }
      }

      ctx.clearRect(0, 0, state.canvasW, state.canvasH);

      state.bricks.forEach(b => {
        if (b.hits === 0) return;
        let color = normalBrickColor;
        if (b.type === 3) color = unbreakableColor;
        else if (b.type === 2) {
           color = b.hits === 2 ? hardBrickColor : normalBrickColor; 
        }
        drawRoundRect(b.rect.left, b.rect.top, b.rect.w, b.rect.h, 6, color);
      });

      for (let i = 0; i < state.particles.length; i++) {
        let p = state.particles[i];
        ctx.globalAlpha = p.life;
        drawRoundRect(p.x, p.y, p.size, p.size, 2, p.color);
        ctx.globalAlpha = 1;
      }

      // 🚀 Solid Borders (No Glow/Shadow)
      drawRoundRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h, state.paddle.h / 2, paddleColor);
      
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, normalBrickColor, paddleColor, ballColor, hardBrickColor, unbreakableColor]);

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      gameRef.current.canvasW = rect.width;
      gameRef.current.canvasH = rect.height;
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      gameRef.current.paddle.y = rect.height - 50; // 🚀 প্যাডেল একটু উপরে তোলা হলো
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
    setPoints(0); setLives(3); setLevel(1); setLifeCost(100);
    initLevel(1); setGameState('playing');
  };

  const nextLevel = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    initLevel(level); setGameState('playing');
  };

  const buyLife = () => {
    if (points >= lifeCost) {
      hapticFeedback([50, 100, 50]); playPreviewSound('win', soundPrefs.win);
      setPoints(p => p - lifeCost);
      setLifeCost(c => c + 50); 
      setLives(1);
      resetBall(); setGameState('playing');
    } else {
      hapticFeedback([100, 50, 100]); 
    }
  };

  useEffect(() => {
     if (points > highScore) { setHighScore(points); localStorage.setItem('brick_highscore', points.toString()); }
  }, [points]);

  return (
    <div className="w-full h-full flex flex-col max-w-md mx-auto relative select-none pt-2 pb-6 px-1">
       
       <div className="flex justify-between items-center py-2 px-5 rounded-full mb-3 shadow-sm mx-2" style={{ backgroundColor: topBarBg }}>
          <div className="flex items-center gap-1.5">
             <Coins className="w-5 h-5 drop-shadow-sm" style={{ color: coinColor }} />
             <span className="text-[14px] font-black" style={{ color: semantics.text }}>{points}</span>
          </div>
          
          <div className="px-5 py-1.5 rounded-full font-black text-[13px] shadow-sm" style={{ backgroundColor: paddleColor, color: isDarkMode ? '#000' : '#fff' }}>
             LVL {level}
          </div>
          
          <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-black" style={{ color: semantics.text }}>{lives}</span>
              <Heart className="w-5 h-5 fill-current drop-shadow-sm" style={{ color: heartColor }} />
          </div>
       </div>

       <div 
          ref={containerRef}
          className="flex-1 relative rounded-[32px] overflow-hidden shadow-inner touch-none mx-2 border-[2px]"
          style={{ backgroundColor: bgColor, borderColor: topBarBg }}
          onPointerMove={handlePointerMove}
       >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          <AnimatePresence>
             {gameState !== 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                   
                   {gameState === 'start' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                        <Star className="w-16 h-16 fill-current drop-shadow-md mb-2" style={{ color: ballColor }} />
                        <h2 className="text-[34px] font-nunito-black text-white drop-shadow-lg leading-tight">Brick Breaker</h2>
                        
                        <div className="bg-black/40 px-6 py-2.5 rounded-full border border-white/10 mt-1 shadow-inner">
                          <span className="text-sm font-black tracking-wide" style={{ color: ballColor }}>HIGH SCORE: {highScore} Pts</span>
                        </div>

                        <button onClick={startGame} className="mt-8 flex items-center gap-2 px-12 py-4 rounded-full font-black text-black text-lg shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: paddleColor }}>
                           <Play className="w-6 h-6 fill-current" /> PLAY
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'gameover' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                        <RotateCcw className="w-14 h-14 text-white/90 mb-1 drop-shadow-md" />
                        
                        <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 shadow-inner mb-2">
                          <span className="text-[13px] font-black tracking-wide" style={{ color: ballColor }}>SCORE: {points}  •  HIGH: {highScore}</span>
                        </div>

                        <h2 className="text-[36px] font-nunito-black text-white drop-shadow-md">GAME OVER</h2>
                        
                        {/* 🚀 Material You Pill Shape Buttons */}
                        <div className="w-full bg-black/40 rounded-[28px] p-6 mt-4 border border-white/10 shadow-lg">
                           <h3 className="text-white/90 font-bold text-[15px] mb-5">Continue Playing?</h3>
                           <button 
                             onClick={buyLife} 
                             disabled={points < lifeCost}
                             className={`w-full py-4 rounded-full font-black text-[15px] transition-all shadow-md flex items-center justify-center gap-2 ${points >= lifeCost ? 'text-black active:scale-95' : 'bg-gray-600 text-white/50 cursor-not-allowed'}`}
                             style={{ backgroundColor: points >= lifeCost ? paddleColor : undefined }}
                           >
                             <Heart className={`w-5 h-5 ${points >= lifeCost ? 'fill-current text-black' : ''}`} /> 
                             BUY 1 LIFE (-{lifeCost} Pts)
                           </button>
                           {points < lifeCost && <p className="text-[11px] text-red-300 mt-3 font-bold uppercase tracking-wider">Not enough Points! Need {lifeCost}</p>}
                        </div>

                        <button onClick={startGame} className="mt-5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm active:scale-95 transition-all">
                           Restart Game
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'levelup' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                        <Zap className="w-16 h-16 fill-current drop-shadow-lg mb-2" style={{ color: ballColor }} />
                        <h2 className="text-[34px] font-nunito-black text-white drop-shadow-md leading-tight">LEVEL {level}<br/>CLEARED!</h2>
                        <button onClick={nextLevel} className="mt-8 flex items-center gap-2 px-10 py-4 rounded-full font-black text-black text-lg shadow-xl active:scale-95 transition-transform" style={{ backgroundColor: paddleColor }}>
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
