import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectInput {
  id: string;
  name: string;
  pod: string;
  quarter: string;
}

const POD_OPTIONS = ['Frontend', 'Backend', 'Mobile', 'Data', 'Platform', 'Infra', 'Other'];
const QUARTER_OPTIONS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Other'];

export default function OnboardingSetup() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const { addProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<ProjectInput[]>([
    { id: 'temp-1', name: '', pod: '', quarter: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddProject = () => {
    if (projects.length >= 4) {
      toast.error('You can have up to 4 projects');
      return;
    }
    setProjects([...projects, { id: `temp-${Date.now()}`, name: '', pod: '', quarter: '' }]);
  };

  const handleRemoveProject = (id: string) => {
    if (projects.length <= 1) {
      toast.error('You need at least one project');
      return;
    }
    setProjects(projects.filter(p => p.id !== id));
    // Clear errors for removed project
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleProjectChange = (id: string, field: keyof ProjectInput, value: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    // Clear error when user types
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const validateProjects = () => {
    const newErrors: Record<string, string> = {};
    const names = new Set<string>();

    projects.forEach(p => {
      if (!p.name.trim()) {
        newErrors[p.id] = 'Project name is required';
      } else if (p.name.trim().length < 2) {
        newErrors[p.id] = 'Project name must be at least 2 characters';
      } else if (p.name.trim().length > 50) {
        newErrors[p.id] = 'Project name must be 50 characters or less';
      } else if (names.has(p.name.toLowerCase().trim())) {
        newErrors[p.id] = 'You already have a project with this name';
      }
      names.add(p.name.toLowerCase().trim());
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateProjects()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add projects
    projects.forEach(p => {
      addProject({
        name: p.name.trim(),
        pod: p.pod || undefined,
        quarter: p.quarter || undefined,
      });
    });

    completeOnboarding();
    toast.success('Projects created! Let\'s log your first update.');
    navigate('/dashboard');
  };

  const isValid = projects.every(p => p.name.trim().length >= 2);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="large" />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="font-medium">Set up projects</span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-muted-foreground">Ready to log</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Let's set up your projects</h1>
            <p className="text-muted-foreground">
              Add up to 4 projects you're currently working on. You can always edit these later.
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Project {index + 1}</span>
                    {projects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`name-${project.id}`}>
                        Project name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`name-${project.id}`}
                        placeholder="e.g., User Authentication Redesign"
                        value={project.name}
                        onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                        className={errors[project.id] ? 'border-destructive' : ''}
                        maxLength={50}
                      />
                      {errors[project.id] && (
                        <p className="text-sm text-destructive mt-1">{errors[project.id]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>POD (optional)</Label>
                        <Select
                          value={project.pod}
                          onValueChange={(value) => handleProjectChange(project.id, 'pod', value)}
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

                      <div>
                        <Label>Quarter (optional)</Label>
                        <Select
                          value={project.quarter}
                          onValueChange={(value) => handleProjectChange(project.id, 'quarter', value)}
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {projects.length < 4 && (
              <motion.button
                className="w-full border-2 border-dashed border-border rounded-xl p-5 text-center text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                onClick={handleAddProject}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="h-5 w-5 inline-block mr-2" />
                Add another project
              </motion.button>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating projects...
                </>
              ) : (
                <>Continue →</>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
