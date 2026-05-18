: (
            <>
              Player{' '}
              <motion.span 
                key={isXNext ? 'X' : 'O'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: 1
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.2 }
                }}
                className={`inline-block font-black text-2xl px-1 ${isXNext ? 'text-mark-x' : 'text-mark-o'}`}
              >
                {isXNext ? 'X' : 'O'}
              </motion.span>
              's turn
            </>
          )}
        </motion.div>
      </header>

      {/* Main Game Container */}
      <div className="relative group">
        {/* The Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-surface-variant p-6 rounded-[40px] shadow-2xl border border-outline/30 backdrop-blur-md"
        >
          {/* The Grid */}
          <div 
            ref={boardRef} 
            className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 relative z-10 w-[280px] sm:w-[340px] aspect-square"
          >
            {board.map((value, i) => {
              const isWinningCell = winnerInfo?.line.includes(i);
              return (
                <button
                  key={i}
                  id={`cell-${i}`}
                  onClick={() => handleClick(i)}
                  className={`
                    w-full h-full bg-cell-bg rounded-[24px] flex items-center justify-center
                    transition-all duration-300 relative overflow-hidden border-2 border-transparent
                    ${!value && !winnerInfo ? 'hover:bg-on-surface-variant/10 cursor-pointer active:scale-90' : 'cursor-default'}
                    ${isWinningCell ? 'bg-success-container/60 shadow-inner border-mark-o/30' : 'shadow-sm'}
                  `}
                  disabled={!!value || !!winnerInfo}
                >
                  <AnimatePresence mode="wait">
                    {value === 'X' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M18 6L6 18M6 6L18 18" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-mark-x"
                          />
                        </svg>
                      </motion.div>
                    )}
                    {value === 'O' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle 
                            cx="12" cy="12" r="9" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            className="text-mark-o"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Winning Line SVG Overlay - Inside the Grid for perfect alignment */}
            {linePoints && (
              <svg 
                className="absolute inset-0 pointer-events-none z-20 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  x1={`${linePoints.start.x}%`}
                  y1={`${linePoints.start.y}%`}
                  x2={`${linePoints.end.x}%`}
                  y2={`${linePoints.end.y}%`}
                  stroke="var(--win-stroke)" 
                  strokeWidth="4"
                  strokeLinecap="round"
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square bg-mark-o/20 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
      </div>
    </div>
  );
}
