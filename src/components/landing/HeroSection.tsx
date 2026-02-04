import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{ background: 'var(--gradient-hero)' }}
        />
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-category-followup/20 blur-3xl"
          animate={{ 
            y: [0, 20, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative py-24 md:py-36 lg:py-44">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="h-4 w-4" />
            AI-powered task extraction
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Turn your daily chaos
            <br />
            <span className="gradient-text">into structured execution</span>
          </h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Paste your messy notes. Watch AI extract actions, follow-ups, and blockers. 
            Never miss a task or status update again.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25" asChild>
              <Link to="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base h-12 group">
              <Play className="h-4 w-4 group-hover:text-primary transition-colors" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-16 text-center"
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">30+</div>
              <div className="text-sm text-muted-foreground">mins saved/week</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">95%</div>
              <div className="text-sm text-muted-foreground">extraction accuracy</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
              <div className="text-sm text-muted-foreground">PMs using daily</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
