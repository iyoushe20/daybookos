 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { ChevronDown, ChevronUp, Quote } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface SourceSnippetProps {
   source: string;
   maxLength?: number;
   highlightInOriginal?: () => void;
 }
 
 export function SourceSnippet({ 
   source, 
   maxLength = 100,
   highlightInOriginal 
 }: SourceSnippetProps) {
   const [isExpanded, setIsExpanded] = useState(false);
   const isTruncated = source.length > maxLength;
   const displayText = isTruncated && !isExpanded 
     ? source.slice(0, maxLength) + '...' 
     : source;
 
   return (
     <div className="flex items-start gap-2 text-sm text-muted-foreground">
       <Quote className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground/50" />
       <div className="flex-1 min-w-0">
         <span className="italic">"{displayText}"</span>
         <div className="flex items-center gap-2 mt-1">
           {isTruncated && (
             <Button
               variant="ghost"
               size="sm"
               className="h-6 px-2 text-xs gap-1"
               onClick={() => setIsExpanded(!isExpanded)}
             >
               {isExpanded ? (
                 <>Show less <ChevronUp className="h-3 w-3" /></>
               ) : (
                 <>Show more <ChevronDown className="h-3 w-3" /></>
               )}
             </Button>
           )}
           {highlightInOriginal && (
             <Button
               variant="ghost"
               size="sm"
               className="h-6 px-2 text-xs"
               onClick={highlightInOriginal}
             >
               View source
             </Button>
           )}
         </div>
       </div>
     </div>
   );
 }