import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useProjects } from '@/contexts/ProjectContext';
import { format, startOfWeek, endOfWeek, subDays, subWeeks } from 'date-fns';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Loader2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DateRangeOption = 'this_week' | 'last_week' | 'last_7_days' | 'custom';

export default function GenerateReport() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>('this_week');
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedProjects, setSelectedProjects] = useState<string[]>(projects.map(p => p.id));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDateRangeChange = (option: DateRangeOption) => {
    setDateRangeOption(option);
    const today = new Date();
    
    switch (option) {
      case 'this_week':
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'last_week':
        const lastWeek = subWeeks(today, 1);
        setStartDate(startOfWeek(lastWeek, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(lastWeek, { weekStartsOn: 1 }));
        break;
      case 'last_7_days':
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
    }
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleGenerate = async () => {
    if (selectedProjects.length === 0) {
      toast.error('Please select at least one project');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast.success('Report generated successfully!');
    navigate('/reports/demo-report-id');
  };

  // Demo preview stats
  const previewStats = {
    logCount: 5,
    tasksCompleted: 8,
    blockersIdentified: 3,
    followUpsOpen: 2,
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="gap-2 mb-4 -ml-3" onClick={() => navigate('/reports')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <h1 className="text-2xl font-bold">Generate Weekly Report</h1>
          <p className="text-muted-foreground">
            Create a summary of your work for the selected period.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          {/* Date Range */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Date Range</Label>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'this_week', label: 'This Week' },
                { value: 'last_week', label: 'Last Week' },
                { value: 'last_7_days', label: 'Last 7 Days' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={dateRangeOption === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDateRangeChange(option.value as DateRangeOption)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => {
                      if (d) {
                        setStartDate(d);
                        setDateRangeOption('custom');
                      }
                    }}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => {
                      if (d) {
                        setEndDate(d);
                        setDateRangeOption('custom');
                      }
                    }}
                    disabled={(date) => date > new Date() || date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Projects</Label>
            <div className="space-y-2">
              {projects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProject(project.id)}
                  />
                  <span className="font-medium">{project.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">
              Preview (based on {previewStats.logCount} logs):
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{previewStats.tasksCompleted} tasks completed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span>{previewStats.blockersIdentified} blockers identified</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-category-followup" />
                <span>{previewStats.followUpsOpen} open follow-ups</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{previewStats.logCount} logs</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => navigate('/reports')}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={selectedProjects.length === 0 || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Report</>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
