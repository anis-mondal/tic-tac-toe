
import { Player } from '../types';
import { ICONS_LIST } from '../constants/themeData';

export default function DynamicIcon({ 
  player, p1Custom, p1Idx, p2Custom, p2Idx, color, className 
}: { 
  player: Player | null, p1Custom: boolean, p1Idx: number, p2Custom: boolean, p2Idx: number, color: string, className?: string 
}) {
  if (!player) return null;
  const isP1 = player === 'X';
  const isCustomEnabled = isP1 ? p1Custom : p2Custom;
  const iconIndex = isP1 ? p1Idx : p2Idx;

  if (isCustomEnabled) {
     const SelectedIcon = ICONS_LIST[iconIndex % ICONS_LIST.length];
     return <SelectedIcon color={color} fill={color} className={className} strokeWidth={2.5} />;
  }
  
  if (isP1) {
     return <svg viewBox="0 0 24 24" className={className} fill="none"><path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" className={className} fill="none"><circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="4.5" /></svg>;
}
