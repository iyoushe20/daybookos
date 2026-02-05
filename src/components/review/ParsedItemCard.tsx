 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { Checkbox } from '@/components/ui/checkbox';
 import { Button } from '@/components/ui/button';
 import { CategoryBadge } from '@/components/CategoryBadge';
 import { ConfidenceBadge } from './ConfidenceBadge';
 import { SourceSnippet } from './SourceSnippet';
 import { InlineEdit } from './InlineEdit';
 import { TaskCategory } from '@/contexts/TaskContext';
 import { Edit2, Trash2, AlertTriangle, Undo2 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { toast } from 'sonner';
 
 export interface ParsedItem {
   id: string;
   text: string;
   category: TaskCategory;
   source: string;
   confidence: number;
   extractionReasoning?: {
     matchedPatterns?: string[];
     confidenceFactors?: Record<string, number>;
     keywords?: string[];
   };
   metadata?: {
     person?: string;
     riskLevel?: 'low' | 'medium' | 'high';
   };
   editHistory?: Array<{
     originalText: string;
     editedText: string;
     editedAt: Date;
   }>;
 }
 
 interface ParsedItemCardProps {
   item: ParsedItem;
   isSelected?: boolean;
   onSelect?: () => void;
   onEdit: (id: string, updates: Partial<ParsedItem>) => void;
   onDelete: (id: string) => void;
   onUndo?: (id: string) => void;
 }
 
 export function ParsedItemCard({
   item,
   isSelected,
   onSelect,
   onEdit,
   onDelete,
   onUndo
 }: ParsedItemCardProps) {
   const [isEditing, setIsEditing] = useState(false);
   const [lastEdit, setLastEdit] = useState<{ text: string; timeoutId: NodeJS.Timeout } | null>(null);
   const isBlocker = item.category === 'blocker';
 
   const handleDoubleClick = () => {
     setIsEditing(true);
   };
 
   const handleSaveEdit = (newText: string) => {
     const previousText = item.text;
     onEdit(item.id, { 
       text: newText,
       editHistory: [
         ...(item.editHistory || []),
         { originalText: previousText, editedText: newText, editedAt: new Date() }
       ]
     });
     setIsEditing(false);
     
     // Show undo toast for 5 seconds
     const timeoutId = setTimeout(() => {
       setLastEdit(null);
     }, 5000);
     
     setLastEdit({ text: previousText, timeoutId });
     
     toast.success('Item updated', {
       action: {
         label: 'Undo',
         onClick: () => {
           onEdit(item.id, { text: previousText });
           clearTimeout(timeoutId);
           setLastEdit(null);
         },
       },
       duration: 5000,
     });
   };
 
   const handleDelete = () => {
     const itemData = { ...item };
     onDelete(item.id);
     
     toast.success('Item removed', {
       action: {
         label: 'Undo',
         onClick: () => {
           if (onUndo) onUndo(item.id);
         },
       },
       duration: 5000,
     });
   };
 
   return (
     <motion.div
       layout
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95, height: 0 }}
       className={cn(
         "border border-border rounded-lg p-4 transition-colors bg-card",
         isBlocker && "border-l-[3px] border-l-destructive",
         item.confidence < 60 && "border-warning/50 bg-warning-light/30"
       )}
     >
       <div className="flex items-start gap-3">
         <Checkbox 
           checked={isSelected} 
           onCheckedChange={onSelect}
           className="mt-1" 
         />
         <div className="flex-1 min-w-0">
           <div className="flex items-start justify-between gap-2">
             {isEditing ? (
               <InlineEdit
                 value={item.text}
                 onSave={handleSaveEdit}
                 onCancel={() => setIsEditing(false)}
                 className="flex-1"
               />
             ) : (
               <p 
                 className="font-medium cursor-pointer hover:text-primary transition-colors"
                 onDoubleClick={handleDoubleClick}
                 title="Double-click to edit"
               >
                 {isBlocker && <AlertTriangle className="h-4 w-4 text-destructive inline mr-2" />}
                 {item.text}
               </p>
             )}
             <div className="flex items-center gap-1 flex-shrink-0">
               <Button 
                 variant="ghost" 
                 size="icon" 
                 className="h-7 w-7"
                 onClick={() => setIsEditing(true)}
               >
                 <Edit2 className="h-3.5 w-3.5" />
               </Button>
               <Button 
                 variant="ghost" 
                 size="icon" 
                 className="h-7 w-7 text-muted-foreground hover:text-destructive"
                 onClick={handleDelete}
               >
                 <Trash2 className="h-3.5 w-3.5" />
               </Button>
             </div>
           </div>
           
           <div className="mt-2 flex items-center gap-2 flex-wrap">
             <CategoryBadge category={item.category} />
             {item.metadata?.person && (
               <span className="text-xs text-muted-foreground">To: {item.metadata.person}</span>
             )}
             {item.metadata?.riskLevel && (
               <span className={cn(
                 "text-xs px-2 py-0.5 rounded-full",
                 item.metadata.riskLevel === 'high' && "bg-destructive/10 text-destructive",
                 item.metadata.riskLevel === 'medium' && "bg-warning-light text-warning",
                 item.metadata.riskLevel === 'low' && "bg-muted text-muted-foreground"
               )}>
                 {item.metadata.riskLevel} risk
               </span>
             )}
           </div>
           
           <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
             <SourceSnippet source={item.source} />
             <ConfidenceBadge 
               confidence={item.confidence} 
               extractionReasoning={item.extractionReasoning}
             />
           </div>
         </div>
       </div>
     </motion.div>
   );
 }