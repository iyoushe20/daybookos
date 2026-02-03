import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { 
  ArrowRight, 
  ClipboardList, 
  Sparkles, 
  FileBarChart,
  CheckCircle2,
  Quote
} from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Paste your notes',
    description: 'Write however you want. No formatting needed.',
  },
  {
    icon: Sparkles,
    title: 'AI structures',
    description: 'We extract actions, follow-ups, blockers.',
  },
  {
    icon: FileBarChart,
    title: 'Get reports',
    description: 'One-click weekly updates.',
  },
];

const benefits = [
  'Save 30-45 minutes per week',
  'Never miss a follow-up',
  'Reduce status meetings by 50%',
  'Make your work visible to leadership',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div className="container relative py-24 md:py-32">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turn your daily chaos
              <br />
              <span className="gradient-text">into structured execution</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Paste your notes. Get an AI-structured plan. Never miss a follow-up again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2 text-base px-8" asChild>
                <Link to="/login">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base">
                Watch Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border bg-card py-8">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            Trusted by Product Managers at leading startups
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to transform your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light text-primary mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-primary bg-primary-light rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Built for PMs who want to focus on what matters
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-lg">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-category-followup/10 rounded-2xl p-8 border border-border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="text-sm font-medium">Before: Scattered notes</span>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground font-mono">
                      Meeting with Raj about PRD<br />
                      Need to follow up with Meha<br />
                      Blocked on legal sign-off<br />
                      Update Jira ticket...
                    </div>
                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm font-medium">After: Structured plan</span>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="badge-action px-2 py-0.5 rounded text-xs">Action</span>
                        Update Jira ticket
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="badge-followup px-2 py-0.5 rounded text-xs">Follow-up</span>
                        Follow up with Meha
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="badge-blocker px-2 py-0.5 rounded text-xs">Blocker</span>
                        Legal sign-off pending
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
              "Finally, a tool that works the way I do. I paste my messy notes and get a clear action plan. It's like having a personal assistant."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
                PS
              </div>
              <div className="text-left">
                <div className="font-medium">Priya Sharma</div>
                <div className="text-sm text-muted-foreground">Product Manager, FinTech Startup</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join hundreds of PMs who've transformed their productivity.
            </p>
            <Button size="lg" className="gap-2 text-base px-8" asChild>
              <Link to="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 PM Task OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
