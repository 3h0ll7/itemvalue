import { motion } from "framer-motion";
import { Sparkles, Search, TrendingUp } from "lucide-react";

export function AnalyzingScreen() {
  const steps = [
    { icon: Sparkles, label: "Identifying item...", delay: 0 },
    { icon: Search, label: "Searching market data...", delay: 1 },
    { icon: TrendingUp, label: "Calculating fair price...", delay: 2 },
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <div className="absolute inset-2 gradient-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Analyzing Your Item
        </h2>
        <p className="text-muted-foreground">
          This usually takes a few seconds
        </p>
      </motion.div>

      <div className="w-full max-w-xs space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay * 0.8 }}
            className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-card"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay * 0.8 + 0.2, type: "spring" }}
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <step.icon className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-foreground font-medium">{step.label}</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: step.delay * 0.8, duration: 1.5, repeat: Infinity }}
              className="ml-auto w-2 h-2 rounded-full bg-primary"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
