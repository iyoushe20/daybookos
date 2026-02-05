 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { AppLayout } from '@/components/AppLayout';
 import { StatCard } from '@/components/StatCard';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Progress } from '@/components/ui/progress';
 import { 
   TrendingUp, 
   TrendingDown,
   Target,
   CheckCircle,
   AlertTriangle,
   Clock,
   BarChart3,
   LineChart,
   PieChart,
   Sparkles,
   Download
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface OKR {
   id: string;
   objective: string;
   keyResults: {
     id: string;
     text: string;
     target: number;
     current: number;
     unit: string;
   }[];
   progress: number;
   status: 'on_track' | 'at_risk' | 'behind';
 }
 
 interface RiskAlert {
   id: string;
   type: 'blocker_escalation' | 'deadline_risk' | 'dependency_blocked';
   title: string;
   description: string;
   severity: 'high' | 'medium' | 'low';
   project: string;
   createdAt: Date;
   aiConfidence: number;
 }
 
 const DEMO_OKRS: OKR[] = [
   {
     id: '1',
     objective: 'Launch Payment Gateway Integration',
     keyResults: [
       { id: 'kr1', text: 'Complete Stripe integration', target: 100, current: 85, unit: '%' },
       { id: 'kr2', text: 'Process 1000 test transactions', target: 1000, current: 750, unit: 'transactions' },
       { id: 'kr3', text: 'Achieve <2s payment latency', target: 2, current: 1.8, unit: 's' },
     ],
     progress: 78,
     status: 'on_track',
   },
   {
     id: '2',
     objective: 'Improve User Authentication Experience',
     keyResults: [
       { id: 'kr4', text: 'Reduce login time', target: 3, current: 4.2, unit: 's' },
       { id: 'kr5', text: 'Implement SSO for enterprise', target: 100, current: 60, unit: '%' },
       { id: 'kr6', text: 'Achieve 99.9% auth uptime', target: 99.9, current: 99.7, unit: '%' },
     ],
     progress: 55,
     status: 'at_risk',
   },
   {
     id: '3',
     objective: 'Scale API Documentation',
     keyResults: [
       { id: 'kr7', text: 'Document all public endpoints', target: 100, current: 40, unit: '%' },
       { id: 'kr8', text: 'Create 50 code examples', target: 50, current: 12, unit: 'examples' },
     ],
     progress: 32,
     status: 'behind',
   },
 ];
 
 const DEMO_RISK_ALERTS: RiskAlert[] = [
   {
     id: '1',
     type: 'blocker_escalation',
     title: 'Legal approval blocker - 5 days',
     description: 'Contract sign-off has been blocked for 5 days. This is impacting Payment Gateway timeline.',
     severity: 'high',
     project: 'Payment Gateway',
     createdAt: new Date(),
     aiConfidence: 92,
   },
   {
     id: '2',
     type: 'deadline_risk',
     title: 'Q1 deadline at risk',
     description: 'Based on current velocity, the User Auth project may miss Q1 deadline by 2 weeks.',
     severity: 'medium',
     project: 'User Auth',
     createdAt: new Date(Date.now() - 3600000),
     aiConfidence: 78,
   },
   {
     id: '3',
     type: 'dependency_blocked',
     title: 'External dependency stalled',
     description: 'Vendor API changes are blocking 3 tasks. Recommend escalation to vendor management.',
     severity: 'high',
     project: 'Payment Gateway',
     createdAt: new Date(Date.now() - 7200000),
     aiConfidence: 85,
   },
 ];
 
 const WeeklyTrends = () => {
   const trends = [
     { label: 'Tasks Completed', value: 23, change: 15, positive: true },
     { label: 'Logs Created', value: 12, change: 8, positive: true },
     { label: 'Blockers Resolved', value: 4, change: -2, positive: false },
     { label: 'Avg Parse Trust', value: '82%', change: 5, positive: true },
   ];
 
   return (
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {trends.map((trend, i) => (
         <motion.div
           key={trend.label}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.05 }}
           className="p-4 bg-card border border-border rounded-xl"
         >
           <p className="text-sm text-muted-foreground mb-1">{trend.label}</p>
           <div className="flex items-end justify-between">
             <span className="text-2xl font-bold">{trend.value}</span>
             <span className={cn(
               "text-sm flex items-center gap-1",
               trend.positive ? 'text-success' : 'text-destructive'
             )}>
               {trend.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
               {Math.abs(trend.change)}%
             </span>
           </div>
         </motion.div>
       ))}
     </div>
   );
 };
 
 const OKRSection = () => {
   const statusColors = {
     on_track: 'text-success bg-success-light',
     at_risk: 'text-warning bg-warning-light',
     behind: 'text-destructive bg-destructive/10',
   };
 
   const statusLabels = {
     on_track: 'On Track',
     at_risk: 'At Risk',
     behind: 'Behind',
   };
 
   return (
     <div className="space-y-4">
       {DEMO_OKRS.map((okr, index) => (
         <motion.div
           key={okr.id}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: index * 0.1 }}
           className="bg-card border border-border rounded-xl p-5"
         >
           <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-3">
               <Target className="h-5 w-5 text-primary" />
               <div>
                 <h3 className="font-semibold">{okr.objective}</h3>
                 <span className={cn(
                   "text-xs px-2 py-0.5 rounded-full",
                   statusColors[okr.status]
                 )}>
                   {statusLabels[okr.status]}
                 </span>
               </div>
             </div>
             <span className="text-2xl font-bold">{okr.progress}%</span>
           </div>
           
           <Progress value={okr.progress} className="h-2 mb-4" />
           
           <div className="space-y-2">
             {okr.keyResults.map(kr => (
               <div key={kr.id} className="flex items-center justify-between text-sm">
                 <span className="text-muted-foreground">{kr.text}</span>
                 <span className="font-medium">
                   {kr.current} / {kr.target} {kr.unit}
                 </span>
               </div>
             ))}
           </div>
         </motion.div>
       ))}
     </div>
   );
 };
 
 const AIRiskAlerts = () => {
   const severityStyles = {
     high: 'border-l-destructive bg-destructive/5',
     medium: 'border-l-warning bg-warning-light/50',
     low: 'border-l-muted-foreground bg-muted/50',
   };
 
   const typeIcons = {
     blocker_escalation: <AlertTriangle className="h-5 w-5 text-destructive" />,
     deadline_risk: <Clock className="h-5 w-5 text-warning" />,
     dependency_blocked: <AlertTriangle className="h-5 w-5 text-destructive" />,
   };
 
   return (
     <div className="space-y-4">
       <div className="flex items-center gap-2 mb-4">
         <Sparkles className="h-5 w-5 text-primary" />
         <h3 className="font-semibold">AI-Powered Risk Alerts</h3>
       </div>
       
       {DEMO_RISK_ALERTS.map((alert, index) => (
         <motion.div
           key={alert.id}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: index * 0.1 }}
           className={cn(
             "border border-border rounded-lg p-4 border-l-[3px]",
             severityStyles[alert.severity]
           )}
         >
           <div className="flex items-start gap-3">
             {typeIcons[alert.type]}
             <div className="flex-1">
               <div className="flex items-start justify-between">
                 <h4 className="font-medium">{alert.title}</h4>
                 <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                   {alert.aiConfidence}% confidence
                 </span>
               </div>
               <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
               <p className="text-xs text-muted-foreground mt-2">
                 Project: {alert.project}
               </p>
             </div>
           </div>
         </motion.div>
       ))}
     </div>
   );
 };
 
 const ProductivityMetrics = () => {
   const metrics = [
     { label: 'Parse Trust Rate', value: 78, target: 75, unit: '%' },
     { label: 'Avg Edits per Item', value: 0.32, target: 0.28, unit: '' },
     { label: 'Time to Review', value: 2.1, target: 2, unit: 'min' },
     { label: 'Logs per Week', value: 4.2, target: 4, unit: '' },
   ];
 
   return (
     <div className="space-y-4">
       {metrics.map((metric, i) => (
         <div key={metric.label} className="space-y-2">
           <div className="flex justify-between text-sm">
             <span>{metric.label}</span>
             <span className="font-medium">
               {metric.value}{metric.unit} <span className="text-muted-foreground">/ target: {metric.target}{metric.unit}</span>
             </span>
           </div>
           <Progress 
             value={Math.min((metric.value / metric.target) * 100, 100)} 
             className="h-2" 
           />
         </div>
       ))}
     </div>
   );
 };
 
 export default function Analytics() {
   const [dateRange, setDateRange] = useState('7d');
 
   return (
     <AppLayout>
       <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold">Analytics & Insights</h1>
             <p className="text-muted-foreground">AI-powered productivity analytics and OKR tracking</p>
           </div>
           <div className="flex gap-2">
             <Select value={dateRange} onValueChange={setDateRange}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="7d">Last 7 days</SelectItem>
                 <SelectItem value="30d">Last 30 days</SelectItem>
                 <SelectItem value="90d">Last 90 days</SelectItem>
                 <SelectItem value="1y">Last year</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" className="gap-2">
               <Download className="h-4 w-4" />
               Export
             </Button>
           </div>
         </div>
 
         {/* Weekly Trends */}
         <WeeklyTrends />
 
         {/* Main Content */}
         <Tabs defaultValue="okrs" className="space-y-6">
           <TabsList>
             <TabsTrigger value="okrs" className="gap-2">
               <Target className="h-4 w-4" />
               OKRs
             </TabsTrigger>
             <TabsTrigger value="risks" className="gap-2">
               <AlertTriangle className="h-4 w-4" />
               Risk Alerts
             </TabsTrigger>
             <TabsTrigger value="productivity" className="gap-2">
               <BarChart3 className="h-4 w-4" />
               Productivity
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="okrs">
             <div className="grid lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2">
                 <OKRSection />
               </div>
               <div className="bg-card border border-border rounded-xl p-6">
                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                   <PieChart className="h-5 w-5" />
                   OKR Summary
                 </h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-success" />
                       On Track
                     </span>
                     <span className="font-medium">1</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-warning" />
                       At Risk
                     </span>
                     <span className="font-medium">1</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-destructive" />
                       Behind
                     </span>
                     <span className="font-medium">1</span>
                   </div>
                 </div>
               </div>
             </div>
           </TabsContent>
 
           <TabsContent value="risks">
             <div className="grid lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2">
                 <div className="bg-card border border-border rounded-xl p-6">
                   <AIRiskAlerts />
                 </div>
               </div>
               <div className="bg-card border border-border rounded-xl p-6">
                 <h3 className="font-semibold mb-4">Risk Summary</h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-destructive">High Severity</span>
                     <span className="font-bold text-destructive">2</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-warning">Medium Severity</span>
                     <span className="font-bold text-warning">1</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Low Severity</span>
                     <span className="font-bold">0</span>
                   </div>
                 </div>
                 <div className="mt-6 pt-4 border-t border-border">
                   <p className="text-sm text-muted-foreground">
                     AI analyzes your tasks, blockers, and historical data to predict potential risks before they become critical.
                   </p>
                 </div>
               </div>
             </div>
           </TabsContent>
 
           <TabsContent value="productivity">
             <div className="grid lg:grid-cols-2 gap-6">
               <div className="bg-card border border-border rounded-xl p-6">
                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                   <LineChart className="h-5 w-5" />
                   Parse Trust Metrics
                 </h3>
                 <ProductivityMetrics />
               </div>
               <div className="bg-card border border-border rounded-xl p-6">
                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                   <BarChart3 className="h-5 w-5" />
                   Activity Overview
                 </h3>
                 <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                   <div className="text-center">
                     <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                     <p>Chart visualization coming soon</p>
                   </div>
                 </div>
               </div>
             </div>
           </TabsContent>
         </Tabs>
       </div>
     </AppLayout>
   );
 }