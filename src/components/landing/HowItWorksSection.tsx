 import { motion } from 'framer-motion';
 import { ClipboardList, Sparkles, CheckCircle2, FileBarChart, ArrowRight, Eye, Fingerprint, Undo2 } from 'lucide-react';

 const steps = [
   {
     number: '01',
     icon: ClipboardList,
     title: 'Paste your notes',
     description: 'Write however you want — meeting notes, quick thoughts, stream of consciousness. No formatting needed.',
     gradient: 'from-primary to-primary/70',
     bgColor: 'bg-primary/10',
     textColor: 'text-primary',
     features: ['Any format works', 'No structure required'],
   },
   {
     number: '02',
     icon: Sparkles,
     title: 'AI extracts with confidence',
     description: 'Our AI identifies actions, follow-ups, and blockers with confidence scores and source provenance you can trust.',
     gradient: 'from-[hsl(var(--category-followup))] to-[hsl(var(--category-followup))]/70',
     bgColor: 'bg-[hsl(var(--category-followup))]/10',
     textColor: 'text-[hsl(var(--category-followup))]',
     features: ['Confidence scores', 'Source snippets'],
   },
   {
     number: '03',
     icon: CheckCircle2,
     title: 'Review & inline edit',
     description: 'Quick review with inline editing, instant undo, and full audit trail. Trust every extraction.',
     gradient: 'from-[hsl(var(--success))] to-[hsl(var(--success))]/70',
     bgColor: 'bg-[hsl(var(--success))]/10',
     textColor: 'text-[hsl(var(--success))]',
     features: ['Inline quick edit', 'Undo support'],
   },
   {
     number: '04',
     icon: FileBarChart,
     title: 'Generate reports',
     description: 'One-click weekly summaries for stakeholders. No more status meeting prep.',
     gradient: 'from-[hsl(var(--category-action))] to-[hsl(var(--category-action))]/70',
     bgColor: 'bg-[hsl(var(--category-action))]/10',
     textColor: 'text-[hsl(var(--category-action))]',
     features: ['Auto-generated', 'Stakeholder-ready'],
   },
 ];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From chaos to clarity in <span className="gradient-text">4 steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple workflow that turns your daily notes into structured, actionable tasks
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-16 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] items-center">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-border via-primary/40 to-border rounded-full" />
                  <ArrowRight className="h-4 w-4 text-primary/60 -ml-1" />
                </div>
              )}

              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-2">
                {/* Step number - Now visible with gradient */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} mb-5 shadow-lg`}>
                  <span className="text-2xl font-bold text-white font-mono">{step.number}</span>
                </div>

 
                 {/* Icon */}
                 <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${step.bgColor} ${step.textColor} mb-4`}>
                   <step.icon className="h-5 w-5" />
                 </div>

                 <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                   {step.description}
                 </p>
                 
                 {/* Feature tags */}
                 <div className="flex flex-wrap gap-2">
                   {step.features.map((feature, i) => (
                     <motion.span
                       key={feature}
                       initial={{ opacity: 0, scale: 0.8 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                       className={`text-xs px-2 py-1 rounded-full ${step.bgColor} ${step.textColor} font-medium`}
                     >
                       {feature}
                     </motion.span>
                   ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
