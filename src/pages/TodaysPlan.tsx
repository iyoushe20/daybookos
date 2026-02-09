import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { EmptyState } from '@/components/EmptyState';
import { AddCategoryDialog } from '@/components/AddCategoryDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTasks, Task, TaskCategory } from '@/contexts/TaskContext';
import { useProjects } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { 
  CheckSquare, 
  MessageSquare, 
  AlertTriangle,
  Lightbulb,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TodaysPlan() {
  const navigate = useNavigate();
  const { tasks, toggleTaskStatus, categories, deleteCategory } = useTasks();
  const { projects, getProject } = useProjects();
  const [showCompleted, setShowCompleted] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (projectFilter !== 'all' && task.projectId !== projectFilter) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });

  const openTasks = filteredTasks.filter(t => t.status === 'open');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const actionItems = openTasks.filter(t => t.category === 'action_item');
  const followUps = openTasks.filter(t => t.category === 'follow_up');
  const blockers = openTasks.filter(t => t.category === 'blocker');
  const decisions = openTasks.filter(t => t.category === 'decision');

  const mustDoToday = [...actionItems, ...followUps].filter(
    t => isToday(t.createdAt) || t.category === 'follow_up'
  );
  const blockersAndRisks = blockers;
  const otherTasks = openTasks.filter(
    t => !mustDoToday.includes(t) && !blockersAndRisks.includes(t)
  );

  function isToday(date: Date) {
    return new Date().toDateString() === new Date(date).toDateString();
  }

  function getRelativeDate(date: Date) {
    const now = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Created today';
    if (diffDays === 1) return 'Created yesterday';
    return `Created ${diffDays} days ago`;
  }

  function getBlockerAge(date: Date) {
    const now = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    return `Open for ${diffDays} days`;
  }

  const handleToggleTask = (taskId: string) => {
    toggleTaskStatus(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task?.status === 'open') {
      toast.success('Task completed', {
        action: {
          label: 'Undo',
          onClick: () => toggleTaskStatus(taskId),
        },
      });
    } else {
      toast.info('Task reopened');
    }
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const project = getProject(task.projectId);
    const isExpanded = expandedTask === task.id;
    const isBlocker = task.category === 'blocker';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={cn(
          "border border-border rounded-lg transition-all",
          isBlocker && "border-l-[3px] border-l-destructive",
          isExpanded && "ring-2 ring-primary"
        )}
      >
        <div
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.status === 'completed'}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleTask(task.id);
              }}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={cn(
                  "font-medium",
                  task.status === 'completed' && "line-through opacity-60"
                )}>
                  {isBlocker && <AlertTriangle className="h-4 w-4 text-destructive inline mr-2" />}
                  {task.text}
                </p>
                {project && (
                  <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground flex-shrink-0">
                    {project.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <CategoryBadge category={task.category} />
                {task.metadata?.person && <span>• To: {task.metadata.person}</span>}
                {task.metadata?.riskLevel && (
                  <span>• Risk: <span className="capitalize">{task.metadata.riskLevel}</span></span>
                )}
                <span>• {isBlocker ? getBlockerAge(task.createdAt) : getRelativeDate(task.createdAt)}</span>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-border mt-0 pt-4">
                {task.source && (
                  <p className="text-sm text-muted-foreground mb-3">
                    Source: "{task.source}"
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  From log: {format(task.createdAt, 'MMMM d, yyyy')}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View Log
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Today's Plan</h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button onClick={() => navigate('/logs/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Action Items"
            value={actionItems.length}
            icon={<CheckSquare className="h-5 w-5" />}
            accentColor="bg-category-action-light text-category-action"
            onClick={() => setCategoryFilter('action_item')}
            isActive={categoryFilter === 'action_item'}
          />
          <StatCard
            label="Follow-ups"
            value={followUps.length}
            icon={<MessageSquare className="h-5 w-5" />}
            accentColor="bg-category-followup-light text-category-followup"
            onClick={() => setCategoryFilter('follow_up')}
            isActive={categoryFilter === 'follow_up'}
          />
          <StatCard
            label="Blockers"
            value={blockers.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            accentColor="bg-category-blocker-light text-category-blocker"
            onClick={() => setCategoryFilter('blocker')}
            isActive={categoryFilter === 'blocker'}
          />
          <StatCard
            label="Decisions"
            value={decisions.length}
            icon={<Lightbulb className="h-5 w-5" />}
            accentColor="bg-category-decision-light text-category-decision"
            onClick={() => setCategoryFilter('decision')}
            isActive={categoryFilter === 'decision'}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{cat.label}</span>
                    {!cat.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (deleteCategory(cat.id)) {
                            toast.success(`Category "${cat.label}" deleted`);
                            if (categoryFilter === cat.id) {
                              setCategoryFilter('all');
                            }
                          }
                        }}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddCategoryDialog />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={showCompleted}
              onCheckedChange={(checked) => setShowCompleted(!!checked)}
            />
            Show Completed
          </label>
          {(projectFilter !== 'all' || categoryFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setProjectFilter('all');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Task Sections */}
        {openTasks.length === 0 && !showCompleted ? (
          <div className="border border-border rounded-xl">
            <EmptyState
              icon={<CheckSquare className="h-8 w-8 text-muted-foreground" />}
              title="No tasks for today"
              description="Create a daily log to get started."
              actionLabel="Create Log"
              onAction={() => navigate('/logs/new')}
            />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-8">
            {/* Must Do Today */}
            {mustDoToday.length > 0 && (
              <section>
                <h3 className="font-semibold mb-3">Must Do Today ({mustDoToday.length})</h3>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {mustDoToday.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Blockers & Risks */}
            {blockersAndRisks.length > 0 && (
              <section>
                <h3 className="font-semibold mb-3 text-destructive">
                  Blockers & Risks ({blockersAndRisks.length})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {blockersAndRisks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Other Tasks */}
            {otherTasks.length > 0 && (
              <section>
                <h3 className="font-semibold mb-3">Other Tasks ({otherTasks.length})</h3>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {otherTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Completed */}
            {showCompleted && completedTasks.length > 0 && (
              <section>
                <h3 className="font-semibold mb-3 text-muted-foreground">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {completedTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
