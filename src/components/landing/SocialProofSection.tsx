 import { motion } from 'framer-motion';
 import { Building2, Briefcase, Rocket, Globe, Zap, Shield } from 'lucide-react';
 
 const companies = [
   { name: 'Google', icon: Globe },
   { name: 'Microsoft', icon: Building2 },
   { name: 'Stripe', icon: Zap },
   { name: 'Notion', icon: Briefcase },
   { name: 'Linear', icon: Rocket },
   { name: 'Figma', icon: Shield },
 ];
 
 export function SocialProofSection() {
   return (
     <section className="border-y border-border bg-gradient-to-b from-card to-background py-12 md:py-16 overflow-hidden">
       <div className="container">
         <motion.p
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center text-sm text-muted-foreground mb-8"
         >
           Trusted by <span className="font-semibold text-foreground">500+</span> Product Managers at
         </motion.p>
         
         <div className="relative">
           {/* Gradient fade edges */}
           <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
           
           <motion.div 
             className="flex items-center justify-center gap-8 md:gap-12 flex-wrap md:flex-nowrap"
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ staggerChildren: 0.1 }}
           >
             {companies.map((company, index) => (
               <motion.div
                 key={company.name}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1, duration: 0.4 }}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
               >
                 <company.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                 <span className="font-medium text-foreground whitespace-nowrap">{company.name}</span>
               </motion.div>
             ))}
           </motion.div>
         </div>
         
         <motion.p
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="text-center text-xs text-muted-foreground mt-8"
         >
           and <span className="font-medium">100+ growing startups</span>
         </motion.p>
       </div>
     </section>
   );
 }