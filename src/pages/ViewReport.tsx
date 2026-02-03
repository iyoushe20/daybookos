import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { 
  ArrowLeft,
  Download,
  Copy,
  ChevronDown,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportSection {
  title: string;
  items: string[];
}

interface ProjectReport {
  id: string;
  name: string;
  workDone: string[];
  keyWins: string[];
  blockers: string[];
  asks: string[];
  whatNext: string[];
}

// Demo report data
const DEMO_REPORT = {
  id: 'report-1',
  startDate: new Date('2026-01-27'),
  endDate: new Date('2026-02-02'),
  generatedAt: new Date('2026-02-03'),
  status: 'final' as 'draft' | 'final',
  projects: [
    {
      id: 'proj-1',
      name: 'Payment Gateway Integration',
      workDone: [
        'Completed API documentation review with vendor',
        'Implemented basic payment flow in staging',
        'Set up webhook endpoints for payment notifications',
        'Conducted security review of integration approach',
      ],
      keyWins: [
        'Secured vendor agreement on revised pricing model',
        'Reduced estimated integration time from 4 weeks to 2.5 weeks',
      ],
      blockers: [
        'Waiting on legal sign-off for vendor contract (3 days)',
        'Vendor API rate limits may need increase for production',
      ],
      asks: [
        'Need Raj\'s approval on final architecture document',
        'Require finance team input on reconciliation workflow',
      ],
      whatNext: [
        'Complete end-to-end testing in staging',
        'Prepare production deployment checklist',
        'Schedule recon discussion with finance team',
      ],
    },
    {
      id: 'proj-2',
      name: 'User Authentication Redesign',
      workDone: [
        'Finalized PRD for new authentication flow',
        'Completed competitive analysis of 5 auth providers',
        'Created wireframes for login/signup screens',
      ],
      keyWins: [
        'Got buy-in from security team on proposed approach',
      ],
      blockers: [],
      asks: [
        'PRD review from Raj before design handoff',
      ],
      whatNext: [
        'Design review with UX team',
        'Technical spec for OAuth integration',
      ],
    },
  ],
};

export default function ViewReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCopy = () => {
    // In real app, would format and copy report
    const reportText = DEMO_REPORT.projects.map(project => {
      return `
## ${project.name}

**Work Done:**
${project.workDone.map(item => `• ${item}`).join('\n')}

**Key Wins:**
${project.keyWins.map(item => `• ${item}`).join('\n')}

**Blockers:**
${project.blockers.length > 0 ? project.blockers.map(item => `• ${item}`).join('\n') : '• None'}

**Asks:**
${project.asks.length > 0 ? project.asks.map(item => `• ${item}`).join('\n') : '• None'}

**What Next:**
${project.whatNext.map(item => `• ${item}`).join('\n')}
      `;
    }).join('\n---\n');

    navigator.clipboard.writeText(reportText);
    toast.success('Report copied to clipboard');
  };

  const handleDownload = () => {
    toast.success('Downloading PDF...');
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const Section = ({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-medium flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" className="gap-2 mb-2 -ml-3" onClick={() => navigate('/reports')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Button>
            <h1 className="text-2xl font-bold">
              {formatDateRange(DEMO_REPORT.startDate, DEMO_REPORT.endDate)}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-muted-foreground">Weekly Report</span>
              <StatusBadge status={DEMO_REPORT.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {DEMO_REPORT.status === 'draft' && (
              <Button variant="outline" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {DEMO_REPORT.projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{project.name}</h3>
              </div>

              <div className="grid gap-6">
                <Section
                  title="Work Done"
                  items={project.workDone}
                  icon={<CheckCircle2 className="h-4 w-4 text-success" />}
                />
                
                {project.keyWins.length > 0 && (
                  <Section
                    title="Key Wins"
                    items={project.keyWins}
                    icon={<span className="text-lg">🎉</span>}
                  />
                )}

                {project.blockers.length > 0 && (
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <Section
                      title="Blockers"
                      items={project.blockers}
                      icon={<span className="text-lg">⚠️</span>}
                    />
                  </div>
                )}

                {project.asks.length > 0 && (
                  <Section
                    title="Asks"
                    items={project.asks}
                    icon={<span className="text-lg">🙋</span>}
                  />
                )}

                <Section
                  title="What Next"
                  items={project.whatNext}
                  icon={<span className="text-lg">📋</span>}
                />
              </div>
            </div>
          ))}

          <div className="text-center text-sm text-muted-foreground py-4">
            Generated on {format(DEMO_REPORT.generatedAt, 'MMMM d, yyyy')} at {format(DEMO_REPORT.generatedAt, 'h:mm a')}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
