import { motion } from "framer-motion";
import { Plus, ArrowLeft, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/hooks/useAppState";

interface HomeScreenProps {
  onStartScan: () => void;
  recentItems: AnalysisResult[];
  onViewHistory: () => void;
}

export function HomeScreen({ onStartScan, recentItems, onViewHistory }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir="rtl">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-4 p-8 grid-border bg-foreground text-background"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2">
          شكد تسوه؟
        </h1>
        <h2 className="text-xl md:text-2xl mb-4 opacity-90">
          اعرف قيمة أغراضك
        </h2>
        <p className="text-sm opacity-70 mb-6 max-w-md">
          استخدم الذكاء الاصطناعي لتسعير الأغراض المستعملة في العراق. صوّر، حلّل، وبيع بالسعر الصح.
        </p>
        <Button
          onClick={onStartScan}
          variant="outline"
          className="bg-background text-foreground hover:bg-background/90 h-12 px-6"
        >
          <Plus className="w-4 h-4 ms-2" />
          قيّم غرضك الآن
        </Button>
      </motion.div>

      {/* Recent Evaluations Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <div className="grid-border-t grid-border-b py-3 px-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">أحدث التقييمات</h3>
          {recentItems.length > 0 && (
            <button 
              onClick={onViewHistory}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 grid-border flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-muted-foreground text-sm font-mono">
                لا توجد تقييمات سابقة
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                ابدأ بتقييم أول غرض لك
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {recentItems.slice(0, 4).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="grid-border p-4 hover:bg-muted/30 transition-colors"
                >
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    {item.itemType}
                  </p>
                  <p className="font-semibold truncate mb-2">{item.itemName}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-mono">
                      {new Intl.NumberFormat("en-IQ").format(item.suggestedPrice)}
                    </span>
                    <span className="text-xs text-muted-foreground">د.ع</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Developer Credit */}
      <div className="grid-border-t py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Developed by: <span className="font-medium text-foreground">𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷</span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://linktr.ee/3h0ll" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://linktr.ee/3h0ll" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label="TikTok"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://linktr.ee/3h0ll" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
