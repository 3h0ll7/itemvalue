import { motion } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
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
    </div>
  );
}
