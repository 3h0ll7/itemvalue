import { motion } from "framer-motion";
import { Search, MapPin, Tag, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "@/hooks/useAppState";

interface HistoryScreenProps {
  items: AnalysisResult[];
}

export function HistoryScreen({ items }: HistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir="rtl">
      {/* Header - Yellow Section */}
      <div className="bg-section-yellow text-section-yellow-foreground py-4 px-4 text-center">
        <h1 className="text-xl font-semibold">سجل التقييمات</h1>
        <p className="text-xs opacity-70 mt-1">
          استعرض جميع الأغراض التي تم تقييمها سابقاً
        </p>
      </div>

      {/* Search */}
      <div className="p-4 grid-border-b">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن غرض، حالة، أو محافظة..."
            className="w-full ps-10 pe-4 py-3 grid-border bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 grid-border flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-muted-foreground text-sm font-mono">
              {items.length === 0 ? 'لا توجد تقييمات بعد' : 'لا توجد نتائج'}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {items.length === 0 ? 'ابدأ بتقييم أول غرض لك' : 'جرب كلمات بحث أخرى'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-end mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-mono">
                    <CheckCircle className="w-3 h-3" />
                    مكتمل
                  </span>
                </div>

                {/* Item Info */}
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  {item.itemType}
                </p>
                <h3 className="font-semibold text-lg mb-3 truncate">
                  {item.itemName}
                </h3>

                {/* Price */}
                <div className="inline-flex items-baseline gap-2 px-3 py-2 bg-muted mb-3">
                  <span className="text-xs text-muted-foreground">السعر التقديري</span>
                  <span className="text-lg font-mono font-semibold">
                    {new Intl.NumberFormat("en-IQ").format(item.lowestPrice)} - {new Intl.NumberFormat("en-IQ").format(item.highestPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground">د.ع</span>
                </div>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 grid-border text-xs">
                    <Tag className="w-3 h-3" />
                    {item.condition}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 grid-border text-xs">
                    <MapPin className="w-3 h-3" />
                    العراق
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
