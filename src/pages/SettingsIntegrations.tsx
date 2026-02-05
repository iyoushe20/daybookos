 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { AppLayout } from '@/components/AppLayout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Separator } from '@/components/ui/separator';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { useProjects } from '@/contexts/ProjectContext';
 import { toast } from 'sonner';
 import { 
   Mail, 
   Calendar, 
   MessageSquare, 
   Copy, 
   Check, 
   RefreshCw,
   Trash2,
   Eye,
   Link2,
   Zap,
   ExternalLink
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 // Email Intake Section
 function EmailIntakeSection() {
   const { projects } = useProjects();
   const [copied, setCopied] = useState(false);
   const [emailEnabled, setEmailEnabled] = useState(true);
   const [notifyOnCreate, setNotifyOnCreate] = useState(true);
   const [autoSelectProject, setAutoSelectProject] = useState('');
   const [autoConfirm, setAutoConfirm] = useState(false);
   
   const emailAddress = 'priya-abc123@inbox.pmtaskos.com';
   
   const recentEmailLogs = [
     {
       id: '1',
       subject: 'Re: API Documentation Review',
       from: 'meha@company.com',
       status: 'draft',
       itemsExtracted: 5,
       receivedAt: new Date(Date.now() - 3600000),
     },
     {
       id: '2',
       subject: 'Vendor Contract Updates',
       from: 'legal@vendor.com',
       status: 'processed',
       itemsExtracted: 3,
       receivedAt: new Date(Date.now() - 7200000),
     },
   ];
 
   const handleCopy = () => {
     navigator.clipboard.writeText(emailAddress);
     setCopied(true);
     toast.success('Email address copied!');
     setTimeout(() => setCopied(false), 2000);
   };
 
   const handleRegenerate = () => {
     toast.success('New email address generated');
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="p-2 rounded-lg bg-primary/10">
             <Mail className="h-5 w-5 text-primary" />
           </div>
           <div>
             <h3 className="font-semibold">Email Intake</h3>
             <p className="text-sm text-muted-foreground">Forward emails to create logs automatically</p>
           </div>
         </div>
         <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
       </div>
 
       {emailEnabled && (
         <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           className="space-y-6"
         >
           <div className="p-4 bg-muted/50 rounded-lg">
             <Label className="text-sm text-muted-foreground mb-2 block">Your email intake address</Label>
             <div className="flex gap-2">
               <Input 
                 value={emailAddress} 
                 readOnly 
                 className="font-mono text-sm"
               />
               <Button variant="outline" onClick={handleCopy} className="gap-2 shrink-0">
                 {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                 {copied ? 'Copied!' : 'Copy'}
               </Button>
             </div>
           </div>
 
           <div className="space-y-4">
             <h4 className="font-medium">How it works</h4>
             <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
               <li>Copy the email address above</li>
               <li>Add it to your email contacts or forwarding rules</li>
               <li>Forward any email to this address</li>
               <li>We'll create a draft log with parsed items</li>
             </ol>
           </div>
 
           <Separator />
 
           <div className="space-y-4">
             <h4 className="font-medium">Settings</h4>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label htmlFor="notify">Send notification when email log is created</Label>
                 <Switch id="notify" checked={notifyOnCreate} onCheckedChange={setNotifyOnCreate} />
               </div>
 
               <div className="space-y-2">
                 <Label>Auto-select project</Label>
                 <Select value={autoSelectProject} onValueChange={setAutoSelectProject}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select a default project" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="">None (ask each time)</SelectItem>
                     {projects.map(p => (
                       <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
 
               <div className="flex items-center justify-between">
                 <div>
                   <Label htmlFor="autoconfirm">Auto-confirm parsed items (skip review)</Label>
                   <p className="text-xs text-muted-foreground">Not recommended for important emails</p>
                 </div>
                 <Switch id="autoconfirm" checked={autoConfirm} onCheckedChange={setAutoConfirm} />
               </div>
             </div>
           </div>
 
           <Separator />
 
           <div className="space-y-4">
             <h4 className="font-medium">Recent email logs</h4>
             {recentEmailLogs.length > 0 ? (
               <div className="space-y-2">
                 {recentEmailLogs.map(log => (
                   <div key={log.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                     <div>
                       <p className="font-medium text-sm">{log.subject}</p>
                       <p className="text-xs text-muted-foreground">
                         From: {log.from} • {log.itemsExtracted} items extracted
                       </p>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className={cn(
                         "text-xs px-2 py-1 rounded-full",
                         log.status === 'draft' ? 'bg-warning-light text-warning' : 'bg-success-light text-success'
                       )}>
                         {log.status}
                       </span>
                       <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-muted-foreground">No email logs yet</p>
             )}
           </div>
 
           <div className="flex gap-2">
             <Button variant="outline" onClick={handleRegenerate} className="gap-2">
               <RefreshCw className="h-4 w-4" />
               Regenerate Address
             </Button>
             <Button variant="destructive" onClick={() => setEmailEnabled(false)}>
               Disable Email Intake
             </Button>
           </div>
         </motion.div>
       )}
     </div>
   );
 }
 
 // Calendar Sync Section
 function CalendarSyncSection() {
   const [googleConnected, setGoogleConnected] = useState(false);
   const [outlookConnected, setOutlookConnected] = useState(false);
   const [autoImport, setAutoImport] = useState(false);
   const [includeAttendees, setIncludeAttendees] = useState(true);
   const [includeLocation, setIncludeLocation] = useState(false);
 
   const handleConnectGoogle = () => {
     toast.success('Google Calendar connected!');
     setGoogleConnected(true);
   };
 
   const handleConnectOutlook = () => {
     toast.success('Outlook Calendar connected!');
     setOutlookConnected(true);
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center gap-3">
         <div className="p-2 rounded-lg bg-category-meeting/10">
           <Calendar className="h-5 w-5 text-category-meeting" />
         </div>
         <div>
           <h3 className="font-semibold">Calendar Sync</h3>
           <p className="text-sm text-muted-foreground">Import meeting notes directly from your calendar</p>
         </div>
       </div>
 
       <div className="grid gap-4">
         <div className="p-4 border border-border rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
               <span className="text-red-600 font-bold">G</span>
             </div>
             <div>
               <p className="font-medium">Google Calendar</p>
               {googleConnected && <p className="text-xs text-muted-foreground">priya@company.com</p>}
             </div>
           </div>
           {googleConnected ? (
             <Button variant="outline" onClick={() => setGoogleConnected(false)}>Disconnect</Button>
           ) : (
             <Button onClick={handleConnectGoogle}>Connect</Button>
           )}
         </div>
 
         <div className="p-4 border border-border rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
               <span className="text-blue-600 font-bold">M</span>
             </div>
             <div>
               <p className="font-medium">Microsoft Outlook</p>
               {outlookConnected && <p className="text-xs text-muted-foreground">priya@company.onmicrosoft.com</p>}
             </div>
           </div>
           {outlookConnected ? (
             <Button variant="outline" onClick={() => setOutlookConnected(false)}>Disconnect</Button>
           ) : (
             <Button onClick={handleConnectOutlook}>Connect</Button>
           )}
         </div>
       </div>
 
       {(googleConnected || outlookConnected) && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="space-y-4"
         >
           <Separator />
           <h4 className="font-medium">Import Settings</h4>
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <Label htmlFor="auto-import">Auto-import meetings as draft logs</Label>
               <Switch id="auto-import" checked={autoImport} onCheckedChange={setAutoImport} />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="attendees">Include meeting attendees</Label>
               <Switch id="attendees" checked={includeAttendees} onCheckedChange={setIncludeAttendees} />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="location">Include meeting location</Label>
               <Switch id="location" checked={includeLocation} onCheckedChange={setIncludeLocation} />
             </div>
           </div>
         </motion.div>
       )}
     </div>
   );
 }
 
 // Slack Integration Section
 function SlackIntegrationSection() {
   const [slackConnected, setSlackConnected] = useState(false);
 
   const handleConnectSlack = () => {
     toast.success('Slack workspace connected!');
     setSlackConnected(true);
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center gap-3">
         <div className="p-2 rounded-lg bg-purple-100">
           <MessageSquare className="h-5 w-5 text-purple-600" />
         </div>
         <div>
           <h3 className="font-semibold">Slack Integration</h3>
           <p className="text-sm text-muted-foreground">Create logs directly from Slack using /log command</p>
         </div>
       </div>
 
       {!slackConnected ? (
         <div className="p-6 border border-dashed border-border rounded-lg text-center">
           <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
           <h4 className="font-medium mb-2">Connect your Slack workspace</h4>
           <p className="text-sm text-muted-foreground mb-4">
             Use the /log command in any Slack channel to quickly create daily logs
           </p>
           <Button onClick={handleConnectSlack} className="gap-2">
             <MessageSquare className="h-4 w-4" />
             Add to Slack
           </Button>
         </div>
       ) : (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="space-y-4"
         >
           <div className="p-4 bg-success-light/50 border border-success/20 rounded-lg flex items-center gap-3">
             <Check className="h-5 w-5 text-success" />
             <div>
               <p className="font-medium text-success">Connected to Slack</p>
               <p className="text-sm text-muted-foreground">Workspace: Acme Corp</p>
             </div>
           </div>
 
           <div className="p-4 bg-muted/50 rounded-lg">
             <h4 className="font-medium mb-2">Available Commands</h4>
             <div className="space-y-2 font-mono text-sm">
               <div className="flex justify-between">
                 <code>/log</code>
                 <span className="text-muted-foreground">Open log creation form</span>
               </div>
               <div className="flex justify-between">
                 <code>/log quick [notes]</code>
                 <span className="text-muted-foreground">Quick log with notes</span>
               </div>
               <div className="flex justify-between">
                 <code>/log status</code>
                 <span className="text-muted-foreground">View today's tasks</span>
               </div>
             </div>
           </div>
 
           <Button variant="outline" onClick={() => setSlackConnected(false)}>
             Disconnect Slack
           </Button>
         </motion.div>
       )}
     </div>
   );
 }
 
 // Jira Integration Section
 function JiraIntegrationSection() {
   const { projects } = useProjects();
   const [jiraConnected, setJiraConnected] = useState(false);
   const [syncDirection, setSyncDirection] = useState('two_way');
 
   const handleConnectJira = () => {
     toast.success('Jira connected!');
     setJiraConnected(true);
   };
 
   const recentSyncActivity = [
     { action: 'Created Jira ticket PAYMENT-123', time: '10:30 AM' },
     { action: 'Synced status: PAYMENT-122 → Done', time: '10:25 AM' },
     { action: 'Updated PAYMENT-121 description', time: '9:15 AM' },
   ];
 
   return (
     <div className="space-y-6">
       <div className="flex items-center gap-3">
         <div className="p-2 rounded-lg bg-blue-100">
           <Link2 className="h-5 w-5 text-blue-600" />
         </div>
         <div>
           <h3 className="font-semibold">Jira Integration</h3>
           <p className="text-sm text-muted-foreground">Two-way sync between PM Task OS and Jira</p>
         </div>
       </div>
 
       {!jiraConnected ? (
         <div className="p-6 border border-dashed border-border rounded-lg text-center">
           <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
           <h4 className="font-medium mb-2">Connect your Jira account</h4>
           <p className="text-sm text-muted-foreground mb-4">
             Sync tasks between PM Task OS and Jira automatically
           </p>
           <Button onClick={handleConnectJira} className="gap-2">
             <Link2 className="h-4 w-4" />
             Connect Jira
           </Button>
         </div>
       ) : (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="space-y-6"
         >
           <div className="p-4 bg-success-light/50 border border-success/20 rounded-lg flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Check className="h-5 w-5 text-success" />
               <div>
                 <p className="font-medium">jira.company.com</p>
                 <p className="text-sm text-muted-foreground">priya@company.com</p>
               </div>
             </div>
             <Button variant="outline" size="sm" onClick={() => setJiraConnected(false)}>
               Disconnect
             </Button>
           </div>
 
           <div className="space-y-4">
             <h4 className="font-medium">Sync Configuration</h4>
             <div className="space-y-2">
               <Label>Sync Direction</Label>
               <Select value={syncDirection} onValueChange={setSyncDirection}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="two_way">Two-way sync</SelectItem>
                   <SelectItem value="pm_to_jira">PM Task OS → Jira only</SelectItem>
                   <SelectItem value="jira_to_pm">Jira → PM Task OS only</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <div className="space-y-4">
             <h4 className="font-medium">Project Mapping</h4>
             {projects.filter(p => p.status === 'active').map(project => (
               <div key={project.id} className="flex items-center gap-4">
                 <span className="min-w-[200px]">{project.name}</span>
                 <span className="text-muted-foreground">→</span>
                 <Select defaultValue="">
                   <SelectTrigger className="w-[200px]">
                     <SelectValue placeholder="Select Jira project" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="PAYMENT">PAYMENT-GATEWAY</SelectItem>
                     <SelectItem value="AUTH">USER-AUTH</SelectItem>
                     <SelectItem value="CORE">CORE-PLATFORM</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             ))}
           </div>
 
           <Separator />
 
           <div className="space-y-4">
             <h4 className="font-medium">Recent Sync Activity</h4>
             <div className="space-y-2">
               {recentSyncActivity.map((activity, i) => (
                 <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                   <span>{activity.action}</span>
                   <span className="text-muted-foreground">{activity.time}</span>
                 </div>
               ))}
             </div>
           </div>
         </motion.div>
       )}
     </div>
   );
 }
 
 export default function SettingsIntegrations() {
   return (
     <AppLayout>
       <div className="max-w-3xl mx-auto">
         <div className="mb-6">
           <h1 className="text-2xl font-bold">Settings</h1>
           <p className="text-muted-foreground">Manage your integrations and connections</p>
         </div>
 
         {/* Navigation Tabs */}
         <div className="flex gap-4 mb-6 border-b border-border">
           <a href="/settings/profile" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
             Profile
           </a>
           <a href="/settings/projects" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
             Projects
           </a>
           <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary -mb-px">
             Integrations
           </button>
         </div>
 
         <Tabs defaultValue="email" className="space-y-6">
           <TabsList className="grid w-full grid-cols-4">
             <TabsTrigger value="email" className="gap-2">
               <Mail className="h-4 w-4" />
               Email
             </TabsTrigger>
             <TabsTrigger value="calendar" className="gap-2">
               <Calendar className="h-4 w-4" />
               Calendar
             </TabsTrigger>
             <TabsTrigger value="slack" className="gap-2">
               <MessageSquare className="h-4 w-4" />
               Slack
             </TabsTrigger>
             <TabsTrigger value="jira" className="gap-2">
               <Link2 className="h-4 w-4" />
               Jira
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="email">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-card border border-border rounded-xl p-6"
             >
               <EmailIntakeSection />
             </motion.div>
           </TabsContent>
 
           <TabsContent value="calendar">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-card border border-border rounded-xl p-6"
             >
               <CalendarSyncSection />
             </motion.div>
           </TabsContent>
 
           <TabsContent value="slack">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-card border border-border rounded-xl p-6"
             >
               <SlackIntegrationSection />
             </motion.div>
           </TabsContent>
 
           <TabsContent value="jira">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-card border border-border rounded-xl p-6"
             >
               <JiraIntegrationSection />
             </motion.div>
           </TabsContent>
         </Tabs>
       </div>
     </AppLayout>
   );
 }