import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useTasks, Task } from '@/contexts/TaskContext';
import { useProjects } from '@/contexts/ProjectContext';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  const { getProject } = useProjects();
  const project = getProject(task.projectId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 py-2 px-1 group"
    >
      <Checkbox
        checked={task.status === 'completed'}
        onClick={() => onToggle(task.id)}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {task.category === 'blocker' && (
          <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
        )}
        <span className="text-sm truncate">{task.text}</span>
      </div>
      {project && (
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0 hidden sm:inline">
          {project.name}
        </span>
      )}
    </motion.div>
  );
}

interface CategoryGroupProps {
  label: string;
  categoryId: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  accentClass?: string;
}

function CategoryGroup({ label, categoryId, tasks, onToggle, accentClass }: CategoryGroupProps) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CategoryBadge category={categoryId} label={label} />
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="divide-y divide-border/50">
        {tasks.map(task => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export function OpenTasksByCategory() {
  const navigate = useNavigate();
  const { tasks, toggleTaskStatus, categories } = useTasks();
  const openTasks = tasks.filter(t => t.status === 'open');

  const handleToggle = (taskId: string) => {
    toggleTaskStatus(taskId);
    toast.success('Task completed', {
      action: {
        label: 'Undo',
        onClick: () => toggleTaskStatus(taskId),
      },
    });
  };

  // Group tasks by category
  const tasksByCategory = categories
    .map(cat => ({
      ...cat,
      tasks: openTasks.filter(t => t.category === cat.id),
    }))
    .filter(group => group.tasks.length > 0);

  if (openTasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No open tasks. You're all caught up! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tasksByCategory.map(group => (
        <CategoryGroup
          key={group.id}
          label={group.label}
          categoryId={group.id}
          tasks={group.tasks}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
