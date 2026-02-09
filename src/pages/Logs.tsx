import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { useProjects } from '@/contexts/ProjectContext';
import { 
  Plus,
  FileText,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Demo logs data
const DEMO_LOGS = [
  {
    id: 'log-1',
    date: new Date(),
    projectId: 'proj-2',
    projectName: 'Payment Gateway Integration',
    itemsCount: 5,
    status: 'confirmed' as const,
    summary: 'Reviewed API contracts with vendor, discussed pricing model changes',
  },
  {
    id: 'log-2',
    date: new Date(Date.now() - 86400000),
    projectId: 'proj-1',
    projectName: 'User Authentication Redesign',
    itemsCount: 3,
    status: 'confirmed' as const,
    summary: 'PRD review session with Raj, updated user flow diagrams',
  },
  {
    id: 'log-3',
    date: new Date(Date.now() - 2 * 86400000),
    projectId: 'proj-2',
    projectName: 'Payment Gateway Integration',
    itemsCount: 4,
    status: 'draft' as const,
    summary: 'Sprint planning, identified blockers for Q1 delivery',
  },
  {
    id: 'log-4',
    date: new Date(Date.now() - 3 * 86400000),
    projectId: 'proj-1',
    projectName: 'User Authentication Redesign',
    itemsCount: 6,
    status: 'confirmed' as const,
    summary: 'Stakeholder sync, finalized OAuth implementation approach',
  },
  {
    id: 'log-5',
    date: new Date(Date.now() - 5 * 86400000),
    projectId: 'proj-2',
    projectName: 'Payment Gateway Integration',
    itemsCount: 2,
    status: 'confirmed' as const,
    summary: 'Legal review meeting for vendor contract',
  },
];

export default function Logs() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredLogs = DEMO_LOGS.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = projectFilter === 'all' || log.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  // Group logs by date
  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const dateKey = formatDate(log.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
    return groups;
  }, {} as Record<string, typeof DEMO_LOGS>);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daily Logs</h1>
            <p className="text-muted-foreground">
              Your work history and extracted items
            </p>
          </div>
          <Button onClick={() => navigate('/logs/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Log
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="border border-border rounded-xl">
            <EmptyState
              icon={<FileText className="h-8 w-8 text-muted-foreground" />}
              title="No logs found"
              description={searchQuery || projectFilter !== 'all' 
                ? "Try adjusting your filters"
                : "Start by creating your first daily log"
              }
              actionLabel="Create Log"
              onAction={() => navigate('/logs/new')}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([dateKey, logs]) => (
              <div key={dateKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateKey}
                </h3>
                <div className="space-y-3">
                  {logs.map((log, index) => (
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
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{log.projectName}</span>
                              <StatusBadge status={log.status === 'confirmed' ? 'completed' : 'draft'} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {log.summary}
                            </p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                            {log.itemsCount} items
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
