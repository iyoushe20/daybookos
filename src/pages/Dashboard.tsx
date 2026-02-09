import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { useTasks } from '@/contexts/TaskContext';
import { useGuidedTour, StartTourButton } from '@/components/onboarding/GuidedTour';
import { 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  Plus,
  X,
  ArrowRight,
  Calendar,
  Lightbulb,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Flame,
  Trophy,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { startTour } = useGuidedTour();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTourPrompt, setShowTourPrompt] = useState(false);

  // Check if tour was completed
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
  const blockers = tasks.filter(t => t.category === 'blocker' && t.status === 'open');
  const logsThisWeek = 3;

  // Calculate streak and progress
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const streak = 5; // Demo value

  // Demo recent logs
  const recentLogs = [
    {
      id: 'log-1',
      date: new Date(),
      projectName: 'Payment Gateway Integration',
      itemsCount: 5,
      status: 'confirmed' as const,
    },
    {
      id: 'log-2',
      date: new Date(Date.now() - 86400000),
      projectName: 'User Authentication Redesign',
      itemsCount: 3,
      status: 'confirmed' as const,
    },
  ];

  const firstName = user?.name.split(' ')[0] || 'there';

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleStartTour = () => {
    setShowTourPrompt(false);
    startTour();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Tour Prompt */}
        <AnimatePresence>
          {showTourPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="relative bg-gradient-to-r from-primary/15 via-category-followup/10 to-primary/15 border border-primary/30 rounded-xl p-5 overflow-hidden"
            >
              <motion.div
                className="absolute top-2 right-20 text-primary/20"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              
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

        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && !showTourPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="relative bg-gradient-to-r from-primary/10 via-category-followup/10 to-primary/10 border border-primary/20 rounded-xl p-6"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8"
                onClick={() => setShowWelcome(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎉</div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    Welcome to PM Task OS, {firstName}!
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    You're all set. Start by logging your daily work.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => navigate('/logs/new')} className="gap-2">
                      Create Your First Log
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <StartTourButton variant="outline" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-category-followup/5 to-category-meeting/5 border border-border rounded-2xl p-8"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-category-followup/10 rounded-full blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-2"
              >
                <span className="text-4xl">👋</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {getGreeting()}, {firstName}!
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-lg"
              >
                You have <span className="font-semibold text-foreground">{openTasks.length} tasks</span> to tackle today. Let's make it count!
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="hidden md:flex items-center gap-4"
            >
              {/* Streak Counter */}
              <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm border border-border rounded-xl px-6 py-4">
                <div className="flex items-center gap-2 text-warning mb-1">
                  <Flame className="h-5 w-5" />
                  <span className="text-2xl font-bold">{streak}</span>
                </div>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>

              <Button onClick={() => navigate('/logs/new')} size="lg" className="gap-2 shadow-lg">
                <Zap className="h-5 w-5" />
                Quick Log
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2 bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Today's Progress</h3>
                  <p className="text-sm text-muted-foreground">Keep up the momentum!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className={cn("h-5 w-5", completionRate >= 50 ? "text-warning" : "text-muted")} />
                <span className="text-2xl font-bold">{completionRate}%</span>
              </div>
            </div>
            <Progress value={completionRate} className="h-3 mb-4" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completedTasks.length} of {totalTasks} tasks completed
              </span>
              {completionRate >= 80 && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-success font-medium"
                >
                  <Star className="h-4 w-4 fill-current" />
                  Crushing it!
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Quick Stats Mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-xl p-6 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <span className="text-3xl font-bold text-destructive">{blockers.length}</span>
                <p className="text-sm text-muted-foreground">Active Blockers</p>
              </div>
            </div>
            {blockers.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks?category=blocker')}
                className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Resolve now →
              </Button>
            )}
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard
              label="Logs this week"
              value={logsThisWeek}
              icon={<FileText className="h-5 w-5" />}
              accentColor="bg-primary-light text-primary"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard
              label="Open tasks"
              value={openTasks.length}
              icon={<CheckSquare className="h-5 w-5" />}
              accentColor="bg-success-light text-success"
              onClick={() => navigate('/tasks')}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard
              label="Completed"
              value={completedTasks.length}
              icon={<Trophy className="h-5 w-5" />}
              accentColor="bg-warning-light text-warning"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <StatCard
              label="Projects"
              value={projects.filter(p => p.status === 'active').length}
              icon={<TrendingUp className="h-5 w-5" />}
              accentColor="bg-category-followup-light text-category-followup"
              onClick={() => navigate('/settings/projects')}
            />
          </motion.div>
        </div>

        {/* Recent Logs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Recent Logs</h2>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                Last 7 days
              </span>
            </div>
            <Button onClick={() => navigate('/logs/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Log
            </Button>
          </div>

          {recentLogs.length === 0 ? (
            <div className="border border-border rounded-xl">
              <EmptyState
                icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                title="No logs yet"
                description="Start by creating your first daily log. It only takes a few minutes."
                actionLabel="Create Log"
                onAction={() => navigate('/logs/new')}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <Link
                    to={`/logs/${log.id}`}
                    className="block bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all hover:shadow-elevated"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.date)}
                        </div>
                        <span className="font-medium">{log.projectName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {log.itemsCount} items extracted
                        </span>
                        <StatusBadge status="completed" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              <Button variant="ghost" className="w-full" onClick={() => navigate('/logs')}>
                View all logs →
              </Button>
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Projects</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings/projects">Manage</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.filter(p => p.status === 'active').map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 hover:shadow-elevated transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {project.pod && <span>{project.pod}</span>}
                      {project.pod && project.quarter && <span>•</span>}
                      {project.quarter && <span>{project.quarter}</span>}
                    </div>
                  </div>
                  <StatusBadge status="open" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}