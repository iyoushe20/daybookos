 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { AppLayout } from '@/components/AppLayout';
 import { StatCard } from '@/components/StatCard';
 import { Button } from '@/components/ui/button';
 import { Avatar, AvatarFallback } from '@/components/ui/avatar';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { 
   CheckSquare, 
   AlertTriangle, 
   MessageSquare,
   TrendingUp,
   Download,
   Eye,
   Users,
   Calendar,
   FileText
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface TeamMember {
   id: string;
   name: string;
   email: string;
   projects: string[];
   lastLogDate: Date;
   openTasks: number;
   blockers: number;
 }
 
 interface Blocker {
   id: string;
   text: string;
   owner: string;
   project: string;
   daysOpen: number;
   riskLevel: 'high' | 'medium' | 'low';
 }
 
 interface Ask {
   id: string;
   text: string;
   from: string;
   project: string;
   urgent: boolean;
 }
 
 const DEMO_TEAM: TeamMember[] = [
   {
     id: '1',
     name: 'Priya Sharma',
     email: 'priya@company.com',
     projects: ['Payment Gateway Integration', 'User Auth'],
     lastLogDate: new Date(),
     openTasks: 5,
     blockers: 2,
   },
   {
     id: '2',
     name: 'Amit Desai',
     email: 'amit@company.com',
     projects: ['Checkout Flow Optimization'],
     lastLogDate: new Date(Date.now() - 86400000),
     openTasks: 8,
     blockers: 1,
   },
   {
     id: '3',
     name: 'Meha Patel',
     email: 'meha@company.com',
     projects: ['API Documentation', 'Developer Portal'],
     lastLogDate: new Date(Date.now() - 2 * 86400000),
     openTasks: 3,
     blockers: 0,
   },
   {
     id: '4',
     name: 'Raj Kumar',
     email: 'raj@company.com',
     projects: ['Mobile App v2'],
     lastLogDate: new Date(Date.now() - 86400000),
     openTasks: 6,
     blockers: 1,
   },
 ];
 
 const DEMO_BLOCKERS: Blocker[] = [
   {
     id: '1',
     text: 'Blocked on legal sign-off for contract',
     owner: 'Priya Sharma',
     project: 'Payment Gateway',
     daysOpen: 5,
     riskLevel: 'high',
   },
   {
     id: '2',
     text: 'Vendor pricing model change rejected',
     owner: 'Priya Sharma',
     project: 'Payment Gateway',
     daysOpen: 3,
     riskLevel: 'medium',
   },
   {
     id: '3',
     text: 'Design review pending from UX team',
     owner: 'Amit Desai',
     project: 'Checkout Flow',
     daysOpen: 2,
     riskLevel: 'medium',
   },
   {
     id: '4',
     text: 'API rate limits hitting production',
     owner: 'Raj Kumar',
     project: 'Mobile App v2',
     daysOpen: 1,
     riskLevel: 'high',
   },
 ];
 
 const DEMO_ASKS: Ask[] = [
   {
     id: '1',
     text: "Need Raj's review on PRD draft",
     from: 'Priya Sharma',
     project: 'Payment Gateway',
     urgent: true,
   },
   {
     id: '2',
     text: 'Request escalation support for vendor negotiations',
     from: 'Priya Sharma',
     project: 'Payment Gateway',
     urgent: false,
   },
   {
     id: '3',
     text: 'Need approval for additional QA resources',
     from: 'Amit Desai',
     project: 'Checkout Flow',
     urgent: false,
   },
 ];
 
export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const stats = {
    openTasks: DEMO_TEAM.reduce((sum, m) => sum + m.openTasks, 0),
    blockers: DEMO_BLOCKERS.length,
    asks: DEMO_ASKS.length,
    highRisk: DEMO_BLOCKERS.filter(b => b.riskLevel === 'high').length,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold">Manager Dashboard</h1>
             <p className="text-muted-foreground flex items-center gap-2">
               <Users className="h-4 w-4" />
               Product Team ({DEMO_TEAM.length} PMs)
             </p>
           </div>
           <div className="flex gap-2">
             <Select value={teamFilter} onValueChange={setTeamFilter}>
               <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Filter team" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Members</SelectItem>
                 {DEMO_TEAM.map(m => (
                   <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Button variant="outline" className="gap-2">
               <Download className="h-4 w-4" />
               Export
             </Button>
           </div>
         </div>
 
         {/* Quick Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard
             label="Open Tasks"
             value={stats.openTasks}
             icon={<CheckSquare className="h-5 w-5" />}
             accentColor="bg-primary-light text-primary"
           />
           <StatCard
             label="Blockers"
             value={stats.blockers}
             icon={<AlertTriangle className="h-5 w-5" />}
             accentColor="bg-category-blocker-light text-category-blocker"
           />
           <StatCard
             label="Asks"
             value={stats.asks}
             icon={<MessageSquare className="h-5 w-5" />}
             accentColor="bg-category-followup-light text-category-followup"
           />
           <StatCard
             label="High Risk"
             value={stats.highRisk}
             icon={<TrendingUp className="h-5 w-5" />}
             accentColor="bg-destructive/10 text-destructive"
           />
         </div>
 
         <div className="grid lg:grid-cols-2 gap-6">
           {/* Team Members */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-card border border-border rounded-xl p-6"
           >
             <h2 className="font-semibold mb-4 flex items-center gap-2">
               <Users className="h-5 w-5" />
               Team Members
             </h2>
             <div className="space-y-4">
               {DEMO_TEAM.map((member, index) => (
                 <motion.div
                   key={member.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                     <Avatar>
                       <AvatarFallback className="bg-primary/10 text-primary text-sm">
                         {getInitials(member.name)}
                       </AvatarFallback>
                     </Avatar>
                     <div>
                       <p className="font-medium">{member.name}</p>
                       <p className="text-xs text-muted-foreground">
                         {member.projects.join(' • ')}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="text-right text-sm">
                       <p className="text-muted-foreground flex items-center gap-1">
                         <Calendar className="h-3 w-3" />
                         {formatDate(member.lastLogDate)}
                       </p>
                       <p className="flex items-center gap-2">
                         <span>{member.openTasks} tasks</span>
                         {member.blockers > 0 && (
                           <span className="text-destructive flex items-center gap-1">
                             <AlertTriangle className="h-3 w-3" />
                             {member.blockers}
                           </span>
                         )}
                       </p>
                     </div>
                     <Button variant="ghost" size="sm">
                       <Eye className="h-4 w-4" />
                     </Button>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
 
           {/* Blockers & Risks */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-card border border-border rounded-xl p-6"
           >
             <h2 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
               <AlertTriangle className="h-5 w-5" />
               Top Blockers
             </h2>
             <div className="space-y-3">
               {DEMO_BLOCKERS.slice(0, 4).map((blocker, index) => (
                 <motion.div
                   key={blocker.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className={cn(
                     "p-3 border rounded-lg",
                     blocker.riskLevel === 'high' 
                       ? 'border-l-[3px] border-l-destructive border-destructive/30' 
                       : 'border-border'
                   )}
                 >
                   <div className="flex items-start justify-between">
                     <div>
                       <p className="font-medium text-sm flex items-center gap-2">
                         <AlertTriangle className={cn(
                           "h-4 w-4",
                           blocker.riskLevel === 'high' ? 'text-destructive' : 'text-warning'
                         )} />
                         {blocker.text}
                       </p>
                       <p className="text-xs text-muted-foreground mt-1">
                         Owner: {blocker.owner} • {blocker.project}
                       </p>
                     </div>
                     <span className="text-xs text-muted-foreground whitespace-nowrap">
                       {blocker.daysOpen} days
                     </span>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
         </div>
 
         {/* Asks Section */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-card border border-border rounded-xl p-6"
         >
           <div className="flex items-center justify-between mb-4">
             <h2 className="font-semibold flex items-center gap-2">
               <MessageSquare className="h-5 w-5 text-category-followup" />
               Top Asks (Across Team)
             </h2>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {DEMO_ASKS.map((ask, index) => (
               <motion.div
                 key={ask.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.05 }}
                 className="p-4 border border-border rounded-lg"
               >
                 <div className="flex items-start gap-2 mb-2">
                   {ask.urgent && (
                     <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                       urgent
                     </span>
                   )}
                 </div>
                 <p className="font-medium text-sm">{ask.text}</p>
                 <p className="text-xs text-muted-foreground mt-2">
                   From: {ask.from} • {ask.project}
                 </p>
               </motion.div>
             ))}
           </div>
         </motion.div>
 
         {/* Generate Report Button */}
         <div className="flex justify-center">
           <Button size="lg" className="gap-2" onClick={() => navigate('/reports/generate')}>
             <FileText className="h-5 w-5" />
             Generate Cross-Team Report
           </Button>
         </div>
       </div>
     </AppLayout>
   );
 }