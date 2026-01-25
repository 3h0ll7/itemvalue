import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";

interface OnboardingScreenProps {
  onSelectGovernorate: (gov: GovernorateId) => void;
}

export function OnboardingScreen({ onSelectGovernorate }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid-border-b py-6 px-6 flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl tracking-tight">بلّه</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            مُقدّر الأسعار
          </p>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid-border-b py-12 px-6 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-bold">
          شكد تسوه؟
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
          الأسماء الزينة ما تشرح نفسها، تخلي المستخدم يجرّب. وهذا واحد منها.
        </p>
      </motion.div>

      {/* Location Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <div className="grid-border-b py-4 px-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            اختر المحافظة
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {GOVERNORATES.map((gov, index) => (
              <motion.button
                key={gov.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.02 }}
                onClick={() => onSelectGovernorate(gov.id)}
                className="grid-border p-6 text-start hover:bg-muted/50 transition-colors group"
              >
                <span className="text-lg font-semibold block mb-1 group-hover:-translate-x-1 transition-transform">
                  {gov.nameAr}
                </span>
                <span className="text-sm text-muted-foreground">
                  {gov.name}
                </span>
                <ArrowLeft className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid-border-t py-4 px-6"
      >
        <p className="text-xs font-mono text-muted-foreground text-center">
          مدعوم بالذكاء الاصطناعي • الأسعار بالدينار العراقي
        </p>
      </motion.footer>
    </div>
  );
}
