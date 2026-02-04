import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEMO_INPUT = `Met with Raj about the PRD for payment gateway
Need to follow up with Meha on designs by Friday
Blocked on legal sign-off for the new T&C
Updated sprint board with new estimates
Customer feedback session went well - 3 action items`;

const DEMO_OUTPUT = [
  { category: 'action', text: 'Update sprint board with new estimates', confidence: 98 },
  { category: 'followup', text: 'Follow up with Meha on designs by Friday', confidence: 95 },
  { category: 'blocker', text: 'Legal sign-off pending for new T&C', confidence: 92 },
  { category: 'update', text: 'PRD discussion with Raj completed', confidence: 88 },
  { category: 'action', text: 'Process 3 action items from customer feedback', confidence: 85 },
];

export function DemoSection() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setShowOutput(false);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowOutput(true);
    }, 2000);
  };

  const resetDemo = () => {
    setShowOutput(false);
    setIsProcessing(false);
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'action':
        return 'bg-category-action-light text-category-action';
      case 'followup':
        return 'bg-category-followup-light text-category-followup';
      case 'blocker':
        return 'bg-category-blocker-light text-category-blocker';
      case 'update':
        return 'bg-category-update-light text-category-update';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-24 md:py-32 bg-card border-y border-border">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See the <span className="gradient-text">magic</span> in action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch how AI transforms unstructured notes into organized tasks
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                Your messy notes
              </div>
              <div className="bg-background border border-border rounded-2xl p-6 shadow-lg">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-muted-foreground">
                  {DEMO_INPUT}
                </pre>
              </div>
            </motion.div>

            {/* Output Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                Structured output
              </div>
              <div className="bg-background border border-border rounded-2xl p-6 shadow-lg min-h-[280px]">
                <AnimatePresence mode="wait">
                  {!showOutput && !isProcessing && (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center text-muted-foreground text-sm"
                    >
                      Click "Process with AI" to see the magic
                    </motion.div>
                  )}

                  {isProcessing && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center gap-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-8 w-8 text-primary" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">AI is extracting tasks...</span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {showOutput && (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {DEMO_OUTPUT.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                        >
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize whitespace-nowrap ${getCategoryStyles(item.category)}`}>
                            {item.category}
                          </span>
                          <span className="text-sm flex-1">{item.text}</span>
                          <span className="text-xs text-success font-medium">{item.confidence}%</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Process Button */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {!showOutput ? (
              <Button 
                size="lg" 
                className="gap-2 px-8"
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Process with AI
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-success">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">5 tasks extracted</span>
                </div>
                <Button variant="outline" onClick={resetDemo}>
                  Try Again
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
