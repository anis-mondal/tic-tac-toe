import { motion, AnimatePresence } from 'motion/react';
import { 
  X as CloseIcon, Info, Moon, Target, Check, Settings,
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, Target as TargetIcon, Shield, Zap,
  Dna, Star, Heart, Infinity as InfinityIcon, Puzzle, Sparkles as SparkleIcon, Gem, Crown, Trophy, Ghost,
  Leaf, Flame, Droplet, Flower2, Snowflake, Feather, Sun as SunIcon, Moon as MoonIcon, Cloud, Wind,
  Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail,
  Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5,
  Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer,
  Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck,
  Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage,
  Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor,
  Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid,
  Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer,
  Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets,
  ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt,
  Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard,
  Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper,
  Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, 
  Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, 
  Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, 
  IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, 
  BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
} from 'lucide-react';

// ==========================================
// গেমের সমস্ত ডেটা (কালার, থিম, আইকন)
// ==========================================
export const ICONS_LIST = [
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, TargetIcon, Shield, Zap,
  Dna, Star, Heart, InfinityIcon, Puzzle, SparkleIcon, Gem, Crown, Trophy, Ghost,
  Leaf, Flame, Droplet, Flower2, Snowflake, Feather, SunIcon, MoonIcon, Cloud, Wind,
  Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail,
  Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5,
  Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer,
  Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck,
  Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage,
  Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor,
  Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid,
  Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer,
  Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets,
  ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt,
  Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard,
  Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper,
  Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, 
  Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, 
  Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, 
  IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, 
  BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
];

export const PLAYER_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#78dd77', '#9fd75c', '#c1d02d', '#fabd00', '#ffb86e', 
  '#feb4a7', '#ffb3c0', '#fcaaff', '#b9c3ff', '#62d3ff'
];

export const EXTRA_LINE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#06b6d4', 
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#64748b',
  '#78dd77', '#9fd75c', '#c1d02d', '#fabd00', '#ffb86e', 
  '#feb4a7', '#ffb3c0', '#fcaaff', '#b9c3ff', '#62d3ff'
];

export const ORIGINAL_THEME = {
  name: 'Classic', light: '#f8f9fa', dark: '#000000', gridLight: '#e2e8f0', gridDark: '#1a1c1e', cellLight: '#ffffff', cellDark: '#2a2d31', indicatorLight: '#64748b', indicatorDark: '#94a3b8', linesLight: ['#22c55e', '#16a34a', '#15803d', '#10b981', '#059669'], linesDark: ['#22c55e', '#4ade80', '#86efac', '#34d399', '#6ee7b7']
};

