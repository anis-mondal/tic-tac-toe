const audioState = { ctx: null as AudioContext | null };

export const playEnhancedSound = (type: 'tap' | 'win' | 'overallWin' | 'pop' | 'point' | 'unmute' | 'mode' | 'refresh', variant: number) => {
  if (!variant || variant === 0 || typeof window === 'undefined') return;
  try {
    if (!audioState.ctx) {
      audioState.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioState.ctx.state === 'suspended') audioState.ctx.resume();
    const ctx = audioState.ctx;
    const t = ctx.currentTime;
    
    const profiles = [
      { w: 'sine', f: 0, d: 0, s: 0 },
      { w: 'sine', f: 600, d: 0.1, s: 1 },        
      { w: 'sine', f: 400, d: 0.1, s: 1.5 },      
      { w: 'triangle', f: 800, d: 0.05, s: 1 },   
      { w: 'sine', f: 1200, d: 0.15, s: 1 },      
      { w: 'sine', f: 300, d: 0.1, s: 0.5 },      
      { w: 'triangle', f: 600, d: 0.1, s: 1 },    
      { w: 'sine', f: 900, d: 0.08, s: 1 },       
      { w: 'triangle', f: 350, d: 0.15, s: 1 },   
      { w: 'sine', f: 1500, d: 0.05, s: 1 },      
      { w: 'sine', f: 500, d: 0.2, s: 1 },        
      { w: 'triangle', f: 1000, d: 0.05, s: 1 },  
      { w: 'sine', f: 800, d: 0.1, s: 0.5 },      
      { w: 'sine', f: 450, d: 0.15, s: 1 },       
      { w: 'triangle', f: 750, d: 0.08, s: 1.2 }, 
      { w: 'sine', f: 200, d: 0.15, s: 1 },       
      { w: 'triangle', f: 550, d: 0.12, s: 1 },   
      { w: 'sine', f: 1800, d: 0.03, s: 1 },      
      { w: 'sine', f: 350, d: 0.1, s: 1.5 },      
      { w: 'triangle', f: 900, d: 0.1, s: 0.8 },  
      { w: 'sine', f: 700, d: 0.15, s: 1 }        
    ];

    const p = profiles[variant] || profiles[1];

    const playOsc = (wave: string, freq: number, vol: number, attack: number, decay: number, sweep: number = 1, sweepDur: number = 0, delay: number = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave as OscillatorType;
        osc.frequency.setValueAtTime(freq, t + delay);
        if (sweep !== 1) osc.frequency.exponentialRampToValueAtTime(freq * sweep, t + delay + sweepDur);
        
        gain.gain.setValueAtTime(0, t + delay);
        gain.gain.linearRampToValueAtTime(vol, t + delay + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + attack + decay);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + attack + decay);
    };

    if (type === 'tap') {
        playOsc(p.w, p.f, 0.4, 0.01, p.d, p.s, 0.1);
    } else if (type === 'pop') {
        playOsc(p.w, p.f * 0.75, 0.4, 0.01, p.d * 1.5, p.s, 0.1);
    } else if (type === 'point' || type === 'unmute') {
        playOsc(p.w, p.f * 1.5, 0.3, 0.01, p.d * 1.2, p.s, 0.1);
    } else if (type === 'mode') {
        playOsc(p.w, p.f * 0.8, 0.3, 0.02, p.d);
        playOsc(p.w, p.f * 1.2, 0.3, 0.02, p.d * 1.2, 1, 0, 0.15);
    } else if (type === 'refresh') {
        playOsc(p.w, p.f * 0.8, 0.3, 0.02, p.d);
        playOsc(p.w, p.f, 0.3, 0.02, p.d, 1, 0, 0.08);
        playOsc(p.w, p.f * 1.4, 0.3, 0.02, p.d * 1.5, 1, 0, 0.16);
    } else if (type === 'win') {
        playOsc(p.w, p.f, 0.3, 0.02, p.d);
        playOsc(p.w, p.f * 1.25, 0.3, 0.02, p.d, 1, 0, 0.15);
        playOsc(p.w, p.f * 1.5, 0.3, 0.02, p.d * 2, 1, 0, 0.3);
    } else if (type === 'overallWin') {
        playOsc(p.w, p.f * 0.8, 0.3, 0.05, p.d);
        playOsc(p.w, p.f * 1.0, 0.3, 0.05, p.d, 1, 0, 0.15);
        playOsc(p.w, p.f * 1.25, 0.3, 0.05, p.d, 1, 0, 0.3);
        playOsc(p.w, p.f * 1.5, 0.3, 0.05, p.d, 1, 0, 0.45);
        playOsc(p.w, p.f * 2.0, 0.4, 0.05, p.d * 3, 1, 0, 0.6);
    }
  } catch(e) {}
};
