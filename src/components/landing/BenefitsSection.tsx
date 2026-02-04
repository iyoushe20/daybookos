import { motion } from 'framer-motion';
import { 
  Clock, 
  Bell, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap 
} from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Save 30-45 mins/week',
    description: 'No more manual task sorting or report writing. AI does the heavy lifting.',
  },
  {
    icon: Bell,
    title: 'Never miss a follow-up',
    description: 'AI catches every action item and due date from your notes.',
  },
  {
    icon: Users,
    title: '50% fewer status meetings',
    description: 'Auto-generated reports keep stakeholders in the loop without meetings.',
  },
  {
    icon: TrendingUp,
    title: 'Visible impact',
    description: 'Clear tracking makes your work visible to leadership.',
  },
  {
    icon: Shield,
    title: 'Enterprise-ready security',
    description: 'SOC 2 compliant with end-to-end encryption.',
  },
  {
    icon: Zap,
    title: 'Works instantly',
    description: 'No setup required. Just paste and go.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Benefits
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for PMs who <span className="gradient-text">ship</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Focus on what matters. Let AI handle the busywork.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