export const CUSTOM_THEMES = [
  { name: 'Dynamic M3', light: '#fdf8fd', dark: '#141218', gridLight: '#e8def8', gridDark: '#2b2930', cellLight: '#ffffff', cellDark: '#36343b', indicatorLight: '#6750a4', indicatorDark: '#d0bcff', linesLight: ['#6750a4', '#b3261e', '#9c4146', '#316934', '#006a6a'], linesDark: ['#d0bcff', '#f2b8b5', '#ffb4ab', '#82c986', '#4cdada'] },
  { name: 'M3 Blue', light: '#eff6ff', dark: '#040b17', gridLight: '#bfdbfe', gridDark: '#0a1229', cellLight: '#ffffff', cellDark: '#121e38', indicatorLight: '#2563eb', indicatorDark: '#3b82f6', linesLight: ['#1e3a8a', '#1d4ed8', '#0891b2', '#4f46e5', '#3b82f6'], linesDark: ['#60a5fa', '#93c5fd', '#3b82f6', '#818cf8', '#7dd3fc'] },
  { name: 'M3 Emerald', light: '#ecfdf5', dark: '#020f0a', gridLight: '#a7f3d0', gridDark: '#052115', cellLight: '#ffffff', cellDark: '#0a3321', indicatorLight: '#16a34a', indicatorDark: '#22c55e', linesLight: ['#166534', '#059669', '#15803d', '#10b981', '#16a34a'], linesDark: ['#4ade80', '#22c55e', '#34d399', '#86efac', '#8dd999'] },
  { name: 'M3 Purple', light: '#f5f3ff', dark: '#0b0412', gridLight: '#d8b4fe', gridDark: '#160826', cellLight: '#ffffff', cellDark: '#200e33', indicatorLight: '#9333ea', indicatorDark: '#a855f7', linesLight: ['#7e22ce', '#9333ea', '#a855f7', '#c026d3', '#db2777'], linesDark: ['#c084fc', '#d8b4fe', '#e879f9', '#f472b6', '#fb7185'] },
  { name: 'M3 Orange', light: '#fff7ed', dark: '#120701', gridLight: '#fdba74', gridDark: '#240d02', cellLight: '#ffffff', cellDark: '#331304', indicatorLight: '#ea580c', indicatorDark: '#f97316', linesLight: ['#c2410c', '#ea580c', '#d97706', '#dc2626', '#b45309'], linesDark: ['#fb923c', '#fcd34d', '#fca5a5', '#f87171', '#fdba74'] },
  { name: 'M3 Rose', light: '#fff1f2', dark: '#140306', gridLight: '#fecdd3', gridDark: '#2e0a13', cellLight: '#ffffff', cellDark: '#400e1c', indicatorLight: '#e11d48', indicatorDark: '#f43f5e', linesLight: ['#be123c', '#e11d48', '#9f1239', '#db2777', '#f43f5e'], linesDark: ['#fb7185', '#fda4af', '#fecdd3', '#fbcfe8', '#f9a8d4'] },
  { name: 'M3 Cyan', light: '#ecfeff', dark: '#020d12', gridLight: '#67e8f9', gridDark: '#051f2b', cellLight: '#ffffff', cellDark: '#093142', indicatorLight: '#0891b2', indicatorDark: '#06b6d4', linesLight: ['#0e7490', '#0891b2', '#0369a1', '#0f766e', '#115e59'], linesDark: ['#4cdada', '#67e8f9', '#7dd3fc', '#5eead4', '#99f6e4'] },
  { name: 'M3 Amber', light: '#fffbeb', dark: '#140b01', gridLight: '#fde047', gridDark: '#291702', cellLight: '#ffffff', cellDark: '#3d2304', indicatorLight: '#d97706', indicatorDark: '#f59e0b', linesLight: ['#ca8a04', '#d97706', '#b45309', '#a16207', '#ea580c'], linesDark: ['#f59e0b', '#fbbf24', '#fcd34d', '#fdba74', '#fde047'] },
  { name: 'M3 Crimson', light: '#fef2f2', dark: '#140303', gridLight: '#fca5a5', gridDark: '#290707', cellLight: '#ffffff', cellDark: '#400c0c', indicatorLight: '#dc2626', indicatorDark: '#ef4444', linesLight: ['#b91c1c', '#dc2626', '#991b1b', '#7f1d1d', '#e11d48'], linesDark: ['#ef4444', '#f87171', '#fca5a5', '#fb7185', '#f87171'] },
  { name: 'M3 Indigo', light: '#eef2ff', dark: '#050512', gridLight: '#c7d2fe', gridDark: '#0e0c29', cellLight: '#ffffff', cellDark: '#161340', indicatorLight: '#4f46e5', indicatorDark: '#6366f1', linesLight: ['#4338ca', '#4f46e5', '#3730a3', '#312e81', '#1e3a8a'], linesDark: ['#6366f1', '#818cf8', '#a5b4fc', '#93c5fd', '#bfdbfe'] },
  { name: 'M3 Mint', light: '#f0fdfa', dark: '#01120f', gridLight: '#99f6e4', gridDark: '#03241d', cellLight: '#ffffff', cellDark: '#06362c', indicatorLight: '#0d9488', indicatorDark: '#14b8a6', linesLight: ['#0f766e', '#0d9488', '#0b1d1d', '#14532d', '#065f46'], linesDark: ['#6ab5ab', '#84c9bf', '#a0c7bb', '#8cc4a8', '#7bb89d'] },
  { name: 'M3 Pink', light: '#fdf2f8', dark: '#170312', gridLight: '#fbcfe8', gridDark: '#330a28', cellLight: '#ffffff', cellDark: '#4a0f3a', indicatorLight: '#ec4899', indicatorDark: '#f472b6', linesLight: ['#db2777', '#ec4899', '#f472b6', '#be185d', '#9d174d'], linesDark: ['#f472b6', '#f9a8d4', '#ec4899', '#fbcfe8', '#db2777'] },
  { name: 'M3 Yellow', light: '#fefce8', dark: '#141000', gridLight: '#fef08a', gridDark: '#332800', cellLight: '#ffffff', cellDark: '#4a3a00', indicatorLight: '#eab308', indicatorDark: '#facc15', linesLight: ['#ca8a04', '#eab308', '#facc15', '#a16207', '#854d0e'], linesDark: ['#facc15', '#fef08a', '#eab308', '#fef9c3', '#ca8a04'] },
  { name: 'M3 Lime', light: '#f7fee7', dark: '#0f1402', gridLight: '#d9f99d', gridDark: '#1d2905', cellLight: '#ffffff', cellDark: '#2a3b07', indicatorLight: '#84cc16', indicatorDark: '#a3e635', linesLight: ['#65a30d', '#84cc16', '#a3e635', '#4d7c0f', '#3f6212'], linesDark: ['#a3e635', '#d9f99d', '#84cc16', '#ecfccb', '#65a30d'] },
  { name: 'M3 Teal', light: '#f0fdfa', dark: '#041414', gridLight: '#ccfbf1', gridDark: '#0f3333', cellLight: '#ffffff', cellDark: '#144040', indicatorLight: '#14b8a6', indicatorDark: '#2dd4bf', linesLight: ['#0d9488', '#14b8a6', '#2dd4bf', '#0f766e', '#115e59'], linesDark: ['#2dd4bf', '#99f6e4', '#14b8a6', '#ccfbf1', '#0d9488'] },
  { name: 'Custom Pastel Green', light: '#f8fbf8', dark: '#081208', gridLight: '#e4f5e4', gridDark: '#162e16', cellLight: '#ffffff', cellDark: '#1a381a', indicatorLight: '#78dd77', indicatorDark: '#78dd77', linesLight: ['#78dd77', '#5ec85d', '#45b445', '#2a9b2a', '#148214'], linesDark: ['#78dd77', '#93f592', '#b2ffb2', '#ccffcc', '#e5ffe5'] },
  { name: 'Custom Light Green', light: '#f8fdf2', dark: '#0d1405', gridLight: '#eef8dc', gridDark: '#223812', cellLight: '#ffffff', cellDark: '#284215', indicatorLight: '#9fd75c', indicatorDark: '#9fd75c', linesLight: ['#9fd75c', '#85c242', '#6ba829', '#529111', '#3b7800'], linesDark: ['#9fd75c', '#bbf276', '#d6ff94', '#eaffb2', '#f6ffcf'] },
  { name: 'Custom Lime Yellow', light: '#fcfee6', dark: '#161a02', gridLight: '#f4facb', gridDark: '#36400a', cellLight: '#ffffff', cellDark: '#404d0c', indicatorLight: '#c1d02d', indicatorDark: '#c1d02d', linesLight: ['#c1d02d', '#a8b515', '#8f9c00', '#778200', '#5e6b00'], linesDark: ['#c1d02d', '#dbe84a', '#f5ff6b', '#ffff8c', '#ffffa8'] },
  { name: 'Custom Bright Amber', light: '#fffaf0', dark: '#1f1600', gridLight: '#ffefc2', gridDark: '#4d3700', cellLight: '#ffffff', cellDark: '#594000', indicatorLight: '#fabd00', indicatorDark: '#fabd00', linesLight: ['#fabd00', '#e0a300', '#c78a00', '#ad7200', '#945c00'], linesDark: ['#fabd00', '#ffdb33', '#fff466', '#ffff99', '#ffffcc'] },
  { name: 'Custom Peach', light: '#fff8f2', dark: '#1f150a', gridLight: '#ffe6cd', gridDark: '#4d3319', cellLight: '#ffffff', cellDark: '#593c1d', indicatorLight: '#ffb86e', indicatorDark: '#ffb86e', linesLight: ['#ffb86e', '#e69e55', '#cc853d', '#b36d26', '#995611'], linesDark: ['#ffb86e', '#ffd28a', '#ffecab', '#ffffcc', '#ffffe5'] },
  { name: 'Custom Salmon', light: '#fff7f5', dark: '#1f1311', gridLight: '#ffdfd9', gridDark: '#4d2d27', cellLight: '#ffffff', cellDark: '#59352e', indicatorLight: '#feb4a7', indicatorDark: '#feb4a7', linesLight: ['#feb4a7', '#e3998d', '#c97f74', '#b0675c', '#965045'], linesDark: ['#feb4a7', '#ffcec2', '#ffe9df', '#fffffc', '#ffffff'] },
  { name: 'Custom Pastel Pink', light: '#fff7f9', dark: '#1f1215', gridLight: '#ffe0e7', gridDark: '#4d2c33', cellLight: '#ffffff', cellDark: '#59333b', indicatorLight: '#ffb3c0', indicatorDark: '#ffb3c0', linesLight: ['#ffb3c0', '#e699a6', '#cc808d', '#b36875', '#99505e'], linesDark: ['#ffb3c0', '#ffd0db', '#ffecf2', '#ffffff', '#ffffff'] },
  { name: 'Custom Light Magenta', light: '#fff6ff', dark: '#1e0e1f', gridLight: '#feddfa', gridDark: '#4d234d', cellLight: '#ffffff', cellDark: '#592959', indicatorLight: '#fcaaff', indicatorDark: '#fcaaff', linesLight: ['#fcaaff', '#e18fe6', '#c676cd', '#ad5eb5', '#95469d'], linesDark: ['#fcaaff', '#ffc7ff', '#ffe4ff', '#ffffff', '#ffffff'] },
  { name: 'Custom Periwinkle', light: '#f7f8ff', dark: '#11131f', gridLight: '#e4e7ff', gridDark: '#2c334d', cellLight: '#ffffff', cellDark: '#343c59', indicatorLight: '#b9c3ff', indicatorDark: '#b9c3ff', linesLight: ['#b9c3ff', '#9ca7e6', '#808ccd', '#6571b5', '#4a589d'], linesDark: ['#b9c3ff', '#d6deff', '#f0f5ff', '#ffffff', '#ffffff'] },
  { name: 'Custom Sky Blue', light: '#f2fbff', dark: '#06171f', gridLight: '#d1f1ff', gridDark: '#12415c', cellLight: '#ffffff', cellDark: '#154c6b', indicatorLight: '#62d3ff', indicatorDark: '#62d3ff', linesLight: ['#62d3ff', '#45b8e6', '#2b9dcd', '#1084b5', '#006c9d'], linesDark: ['#62d3ff', '#82e8ff', '#a3fcff', '#c7ffff', '#e5ffff'] }
];

