import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ClipboardList, 
  CheckCircle2, 
  FileBarChart,
  Lightbulb,
  Mail,
  Users,
  Shield
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GuidedTourContextType {
  isActive: boolean;
  currentStep: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const GuidedTourContext = createContext<GuidedTourContextType | undefined>(undefined);

export function useGuidedTour() {
  const context = useContext(GuidedTourContext);
  if (!context) {
    throw new Error('useGuidedTour must be used within GuidedTourProvider');
  }
  return context;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Daybook! 📓',
    description: 'Your AI-powered daily work companion. Let\'s show you how Daybook turns messy notes into structured, actionable tasks.',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: 'paste-notes',
    title: 'Step 1: Capture Your Day',
    description: 'Write or paste your daily work notes in any format — meeting summaries, to-dos, random thoughts. No structure needed!',
    icon: <ClipboardList className="h-6 w-6" />,
    highlight: 'logs-new',
  },
  {
    id: 'ai-extraction',
    title: 'Step 2: AI Extracts Tasks',
    description: 'Daybook AI identifies actions, follow-ups, blockers, and updates from your notes with confidence scores and source snippets.',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: 'review-confirm',
    title: 'Step 3: Review & Confirm',
    description: 'Review what AI extracted with confidence badges, see the source text, edit inline if needed, and confirm. Every change is tracked in the audit log.',
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
  {
    id: 'email-intake',
    title: 'Step 4: Email & Calendar Sync',
    description: 'Forward emails to your unique Daybook address to auto-parse tasks. Connect Google or Outlook calendars to pull meeting context.',
    icon: <Mail className="h-6 w-6" />,
  },
  {
    id: 'manager-view',
    title: 'Step 5: Manager Dashboard',
    description: 'Managers can switch to Team View to see top 5 blockers, top 5 asks, and team-wide task status at a glance.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 'reports',
    title: 'Step 6: Generate Reports',
    description: 'One-click weekly reports summarize your work for stakeholders. No more status meeting prep!',
    icon: <FileBarChart className="h-6 w-6" />,
  },
  {
    id: 'tips',
    title: 'Pro Tips',
    description: 'Use natural language like "need to follow up with Raj about PRD" or "blocked on legal approval" — Daybook AI understands context!',
    icon: <Lightbulb className="h-6 w-6" />,
  },
];

interface GuidedTourProviderProps {
  children: React.ReactNode;
}

export function GuidedTourProvider({ children }: GuidedTourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const endTour = () => {
    setIsActive(false);
    localStorage.setItem('daybook_tour_completed', 'true');
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < TOUR_STEPS.length) {
      setCurrentStep(step);
    }
  };

  return (
    <GuidedTourContext.Provider
      value={{
        isActive,
        currentStep,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
    </GuidedTourContext.Provider>
  );
}

export function GuidedTourModal() {
  const { isActive, currentStep, endTour, nextStep, prevStep } = useGuidedTour();
  const step = TOUR_STEPS[currentStep];

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8"
            onClick={endTour}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="p-8 pt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary">
                  {step.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual example for AI extraction step */}
                {step.id === 'ai-extraction' && (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-3 font-medium flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      PARSE PROVENANCE PREVIEW
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-category-action-light text-category-action">Action</span>
                        <span>Update Jira ticket for sprint</span>
                        <span className="ml-auto text-xs text-success font-medium">95%</span>
                      </div>
                      <div className="text-xs text-muted-foreground pl-4 border-l-2 border-primary/30 italic">
                        "...need to update the Jira ticket before sprint planning..."
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-3">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-category-blocker-light text-category-blocker">Blocker</span>
                        <span>Waiting for legal sign-off</span>
                        <span className="ml-auto text-xs text-warning font-medium">72%</span>
                      </div>
                      <div className="text-xs text-muted-foreground pl-4 border-l-2 border-primary/30 italic">
                        "...blocked on legal, they haven't responded..."
                      </div>
                    </div>
                  </div>
                )}

                {/* Manager view visual */}
                {step.id === 'manager-view' && (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-3 font-medium">MANAGER DASHBOARD PREVIEW</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-destructive/10 rounded-lg p-2">
                        <div className="text-xs text-destructive font-medium">Top 5 Blockers</div>
                        <div className="text-lg font-bold text-destructive">4</div>
                      </div>
                      <div className="bg-category-followup-light rounded-lg p-2">
                        <div className="text-xs text-category-followup font-medium">Top 5 Asks</div>
                        <div className="text-lg font-bold text-category-followup">3</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email intake visual */}
                {step.id === 'email-intake' && (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-3 font-medium">EMAIL INTAKE</div>
                    <div className="font-mono text-xs bg-card px-3 py-2 rounded border">
                      priya.abc123@intake.daybook.app
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Forward emails → Auto-parsed tasks</p>
                  </div>
                )}

                {/* Tips visual */}
                {step.id === 'tips' && (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-3">
                    <div className="text-xs text-muted-foreground font-medium">EXAMPLE INPUTS</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">→</span>
                        <span className="font-mono text-xs bg-card px-2 py-1 rounded">"Need to follow up with Raj about PRD"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">→</span>
                        <span className="font-mono text-xs bg-card px-2 py-1 rounded">"Blocked on legal approval for launch"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">→</span>
                        <span className="font-mono text-xs bg-card px-2 py-1 rounded">"Shipped new payment flow to production"</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {/* Step indicators */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-primary'
                      : index < currentStep
                      ? 'w-1.5 bg-primary/50'
                      : 'w-1.5 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    Get Started
                    <Sparkles className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Start tour button component
export function StartTourButton({ variant = 'default' }: { variant?: 'default' | 'outline' | 'ghost' }) {
  const { startTour } = useGuidedTour();
  
  return (
    <Button variant={variant} onClick={startTour} className="gap-2">
      <Lightbulb className="h-4 w-4" />
      Take a Tour
    </Button>
  );
}