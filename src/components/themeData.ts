import { 
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

export const ICONS_LIST = [
  Hexagon, Octagon, Pentagon, Triangle, Square, Diamond, Asterisk, TargetIcon, Shield, Zap, Dna, Star, Heart, InfinityIcon, Puzzle, SparkleIcon, Gem, Crown, Trophy, Ghost, Leaf, Flame, Droplet, Flower2, Snowflake, Feather, SunIcon, MoonIcon, Cloud, Wind, Sprout, TreePine, Mountain, Bug, Cat, Dog, Bird, Fish, Rabbit, Snail, Anchor, Magnet, Umbrella, Coffee, Camera, Bell, Music, Gamepad2, Lightbulb, Dice5, Tent, Wand2, Atom, Orbit, Bomb, Key, Glasses, Clock, Hourglass, Timer, Rocket, Plane, Car, Ship, Bus, Train, Bike, Tractor, Sailboat, Truck, Compass, MapPin, Radar, LifeBuoy, Map, Navigation, Flag, Globe, Ticket, Luggage, Cpu, Database, Laptop, Smartphone, Watch, Headphones, Mic, Radio, Tv, Monitor, Smile, Skull, Bot, Eye, Fingerprint, Activity, Box, Layers, Aperture, Grid, Palette, PenTool, Brush, Scissors, Hammer, Wrench, Ruler, Drill, HardHat, Thermometer, Sunrise, Sunset, CloudRain, CloudSnow, CloudLightning, Tornado, Waves, Trees, Palmtree, Droplets, ShoppingCart, ShoppingBag, ShoppingBasket, Tag, Wallet, CreditCard, Banknote, Coins, PiggyBank, Receipt, Stethoscope, Syringe, TestTube, FlaskConical, Pill, Microscope, Telescope, Webcam, Film, Clapperboard, Megaphone, Speaker, Book, Bookmark, Briefcase, GraduationCap, Medal, Award, Gift, PartyPopper, Apple, Axe, Backpack, Banana, Battery, Bed, Binoculars, Bone, Brain, Cake, Calculator, Calendar, Candy, Carrot, Castle, Cherry, Church, Clover, Club, Cookie, Croissant, Crosshair, CupSoda, Drama, Drum, Dumbbell, Ear, Eclipse, Egg, Factory, Fan, FerrisWheel, Flashlight, Footprints, Guitar, IceCream, Keyboard, Origami, PaintBucket, Pizza, Popcorn, Rainbow, Satellite, Shirt, Swords, Turtle, AlarmClock, Ambulance, BaggageClaim, Beer, CarFront, ChefHat, Citrus, Grape, Lock, Joystick, MountainSnow, Wine, Nut, Rat, Squirrel, Caravan, Cylinder, Wheat, Sandwich
];

export let savedCustomColors: string[] = [];
try {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('userCustomColors');
    if (val) savedCustomColors = JSON.parse(val);
  }
} catch (e) {}

export const STATIC_COLORS_COUNT = 49;

export const PLAYER_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
  '#22c55e', '#65a30d', '#a16207', '#d97706', '#ea580c', '#e11d48', '#db2777', '#c026d3', '#6366f1', '#0284c7',
  '#6A5687', '#D5BBFA', '#895130', '#FFB68D', '#775B1A', '#FEDF9E', 
  '#61692D', '#DFE895', '#3C6942', '#9BD49F', '#1E6A60', '#9EF2E3', 
  '#23677A', '#B0EDFF', '#30436E', '#B0C6FF', '#413E6D', '#C4BFFF',
  '#8D4E45', '#5F2A24', '#FAAA9F', '#FFB1BE', '#72333E', '#FFD9DE',
  ...savedCustomColors 
];

export const EXTRA_LINE_COLORS = [...PLAYER_COLORS];

export const ORIGINAL_THEME = { name: 'Classic', light: '#f8f9fa', dark: '#000000', gridLight: '#e2e8f0', gridDark: '#1a1c1e', cellLight: '#ffffff', cellDark: '#2a2d31', indicatorLight: '#64748b', indicatorDark: '#94a3b8', linesLight: ['#22c55e', '#16a34a', '#15803d', '#10b981', '#059669'], linesDark: ['#22c55e', '#4ade80', '#86efac', '#34d399', '#6ee7b7'] };

