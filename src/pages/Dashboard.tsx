import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
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
  Sparkles
} from 'lucide-react';

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
  const blockers = tasks.filter(t => t.category === 'blocker' && t.status === 'open');
  const logsThisWeek = 3; // Demo value

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
              {/* Animated sparkle background */}
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

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {firstName}</p>
          </div>
          <StartTourButton variant="ghost" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Logs this week"
            value={logsThisWeek}
            icon={<FileText className="h-5 w-5" />}
            accentColor="bg-primary-light text-primary"
          />
          <StatCard
            label="Open tasks"
            value={openTasks.length}
            icon={<CheckSquare className="h-5 w-5" />}
            accentColor="bg-success-light text-success"
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            label="Blockers"
            value={blockers.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            accentColor="bg-category-blocker-light text-category-blocker"
            onClick={() => navigate('/tasks?category=blocker')}
          />
        </div>

        {/* Recent Logs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Logs</h2>
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
                className="bg-card border border-border rounded-xl p-4"
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
