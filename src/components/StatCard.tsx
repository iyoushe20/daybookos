import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function StatCard({ label, value, icon, accentColor, onClick, isActive }: StatCardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={cn(
        "stat-card text-left w-full",
        onClick && "cursor-pointer",
        isActive && "ring-2 ring-primary"
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {icon && (
        <div 
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
            accentColor || "bg-primary-light text-primary"
          )}
        >
          {icon}
        </div>
      )}
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </Component>
  );
}
