import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Logo({ className = '', size = 'default' }: { className?: string; size?: 'default' | 'large' }) {
  const sizeClasses = size === 'large' ? 'h-10' : 'h-8';
  const iconSize = size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
  
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <motion.div 
        className={`${sizeClasses} aspect-square rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg relative overflow-hidden`}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
        
        {/* Book/daybook icon */}
        <svg 
          viewBox="0 0 24 24" 
          className={`${iconSize} text-primary-foreground relative z-10`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Open book with sun ray */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none" />
          <path d="M12 6v1" strokeWidth="1.5" />
          <path d="M15 10h-1" strokeWidth="1.5" />
          <path d="M12 13v1" strokeWidth="1.5" />
          <path d="M9 10h1" strokeWidth="1.5" />
        </svg>
      </motion.div>
      <motion.span 
        className="font-bold text-foreground tracking-tight"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Daybook</span>
      </motion.span>
    </Link>
  );
}