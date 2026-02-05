 import { useState } from 'react';
 import { useNavigate, useParams } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { AppLayout } from '@/components/AppLayout';
 import { Button } from '@/components/ui/button';
 import { 
   ArrowLeft, 
   FileText, 
   Sparkles, 
   Edit, 
   Trash2, 
   CheckCircle,
   User,
   Bot,
   Download
 } from 'lucide-react';
 import { format } from 'date-fns';
 import { cn } from '@/lib/utils';
 
 interface AuditEntry {
   id: string;
   entryType: 'log_created' | 'parse_initiated' | 'parse_completed' | 'item_extracted' | 'item_edited' | 'item_deleted' | 'log_confirmed';
   actorType: 'user' | 'system';
   actorName?: string;
   description: string;
   metadata?: {
     model?: string;
     parseTimeMs?: number;
     itemsExtracted?: number;
     itemText?: string;
     changeType?: string;
     originalValue?: string;
     newValue?: string;
   };
   createdAt: Date;
 }
 
 // Demo audit entries
 const DEMO_AUDIT_ENTRIES: AuditEntry[] = [
   {
     id: '1',
     entryType: 'log_created',
     actorType: 'user',
     actorName: 'Priya Sharma',
     description: 'Log created',
     metadata: {},
     createdAt: new Date(Date.now() - 300000), // 5 min ago
   },
   {
     id: '2',
     entryType: 'parse_initiated',
     actorType: 'system',
     description: 'AI parsing initiated',
     createdAt: new Date(Date.now() - 295000),
   },
   {
     id: '3',
     entryType: 'parse_completed',
     actorType: 'system',
     description: 'AI parsing completed: 7 items extracted',
     metadata: {
       model: 'gpt-4-turbo-preview',
       parseTimeMs: 2340,
       itemsExtracted: 7,
     },
     createdAt: new Date(Date.now() - 290000),
   },
   {
     id: '4',
     entryType: 'item_edited',
     actorType: 'user',
     actorName: 'Priya Sharma',
     description: 'Item edited: "Follow up with Meha on API docs"',
     metadata: {
       itemText: 'Follow up with Meha on API docs',
       changeType: 'text',
       originalValue: 'Follow up with Meha',
       newValue: 'Follow up with Meha on API docs',
     },
     createdAt: new Date(Date.now() - 180000),
   },
   {
     id: '5',
     entryType: 'item_deleted',
     actorType: 'user',
     actorName: 'Priya Sharma',
     description: 'Item deleted: "Schedule recon discussion"',
     metadata: {
       itemText: 'Schedule recon discussion',
     },
     createdAt: new Date(Date.now() - 120000),
   },
   {
     id: '6',
     entryType: 'log_confirmed',
     actorType: 'user',
     actorName: 'Priya Sharma',
     description: 'Log confirmed: 6 tasks created',
     metadata: {
       itemsExtracted: 6,
     },
     createdAt: new Date(Date.now() - 60000),
   },
 ];
 
 const entryIcons: Record<AuditEntry['entryType'], React.ReactNode> = {
   log_created: <FileText className="h-4 w-4" />,
   parse_initiated: <Sparkles className="h-4 w-4" />,
   parse_completed: <Sparkles className="h-4 w-4" />,
   item_extracted: <Sparkles className="h-4 w-4" />,
   item_edited: <Edit className="h-4 w-4" />,
   item_deleted: <Trash2 className="h-4 w-4" />,
   log_confirmed: <CheckCircle className="h-4 w-4" />,
 };
 
 export default function AuditLog() {
   const navigate = useNavigate();
   const { id } = useParams();
   const [entries] = useState<AuditEntry[]>(DEMO_AUDIT_ENTRIES);
 
   return (
     <AppLayout>
       <div className="max-w-3xl mx-auto">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
           <div>
             <Button variant="ghost" className="gap-2 mb-2 -ml-3" onClick={() => navigate(-1)}>
               <ArrowLeft className="h-4 w-4" />
               Back to Review
             </Button>
             <h1 className="text-2xl font-bold">Audit Log</h1>
             <p className="text-muted-foreground">
               Payment Gateway Integration • Monday, February 3, 2026
             </p>
           </div>
           <Button variant="outline" className="gap-2">
             <Download className="h-4 w-4" />
             Export
           </Button>
         </div>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <h2 className="font-semibold mb-6">Timeline</h2>
           
           <div className="relative">
             {/* Timeline line */}
             <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
             
             {/* Entries */}
             <div className="space-y-6">
               {entries.map((entry, index) => (
                 <motion.div
                   key={entry.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="relative flex gap-4"
                 >
                   {/* Icon */}
                   <div className={cn(
                     "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-background",
                     entry.actorType === 'system' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'bg-muted text-muted-foreground'
                   )}>
                     {entry.actorType === 'system' ? (
                       <Bot className="h-4 w-4" />
                     ) : (
                       <User className="h-4 w-4" />
                     )}
                   </div>
                   
                   {/* Content */}
                   <div className="flex-1 pt-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-sm font-medium">
                         {format(entry.createdAt, 'h:mm a')}
                       </span>
                       <span className="text-muted-foreground">
                         {entryIcons[entry.entryType]}
                       </span>
                       <span className="font-medium">{entry.description}</span>
                     </div>
                     
                     {entry.actorType === 'user' && entry.actorName && (
                       <p className="text-sm text-muted-foreground">
                         Actor: {entry.actorName}
                       </p>
                     )}
                     
                     {entry.metadata && (
                       <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                         {entry.metadata.model && (
                           <p>Model: <span className="font-mono">{entry.metadata.model}</span></p>
                         )}
                         {entry.metadata.parseTimeMs && (
                           <p>Parse time: {(entry.metadata.parseTimeMs / 1000).toFixed(1)}s</p>
                         )}
                         {entry.metadata.itemsExtracted !== undefined && (
                           <p>Items: {entry.metadata.itemsExtracted}</p>
                         )}
                         {entry.metadata.originalValue && entry.metadata.newValue && (
                           <div>
                             <p className="text-muted-foreground">Original: <span className="line-through">{entry.metadata.originalValue}</span></p>
                             <p>New: {entry.metadata.newValue}</p>
                           </div>
                         )}
                         {entry.metadata.itemText && !entry.metadata.originalValue && (
                           <p>Item: "{entry.metadata.itemText}"</p>
                         )}
                       </div>
                     )}
                   </div>
                 </motion.div>
               ))}
             </div>
           </div>
         </motion.div>
       </div>
     </AppLayout>
   );
 }