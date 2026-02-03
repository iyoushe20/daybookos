import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Logo({ className = '', size = 'default' }: { className?: string; size?: 'default' | 'large' }) {
  const sizeClasses = size === 'large' ? 'h-10' : 'h-8';
  
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <motion.div 
        className={`${sizeClasses} aspect-square rounded-lg bg-gradient-to-br from-primary to-category-followup flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </motion.div>
      <span className="font-semibold text-foreground">
        PM Task OS
      </span>
    </Link>
  );
}
