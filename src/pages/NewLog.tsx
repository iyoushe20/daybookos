import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
 import { Checkbox } from '@/components/ui/checkbox';
import { useProjects } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ArrowLeft,
  Loader2,
  Link as LinkIcon,
  Plus,
  Trash2,
   Sparkles,
   Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface Attachment {
  id: string;
  url: string;
  label: string;
}

const PLACEHOLDER_TEXT = `What did you work on today? Paste your notes here...

Examples:
• Had meeting with Raj about PRD review
• Need to follow up with Meha on API docs
• Blocked on legal sign-off for vendor contract
• Decided to use Stripe for payments
• Need to update Jira ticket STATUS-123
• Vendor refused to change pricing model`;

export default function NewLog() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [date, setDate] = useState<Date>(new Date());
  const [projectId, setProjectId] = useState<string>('');
  const [rawText, setRawText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeProjects = projects.filter(p => p.status === 'active');
  const characterCount = rawText.length;
  const maxCharacters = 10000;

   // Calendar import state
   const [showCalendarImport, setShowCalendarImport] = useState(false);
   const [selectedMeetings, setSelectedMeetings] = useState<Set<string>>(new Set());
   
   // Demo meetings for today
   const todayMeetings = [
     { id: 'm1', title: 'Daily standup', start: '9:30 AM', end: '10:00 AM', attendees: ['Priya', 'Meha', 'Raj'] },
     { id: 'm2', title: '1:1 with Raj', start: '1:00 PM', end: '1:30 PM', attendees: ['Priya', 'Raj'] },
     { id: 'm3', title: 'Vendor call - Payment Gateway', start: '2:30 PM', end: '3:00 PM', attendees: ['Priya', 'Vendor Team'] },
   ];
 
   const handleToggleMeeting = (meetingId: string) => {
     setSelectedMeetings(prev => {
       const next = new Set(prev);
       if (next.has(meetingId)) {
         next.delete(meetingId);
       } else {
         next.add(meetingId);
       }
       return next;
     });
   };
 
   const handleImportMeetings = () => {
     if (selectedMeetings.size === 0) return;
     
     const imported = todayMeetings
       .filter(m => selectedMeetings.has(m.id))
       .map(m => `Meeting: ${m.title}\nTime: ${m.start} - ${m.end}\nAttendees: ${m.attendees.join(', ')}\n`)
       .join('\n---\n\n');
     
     setRawText(prev => (prev ? prev + '\n\n---\n\n' : '') + imported);
     setShowCalendarImport(false);
     setSelectedMeetings(new Set());
     toast.success(`Imported ${selectedMeetings.size} meeting(s)`);
   };
 
  const handleAddAttachment = () => {
    if (attachments.length >= 5) {
      toast.error('Maximum 5 attachments allowed');
      return;
    }
    setShowAttachments(true);
    setAttachments([...attachments, { id: `att-${Date.now()}`, url: '', label: '' }]);
  };

  const handleRemoveAttachment = (id: string) => {
    const newAttachments = attachments.filter(a => a.id !== id);
    setAttachments(newAttachments);
    if (newAttachments.length === 0) {
      setShowAttachments(false);
    }
  };

  const handleAttachmentChange = (id: string, field: 'url' | 'label', value: string) => {
    setAttachments(attachments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const isValid = projectId && rawText.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;

    // Validate attachments
    const invalidAttachments = attachments.filter(a => a.url && !isValidUrl(a.url));
    if (invalidAttachments.length > 0) {
      toast.error('Please enter valid URLs starting with http:// or https://');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Log parsed successfully!');
    navigate('/logs/demo-log-id/review');
  };

  const handleCancel = () => {
    if (rawText.trim()) {
      // In a real app, show confirmation modal
      if (confirm('Discard this log?')) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="gap-2 mb-4 -ml-3" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">New Daily Log</h1>
          <p className="text-muted-foreground">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          {/* Date and Project */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Project <span className="text-destructive">*</span></Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className={!projectId ? 'text-muted-foreground' : ''}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {activeProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-2">
             {/* Calendar Import Section */}
             <div className="mb-4 p-4 border border-dashed border-border rounded-lg">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <CalendarIcon className="h-5 w-5 text-category-meeting" />
                   <span className="font-medium">Import from Calendar</span>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => setShowCalendarImport(!showCalendarImport)}
                 >
                   {showCalendarImport ? 'Hide' : 'Show Meetings'}
                 </Button>
               </div>
               
               {showCalendarImport && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="mt-4 space-y-3"
                 >
                   <p className="text-sm text-muted-foreground">
                     Select meetings from {format(date, 'MMMM d')} to import:
                   </p>
                   {todayMeetings.map(meeting => (
                     <div 
                       key={meeting.id}
                       className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50"
                       onClick={() => handleToggleMeeting(meeting.id)}
                     >
                       <Checkbox checked={selectedMeetings.has(meeting.id)} />
                       <div className="flex-1">
                         <p className="font-medium text-sm">{meeting.title}</p>
                         <p className="text-xs text-muted-foreground flex items-center gap-1">
                           <Clock className="h-3 w-3" />
                           {meeting.start} - {meeting.end}
                         </p>
                       </div>
                     </div>
                   ))}
                   {selectedMeetings.size > 0 && (
                     <Button size="sm" onClick={handleImportMeetings} className="w-full gap-2">
                       <Plus className="h-4 w-4" />
                       Import {selectedMeetings.size} Meeting(s)
                     </Button>
                   )}
                 </motion.div>
               )}
             </div>
 
            <Label>Your Notes <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder={PLACEHOLDER_TEXT}
              value={rawText}
              onChange={(e) => setRawText(e.target.value.slice(0, maxCharacters))}
              className="min-h-[300px] resize-y font-mono text-sm"
            />
            <div className="flex justify-end">
              <span className={cn(
                "text-sm",
                characterCount > maxCharacters * 0.9 ? "text-warning" : "text-muted-foreground"
              )}>
                {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Attachments */}
          {showAttachments ? (
            <div className="space-y-4">
              <Label>Attachments</Label>
              {attachments.map((attachment, index) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="https://..."
                      value={attachment.url}
                      onChange={(e) => handleAttachmentChange(attachment.id, 'url', e.target.value)}
                      className={!isValidUrl(attachment.url) ? 'border-destructive' : ''}
                    />
                    <Input
                      placeholder="Label (optional)"
                      value={attachment.label}
                      onChange={(e) => handleAttachmentChange(attachment.id, 'label', e.target.value)}
                    />
                    {!isValidUrl(attachment.url) && attachment.url && (
                      <p className="text-xs text-destructive">
                        Please enter a valid URL starting with http:// or https://
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              {attachments.length < 5 && (
                <Button variant="ghost" size="sm" onClick={handleAddAttachment} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add another link
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {attachments.length} / 5 attachments
              </p>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground"
              onClick={handleAddAttachment}
            >
              <LinkIcon className="h-4 w-4" />
              Add link (PRD, Jira ticket, doc...)
            </Button>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
