
export default function AILogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" className="drop-shadow-sm shrink-0">
      <defs>
        <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3B30" />    
          <stop offset="25%" stopColor="#FF9500" />   
          <stop offset="50%" stopColor="#4CD964" />   
          <stop offset="75%" stopColor="#5AC8FA" />   
          <stop offset="100%" stopColor="#007AFF" />  
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ai-grad)" strokeWidth="12" />
      <text x="50" y="68" fontFamily="NunitoCustom, sans-serif" fontWeight="900" fontSize="48" fill="url(#ai-grad)" textAnchor="middle">Ai</text>
    </svg>
  );
}
