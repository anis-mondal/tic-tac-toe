import { motion } from 'motion/react';
import { Info, X as CloseIcon } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <motion.div onClick={onClose} className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
       {/* মেইন ফাইলের About Modal কোড এখানে আনুন */}
    </motion.div>
  );
}

