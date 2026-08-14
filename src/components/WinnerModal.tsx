
import { motion, AnimatePresence } from 'motion/react';
import DynamicIcon from './DynamicIcon';
import { PLAYER_COLORS } from '../constants/themeData';

export default function WinnerModal({ 
  show, overallWinner, p1Custom, p1Idx, p2Custom, p2Idx, xColorIdx, oColorIdx, 
  semantics, performHardReset, startingPlayer, setIsTargetScoreEnabled, 
  resetGameForMode, setOverallWinner, setShowWinnerModal 
}: any) {
  return (
    <AnimatePresence>
      {show && overallWinner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/15 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.8, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 10 }} style={{ color: semantics.text }} className="w-full max-w-[280px] flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-col items-center gap-1 z-10 w-full">
              <h2 className="font-nunito-black text-3xl tracking-tight leading-tight drop-shadow-md">Winner!</h2>
              <motion.span animate={{ scale: [1, 1.2, 0.9, 1] }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="drop-shadow-xl flex justify-center mt-2 mb-1">
                <DynamicIcon player={overallWinner} p1Custom={p1Custom} p1Idx={p1Idx} p2Custom={p2Custom} p2Idx={p2Idx} color={overallWinner === 'X' ? PLAYER_COLORS[xColorIdx] : PLAYER_COLORS[oColorIdx]} className="w-16 h-16" />
              </motion.span>
            </div>
            
            <div className="flex flex-col w-full gap-2.5 pt-1 z-10">
              <button onClick={() => performHardReset(startingPlayer)} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none bg-black/10 backdrop-blur-md">
                Start a New Game
              </button>
              <button onClick={() => { setIsTargetScoreEnabled(false); resetGameForMode(startingPlayer); setOverallWinner(null); setShowWinnerModal(false); }} className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md select-none">
                Continue This Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
