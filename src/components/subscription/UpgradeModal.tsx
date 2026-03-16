import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason: "limit_reached" | "feature_locked" | "manual";
  evaluationsUsed?: number;
  featureName?: string;
}

const WHATSAPP_NUMBER = "REPLACE_WITH_YOUR_WHATSAPP_NUMBER";

const FEATURES = [
  { name: "التقييمات", free: "5 فقط", pro: "♾️ غير محدود" },
  { name: "بطاقة السعر", free: false, pro: true },
  { name: "سجل التقييمات", free: false, pro: true },
  { name: "مقارنة الأغراض", free: false, pro: true },
  { name: "تحليل تفصيلي", free: false, pro: true },
  { name: "بدون إعلانات", free: false, pro: true },
  { name: "شارة PRO 👑", free: false, pro: true },
];

export function UpgradeModal({
  isOpen,
  onClose,
  triggerReason,
  evaluationsUsed,
  featureName,
}: UpgradeModalProps) {
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowClose(false);
      const timer = setTimeout(() => setShowClose(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const triggerMessage =
    triggerReason === "limit_reached"
      ? `انتهت تقييماتك المجانية الـ ${evaluationsUsed ?? 5} — انضم لـ PRO وكمّل بلا حدود`
      : triggerReason === "feature_locked"
      ? `هذه الميزة (${featureName}) متاحة لمشتركي PRO فقط`
      : "ارتقِ لتجربة بلا حدود";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "أريد الاشتراك في باقة شكد تسوه PRO 👑"
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          dir="rtl"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={showClose ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[hsl(var(--section-pink))] to-[hsl(var(--section-purple))] text-white sm:rounded-lg"
          >
            {/* Close button - delayed */}
            {showClose && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onClose}
                className="absolute top-4 start-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            <div className="p-6 pt-8">
              {/* Crown icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex justify-center mb-4"
              >
                <span className="text-6xl">👑</span>
              </motion.div>

              {/* Trigger reason */}
              <p className="text-center text-sm opacity-90 mb-2 px-4">
                {triggerMessage}
              </p>

              {/* Title */}
              <h2 className="text-3xl text-center mb-1">ارتقِ للباقة الذهبية</h2>
              <p className="text-center text-sm opacity-80 mb-6">
                استمر بتقييم أغراضك بدون حدود
              </p>

              {/* Price section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-5 text-center">
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl font-mono font-bold">15,000</span>
                  <span className="text-lg opacity-80">د.ع / سنة</span>
                </div>
                <p className="text-sm opacity-70 mb-3">
                  يعني بس 1,250 د.ع بالشهر
                </p>
                <span className="inline-block bg-green-500/30 text-green-100 text-xs px-3 py-1 rounded-full">
                  🔥 أوفر من فنجان چاي بالشهر
                </span>
              </div>

              {/* Features comparison */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden mb-5">
                <div className="grid grid-cols-3 text-xs font-bold p-3 border-b border-white/10">
                  <span>الميزة</span>
                  <span className="text-center">حر</span>
                  <span className="text-center">ذهبي PRO</span>
                </div>
                {FEATURES.map((f, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-xs p-3 border-b border-white/5 last:border-b-0"
                  >
                    <span className="opacity-90">{f.name}</span>
                    <span className="text-center">
                      {typeof f.free === "string" ? (
                        f.free
                      ) : f.free ? (
                        <Check className="w-4 h-4 inline text-green-300" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 inline opacity-50" />
                      )}
                    </span>
                    <span className="text-center">
                      {typeof f.pro === "string" ? (
                        <span className="text-green-300 font-bold">{f.pro}</span>
                      ) : (
                        <Check className="w-4 h-4 inline text-green-300" />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-14 bg-foreground text-background font-bold text-base rounded-lg mb-3 hover:opacity-90 transition-opacity"
              >
                <Crown className="w-5 h-5" />
                اشترك الآن — 15,000 د.ع
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 bg-green-600 text-white text-sm rounded-lg mb-4 hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                تواصل عبر واتساب للدفع
              </a>

              <p className="text-xs text-center opacity-60 mb-1">
                الدفع يدوي حالياً — ZainCash أو نقداً — يُفعَّل خلال ساعة
              </p>
              <p className="text-xs text-center opacity-50">
                ضمان استرداد خلال 7 أيام إذا مو راضي
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
