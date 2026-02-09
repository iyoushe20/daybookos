import { cn } from '@/lib/utils';
import { TaskCategory, DEFAULT_CATEGORIES } from '@/contexts/TaskContext';

interface CategoryBadgeProps {
  category: TaskCategory;
  label?: string;
  className?: string;
}

const defaultCategoryConfig: Record<string, { label: string; className: string }> = {
  action_item: { label: 'Action Item', className: 'badge-action' },
  follow_up: { label: 'Follow-up', className: 'badge-followup' },
  meeting: { label: 'Meeting', className: 'badge-meeting' },
  decision: { label: 'Decision', className: 'badge-decision' },
  writing: { label: 'Writing', className: 'badge-writing' },
  blocker: { label: 'Blocker', className: 'badge-blocker' },
  what_next: { label: 'What Next', className: 'badge-whatnext' },
};

// For custom categories, cycle through some nice colors
const customCategoryColors = [
  'bg-[hsl(var(--category-action-light))] text-[hsl(var(--category-action))]',
  'bg-[hsl(var(--category-followup-light))] text-[hsl(var(--category-followup))]',
  'bg-[hsl(var(--category-meeting-light))] text-[hsl(var(--category-meeting))]',
  'bg-[hsl(var(--category-decision-light))] text-[hsl(var(--category-decision))]',
  'bg-[hsl(var(--category-writing-light))] text-[hsl(var(--category-writing))]',
];

function getCustomCategoryColor(categoryId: string): string {
  // Simple hash function to get consistent color for a category
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = ((hash << 5) - hash) + categoryId.charCodeAt(i);
    hash = hash & hash;
  }
  return customCategoryColors[Math.abs(hash) % customCategoryColors.length];
}

export function CategoryBadge({ category, label, className }: CategoryBadgeProps) {
  const isDefault = (DEFAULT_CATEGORIES as readonly string[]).includes(category);
  const config = isDefault ? defaultCategoryConfig[category] : null;
  
  const displayLabel = label || config?.label || category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const colorClass = config?.className || getCustomCategoryColor(category);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        colorClass,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}