export const STATIC_THEMES = [
  { name: 'M3 Custom Red', light: '#FFF1F0', dark: '#1A0F0E', gridLight: '#FAAA9F', gridDark: '#3A1915', cellLight: '#ffffff', cellDark: '#5F2A24', indicatorLight: '#8D4E45', indicatorDark: '#FFB1BE', linesLight: ['#8D4E45', '#5F2A24', '#785752', '#A36258', '#FAAA9F'], linesDark: ['#FFB1BE', '#FFD9DE', '#E5BCC0', '#E58593', '#72333E'] },
  { name: 'M3 Custom Purple', light: '#F8F4FF', dark: '#140D1C', gridLight: '#DDC4FD', gridDark: '#3C255B', cellLight: '#ffffff', cellDark: '#533C74', indicatorLight: '#6A5687', indicatorDark: '#D5BBFA', linesLight: ['#6A5687', '#4E3B68', '#7D516A', '#9F7AEA', '#FDC4E4'], linesDark: ['#D5BBFA', '#EDDCFF', '#FFD8E0', '#643B43', '#B794F4'] },
  { name: 'M3 Custom Orange', light: '#FEEAE1', dark: '#1F1005', gridLight: '#FCB38A', gridDark: '#381A0B', cellLight: '#ffffff', cellDark: '#6F3712', indicatorLight: '#895130', indicatorDark: '#FFB68D', linesLight: ['#895130', '#A66A42', '#C48355', '#FCB38A', '#E4BEA9'], linesDark: ['#FFB68D', '#FFCAAA', '#E4BEA9', '#D2A180', '#FCB38A'] },
  { name: 'M3 Custom Yellow', light: '#F8ECDE', dark: '#1A1405', gridLight: '#FAD688', gridDark: '#332600', cellLight: '#ffffff', cellDark: '#5B4400', indicatorLight: '#775B1A', indicatorDark: '#FEDF9E', linesLight: ['#775B1A', '#6C5D40', '#8F712A', '#A8883B', '#FAD688'], linesDark: ['#FEDF9E', '#E9C16C', '#D8C4A1', '#EED888', '#F5E499'] },
  { name: 'M3 Custom Chartreuse', light: '#F8FAE6', dark: '#171810', gridLight: '#E1E99E', gridDark: '#222502', cellLight: '#ffffff', cellDark: '#444B05', indicatorLight: '#61692D', indicatorDark: '#DFE895', linesLight: ['#61692D', '#64674A', '#4A5021', '#7A843C', '#E1E99E'], linesDark: ['#DFE895', '#C4CD7C', '#C8C9A7', '#B6C25B', '#444B05'] },
  { name: 'M3 Custom Green', light: '#EAF8EB', dark: '#0E170F', gridLight: '#BEF0BF', gridDark: '#0E2914', cellLight: '#ffffff', cellDark: '#1D5228', indicatorLight: '#3C6942', indicatorDark: '#9BD49F', linesLight: ['#3C6942', '#526351', '#284B2E', '#4F8857', '#BEF0BF'], linesDark: ['#9BD49F', '#B8CBB5', '#7BC481', '#1D5228', '#A2D9A6'] },
  { name: 'M3 Custom Teal', light: '#E2F9F5', dark: '#071715', gridLight: '#A9F0E2', gridDark: '#002823', cellLight: '#ffffff', cellDark: '#005047', indicatorLight: '#1E6A60', indicatorDark: '#9EF2E3', linesLight: ['#1E6A60', '#4B6460', '#134D45', '#2A8F82', '#A9F0E2'], linesDark: ['#9EF2E3', '#83D5C7', '#B1CCC7', '#6BD8C6', '#005047'] },
  { name: 'M3 Custom Cyan', light: '#E3F6FE', dark: '#0A161A', gridLight: '#A8E6FD', gridDark: '#002730', cellLight: '#ffffff', cellDark: '#014E60', indicatorLight: '#23677A', indicatorDark: '#B0EDFF', linesLight: ['#23677A', '#4B626A', '#164B59', '#3288A0', '#A8E6FD'], linesDark: ['#B0EDFF', '#87D1EA', '#B3C9D4', '#5BC1E3', '#014E60'] },
  { name: 'M3 Custom Blue', light: '#EAF0FF', dark: '#0E121A', gridLight: '#B7CBFE', gridDark: '#17223B', cellLight: '#ffffff', cellDark: '#2E4577', indicatorLight: '#30436E', indicatorDark: '#B0C6FF', linesLight: ['#30436E', '#4B5D8B', '#585F72', '#223254', '#B7CBFE'], linesDark: ['#B0C6FF', '#D9E2FF', '#BFC5DB', '#87A8FF', '#2E4577'] },
  { name: 'M3 Custom Indigo', light: '#EFEEFF', dark: '#12111A', gridLight: '#CBC6FF', gridDark: '#21203B', cellLight: '#ffffff', cellDark: '#434077', indicatorLight: '#413E6D', indicatorDark: '#C4BFFF', linesLight: ['#413E6D', '#5D598B', '#5F5D72', '#2C2A4F', '#CBC6FF'], linesDark: ['#C4BFFF', '#E3E0FF', '#C8C4DB', '#A299FF', '#434077'] },
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
  { name: 'M3 Yellow', light: '#fefce8', dark: '#141000', gridLight: '#fef08a', gridDark: '#332800', cellLight: '#ffffff', cellDark: '#4a3a00', indicatorLight: '#eab308', indicatorDark: '#facc15', linesLight: ['#ca8a04', '#eab308', '#facc15', '#fef08a', '#fef9c3'], linesDark: ['#facc15', '#fef08a', '#eab308', '#fef9c3', '#ca8a04'] },
  { name: 'M3 Lime', light: '#f7fee7', dark: '#0f1402', gridLight: '#d9f99d', gridDark: '#1d2905', cellLight: '#ffffff', cellDark: '#2a3b07', indicatorLight: '#84cc16', indicatorDark: '#a3e635', linesLight: ['#65a30d', '#84cc16', '#a3e635', '#4d7c0f', '#3f6212'], linesDark: ['#a3e635', '#d9f99d', '#84cc16', '#ecfccb', '#65a30d'] },
  { name: 'M3 Teal', light: '#f0fdfa', dark: '#041414', gridLight: '#ccfbf1', gridDark: '#0f3333', cellLight: '#ffffff', cellDark: '#144040', indicatorLight: '#14b8a6', indicatorDark: '#2dd4bf', linesLight: ['#0d9488', '#14b8a6', '#2dd4bf', '#0f766e', '#115e59'], linesDark: ['#2dd4bf', '#99f6e4', '#14b8a6', '#ccfbf1', '#0d9488'] },
  
  { name: 'Vibrant Green', light: '#f0fdf4', dark: '#022c22', gridLight: '#bbf7d0', gridDark: '#064e3b', cellLight: '#ffffff', cellDark: '#065f46', indicatorLight: '#22c55e', indicatorDark: '#4ade80', linesLight: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'], linesDark: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'] },
  { name: 'Vibrant Lime', light: '#fefce8', dark: '#422006', gridLight: '#fef08a', gridDark: '#713f12', cellLight: '#ffffff', cellDark: '#854d0e', indicatorLight: '#eab308', indicatorDark: '#fde047', linesLight: ['#ca8a04', '#eab308', '#facc15', '#fef08a', '#fef9c3'], linesDark: ['#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207'] },
  { name: 'Vibrant Amber', light: '#fffbeb', dark: '#451a03', gridLight: '#fde68a', gridDark: '#78350f', cellLight: '#ffffff', cellDark: '#92400e', indicatorLight: '#f59e0b', indicatorDark: '#fbbf24', linesLight: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'], linesDark: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'] },
  { name: 'Vibrant Orange', light: '#fff7ed', dark: '#431407', gridLight: '#fed7aa', gridDark: '#7c2d12', cellLight: '#ffffff', cellDark: '#9a3412', indicatorLight: '#ea580c', indicatorDark: '#fb923c', linesLight: ['#c2410c', '#ea580c', '#f97316', '#fdba74', '#fed7aa'], linesDark: ['#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'] },
  { name: 'Vibrant Coral', light: '#fff1f2', dark: '#4c0519', gridLight: '#fecdd3', gridDark: '#881337', cellLight: '#ffffff', cellDark: '#9f1239', indicatorLight: '#e11d48', indicatorDark: '#fb7185', linesLight: ['#be123c', '#e11d48', '#f43f5e', '#fda4af', '#fecdd3'], linesDark: ['#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239'] },
  { name: 'Vibrant Pink', light: '#fdf2f8', dark: '#500724', gridLight: '#fbcfe8', gridDark: '#831843', cellLight: '#ffffff', cellDark: '#9d174d', indicatorLight: '#db2777', indicatorDark: '#f472b6', linesLight: ['#be185d', '#db2777', '#ec4899', '#f9a8d4', '#fbcfe8'], linesDark: ['#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d'] },
  { name: 'Vibrant Fuchsia', light: '#faf5ff', dark: '#3b0764', gridLight: '#e9d5ff', gridDark: '#6b21a8', cellLight: '#ffffff', cellDark: '#86198f', indicatorLight: '#c026d3', indicatorDark: '#e879f9', linesLight: ['#a21caf', '#c026d3', '#d946ef', '#f0abfc', '#f5d0fe'], linesDark: ['#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f'] },
  { name: 'Vibrant Indigo', light: '#eef2ff', dark: '#1e1b4b', gridLight: '#c7d2fe', gridDark: '#312e81', cellLight: '#ffffff', cellDark: '#3730a3', indicatorLight: '#4f46e5', indicatorDark: '#818cf8', linesLight: ['#4338ca', '#4f46e5', '#6366f1', '#a5b4fc', '#c7d2fe'], linesDark: ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'] },
  { name: 'Vibrant Sky', light: '#f0f9ff', dark: '#082f49', gridLight: '#bae6fd', gridDark: '#0c4a6e', cellLight: '#ffffff', cellDark: '#075985', indicatorLight: '#0284c7', indicatorDark: '#38bdf8', linesLight: ['#0369a1', '#0284c7', '#0ea5e9', '#7dd3fc', '#bae6fd'], linesDark: ['#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985'] },
  { name: 'Vibrant Cyan', light: '#ecfeff', dark: '#083344', gridLight: '#a5f3fc', gridDark: '#164e63', cellLight: '#ffffff', cellDark: '#0c4a6e', indicatorLight: '#06b6d4', indicatorDark: '#22d3ee', linesLight: ['#0e7490', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'], linesDark: ['#22d3ee', '#06b6d4', '#0e7490', '#155e75', '#164e63'] }
];

export let savedAdaptiveThemes: any[] = [];
try {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('userAdaptiveThemes');
    if (val) savedAdaptiveThemes = JSON.parse(val);
  }
} catch (e) {}

export const CUSTOM_THEMES = [...STATIC_THEMES, ...savedAdaptiveThemes];
