import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, CheckCircle2, FileBarChart, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Paste your notes',
    description: 'Write however you want — meeting notes, quick thoughts, stream of consciousness. No formatting needed.',
    color: 'primary',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI extracts tasks',
    description: 'Our AI identifies actions, follow-ups, blockers, and updates automatically with confidence scores.',
    color: 'category-followup',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Review & confirm',
    description: 'Quick review, edit if needed, and confirm. Your structured task list is ready.',
    color: 'success',
  },
  {
    number: '04',
    icon: FileBarChart,
    title: 'Generate reports',
    description: 'One-click weekly summaries for stakeholders. No more status meeting prep.',
    color: 'category-action',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative">
        <motion.div 
          className="text-center mb-16 md:mb-20"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
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
                <div className="hidden lg:block absolute top-12 left-full w-full h-px">
                  <div className="h-full bg-gradient-to-r from-border via-primary/30 to-border" />
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-primary/50" />
                </div>
              )}

              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-1">
                {/* Step number */}
                <div className="text-6xl font-bold text-muted/30 mb-4 font-mono">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${step.color}-light text-${step.color} mb-4`}>
                  <step.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
