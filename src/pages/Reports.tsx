import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { 
  Plus, 
  FileBarChart,
  Download,
  Copy,
  ChevronDown,
  Eye,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  projectCount: number;
  status: 'draft' | 'final';
}

// Demo reports
const DEMO_REPORTS: Report[] = [
  {
    id: 'report-1',
    startDate: new Date('2026-01-27'),
    endDate: new Date('2026-02-02'),
    generatedAt: new Date('2026-02-03'),
    projectCount: 2,
    status: 'final',
  },
  {
    id: 'report-2',
    startDate: new Date('2026-01-20'),
    endDate: new Date('2026-01-26'),
    generatedAt: new Date('2026-01-27'),
    projectCount: 2,
    status: 'final',
  },
  {
    id: 'report-3',
    startDate: new Date('2026-01-13'),
    endDate: new Date('2026-01-19'),
    generatedAt: new Date('2026-01-20'),
    projectCount: 1,
    status: 'draft',
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const [reports] = useState<Report[]>(DEMO_REPORTS);

  const handleCopy = (reportId: string) => {
    // In real app, would copy formatted report to clipboard
    toast.success('Report copied to clipboard');
  };

  const handleDownload = (reportId: string) => {
    // In real app, would download PDF
    toast.success('Downloading PDF...');
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `Week of ${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Weekly Reports</h1>
            <p className="text-muted-foreground">Your weekly status updates</p>
          </div>
          <Button onClick={() => navigate('/reports/generate')} className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="border border-border rounded-xl">
            <EmptyState
              icon={<FileBarChart className="h-8 w-8 text-muted-foreground" />}
              title="No reports yet"
              description="Generate your first weekly report to share updates with your manager."
              actionLabel="Generate Report"
              onAction={() => navigate('/reports/generate')}
            />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {formatDateRange(report.startDate, report.endDate)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Generated: {format(report.generatedAt, 'MMM d, yyyy')} • {report.projectCount} projects
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={report.status} />
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/reports/${report.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {report.status === 'draft' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/reports/${report.id}`}>
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopy(report.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(report.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