// ==========================================
// নতুন চমৎকার অ্যানিমেটেড টগল (Theme ভিত্তিক কালার)
// ==========================================
const AnimatedToggle = ({ enabled, onToggle, activeColor }: { enabled: boolean, onToggle: () => void, activeColor: string }) => {
  // টগল অফ থাকলে কালারটি হালকা/ঝাপসা হয়ে যাবে
  const offBgColor = `${activeColor}40`; // Hex কোডের শেষে 40 যোগ করলে এটি ট্রান্সপারেন্ট (ঝাপসা) হয়ে যায়
  
  return (
    <motion.button 
      onClick={onToggle}
      className="w-[52px] h-[30px] rounded-full p-1 flex items-center shrink-0 relative transition-colors duration-500"
      style={{ backgroundColor: enabled ? activeColor : offBgColor }}
    >
      <motion.div 
        animate={{ x: enabled ? 22 : 0 }} 
        className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center z-10"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {enabled 
          ? <Check className="w-3.5 h-3.5" style={{ color: activeColor }} strokeWidth={4} /> 
          : <CloseIcon className="w-3.5 h-3.5" style={{ color: activeColor }} strokeWidth={4} />
        }
      </motion.div>
    </motion.button>
  );
};

// ==========================================
// মূল সেটিংস মোডাল (এখানেই সব এডিট করা যাবে)
// ==========================================
interface SettingsModalProps {
  isOpen: boolean; onClose: () => void; setIsAboutOpen: (val: boolean) => void;
  semantics: any; isDarkMode: boolean; isAmoled: boolean; setIsAmoled: (val: boolean) => void;
  useDefaultTheme: boolean; setUseDefaultTheme: (val: boolean) => void;
  themeIdx: number; setThemeIdx: (val: number) => void;
  p1Custom: boolean; setP1Custom: (val: boolean) => void; p1Idx: number; setP1Idx: (val: number) => void;
  p2Custom: boolean; setP2Custom: (val: boolean) => void; p2Idx: number; setP2Idx: (val: number) => void;
  enableCustomLine: boolean; setEnableCustomLine: (val: boolean) => void; customLineIdx: number; setCustomLineIdx: (val: number) => void;
  enableCustomX: boolean; setEnableCustomX: (val: boolean) => void; xColorIdx: number; setXColorIdx: (val: number) => void;
  enableCustomO: boolean; setEnableCustomO: (val: boolean) => void; oColorIdx: number; setOColorIdx: (val: number) => void;
  isTargetScoreEnabled: boolean; setIsTargetScoreEnabled: (val: boolean) => void; setUserWantsTargetScore: (val: boolean) => void;
  targetScore: number; setTargetScore: any; maxScore: number;
  activeLineColor: string; currentXColor: string; currentOColor: string;
  hapticFeedback: (pattern: number | number[]) => void;
}

