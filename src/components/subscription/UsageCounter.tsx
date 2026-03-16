import { motion } from "framer-motion";
import { Crown, AlertTriangle } from "lucide-react";

interface UsageCounterProps {
  isPro: boolean;
  evaluationsUsed: number;
  evaluationsLimit: number;
  evaluationsRemaining: number;
  onUpgradeClick: () => void;
}

export function UsageCounter({
  isPro,
  evaluationsUsed,
  evaluationsLimit,
  evaluationsRemaining,
  onUpgradeClick,
}: UsageCounterProps) {
  if (isPro) {
    return (
      <div className="bg-green-600/10 text-green-700 dark:text-green-400 px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
        <Crown className="w-4 h-4" />
        <span className="font-medium">PRO — تقييمات غير محدودة</span>
      </div>
    );
  }

  const percentage = Math.min(100, (evaluationsUsed / evaluationsLimit) * 100);
  const barColor =
    evaluationsUsed <= 2
      ? "bg-green-500"
      : evaluationsUsed <= 4
      ? "bg-yellow-500"
      : "bg-destructive";

  if (evaluationsRemaining === 0) {
    return (
      <button
        onClick={onUpgradeClick}
        className="w-full bg-destructive/10 text-destructive px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <AlertTriangle className="w-4 h-4" />
        انتهت تقييماتك — اشترك للاستمرار
      </button>
    );
  }

  return (
    <button
      onClick={onUpgradeClick}
      className="w-full px-4 py-2.5 grid-border-b hover:bg-muted/30 transition-colors"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">
          {evaluationsRemaining === 1 && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-flex items-center gap-1"
            >
              ⚠️ آخر تقييم مجاني!
            </motion.span>
          )}
          {evaluationsRemaining > 1 && `باقيلك ${evaluationsRemaining} تقييم مجاني`}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {evaluationsUsed}/{evaluationsLimit}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </button>
  );
}
