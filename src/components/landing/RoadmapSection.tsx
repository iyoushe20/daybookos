 import { motion } from 'framer-motion';
 import { Shield, Mail, Users, Brain, Check, Clock, ArrowRight } from 'lucide-react';
 
 const phases = [
   {
     id: 'phase-a',
     phase: 'Phase A',
     title: 'Trust & Polish',
     duration: '0-6 weeks',
     status: 'current',
     icon: Shield,
     color: 'primary',
     features: [
       'Parse confidence & source snippets',
       'Inline quick edit with undo',
       'Parsing audit log & provenance',
     ],
     description: 'Build trust in AI outputs with transparency and easy corrections.',
   },
   {
     id: 'phase-b',
     phase: 'Phase B',
     title: 'Intake & Sync',
     duration: '6-14 weeks',
     status: 'upcoming',
     icon: Mail,
     color: 'category-followup',
     features: [
       'Email intake (auto-forward notes)',
       'Calendar sync (import meetings)',
       'Slack integration (/log command)',
     ],
     description: 'Capture work from everywhere — email, calendar, Slack.',
   },
   {
     id: 'phase-c',
     phase: 'Phase C',
     title: 'Team & Integrations',
     duration: '14-26 weeks',
     status: 'upcoming',
     icon: Users,
     color: 'success',
     features: [
       'Manager view & shared reports',
       'Jira / Linear two-way sync',
       'Team workspaces & permissions',
     ],
     description: 'Scale from individual tool to team execution OS.',
   },
   {
     id: 'phase-d',
     phase: 'Phase D',
     title: 'Advanced AI & Analytics',
     duration: '26-40 weeks',
     status: 'upcoming',
     icon: Brain,
     color: 'category-action',
     features: [
       'AI risk alerts & blocker escalation',
       'OKR & outcome tracking',
       'Predictive analytics & insights',
     ],
     description: 'Make the product smarter — predictive, proactive, measurable.',
   },
 ];
 
 const getColorClasses = (color: string, status: string) => {
   const isCurrent = status === 'current';
   const baseClasses = {
     primary: {
       bg: isCurrent ? 'bg-primary' : 'bg-primary/20',
       text: isCurrent ? 'text-primary-foreground' : 'text-primary',
       border: 'border-primary/30',
       light: 'bg-primary/10',
     },
     'category-followup': {
       bg: isCurrent ? 'bg-[hsl(var(--category-followup))]' : 'bg-[hsl(var(--category-followup))]/20',
       text: isCurrent ? 'text-white' : 'text-[hsl(var(--category-followup))]',
       border: 'border-[hsl(var(--category-followup))]/30',
       light: 'bg-[hsl(var(--category-followup))]/10',
     },
     success: {
       bg: isCurrent ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--success))]/20',
       text: isCurrent ? 'text-white' : 'text-[hsl(var(--success))]',
       border: 'border-[hsl(var(--success))]/30',
       light: 'bg-[hsl(var(--success))]/10',
     },
     'category-action': {
       bg: isCurrent ? 'bg-[hsl(var(--category-action))]' : 'bg-[hsl(var(--category-action))]/20',
       text: isCurrent ? 'text-white' : 'text-[hsl(var(--category-action))]',
       border: 'border-[hsl(var(--category-action))]/30',
       light: 'bg-[hsl(var(--category-action))]/10',
     },
   };
   return baseClasses[color as keyof typeof baseClasses] || baseClasses.primary;
 };
 
 export function RoadmapSection() {
   return (
     <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
       {/* Background pattern */}
       <div className="absolute inset-0 opacity-30">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--category-followup))]/10 rounded-full blur-3xl" />
       </div>
       
       <div className="container relative">
         <motion.div 
           className="text-center mb-12 md:mb-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
             Product Roadmap
           </span>
           <h2 className="text-3xl md:text-5xl font-bold mb-4">
             What's <span className="gradient-text">coming next</span>
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Our vision for making PM Task OS the ultimate execution layer for product teams
           </p>
         </motion.div>
 
         {/* Timeline */}
         <div className="relative">
           {/* Vertical connector line for mobile */}
           <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-[hsl(var(--category-followup))] to-[hsl(var(--category-action))] md:hidden" />
           
           {/* Horizontal connector line for desktop */}
           <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-[hsl(var(--category-followup))] via-[hsl(var(--success))] to-[hsl(var(--category-action))]" />
           
           <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
             {phases.map((phase, index) => {
               const colors = getColorClasses(phase.color, phase.status);
               const Icon = phase.icon;
               
               return (
                 <motion.div
                   key={phase.id}
                   className="relative pl-16 md:pl-0"
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: index * 0.15 }}
                 >
                   {/* Mobile timeline dot */}
                   <div className={`absolute left-4 top-0 w-5 h-5 rounded-full ${colors.bg} border-4 border-background md:hidden z-10`} />
                   
                   {/* Desktop timeline node */}
                   <div className="hidden md:flex justify-center mb-6">
                     <motion.div 
                       className={`relative w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center shadow-lg`}
                       whileHover={{ scale: 1.1 }}
                       transition={{ type: 'spring', stiffness: 400 }}
                     >
                       <Icon className={`h-5 w-5 ${phase.status === 'current' ? 'text-white' : colors.text}`} />
                       {phase.status === 'current' && (
                         <motion.div
                           className="absolute inset-0 rounded-full bg-primary"
                           initial={{ scale: 1, opacity: 0.5 }}
                           animate={{ scale: 1.5, opacity: 0 }}
                           transition={{ duration: 1.5, repeat: Infinity }}
                         />
                       )}
                     </motion.div>
                   </div>
                   
                   {/* Card */}
                   <motion.div 
                     className={`bg-card border ${phase.status === 'current' ? 'border-primary/50 shadow-elevated' : 'border-border'} rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300`}
                     whileHover={{ y: -4 }}
                   >
                     {/* Phase label */}
                     <div className="flex items-center gap-3 mb-4">
                       <span className={`text-xs font-bold uppercase tracking-wider ${colors.text} ${colors.light} px-2 py-1 rounded`}>
                         {phase.phase}
                       </span>
                       {phase.status === 'current' && (
                         <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded flex items-center gap-1">
                           <Clock className="h-3 w-3" />
                           In Progress
                         </span>
                       )}
                     </div>
                     
                     <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                     <p className="text-muted-foreground text-sm mb-4">{phase.description}</p>
                     
                     {/* Duration badge */}
                     <div className="text-xs text-muted-foreground mb-4 font-mono">
                       {phase.duration}
                     </div>
                     
                     {/* Features list */}
                     <ul className="space-y-2">
                       {phase.features.map((feature, i) => (
                         <motion.li 
                           key={feature}
                           className="flex items-start gap-2 text-sm"
                           initial={{ opacity: 0, x: -10 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                         >
                           <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${phase.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                           <span className={phase.status === 'current' ? 'text-foreground' : 'text-muted-foreground'}>
                             {feature}
                           </span>
                         </motion.li>
                       ))}
                     </ul>
                   </motion.div>
                 </motion.div>
               );
             })}
           </div>
         </div>
         
         {/* CTA */}
         <motion.div 
           className="text-center mt-12"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.6 }}
         >
           <p className="text-muted-foreground mb-4">
             Want to influence our roadmap? We'd love your feedback.
           </p>
           <a 
             href="#" 
             className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
           >
             Join our feedback community
             <ArrowRight className="h-4 w-4" />
           </a>
         </motion.div>
       </div>
     </section>
   );
 }