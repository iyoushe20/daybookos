import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useProjects } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react';

const POD_OPTIONS = ['Frontend', 'Backend', 'Mobile', 'Data', 'Platform', 'Infra', 'Other'];
const QUARTER_OPTIONS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Other'];

export default function SettingsProjects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', pod: '', quarter: '' });
  const [editForm, setEditForm] = useState({ name: '', pod: '', quarter: '' });

  const startEdit = (project: typeof projects[0]) => {
    setEditingId(project.id);
    setEditForm({
      name: project.name,
      pod: project.pod || '',
      quarter: project.quarter || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', pod: '', quarter: '' });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    updateProject(editingId!, {
      name: editForm.name.trim(),
      pod: editForm.pod || undefined,
      quarter: editForm.quarter || undefined,
    });
    toast.success('Project updated');
    cancelEdit();
  };

  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (projects.length >= 4) {
      toast.error('Maximum 4 projects allowed');
      return;
    }
    addProject({
      name: newProject.name.trim(),
      pod: newProject.pod || undefined,
      quarter: newProject.quarter || undefined,
    });
    toast.success('Project created');
    setNewProject({ name: '', pod: '', quarter: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    toast.success('Project deleted');
  };

  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <a href="/settings/profile" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </a>
          <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary -mb-px">
            Projects
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Projects</h2>
            {!isAdding && activeProjects.length < 4 && (
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            )}
          </div>

          {/* Add Project Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-primary/50 rounded-xl p-5"
              >
                <h3 className="font-medium mb-4">New Project</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project Name <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="e.g., User Authentication Redesign"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      maxLength={50}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>POD (optional)</Label>
                      <Select
                        value={newProject.pod}
                        onValueChange={(value) => setNewProject({ ...newProject, pod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {POD_OPTIONS.map(pod => (
                            <SelectItem key={pod} value={pod}>{pod}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quarter (optional)</Label>
                      <Select
                        value={newProject.quarter}
                        onValueChange={(value) => setNewProject({ ...newProject, quarter: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {QUARTER_OPTIONS.map(quarter => (
                            <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProject}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects List */}
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="bg-card border border-border rounded-xl p-5"
              >
                {editingId === project.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Name <span className="text-destructive">*</span></Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        maxLength={50}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>POD</Label>
                        <Select
                          value={editForm.pod}
                          onValueChange={(value) => setEditForm({ ...editForm, pod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {POD_OPTIONS.map(pod => (
                              <SelectItem key={pod} value={pod}>{pod}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quarter</Label>
                        <Select
                          value={editForm.quarter}
                          onValueChange={(value) => setEditForm({ ...editForm, quarter: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {QUARTER_OPTIONS.map(quarter => (
                              <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <StatusBadge status="open" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {project.pod && <span>{project.pod}</span>}
                        {project.pod && project.quarter && <span>•</span>}
                        {project.quarter && <span>{project.quarter}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(project)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{project.name}" and all associated logs and tasks. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {activeProjects.length >= 4 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Maximum 4 projects allowed. Delete a project to add a new one.
            </p>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
