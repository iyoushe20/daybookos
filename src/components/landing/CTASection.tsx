import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const features = [
  'Free forever for personal use',
  'No credit card required',
  'Set up in 2 minutes',
];

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Limited time: Pro features free for early users
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to transform your
            <br />
            <span className="gradient-text">productivity?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join hundreds of Product Managers who've already made the switch.
          </p>

          {/* Feature list */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <Check className="h-4 w-4 text-success" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button size="lg" className="gap-2 text-base px-10 h-14 shadow-lg shadow-primary/25" asChild>
            <Link to="/login">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
