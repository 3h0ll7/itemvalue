import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";
import { Button } from "@/components/ui/button";

interface OnboardingScreenProps {
  onSelectGovernorate: (gov: GovernorateId) => void;
}

export function OnboardingScreen({ onSelectGovernorate }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-12 pb-8 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-3xl flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Welcome to <span className="text-primary">balla</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xs mx-auto">
          Get accurate prices for your used items instantly with AI
        </p>
      </motion.div>

      {/* Location Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 px-6 pb-8"
      >
        <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Select Your Location</h2>
              <p className="text-sm text-muted-foreground">Prices vary by governorate</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto -mx-2 px-2">
            <div className="grid grid-cols-2 gap-3">
              {GOVERNORATES.map((gov, index) => (
                <motion.div
                  key={gov.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.03 }}
                >
                  <Button
                    variant="hero-outline"
                    className="w-full h-auto py-4 flex flex-col gap-1"
                    onClick={() => onSelectGovernorate(gov.id)}
                  >
                    <span className="font-semibold">{gov.name}</span>
                    <span className="text-xs text-muted-foreground">{gov.nameAr}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
