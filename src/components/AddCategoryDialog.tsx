import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTasks } from '@/contexts/TaskContext';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AddCategoryDialogProps {
  trigger?: React.ReactNode;
}

export function AddCategoryDialog({ trigger }: AddCategoryDialogProps) {
  const { addCategory, canAddCategory, categories } = useTasks();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }

    if (trimmedName.length > 20) {
      setError('Category name must be 20 characters or less');
      return;
    }

    if (!canAddCategory()) {
      setError('Maximum of 7 categories allowed');
      return;
    }

    const success = addCategory(trimmedName);
    
    if (success) {
      toast.success(`Category "${trimmedName}" added`);
      setName('');
      setOpen(false);
    } else {
      setError('A category with this name already exists');
    }
  };

  const remainingSlots = 7 - categories.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2" disabled={!canAddCategory()}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
            <DialogDescription>
              Create a new task category. You can have up to 7 categories total.
              {remainingSlots > 0 ? (
                <span className="block mt-1 text-muted-foreground">
                  {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
                </span>
              ) : (
                <span className="block mt-1 text-destructive">
                  No slots remaining. Delete a custom category first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Research, Review, Urgent"
                maxLength={20}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canAddCategory()}>
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}