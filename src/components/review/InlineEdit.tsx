 import { useState, useRef, useEffect, KeyboardEvent } from 'react';
 import { Input } from '@/components/ui/input';
 import { cn } from '@/lib/utils';
 
 interface InlineEditProps {
   value: string;
   onSave: (newValue: string) => void;
   onCancel: () => void;
   className?: string;
 }
 
 export function InlineEdit({ value, onSave, onCancel, className }: InlineEditProps) {
   const [editValue, setEditValue] = useState(value);
   const inputRef = useRef<HTMLInputElement>(null);
 
   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
       inputRef.current.select();
     }
   }, []);
 
   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
       e.preventDefault();
       if (editValue.trim() && editValue !== value) {
         onSave(editValue.trim());
       } else {
         onCancel();
       }
     } else if (e.key === 'Escape') {
       onCancel();
     }
   };
 
   const handleBlur = () => {
     if (editValue.trim() && editValue !== value) {
       onSave(editValue.trim());
     } else {
       onCancel();
     }
   };
 
   return (
     <Input
       ref={inputRef}
       value={editValue}
       onChange={(e) => setEditValue(e.target.value)}
       onKeyDown={handleKeyDown}
       onBlur={handleBlur}
       className={cn("font-medium", className)}
     />
   );
 }