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

const getSafeHex = (color: string) => {
  if (!color) return '#007AFF';
  if (color.startsWith('#')) {
      if (color.length === 7) return color;
      if (color.length === 9) return color.slice(0, 7);
      if (color.length === 4) return '#' + color[1]+color[1] + color[2]+color[2] + color[3]+color[3];
  }
  return '#007AFF'; 
};

export default function BrickBreaker({
  semantics, isDarkMode, activeLineColor, hapticFeedback, playPreviewSound, soundPrefs
}: BrickBreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 🚀 Safe React States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'levelup'>('start');
  const [isBallLaunched, setIsBallLaunched] = useState(false);
  const [points, setPoints] = useState(0); 
  const [xp, setXp] = useState(0); 
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [lifeCost, setLifeCost] = useState(100);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('brick_highscore') || '0'));

  // =========================================================
  // 🎨 Material You Color Palette 
  // =========================================================
  const safeHexColor = getSafeHex(activeLineColor);
  const monetTheme = themeFromSourceColor(argbFromHex(safeHexColor));
  const p = monetTheme.palettes;

  const boardBg = isDarkMode ? hexFromArgb(p.primary.tone(8)) : hexFromArgb(p.primary.tone(94));
  const topBarBg = isDarkMode ? hexFromArgb(p.primary.tone(12)) : hexFromArgb(p.primary.tone(92));
  
  const tertiaryPillBg = isDarkMode ? hexFromArgb(p.tertiary.tone(80)) : hexFromArgb(p.tertiary.tone(35));
  const tertiaryPillText = isDarkMode ? '#000000' : '#ffffff';
  
  const primaryPillBg = safeHexColor;
  const primaryPillText = isDarkMode ? '#000000' : '#ffffff';
  
  // 🚀 বলের কালার টার্সিয়ারি কালারের একটি মিডিয়াম (Medium) ভার্সনে সেট করা হয়েছে
  const ballColor = isDarkMode ? hexFromArgb(p.tertiary.tone(60)) : hexFromArgb(p.tertiary.tone(50)); 
  const paddleColor = safeHexColor;
  
  const heartColor = isDarkMode ? hexFromArgb(p.error.tone(40)) : hexFromArgb(p.error.tone(70)); 
  const coinColor = isDarkMode ? hexFromArgb(p.secondary.tone(80)) : hexFromArgb(p.secondary.tone(30)); 
  
  const normalBrickColor = safeHexColor; 
  const hardBrickColor = isDarkMode ? hexFromArgb(p.secondary.tone(60)) : hexFromArgb(p.secondary.tone(40)); 
  const veryHardBrickColor = isDarkMode ? hexFromArgb(p.tertiary.tone(70)) : hexFromArgb(p.tertiary.tone(40)); 
  const unbreakableBg = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'; 
  // =========================================================

  const gameRef = useRef({
    ball: { x: 150, y: 300, vx: 0, vy: 0, radius: 8.5, baseSpeed: 290, currentSpeedMult: 1 }, 
    paddle: { x: 100, y: 400, w: 75, h: 9 }, 
    bricks: [] as any[],
    particles: [] as any[],
    canvasW: 300,
    canvasH: 450,
    physicsAccumulator: 0,
    lastFrameTime: 0,
    isPaused: false,
    ballLaunched: false,
    isTransitioning: false 
  });

  const FIXED_STEP = 1 / 120; 
  const MAX_STEPS = 8;

  const initLevel = (currentLevel: number) => {
    const r = gameRef.current;
    r.bricks = [];
    r.particles = [];
    r.isTransitioning = false; 
    
    r.ball.currentSpeedMult = 1 + ((currentLevel - 1) * 0.12); 
    
    // 🚀 প্যাডেলের চওড়া (Width) সামান্য কমানো হলো
    const widthFactor = Math.max(0.14, 0.20 - (currentLevel * 0.015)); 
    r.paddle.w = r.canvasW * widthFactor;

    const cols = 7; 
    const minRows = Math.min(4 + Math.floor(currentLevel / 3), 6);
    const maxRows = Math.min(minRows + 3, 9);
    const rows = Math.floor(Math.random() * (maxRows - minRows + 1)) + minRows; 
    
    const padding = 12; 
    const offsetLeft = padding; 
    const offsetTop = padding; 
    
    const availableWidth = r.canvasW - (padding * 2); 
    const totalGapWidth = padding * (cols - 1);
    const brickW = (availableWidth - totalGapWidth) / cols; 
    
    // 🚀 ইটের উচ্চতা (Height) বাড়ানো হলো (চওড়া বোর্ড অনুযায়ী অটোমেটিক বেড়ে গেছে)
    const brickH = 22; 

    const pSecondary = currentLevel >= 2 ? Math.min(0.15 + (currentLevel - 2) * 0.02, 0.35) : 0;
    const pTertiary = currentLevel >= 3 ? Math.min(0.08 + (currentLevel - 3) * 0.03, 0.25) : 0;
    const pSolid = currentLevel >= 4 ? Math.min(0.03 + (currentLevel - 4) * 0.02, 0.15) : 0;

    for (let c = 0; c < cols; c++) {
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        const rand = Math.random();
        if (currentLevel > 1 && rand < Math.min(0.05 * currentLevel, 0.15)) continue;

        let type = 1; let hits = 1;
        const typeRand = Math.random();

        if (currentLevel === 1) {
            type = 1; hits = 1; 
        } else if (currentLevel === 2) {
            if (typeRand < 0.25) { type = 2; hits = 2; } 
        } else if (currentLevel === 3) {
            if (typeRand < 0.15) { type = 3; hits = 3; } 
            else if (typeRand < 0.35) { type = 2; hits = 2; } 
        } else if (currentLevel === 4) {
            if (typeRand < 0.10) { type = 4; hits = -1; } 
            else if (typeRand < 0.35) { type = 2; hits = 2; } 
        } else if (currentLevel === 5) {
            if (typeRand < 0.12) { type = 4; hits = -1; } 
            else if (typeRand < 0.35) { type = 3; hits = 3; } 
        } else {
            if (typeRand < 0.12) { type = 4; hits = -1; }
            else if (typeRand < 0.25) { type = 3; hits = 3; }
            else if (typeRand < 0.45) { type = 2; hits = 2; }
        }

        r.bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + rIdx * (brickH + padding),
          w: brickW, 
          h: brickH,
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

  const circleIntersectsRect = (cx: number, cy: number, radius: number, rx: number, ry: number, rw: number, rh: number) => {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
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
            state.ball.currentSpeedMult += 0.015 * dt; 
            state.ball.currentSpeedMult = Math.min(state.ball.currentSpeedMult, 3.0);
            
            const currentV = Math.sqrt(state.ball.vx*state.ball.vx + state.ball.vy*state.ball.vy);
            const targetV = state.ball.baseSpeed * state.ball.currentSpeedMult;
            if (currentV > 0) {
               state.ball.vx = (state.ball.vx / currentV) * targetV;
               state.ball.vy = (state.ball.vy / currentV) * targetV;
            }

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

            if (state.isTransitioning) return;

            while (state.physicsAccumulator >= FIXED_STEP && steps < MAX_STEPS) {
              state.physicsAccumulator -= FIXED_STEP;
              steps++;

              let nextX = state.ball.x + (state.ball.vx * FIXED_STEP);
              let nextY = state.ball.y + (state.ball.vy * FIXED_STEP);
              let ballLost = false;

              if (nextX - state.ball.radius <= 0) { nextX = state.ball.radius; state.ball.vx = Math.abs(state.ball.vx); }
              if (nextX + state.ball.radius >= state.canvasW) { nextX = state.canvasW - state.ball.radius; state.ball.vx = -Math.abs(state.ball.vx); }
              if (nextY - state.ball.radius <= 0) { nextY = state.ball.radius; state.ball.vy = Math.abs(state.ball.vy); }

              if (state.ball.vy > 0 && circleIntersectsRect(nextX, nextY, state.ball.radius, state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h)) {
                  let hitPoint = (nextX - (state.paddle.x + state.paddle.w / 2)) / (state.paddle.w / 2);
                  hitPoint = Math.max(-1, Math.min(hitPoint, 1));
                  
                  state.ball.vx = targetV * hitPoint * 0.82;
                  state.ball.vy = -Math.sqrt(Math.max(0, (targetV * targetV) - (state.ball.vx * state.ball.vx)));
                  nextY = state.paddle.y - state.ball.radius - 1;
                  
                  hapticFeedback(20);
                  playPreviewSound('tap', soundPrefs.xTap);
              }

              let breakableCount = 0;
              let hitBrick = false;

              for (let i = 0; i < state.bricks.length; i++) {
                let b = state.bricks[i];
                if (b.hits === 0) continue;
                if (b.type !== 4) breakableCount++; 

                if (!hitBrick && circleIntersectsRect(nextX, nextY, state.ball.radius, b.x, b.y, b.w, b.h)) {
                   hitBrick = true;
                   state.ball.vy *= -1; 
                   
                   if (b.type !== 4) {
                     b.hits--;
                     hapticFeedback(30);
                     playPreviewSound('tap', soundPrefs.oTap);
                     
                     let bColor = normalBrickColor;
                     if (b.hits === 2) bColor = veryHardBrickColor;
                     else if (b.hits === 1) bColor = hardBrickColor;
                     
                     createParticles(nextX, nextY, bColor);
                     
                     if (b.hits === 0) {
                        setPoints(p => p + 1); 
                        setXp(x => x + 50); 
                     }
                   } else {
                     hapticFeedback(20);
                     playPreviewSound('point', soundPrefs.point); 
                     createParticles(nextX, nextY, safeHexColor, 3);
                   }
                }
              }

              if (breakableCount === 0 && state.bricks.length > 0 && !state.isTransitioning) {
                 state.isTransitioning = true;
                 setGameState('levelup');
                 playPreviewSound('win', soundPrefs.win);
                 hapticFeedback([50, 100, 50]);
                 setLevel(l => l + 1);
                 break;
              }

              if (nextY - state.ball.radius > state.canvasH && !state.isTransitioning) {
                 state.isTransitioning = true;
                 ballLost = true;
                 hapticFeedback([100, 50]);
                 playPreviewSound('point', soundPrefs.point);
                 
                 setLives(prev => {
                   const newLives = prev - 1;
                   if (newLives <= 0) {
                      setGameState('gameover');
                      playPreviewSound('overallWin', soundPrefs.overallWin);
                   } else {
                      state.ball.currentSpeedMult = 1 + ((level - 1) * 0.12);
                      state.ballLaunched = false;
                      setIsBallLaunched(false);
                      state.isTransitioning = false; 
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
        
        if (b.type === 4) {
           drawRoundRect(b.x, b.y, b.w, b.h, 4, unbreakableBg);
           ctx.beginPath();
           ctx.moveTo(b.x + 5, b.y + 5);
           ctx.lineTo(b.x + b.w - 5, b.y + b.h - 5);
           ctx.moveTo(b.x + b.w - 5, b.y + 5);
           ctx.lineTo(b.x + 5, b.y + b.h - 5);
           ctx.strokeStyle = safeHexColor;
           ctx.lineWidth = 2.5;
           ctx.lineCap = 'round'; 
           ctx.lineJoin = 'round';
           ctx.stroke();
           ctx.closePath();
        } else {
           let color = normalBrickColor;
           if (b.hits === 3) color = veryHardBrickColor; 
           else if (b.hits === 2) color = hardBrickColor; 
           
           drawRoundRect(b.x, b.y, b.w, b.h, 4, color); 
        }
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
  }, [gameState, normalBrickColor, paddleColor, ballColor, hardBrickColor, veryHardBrickColor, unbreakableBg, safeHexColor, level]);

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
      if(gameState === 'start') setTimeout(() => initLevel(1), 50);
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
    gameRef.current.isTransitioning = false; 
    initLevel(1); setGameState('playing');
  };

  const nextLevel = () => {
    hapticFeedback(50); playPreviewSound('mode', soundPrefs.mode);
    gameRef.current.isTransitioning = false; 
    initLevel(level); setGameState('playing');
  };

  const buyLife = () => {
    if (points >= lifeCost) {
      hapticFeedback([50, 100, 50]); playPreviewSound('win', soundPrefs.win);
      setPoints(p => p - lifeCost);
      setLifeCost(c => c + 50); 
      setLives(1);
      
      gameRef.current.ballLaunched = false;
      gameRef.current.isTransitioning = false; 
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
    <div 
      className="w-full h-full flex flex-col items-center select-none pt-2 pb-4 px-4 overflow-hidden bg-transparent" 
      style={{ touchAction: 'none', overscrollBehaviorY: 'contain' }}
      onTouchMove={(e) => e.stopPropagation()}
    >
       
       <div className="inline-flex w-auto justify-center items-center gap-2 p-2 rounded-full mt-6 mb-8 shadow-sm mx-auto transition-all" style={{ backgroundColor: topBarBg }}>
          
          {/* 🚀 পিলগুলোর প্যাডিং সমান করে চারদিকে পারফেক্ট রাউন্ডেড করা হলো */}
          <div className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm" style={{ backgroundColor: primaryPillBg }}>
             <Coins className="w-[14px] h-[14px]" style={{ color: primaryPillText }} strokeWidth={3} />
             <span className="text-[13px] font-black leading-none pt-[1px]" style={{ color: primaryPillText }}>{points}</span>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm" style={{ backgroundColor: tertiaryPillBg }}>
             <span className="text-[11px] font-black uppercase tracking-wider leading-none pt-[1.5px]" style={{ color: tertiaryPillText }}>XP</span>
             <span className="text-[13px] font-black leading-none pt-[1px]" style={{ color: tertiaryPillText }}>{xp}</span>
          </div>

          <div className="px-4 py-2 rounded-full font-black text-[13px] shadow-sm flex items-center justify-center" style={{ backgroundColor: primaryPillBg, color: primaryPillText }}>
             <span className="leading-none pt-[1px]">LVL {level}</span>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full shadow-sm" style={{ backgroundColor: tertiaryPillBg }}>
              <span className="text-[13px] font-black leading-none pt-[1px]" style={{ color: tertiaryPillText }}>{lives}</span>
              <Heart className="w-[14px] h-[14px] fill-current" style={{ color: heartColor }} />
          </div>
       </div>

       {/* 🚀 গেম বোর্ডের চওড়া ১০% বৃদ্ধি করা হলো (max-w-[530px]) */}
       <div className="relative w-full max-w-[530px] h-[75vh] max-h-[660px] rounded-[18px] overflow-hidden shadow-inner" style={{ backgroundColor: boardBg }}>
          
          <div 
             ref={containerRef}
             className="absolute inset-0 touch-none"
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
          >
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />
          </div>

          <AnimatePresence>
             {gameState === 'playing' && !isBallLaunched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                   <span className="text-white/60 font-black tracking-widest uppercase text-sm bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm">
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
                        <Star className="w-12 h-12 fill-current mb-1 drop-shadow-md" style={{ color: ballColor }} />
                        
                        <h2 className="text-[26px] font-nunito-black text-white leading-tight drop-shadow-md">Brick Breaker</h2>
                        
                        <div className="px-5 py-2 rounded-full mt-2 shadow-sm" style={{ backgroundColor: tertiaryPillBg }}>
                          <span className="text-[12px] font-black tracking-wide" style={{ color: tertiaryPillText }}>HIGH SCORE: {highScore} Pts</span>
                        </div>

                        <button onClick={startGame} className="mt-6 flex items-center gap-2 px-10 py-3.5 rounded-full font-black text-black text-[15px] active:scale-95 transition-transform shadow-md" style={{ backgroundColor: paddleColor }}>
                           <Play className="w-5 h-5 fill-current" /> PLAY
                        </button>
                     </motion.div>
                   )}

                   {gameState === 'gameover' && (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3 w-full">
                        
                        <div className="px-5 py-2 rounded-full mb-2 shadow-sm" style={{ backgroundColor: tertiaryPillBg }}>
                          <span className="text-[12px] font-black tracking-wide" style={{ color: tertiaryPillText }}>SCORE: {points}  •  HIGH: {highScore}</span>
                        </div>

                        <h2 className="text-[28px] font-nunito-black text-white mb-2 drop-shadow-md">GAME OVER</h2>
                        
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
                        <Zap className="w-14 h-14 fill-current mb-1 drop-shadow-md" style={{ color: ballColor }} />
                        <h2 className="text-[28px] font-nunito-black text-white leading-tight drop-shadow-md">LEVEL {level}<br/>CLEARED!</h2>
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
