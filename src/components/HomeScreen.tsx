import { motion } from "framer-motion";
import { Plus, ArrowLeft, Instagram, Twitter, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
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
      {/* Hero Card - Pink Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-4 p-8 grid-border bg-section-pink text-section-pink-foreground relative overflow-hidden"
      >
        {/* Decorative Icons */}
        <div className="absolute top-4 start-4 opacity-20">
          <Sparkles className="w-16 h-16" />
        </div>
        <div className="absolute bottom-4 end-24 opacity-15">
          <TrendingUp className="w-12 h-12 rotate-12" />
        </div>
        <div className="absolute top-1/2 start-1/4 opacity-10">
          <Zap className="w-8 h-8 -rotate-12" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2 relative z-10">
          شكد تسوه؟
        </h1>
        <h2 className="text-xl md:text-2xl mb-4 opacity-90 relative z-10">
          اعرف قيمة أغراضك
        </h2>
        <p className="text-sm opacity-70 mb-6 max-w-md relative z-10">
          استخدم الذكاء الاصطناعي لتسعير الأغراض المستعملة في العراق. صوّر، حلّل، وبيع بالسعر الصح.
        </p>
        <Button
          onClick={onStartScan}
          variant="outline"
          className="bg-foreground text-background hover:bg-foreground/90 h-12 px-6 border-foreground relative z-10"
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
        {/* Purple Section Header */}
        <div className="bg-section-purple text-section-purple-foreground py-3 px-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute start-4 top-1/2 -translate-y-1/2 opacity-20">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold relative z-10">أحدث التقييمات</h3>
          {recentItems.length > 0 && (
            <button 
              onClick={onViewHistory}
              className="text-xs font-mono opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1 relative z-10"
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

      {/* Developer Credit - Orange Section */}
      <div className="bg-section-orange text-section-orange-foreground py-4 px-4 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute start-4 top-1/2 -translate-y-1/2 opacity-20">
          <div className="w-8 h-8 border-2 border-current rotate-45" />
        </div>
        <div className="absolute end-8 top-1/2 -translate-y-1/2 opacity-20">
          <div className="w-6 h-6 rounded-full border-2 border-current" />
        </div>
        <p className="text-xs opacity-80 mb-2 relative z-10">
          Developed by: <span className="font-medium">𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷</span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://linktr.ee/3h0ll" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://linktr.ee/3h0ll" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
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
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
