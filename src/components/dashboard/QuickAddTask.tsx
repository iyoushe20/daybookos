import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useTasks, TaskCategory } from '@/contexts/TaskContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Plus, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export function QuickAddTask() {
  const { addTask, categories } = useTasks();
  const { projects, addProject } = useProjects();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState<TaskCategory>('action_item');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const activeProjects = projects.filter(p => p.status === 'active');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    addProject({ name: newProjectName.trim() });
    const newId = `proj-${Date.now()}`;
    // We can't get the exact ID since it's generated inside context,
    // but we'll set it after project list updates
    toast.success(`Project "${newProjectName}" created`);
    setNewProjectName('');
    setShowNewProject(false);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error('Task description is required');
      return;
    }
    if (!projectId) {
      toast.error('Please select a project');
      return;
    }
    addTask({
      text: text.trim(),
      category,
      projectId,
      status: 'open',
    });
    toast.success('Task added!');
    setText('');
    setCategory('action_item');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>What needs to be done?</Label>
            <Input
              placeholder="e.g., Review API documentation"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            <div className="flex gap-2">
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  {activeProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNewProject(!showNewProject)}
                title="Create new project"
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showNewProject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                  <Input
                    placeholder="New project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <Button size="sm" onClick={handleCreateProject}>Create</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
