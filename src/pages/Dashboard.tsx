import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuickAddTask } from '@/components/dashboard/QuickAddTask';
import { QuickAddProject } from '@/components/dashboard/QuickAddProject';
import { OpenTasksByCategory } from '@/components/dashboard/OpenTasksByCategory';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { useTasks } from '@/contexts/TaskContext';
import { useGuidedTour, StartTourButton } from '@/components/onboarding/GuidedTour';
import { 
  CheckSquare, 
  AlertTriangle, 
  MessageSquare,
  Plus,
  X,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Zap,
  Target,
  Flame,
  Trophy,
  Star,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { startTour } = useGuidedTour();
  const [showTourPrompt, setShowTourPrompt] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('pmtaskos_tour_completed');
    const hasShownTourPrompt = localStorage.getItem('pmtaskos_tour_prompt_shown');
    if (!tourCompleted && !hasShownTourPrompt) {
      setShowTourPrompt(true);
      localStorage.setItem('pmtaskos_tour_prompt_shown', 'true');
    }
  }, []);

  const openTasks = tasks.filter(t => t.status === 'open');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const blockers = openTasks.filter(t => t.category === 'blocker');
  const followUps = openTasks.filter(t => t.category === 'follow_up');
  const actionItems = openTasks.filter(t => t.category === 'action_item');

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const streak = 5;

  const firstName = user?.name.split(' ')[0] || 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStartTour = () => {
    setShowTourPrompt(false);
    startTour();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Tour Prompt */}
        <AnimatePresence>
          {showTourPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="relative bg-gradient-to-r from-primary/15 via-category-followup/10 to-primary/15 border border-primary/30 rounded-xl p-5 overflow-hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8"
                onClick={() => setShowTourPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">New to PM Task OS?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Take a 30-second tour to learn how AI helps you extract tasks from notes.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={handleStartTour} className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Start Tour
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowTourPrompt(false)}>
                      Skip for now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-category-followup/5 to-category-meeting/5 border border-border rounded-2xl p-6 md:p-8"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">👋</span>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {getGreeting()}, {firstName}!
                </h1>
              </div>
              <p className="text-muted-foreground">
                You have <span className="font-semibold text-foreground">{openTasks.length} open tasks</span> today.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Streak */}
              <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm border border-border rounded-xl px-5 py-3">
                <div className="flex items-center gap-1.5 text-warning">
                  <Flame className="h-4 w-4" />
                  <span className="text-xl font-bold">{streak}</span>
                </div>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>

              {/* Quick Actions */}
              <QuickAddProject />
              <QuickAddTask />
            </div>
          </div>
        </motion.div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatCard
              label="Open Tasks"
              value={openTasks.length}
              icon={<ClipboardList className="h-5 w-5" />}
              accentColor="bg-primary-light text-primary"
              onClick={() => navigate('/tasks')}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard
              label="Action Items"
              value={actionItems.length}
              icon={<CheckSquare className="h-5 w-5" />}
              accentColor="bg-success-light text-success"
              onClick={() => navigate('/tasks?category=action_item')}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard
              label="Follow-ups"
              value={followUps.length}
              icon={<MessageSquare className="h-5 w-5" />}
              accentColor="bg-category-followup-light text-category-followup"
              onClick={() => navigate('/tasks?category=follow_up')}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard
              label="Blockers"
              value={blockers.length}
              icon={<AlertTriangle className="h-5 w-5" />}
              accentColor="bg-category-blocker-light text-category-blocker"
              onClick={() => navigate('/tasks?category=blocker')}
            />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-semibold">Today's Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className={cn("h-4 w-4", completionRate >= 50 ? "text-warning" : "text-muted")} />
              <span className="text-xl font-bold">{completionRate}%</span>
            </div>
          </div>
          <Progress value={completionRate} className="h-2.5 mb-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedTasks.length} of {totalTasks} completed
            </span>
            {completionRate >= 80 && (
              <span className="flex items-center gap-1 text-success font-medium">
                <Star className="h-3.5 w-3.5 fill-current" />
                Crushing it!
              </span>
            )}
          </div>
        </motion.div>

        {/* Open Tasks by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Open Tasks</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
              View all →
            </Button>
          </div>
          <OpenTasksByCategory />
        </motion.div>
      </div>
    </AppLayout>
  );
}
