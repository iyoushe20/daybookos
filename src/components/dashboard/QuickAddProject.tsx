import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProjects } from '@/contexts/ProjectContext';
import { FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

const POD_OPTIONS = ['Frontend', 'Backend', 'Mobile', 'Data', 'Platform', 'Infra', 'Other'];
const QUARTER_OPTIONS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

export function QuickAddProject() {
  const { projects, addProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [pod, setPod] = useState('');
  const [quarter, setQuarter] = useState('');

  const activeProjects = projects.filter(p => p.status === 'active');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (activeProjects.length >= 4) {
      toast.error('Maximum 4 projects allowed');
      return;
    }
    addProject({
      name: name.trim(),
      pod: pod || undefined,
      quarter: quarter || undefined,
    });
    toast.success(`Project "${name}" created!`);
    setName('');
    setPod('');
    setQuarter('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Project Name <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g., User Authentication Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={50}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>POD (optional)</Label>
              <Select value={pod} onValueChange={setPod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {POD_OPTIONS.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quarter (optional)</Label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {QUARTER_OPTIONS.map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
