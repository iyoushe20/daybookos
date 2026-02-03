import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'open' | 'completed' | 'blocked' | 'draft' | 'final';
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: 'Open', className: 'badge-open' },
  completed: { label: 'Completed', className: 'badge-completed' },
  blocked: { label: 'Blocked', className: 'badge-blocked' },
  draft: { label: 'Draft', className: 'badge-draft' },
  final: { label: 'Final', className: 'badge-completed' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
