import { motion } from "framer-motion";

export function AnalyzingScreen() {
  const steps = [
    { label: 'التعرف على الشي', delay: 0 },
    { label: 'البحث بالسوق', delay: 0.8 },
    { label: 'حساب السعر', delay: 1.6 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="grid-border-b py-6 px-6">
        <h1 className="text-2xl text-center">جاري التحليل</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-24 h-24 mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 grid-border"
            style={{ transformOrigin: 'center' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 grid-border"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 bg-foreground"
          />
        </motion.div>

        {/* Steps */}
        <div className="w-full max-w-xs space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="grid-border p-4 flex items-center justify-between"
            >
              <span className="font-mono text-sm">{step.label}</span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ delay: step.delay, duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-foreground"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="grid-border-t py-4 px-6">
        <p className="text-xs font-mono text-muted-foreground text-center">
          هذا عادةً ياخذ ثواني
        </p>
      </footer>
    </div>
  );
}
