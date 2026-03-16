import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { useGlobalStats } from "@/hooks/useGlobalStats";

export function StatsTickerBar() {
  const { data: stats, isLoading } = useGlobalStats();

  if (isLoading || !stats || stats.totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-section-orange text-section-orange-foreground px-4 py-2.5 flex items-center justify-between text-sm"
        dir="rtl"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 animate-pulse" />
          <span className="font-medium">
            تم تقييم {stats.todayCount.toLocaleString("ar-IQ")} غرض اليوم
          </span>
        </div>
        <div className="flex items-center gap-1.5 opacity-80 text-xs">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{stats.totalCount.toLocaleString("ar-IQ")} إجمالي</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
