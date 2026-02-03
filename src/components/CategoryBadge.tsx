import { cn } from '@/lib/utils';
import { TaskCategory } from '@/contexts/TaskContext';

interface CategoryBadgeProps {
  category: TaskCategory;
  className?: string;
}

const categoryConfig: Record<TaskCategory, { label: string; className: string }> = {
  action_item: { label: 'Action Item', className: 'badge-action' },
  follow_up: { label: 'Follow-up', className: 'badge-followup' },
  meeting: { label: 'Meeting', className: 'badge-meeting' },
  decision: { label: 'Decision', className: 'badge-decision' },
  writing: { label: 'Writing', className: 'badge-writing' },
  blocker: { label: 'Blocker', className: 'badge-blocker' },
  what_next: { label: 'What Next', className: 'badge-whatnext' },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
