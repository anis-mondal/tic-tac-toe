import { motion, AnimatePresence } from 'motion/react';
import { X as CloseIcon, Info } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  semantics: { screenBackground: string; text: string };
  useDefaultTheme: boolean;
  activeLineColor: string;
}

export default function AboutModal({ isOpen, onClose, semantics, useDefaultTheme, activeLineColor }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: semantics.screenBackground, color: semantics.text }} className="w-full max-w-[420px] p-7 rounded-[36px] shadow-2xl relative border border-white/5 transition-colors duration-1000">
            
            <button onClick={onClose} className="absolute top-5 right-5 p-2 transition-opacity hover:opacity-70 z-[170]">
              <CloseIcon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-6 opacity-80">
              <Info className="w-6 h-6 mr-1" />
              <h2 className="font-nunito-black text-3xl">About Game</h2>
            </div>

            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-3 m3-scrollbar font-nunito font-normal text-[15px] opacity-80">
              <p>This is a premium <span className="font-nunito-black opacity-100">Tic Tac Toe</span> game crafted with Google's <span className="font-nunito-black opacity-100">Material You (M3)</span> design system. Customize themes, colors, and target scores for a personalized experience.</p>
              
              <div className="space-y-3.5">
                <h4 className="text-lg font-extrabold tracking-tight opacity-90 pt-2">Key Features</h4>
                <p>🤖 <span className="font-nunito-black opacity-100">1 Player (AI):</span> Play against an intelligent AI.</p>
                <p>👥 <span className="font-nunito-black opacity-100">2 Players:</span> Switch modes with one tap and play with a friend on the same device.</p>
                <p>🎯 <span className="font-nunito-black opacity-100">Target Score Win:</span> Set a custom point target (1-20) to win the full match.</p>
                <p>🎨 <span className="font-nunito-black opacity-100">Material You Themes:</span> Choose from <span className="font-nunito-black opacity-100 text-[16px]">25 beautiful M3 themes</span>.</p>
                <p>✨ <span className="font-nunito-black opacity-100">Custom Shapes:</span> Unlock <span className="font-nunito-black opacity-100 text-[16px]">250 unique custom icons</span> for each player.</p>
                <p>🌈 <span className="font-nunito-black opacity-100">Player Colors:</span> <span className="font-nunito-black opacity-100 text-[16px]">25 vibrant colors</span> available for X and O. These colors seamlessly apply to any custom icon you choose!</p>
                <p>🖌️ <span className="font-nunito-black opacity-100">Winning Line:</span> <span className="font-nunito-black opacity-100 text-[16px]">25 distinct colors</span> for the winning strike. (Note: The first 5 line colors dynamically adapt to your active Custom Theme).</p>
                
                <h4 className="text-lg font-extrabold tracking-tight opacity-90 pt-3">Controls</h4>
                <p>🔄 <span className="font-nunito-black opacity-100">Soft Reset:</span> Tap the Restart button to clear the board and start a new round.</p>
                <p>⚠️ <span className="font-nunito-black opacity-100">Hard Reset:</span> <strong>Press and hold</strong> the Restart button to wipe all scores and start completely fresh.</p>
                <p>✨ <span className="font-nunito-black opacity-100">Change Player Symbol:</span> <strong>Press and hold</strong> the turn banner when the game is hard reset to switch your symbol.</p>
                <p>✨ <span className="font-nunito-black opacity-100">Change Turn:</span> <strong>Tap</strong> the turn banner before starting a new round to swap who goes first.</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-500/30 flex flex-col items-center justify-center gap-1.5 pb-4">
                 <p className="text-[13px] uppercase tracking-widest opacity-60 font-black">Designed & Developed By</p>
                 
                 <a 
                   href="https://github.com/anis-mondal" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="font-nunito-black text-2xl transition-colors drop-shadow-sm hover:opacity-75"
                   style={{ color: useDefaultTheme ? '#0ea5e9' : activeLineColor }}
                 >
                    Anis Mondal
                 </a>
                 
                 <a href="https://github.com/anis-mondal/tic-tac-toe" target="_blank" rel="noopener noreferrer" className="mt-3 px-5 py-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all font-bold text-[14px] flex items-center gap-2 border border-gray-500/20 shadow-sm active:scale-95">
                    🔗 Open GitHub Repository
                 </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
