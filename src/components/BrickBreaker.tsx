import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Play, Coins, Zap } from 'lucide-react';
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
  const [isBallLaunched, setIsBallLaunched] = useState(false);
  const [points, setPoints] = useState(0); 
  const [xp, setXp] = useState(0); // 🚀 নতুন: XP পয়েন্ট
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [lifeCost, setLifeCost] = useState(100);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('brick_highscore') || '0'));

  // =========================================================
  // 🎨 Material You Color Palette 
  // =========================================================
  const monetTheme = themeFromSourceColor(argbFromHex(activeLineColor));
  const p = monetTheme.palettes;

  const outerBg = isDarkMode ? hexFromArgb(p.neutral.tone(4)) : hexFromArgb(p.neutral.tone(98));
  const boardBg = isDarkMode ? hexFromArgb(p.primary.tone(10)) : hexFromArgb(p.primary.tone(92));
  const topBarBg = isDarkMode ? hexFromArgb(p.primary.tone(18)) : hexFromArgb(p.primary.tone(90));
  
  const paddleColor = activeLineColor; // 🚀 মূল কালার 
  const ballColor = isDarkMode ? hexFromArgb(p.tertiary.tone(80)) : hexFromArgb(p.tertiary.tone(40)); 
  
  // 🚀 XP এবং High Score কন্টেইনারের জন্য উজ্জ্বল টার্সিয়ারি কালার
  const tertiaryAccentBg = isDarkMode ? hexFromArgb(p.tertiary.tone(30)) : hexFromArgb(p.tertiary.tone(80));
  const tertiaryAccentText = isDarkMode ? hexFromArgb(p.tertiary.tone(90)) : hexFromArgb(p.tertiary.tone(10));
  
  const heartColor = isDarkMode ? hexFromArgb(p.error.tone(70)) : hexFromArgb(p.error.tone(40)); 
  const coinColor = isDarkMode ? hexFromArgb(p.secondary.tone(70)) : hexFromArgb(p.secondary.tone(40)); 
  
  // 🚀 ইটের কালারগুলো (৩টি স্টেজ)
  const normalBrickColor = activeLineColor; // 1 Hit
  const hardBrickColor = isDarkMode ? hexFromArgb(p.secondary.tone(40)) : hexFromArgb(p.secondary.tone(60)); // 2 Hits (ঝাপসা টাইপের)
  const veryHardBrickColor = isDarkMode ? hexFromArgb(p.tertiary.tone(60)) : hexFromArgb(p.tertiary.tone(40)); // 3 Hits (টার্সিয়ারি)
  const unbreakableColor = isDarkMode ? hexFromArgb(p.neutralVariant.tone(30)) : hexFromArgb(p.neutralVariant.tone(80)); 

  // Physics Engine Refs
  const gameRef = useRef({
    ball: { x: 150, y: 300, vx: 0, vy: 0, radius: 6.5, baseSpeed: 290, currentSpeedMult: 1 }, 
    paddle: { x: 100, y: 400, w: 75, h: 12 }, 
    bricks: [] as any[],
    particles: [] as any[],
    canvasW: 300,
    canvasH: 450,
    physicsAccumulator: 0,
    lastFrameTime: 0,
    isPaused: false,
    ballLaunched: false
  });

  const FIXED_STEP = 1 / 120; 
  const MAX_STEPS = 8;

  // 🚀 Initialize Level (পারফেক্ট অ্যালাইনমেন্ট এবং ৩টি হিট স্টেজ)
  const initLevel = (currentLevel: number) => {
    const r = gameRef.current;
    r.bricks = [];
    r.particles = [];
    
    r.ball.currentSpeedMult = 1 + ((currentLevel - 1) * 0.12); 
    const widthFactor = Math.max(0.18, 0.28 - (currentLevel * 0.015)); 
    r.paddle.w = r.canvasW * widthFactor;

    const cols = 8; 
    const rows = Math.min(4 + currentLevel, 10);
    const padding = 8; 
    const offsetTop = 20; 
    
    const availableWidth = r.canvasW - (padding * 2); 
    const totalGapWidth = padding * (cols - 1);
    const brickW = (availableWidth - totalGapWidth) / cols; 
    const brickH = 16; 

    // 🚀 Probability Logic
    const veryHardProb = currentLevel >= 3 ? Math.min(0.10 * currentLevel, 0.3) : 0; // ৩ হিটের ইট লেভেল ৩ থেকে আসবে
    const hardProb = currentLevel >= 2 ? Math.min(0.15 * currentLevel, 0.4) : 0;
    const solidProb = currentLevel >= 4 ? Math.min(0.05 * currentLevel, 0.15) : 0;

    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const rand = Math.random();
        if (rand < Math.min(0.05 * currentLevel, 0.2)) continue;

        let type = 1; let hits = 1;
        
        if (rIdx > 1 && rand < solidProb) {
           type = 4; hits = -1; // Unbreakable
        } else if (rand < solidProb + veryHardProb) {
           type = 3; hits = 3; // Very Hard (Tertiary)
        } else if (rand < solidProb + veryHardProb + hardProb) {
           type = 2; hits = 2; // Hard (Secondary Blur)
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
    
    setIsBallLaunched(false);
    gameRef.current.ballLaunched = false;
  };

  const launchBall = () => {
    const r = gameRef.current;
    r.ballLaunched = true;
    setIsBallLaunched(true);
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

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            gameRef.current.isPaused = true;
        } else {
            gameRef.current.isPaused = false;
            gameRef.current.lastFrameTime = performance.now(); 
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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

      if (gameState === 'playing' && !state.isPaused) {
        
        if (!state.ballLaunched) {
            state.ball.x = state.paddle.x + state.paddle.w / 2;
            state.ball.y = state.paddle.y - state.ball.radius - 2;
        } else {
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
                if (b.type !== 4) breakableCount++;

                if (!hitBrick && circleIntersectsRect(nextX, nextY, state.ball.radius, b.rect)) {
                   hitBrick = true;
                   state.ball.vy *= -1; 
                   
                   if (b.type !== 4) {
                     b.hits--;
                     hapticFeedback(30);
                     playPreviewSound('tap', soundPrefs.oTap);
                     
                     // 🚀 কালার লজিক (হিট অনুযায়ী পার্টিকেল)
                     let bColor = normalBrickColor;
                     if (b.hits === 2) bColor = veryHardBrickColor;
                     else if (b.hits === 1) bColor = hardBrickColor;
                     
                     createParticles(nextX, nextY, bColor);
                     
                     // 🚀 পয়েন্ট এবং XP লজিক
                     if (b.hits === 0) {
                        setPoints(p => p + 1); 
                        setXp(x => x + 50); // প্রতি ইট ভাঙলে 50 XP
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
                      state.ballLaunched = false;
                      setIsBallLaunched(false);
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
      }

      ctx.clearRect(0, 0, state.canvasW, state.canvasH);

      state.bricks.forEach(b => {
        if (b.hits === 0) return;
        let color = normalBrickColor;
        if (b.type === 4) color = unbreakableColor;
        else if (b.hits === 3) color = veryHardBrickColor; // Tertiary
        else if (b.hits === 2) color = hardBrickColor; // Secondary Blur
        
        drawRoundRect(b.rect.left, b.rect.top, b.rect.w, b.rect.h, 4, color); 
      });

      for (let i = 0; i < state.particles.length; i++) {
        let p = state.particles[i];
        ctx.globalAlpha = p.life;
        drawRoundRect(p.x, p.y, p.size, p.size, 2, p.color);
        ctx.globalAlpha = 1;
      }

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
  }, [gameState, normalBrickColor, paddleColor, ballColor, hardBrickColor, veryHardBrickColor, unbreakableColor]);

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1; 
      
      gameRef.current.canvasW = rect.width;
      gameRef.current.canvasH = rect.height;
      
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      canvasRef.current.style.width = `${rect.width}px`;
      canvasRef.current.style.height = `${rect.height}px`;
      
      const ctx = canvasRef.current.getContext('2d');
      ctx?.scale(dpr, dpr);

      gameRef.current.paddle.y = rect.height - 35; 
      // 🚀 প্রথমবার লোড হলে আবার ড্র করার জন্য
      if(gameState === 'start') {
         setTimeout(() => initLevel(1), 100);
      }
    }
  }, [gameState]);

  const handlePointerDown = () => {
    if (gameState === 'playing' && !isBallLaunched) {
        launchBall();
    }
  };

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
    setPoints(0); setXp(0); setLives(3); setLevel(1); setLifeCost(100);
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
      
      gameRef.current.ballLaunched = false;
      setIsBallLaunched(false);
      setGameState('playing');
    } else {
      hapticFeedback([100, 50, 100]); 
    }
  };

  useEffect(() => {
     if (points > highScore) { setHighScore(points); localStorage.setItem('brick_highscore', points.toString()); }
  }, [points]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none pt-2 pb-6 px-4" style={{ backgroundColor: outerBg }}>
       
       {/* 🚀 Top Bar */}
       <div className="flex justify-between items-center py-2.5 px-4 rounded-full w-full max-w-[380px] mb-3 shadow-sm" style={{ backgroundColor: topBarBg }}>
          
          <div className="flex items-center gap-1.5">
             <Coins className="w-[16px] h-[16px]" style={{ color: coinColor }} strokeWidth={2.5} />
             <span className="text-[14px] font-black" style={{ color: semantics.text }}>{points}</span>
          </div>
          
          {/* 🚀 XP Points (Tertiary Color Pill) */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: tertiaryAccentBg }}>
             <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: tertiaryAccentText }}>XP</span>
             <span className="text-[13px] font-black" style={{ color: tertiaryAccentText }}>{xp}</span>
          </div>

          <div className="px-5 py-1.5 rounded-full font-black text-[13px] shadow-sm" style={{ backgroundColor: paddleColor, color: isDarkMode ? '#000' : '#fff' }}>
             LVL {level}
          </div>
          
          <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-black" style={{ color: semantics.text }}>{lives}</span>
              <Heart className="w-[16px] h-[16px] fill-current" style={{ color: heartColor }} />
          </div>
       </div>

       {/* 🚀 Game Board */}
       <div className="relative w-full max-w-[380px] flex-1 min-h-0 rounded-[18px] overflow-hidden" style={{ backgroundColor: boardBg }}>
          
          {/* Canvas Container */}
          <div 
             ref={containerRef}
             className="absolute inset-0 touch-none"
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
          >
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          </div>

          {/* 🚀 Overlays (Absolute inside the board) */}
          <AnimatePresence>
             {gameState === 'playing' && !isBallLaunched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                   <span className="text-white/60 font-black tracking-widest uppercase text-sm bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm">
                      Tap to Launch
                   </span>
                </motion.div>
             )}
          </AnimatePresence>

          <AnimatePresence>
             {gameState !== 'playing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-6 text-center">
                   
                   {gameState === 'start' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3 w-full">
                        <Star className="w-12 h-12 fill-current mb-1" style={{ color: ballColor }} />
                        <h2 className="text-[26px] font-nunito-black text-white leading-tight">Brick Breaker</h2>
                        
                        <div className="px-5 py-2 rounded-full mt-2 shadow-sm" style={{ backgroundColor: tertiaryAccentBg }}>
                          <span className="text-[12px] font-black tracking-wide" style={{ color: tertiaryAccentText }}>HIGH SCORE: {highScore} Pts</span>
                        </div>

                        <button onClick={startGame} className="mt-6 flex items-center gap-2 px-10 py-3.5 rounded-full font-black text-black text-[15px] active:scale-95 transition-transform shadow-md" style={{ backgroundColor: paddleColor }}>
                           <Play className="w-5 h-5 fill-current" /> PLAY
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'gameover' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3 w-full">
                        
                        <div className="px-5 py-2 rounded-full mb-2 shadow-sm" style={{ backgroundColor: tertiaryAccentBg }}>
                          <span className="text-[12px] font-black tracking-wide" style={{ color: tertiaryAccentText }}>SCORE: {points}  •  HIGH: {highScore}</span>
                        </div>

                        <h2 className="text-[28px] font-nunito-black text-white mb-2">GAME OVER</h2>
                        
                        <button onClick={startGame} className="w-[90%] max-w-[240px] py-3.5 rounded-full font-black text-black text-[14px] active:scale-95 transition-transform shadow-md mt-2" style={{ backgroundColor: paddleColor }}>
                           RESTART GAME
                        </button>
                        
                        <button 
                           onClick={buyLife} 
                           disabled={points < lifeCost}
                           className={`w-[90%] max-w-[240px] mt-2 py-3 rounded-full font-black text-[13px] transition-all flex items-center justify-center gap-2 shadow-sm ${points >= lifeCost ? 'bg-white/20 text-white active:scale-95' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                        >
                           <Heart className="w-[16px] h-[16px] fill-current" style={{ color: points >= lifeCost ? heartColor : undefined }} /> 
                           BUY 1 LIFE ( {lifeCost} Pts )
                        </button>
                        
                     </motion.div>
                   )}

                   {gameState === 'levelup' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                        <Zap className="w-14 h-14 fill-current mb-1" style={{ color: ballColor }} />
                        <h2 className="text-[28px] font-nunito-black text-white leading-tight">LEVEL {level}<br/>CLEARED!</h2>
                        <button onClick={nextLevel} className="mt-6 flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-black text-[15px] active:scale-95 transition-transform shadow-md" style={{ backgroundColor: paddleColor }}>
                           <Play className="w-5 h-5 fill-current" /> NEXT LEVEL
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
