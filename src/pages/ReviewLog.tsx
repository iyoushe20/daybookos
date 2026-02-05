 import { useState, useCallback } from 'react';
 import { useNavigate, useParams, Link } from 'react-router-dom';
 import { motion, AnimatePresence } from 'framer-motion';
 import { AppLayout } from '@/components/AppLayout';
 import { Button } from '@/components/ui/button';
 import { TaskCategory } from '@/contexts/TaskContext';
 import { ParsedItemCard, ParsedItem } from '@/components/review/ParsedItemCard';
 import { 
   ArrowLeft,
   Loader2,
   Plus,
   FileText,
   History
 } from 'lucide-react';
 import { toast } from 'sonner';

// Demo parsed items
 const DEMO_ITEMS: ParsedItem[] = [
  {
    id: '1',
    text: 'Update Jira ticket STATUS-123',
    category: 'action_item',
    source: 'Need to update Jira ticket STATUS-123',
    confidence: 95,
     extractionReasoning: {
       matchedPatterns: ['action_verb_update', 'jira_ticket_reference'],
       confidenceFactors: { explicit_action: 0.95, ticket_reference: 0.98 },
       keywords: ['update', 'Jira', 'STATUS-123']
     }
  },
  {
    id: '2',
    text: 'Schedule recon discussion',
    category: 'action_item',
    source: 'Should schedule recon discussion',
    confidence: 72,
     extractionReasoning: {
       matchedPatterns: ['action_verb_schedule'],
       confidenceFactors: { explicit_action: 0.7, topic_clarity: 0.6 },
       keywords: ['schedule', 'discussion']
     }
  },
  {
    id: '3',
    text: 'Follow up with Meha on API docs',
    category: 'follow_up',
    source: 'Need to follow up on API docs',
    confidence: 88,
     extractionReasoning: {
       matchedPatterns: ['follow_up_with_person', 'action_verb_follow_up'],
       confidenceFactors: { explicit_action: 0.9, person_mentioned: 0.95, topic_clarity: 0.8 },
       keywords: ['follow up', 'Meha', 'API docs']
     },
    metadata: { person: 'Meha' },
  },
  {
    id: '4',
    text: 'Follow up with Raj on PRD review',
    category: 'follow_up',
    source: 'PRD is pending review from Raj',
    confidence: 92,
     extractionReasoning: {
       matchedPatterns: ['follow_up_with_person', 'pending_review'],
       confidenceFactors: { explicit_action: 0.9, person_mentioned: 0.95 },
       keywords: ['PRD', 'review', 'Raj']
     },
    metadata: { person: 'Raj' },
  },
  {
    id: '5',
    text: 'Blocked on legal sign-off for contract',
    category: 'blocker',
    source: 'Blocked on legal sign-off for contract',
    confidence: 98,
     extractionReasoning: {
       matchedPatterns: ['blocker_keyword', 'external_dependency'],
       confidenceFactors: { blocker_explicit: 0.99, risk_indicator: 0.95 },
       keywords: ['blocked', 'legal', 'sign-off']
     },
    metadata: { riskLevel: 'high' },
  },
  {
    id: '6',
    text: 'Vendor refused to change pricing model',
    category: 'blocker',
    source: 'Vendor refused to change pricing model',
    confidence: 95,
     extractionReasoning: {
       matchedPatterns: ['external_dependency', 'negative_outcome'],
       confidenceFactors: { blocker_implicit: 0.9, vendor_mention: 0.85 },
       keywords: ['vendor', 'refused', 'pricing']
     },
    metadata: { riskLevel: 'medium' },
  },
  {
    id: '7',
    text: 'Decided to use Stripe for payments',
    category: 'decision',
    source: 'Decided to use Stripe for payments',
    confidence: 90,
     extractionReasoning: {
       matchedPatterns: ['decision_keyword'],
       confidenceFactors: { decision_explicit: 0.95 },
       keywords: ['decided', 'Stripe', 'payments']
     }
  },
  {
    id: '8',
    text: 'Research alternative payment providers',
    category: 'what_next',
    source: 'Should look into other options',
    confidence: 65,
     extractionReasoning: {
       matchedPatterns: ['action_verb_research'],
       confidenceFactors: { implicit_action: 0.6, topic_clarity: 0.5 },
       keywords: ['research', 'options']
     }
  },
];

export default function ReviewLog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState<ParsedItem[]>(DEMO_ITEMS);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.id)));
   const [deletedItems, setDeletedItems] = useState<ParsedItem[]>([]);

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

   const handleEdit = useCallback((itemId: string, updates: Partial<ParsedItem>) => {
     setItems(prev => prev.map(item => 
       item.id === itemId ? { ...item, ...updates } : item
     ));
   }, []);
 
   const handleDelete = useCallback((itemId: string) => {
     const item = items.find(i => i.id === itemId);
     if (item) {
       setDeletedItems(prev => [...prev, item]);
     }
     setItems(prev => prev.filter(i => i.id !== itemId));
     setSelectedItems(prev => {
       const next = new Set(prev);
       next.delete(itemId);
       return next;
     });
   }, [items]);
 
   const handleUndo = useCallback((itemId: string) => {
     const item = deletedItems.find(i => i.id === itemId);
     if (item) {
       setItems(prev => [...prev, item]);
       setDeletedItems(prev => prev.filter(i => i.id !== itemId));
       setSelectedItems(prev => new Set([...prev, itemId]));
     }
   }, [deletedItems]);
 
   const toggleSelection = useCallback((itemId: string) => {
     setSelectedItems(prev => {
       const next = new Set(prev);
       if (next.has(itemId)) {
         next.delete(itemId);
       } else {
         next.add(itemId);
       }
       return next;
     });
   }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
     toast.success(`Plan saved! ${selectedItems.size} tasks added.`);
    navigate('/dashboard');
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
           <div className="flex items-center gap-2">
             <Button variant="outline" className="gap-2" asChild>
               <Link to={`/logs/${id}/audit`}>
                 <History className="h-4 w-4" />
                 Audit Log
               </Link>
             </Button>
             <Button
               onClick={handleConfirm}
               disabled={isSubmitting || selectedItems.size === 0}
               className="gap-2"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="h-4 w-4 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>Confirm & Save ({selectedItems.size})</>
               )}
             </Button>
           </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
           <div className="flex items-center justify-between mb-6">
             <p className="text-muted-foreground">
               We extracted <span className="font-semibold text-foreground">{items.length} items</span> from your notes. 
               Review and edit below. <span className="text-xs">(Double-click to edit)</span>
             </p>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <FileText className="h-4 w-4" />
               <span>{selectedItems.size} selected</span>
             </div>
           </div>

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
                             <ParsedItemCard
                          key={item.id}
                               item={item}
                               isSelected={selectedItems.has(item.id)}
                               onSelect={() => toggleSelection(item.id)}
                               onEdit={handleEdit}
                               onDelete={handleDelete}
                               onUndo={handleUndo}
                             />
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
