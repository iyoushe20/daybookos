import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskCategory } from '@/contexts/TaskContext';
import { 
  ArrowLeft,
  Loader2,
  Edit2,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ParsedItem {
  id: string;
  text: string;
  category: TaskCategory;
  source: string;
  confidence: number;
  metadata?: {
    person?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
}

// Demo parsed items
const DEMO_ITEMS: ParsedItem[] = [
  {
    id: '1',
    text: 'Update Jira ticket STATUS-123',
    category: 'action_item',
    source: 'Need to update Jira ticket STATUS-123',
    confidence: 95,
  },
  {
    id: '2',
    text: 'Schedule recon discussion',
    category: 'action_item',
    source: 'Should schedule recon discussion',
    confidence: 72,
  },
  {
    id: '3',
    text: 'Follow up with Meha on API docs',
    category: 'follow_up',
    source: 'Need to follow up on API docs',
    confidence: 88,
    metadata: { person: 'Meha' },
  },
  {
    id: '4',
    text: 'Follow up with Raj on PRD review',
    category: 'follow_up',
    source: 'PRD is pending review from Raj',
    confidence: 92,
    metadata: { person: 'Raj' },
  },
  {
    id: '5',
    text: 'Blocked on legal sign-off for contract',
    category: 'blocker',
    source: 'Blocked on legal sign-off for contract',
    confidence: 98,
    metadata: { riskLevel: 'high' },
  },
  {
    id: '6',
    text: 'Vendor refused to change pricing model',
    category: 'blocker',
    source: 'Vendor refused to change pricing model',
    confidence: 95,
    metadata: { riskLevel: 'medium' },
  },
  {
    id: '7',
    text: 'Decided to use Stripe for payments',
    category: 'decision',
    source: 'Decided to use Stripe for payments',
    confidence: 90,
  },
  {
    id: '8',
    text: 'Research alternative payment providers',
    category: 'what_next',
    source: 'Should look into other options',
    confidence: 65,
  },
];

const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  const level = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
  const dots = level === 'high' ? 4 : level === 'medium' ? 3 : 2;
  const colors = {
    high: 'text-success',
    medium: 'text-warning',
    low: 'text-destructive',
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              i <= dots ? colors[level] : "bg-muted"
            )}
            style={{ backgroundColor: i <= dots ? undefined : undefined }}
          />
        ))}
      </div>
      <span className={cn("capitalize", colors[level])}>
        {level} ({confidence}%)
      </span>
    </div>
  );
};

export default function ReviewLog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState<ParsedItem[]>(DEMO_ITEMS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<TaskCategory, ParsedItem[]>);

  const categoryOrder: TaskCategory[] = [
    'action_item',
    'follow_up',
    'blocker',
    'decision',
    'meeting',
    'writing',
    'what_next',
  ];

  const handleDelete = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId));
    toast.success('Item removed');
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Plan saved! Your tasks have been added.');
    navigate('/dashboard');
  };

  const getCategoryIcon = (category: TaskCategory) => {
    if (category === 'blocker') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" className="gap-2 mb-2 -ml-3" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Edit Notes
            </Button>
            <h1 className="text-2xl font-bold">Review Your Plan</h1>
            <p className="text-muted-foreground">
              Payment Gateway Integration • Monday, February 3, 2026
            </p>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || items.length === 0}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>Confirm & Save</>
            )}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <p className="text-muted-foreground mb-6">
            We extracted <span className="font-semibold text-foreground">{items.length} items</span> from your notes. 
            Review and edit below.
          </p>

          <div className="space-y-8">
            {categoryOrder.map(category => {
              const categoryItems = groupedItems[category];
              if (!categoryItems || categoryItems.length === 0) return null;

              const categoryLabels: Record<TaskCategory, string> = {
                action_item: 'Action Items',
                follow_up: 'Follow-ups',
                meeting: 'Meetings',
                decision: 'Decisions',
                writing: 'Writing Tasks',
                blocker: 'Blockers/Risks',
                what_next: 'What Next',
              };

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      {categoryLabels[category]} ({categoryItems.length})
                    </h3>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {categoryItems.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          className={cn(
                            "border border-border rounded-lg p-4 transition-colors",
                            category === 'blocker' && "border-l-[3px] border-l-destructive"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox className="mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium">{item.text}</p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-border/50 text-sm text-muted-foreground space-y-1">
                                <p>Source: "{item.source}"</p>
                                {item.metadata?.person && (
                                  <p>To: {item.metadata.person}</p>
                                )}
                                {item.metadata?.riskLevel && (
                                  <p>Risk Level: <span className="capitalize">{item.metadata.riskLevel}</span></p>
                                )}
                                <ConfidenceBadge confidence={item.confidence} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No items to confirm. Go back to add more notes.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