export default function SettingsModal(props: SettingsModalProps) {
  const { availableLinesDark, availableLinesLight } = {
    availableLinesDark: [...(props.useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[props.themeIdx]).linesDark, ...EXTRA_LINE_COLORS],
    availableLinesLight: [...(props.useDefaultTheme ? ORIGINAL_THEME : CUSTOM_THEMES[props.themeIdx]).linesLight, ...EXTRA_LINE_COLORS]
  };

  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div onClick={props.onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} style={{ backgroundColor: props.semantics.screenBackground, color: props.semantics.text }} className="w-full max-w-[420px] pt-6 pb-4 rounded-[36px] shadow-2xl relative border-[4px] border-black/10 dark:border-white/10 transition-colors duration-1000">
            
            <button onClick={props.onClose} className="absolute top-5 right-5 p-2 transition-opacity hover:opacity-70 z-[160] bg-black/5 dark:bg-white/5 rounded-full">
              <CloseIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-5 px-6">
              <Settings className="w-6 h-6 opacity-80" />
              <h2 className="font-nunito-black text-3xl tracking-tight">Settings</h2>
            </div>

            {/* রাউন্ডেড অদৃশ্য স্ক্রল বক্স (স্ক্রলবার বাইরে থাকবে) */}
            <div className="relative w-full overflow-hidden">
              <div className="space-y-4 max-h-[65vh] overflow-y-auto px-6 pr-4 m3-scrollbar pb-6">
                
                {/* Theme Style */}
                <div className="rounded-[24px] p-5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
                   <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black">Theme Style</h3>
                   <div className="relative flex p-1.5 rounded-full w-full bg-black/10 dark:bg-white/10 shadow-inner">
                      <motion.div 
                          className="absolute top-1.5 bottom-1.5 rounded-full shadow-sm"
                          style={{ width: 'calc(50% - 6px)', backgroundColor: props.activeLineColor }}
                          animate={{ x: props.useDefaultTheme ? 0 : '100%' }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                      <button onClick={() => { props.hapticFeedback(20); props.setUseDefaultTheme(true); }} className="flex-1 py-2.5 z-10 text-[13px] font-black uppercase tracking-wider transition-colors" style={{ color: props.useDefaultTheme ? '#fff' : props.semantics.text }}>Classic</button>
                      <button onClick={() => { props.hapticFeedback(20); props.setUseDefaultTheme(false); }} className="flex-1 py-2.5 z-10 text-[13px] font-black uppercase tracking-wider transition-colors" style={{ color: !props.useDefaultTheme ? '#fff' : props.semantics.text }}>Custom (M3)</button>
                   </div>
                </div>

                {/* M3 Custom Themes List */}
                {!props.useDefaultTheme && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-[24px] p-5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mb-4">Surface Colors</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {CUSTOM_THEMES.map((theme, idx) => (
                        <button key={theme.name} onClick={() => { props.hapticFeedback(20); props.setThemeIdx(idx); props.setCustomLineIdx(0); }} style={{ backgroundColor: props.isDarkMode ? theme.indicatorDark : theme.indicatorLight, borderColor: props.themeIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 mx-auto rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-105" aria-label={`Theme ${theme.name}`}>
                          {props.themeIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Pure Black AMOLED */}
                <AnimatePresence>
                  {props.isDarkMode && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="flex items-center justify-between rounded-[24px] p-5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                               <Moon className="w-5 h-5 opacity-70" />
                               <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Pure Black (AMOLED)</h3>
                            </div>
                            <AnimatedToggle enabled={props.isAmoled} onToggle={() => { props.hapticFeedback(30); props.setIsAmoled(!props.isAmoled); }} activeColor={props.activeLineColor} />
                        </div>
                     </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Target Point Win */}
                <div className="rounded-[24px] p-5 space-y-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Target className="w-5 h-5 opacity-70" />
                         <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1">Target Point Win</h3>
                      </div>
                      <AnimatedToggle enabled={props.isTargetScoreEnabled} onToggle={() => { props.hapticFeedback(30); props.setIsTargetScoreEnabled(!props.isTargetScoreEnabled); props.setUserWantsTargetScore(!props.isTargetScoreEnabled); }} activeColor={props.activeLineColor} />
                   </div>
                   <AnimatePresence>
                   {props.isTargetScoreEnabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-4 overflow-hidden pt-1">
                         <span className="text-[13px] opacity-80 font-black uppercase tracking-wider">Points to Win:</span>
                         <div className="flex gap-2.5 items-center bg-transparent/10 p-1 rounded-xl">
                            <button onClick={() => { props.hapticFeedback(20); props.setTargetScore((s: number) => Math.max(Math.max(1, props.maxScore), s-1)); }} disabled={props.targetScore <= Math.max(1, props.maxScore)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/20 transition-colors">-</button>
                            <span className="text-xl font-black w-8 text-center">{props.targetScore}</span>
                            <button onClick={() => { props.hapticFeedback(20); props.setTargetScore((s: number) => Math.min(20, s+1)); }} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg font-black hover:bg-black/10 dark:hover:bg-white/20 transition-colors">+</button>
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>
                </div>
                
                {/* Custom Winning Line Color */}
                <div className="rounded-[24px] p-5 space-y-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                   <div className="flex items-start justify-between">
                      <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Winning Line Color</h3>
                      <AnimatedToggle enabled={props.enableCustomLine} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomLine(!props.enableCustomLine); }} activeColor={props.activeLineColor} />
                   </div>
                   <AnimatePresence>
                   {props.enableCustomLine && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                         <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto m3-scrollbar pr-1 pb-1">
                            {(props.isDarkMode ? availableLinesDark : availableLinesLight).map((color, idx) => (
                              <button key={`line-${idx}`} onClick={() => { props.hapticFeedback(20); props.setCustomLineIdx(idx); }} style={{ backgroundColor: color, borderColor: props.customLineIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 mx-auto rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-105">
                                {props.customLineIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                              </button>
                            ))}
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>
                </div>

                {/* Custom Player X Box */}
                <div className="rounded-[24px] p-5 space-y-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                   <div className="flex items-start justify-between">
                      <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player X Color</h3>
                      <AnimatedToggle enabled={props.enableCustomX} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomX(!props.enableCustomX); }} activeColor={props.currentXColor} />
                   </div>
                   <AnimatePresence>
                   {props.enableCustomX && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                         <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto m3-scrollbar pr-1 pb-1">
                            {PLAYER_COLORS.map((color, idx) => (
                              <button key={`x-col-${idx}`} onClick={() => { props.hapticFeedback(20); props.setXColorIdx(idx); }} style={{ backgroundColor: color, borderColor: props.xColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 mx-auto rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-105">
                                 {props.xColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                              </button>
                            ))}
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>

                   <div className="flex items-start justify-between pt-2 border-t border-black/10 dark:border-white/10">
                      <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-3 leading-snug w-3/5">Custom Player X Shape</h3>
                      <div className="mt-2"><AnimatedToggle enabled={props.p1Custom} onToggle={() => { props.hapticFeedback(30); props.setP1Custom(!props.p1Custom); }} activeColor={props.currentXColor} /></div>
                   </div>
                   <AnimatePresence>
                   {props.p1Custom && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                         <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto m3-scrollbar pr-1 pb-1">
                            {ICONS_LIST.map((IconComponent, idx) => (
                               <button key={idx} onClick={() => { props.hapticFeedback(20); props.setP1Idx(idx); }} className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p1Idx === idx ? 'bg-black/10 dark:bg-white/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p1Idx === idx ? props.currentXColor : 'transparent' }}>
                                  <IconComponent className="w-6 h-6" color={props.currentXColor} fill={props.currentXColor} strokeWidth={2.5} />
                               </button>
                            ))}
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>
                </div>

                {/* Custom Player O Box */}
                <div className="rounded-[24px] p-5 space-y-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                   <div className="flex items-start justify-between">
                      <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-1 leading-snug w-3/5">Custom Player O Color</h3>
                      <AnimatedToggle enabled={props.enableCustomO} onToggle={() => { props.hapticFeedback(30); props.setEnableCustomO(!props.enableCustomO); }} activeColor={props.currentOColor} />
                   </div>
                   <AnimatePresence>
                   {props.enableCustomO && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                         <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto m3-scrollbar pr-1 pb-1">
                            {PLAYER_COLORS.map((color, idx) => (
                              <button key={`o-col-${idx}`} onClick={() => { props.hapticFeedback(20); props.setOColorIdx(idx); }} style={{ backgroundColor: color, borderColor: props.oColorIdx === idx ? (props.isDarkMode ? '#ffffff' : '#000000') : 'transparent' }} className="w-10 h-10 mx-auto rounded-full border-[3px] shadow-sm transition-transform active:scale-90 flex items-center justify-center hover:scale-105">
                                {props.oColorIdx === idx && <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />}
                              </button>
                            ))}
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>

                   <div className="flex items-start justify-between pt-2 border-t border-black/10 dark:border-white/10">
                      <h3 className="text-[12px] uppercase tracking-widest opacity-80 font-black mt-3 leading-snug w-3/5">Custom Player O Shape</h3>
                      <div className="mt-2"><AnimatedToggle enabled={props.p2Custom} onToggle={() => { props.hapticFeedback(30); props.setP2Custom(!props.p2Custom); }} activeColor={props.currentOColor} /></div>
                   </div>
                   <AnimatePresence>
                   {props.p2Custom && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                         <div className="grid grid-cols-5 gap-3 max-h-[220px] overflow-y-auto m3-scrollbar pr-1 pb-1">
                            {ICONS_LIST.map((IconComponent, idx) => (
                               <button key={idx} onClick={() => { props.hapticFeedback(20); props.setP2Idx(idx); }} className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center border-[2.5px] transition-colors ${props.p2Idx === idx ? 'bg-black/10 dark:bg-white/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} style={{ borderColor: props.p2Idx === idx ? props.currentOColor : 'transparent' }}>
                                  <IconComponent className="w-6 h-6" color={props.currentOColor} fill={props.currentOColor} strokeWidth={2.5} />
                               </button>
                            ))}
                         </div>
                      </motion.div>
                   )}
                   </AnimatePresence>
                </div>
                
                {/* About Game Button at Bottom */}
                <div className="pt-4 w-full">
                   <button onClick={() => { props.hapticFeedback(30); props.setIsAboutOpen(true); }} className="w-full py-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm">
                     <Info className="w-6 h-6" style={{ color: props.activeLineColor }} /> 
                     <span className="font-black uppercase tracking-wider text-lg mt-1" style={{ color: props.activeLineColor }}>About Game</span>
                   </button>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
