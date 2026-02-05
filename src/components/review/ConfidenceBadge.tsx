 import { cn } from '@/lib/utils';
 import { Info } from 'lucide-react';
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from '@/components/ui/tooltip';
 
 interface ConfidenceBadgeProps {
   confidence: number;
   showDetails?: boolean;
   extractionReasoning?: {
     matchedPatterns?: string[];
     confidenceFactors?: Record<string, number>;
     keywords?: string[];
   };
 }
 
 export function ConfidenceBadge({ 
   confidence, 
   showDetails = true,
   extractionReasoning 
 }: ConfidenceBadgeProps) {
   const level = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
   const dots = level === 'high' ? 4 : level === 'medium' ? 3 : 2;
   
   const styles = {
     high: {
       dots: 'bg-success',
       bg: 'bg-success-light',
       text: 'text-success',
       label: 'High'
     },
     medium: {
       dots: 'bg-warning',
       bg: 'bg-warning-light',
       text: 'text-warning',
       label: 'Medium'
     },
     low: {
       dots: 'bg-destructive',
       bg: 'bg-destructive/10',
       text: 'text-destructive',
       label: 'Low'
     },
   };
 
   const style = styles[level];
 
   const badge = (
     <div className={cn(
       "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
       style.bg, style.text
     )}>
       <div className="flex gap-0.5">
         {[1, 2, 3, 4].map(i => (
           <div
             key={i}
             className={cn(
               "w-1.5 h-1.5 rounded-full",
               i <= dots ? style.dots : "bg-muted"
             )}
           />
         ))}
       </div>
       <span>{style.label} ({confidence}%)</span>
       {level === 'low' && <span className="ml-1">• Needs review</span>}
       {showDetails && extractionReasoning && (
         <Info className="h-3 w-3 ml-1" />
       )}
     </div>
   );
 
   if (!showDetails || !extractionReasoning) {
     return badge;
   }
 
   return (
     <Tooltip>
       <TooltipTrigger asChild>
         <button className="cursor-help">{badge}</button>
       </TooltipTrigger>
       <TooltipContent side="bottom" className="max-w-xs p-3">
         <div className="space-y-2 text-sm">
           <p className="font-medium">Why this was extracted</p>
           {extractionReasoning.matchedPatterns && extractionReasoning.matchedPatterns.length > 0 && (
             <div>
               <span className="text-muted-foreground">Patterns:</span>{' '}
               {extractionReasoning.matchedPatterns.join(', ')}
             </div>
           )}
           {extractionReasoning.keywords && extractionReasoning.keywords.length > 0 && (
             <div>
               <span className="text-muted-foreground">Keywords:</span>{' '}
               {extractionReasoning.keywords.join(', ')}
             </div>
           )}
           {extractionReasoning.confidenceFactors && (
             <div className="space-y-1">
               <span className="text-muted-foreground">Confidence factors:</span>
               {Object.entries(extractionReasoning.confidenceFactors).map(([key, value]) => (
                 <div key={key} className="flex justify-between text-xs">
                   <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                   <span>{Math.round(value * 100)}%</span>
                 </div>
               ))}
             </div>
           )}
         </div>
       </TooltipContent>
     </Tooltip>
   );
 }