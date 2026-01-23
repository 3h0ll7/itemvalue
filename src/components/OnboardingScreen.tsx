import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useApp } from "@/contexts/AppContext";

interface OnboardingScreenProps {
  onSelectGovernorate: (gov: GovernorateId) => void;
}

export function OnboardingScreen({ onSelectGovernorate }: OnboardingScreenProps) {
  const { t, isRTL } = useApp();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid-border-b py-6 px-6 flex items-center justify-between"
      >
        <div className="flex-1" />
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl tracking-tight">{t('appName')}</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            {t('priceEstimator')}
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <SettingsMenu />
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
          {t('heroTitle')}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
          {t('heroDescription')}
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
            {t('selectGovernorate')}
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
                <span className="text-lg font-semibold block mb-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  {gov.name}
                </span>
                <span className="text-sm text-muted-foreground font-arabic">
                  {gov.nameAr}
                </span>
                <ArrowIcon className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          {t('poweredBy')} • {t('pricesIn')}
        </p>
      </motion.footer>
    </div>
  );
}
