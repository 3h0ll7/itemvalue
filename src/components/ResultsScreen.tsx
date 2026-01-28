import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/hooks/useAppState";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";
import { ConfidenceSection } from "@/components/results/ConfidenceSection";
import { ShareSection } from "@/components/results/ShareSection";

interface ResultsScreenProps {
  result: AnalysisResult;
  governorate: GovernorateId;
  imagePreview: string | null;
  onReset: () => void;
  onBack: () => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IQ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ResultsScreen({
  result,
  governorate,
  imagePreview,
  onReset,
  onBack,
}: ResultsScreenProps) {
  const govData = GOVERNORATES.find((g) => g.id === governorate);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header - Teal Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-section-teal text-section-teal-foreground py-4 px-6 flex items-center justify-between"
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg">النتيجة</h1>
          <p className="text-xs font-mono opacity-70">
            {govData?.nameAr}
          </p>
        </div>
        
        <div className="w-10 h-10" />
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Item Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2"
        >
          {/* Image */}
          {imagePreview && (
            <div className="aspect-square md:aspect-auto grid-border-b md:grid-border-s bg-muted/30">
              <img
                src={imagePreview}
                alt="Item"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex flex-col">
            <div className="grid-border-b p-6">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                {result.itemType}
              </p>
              <h2 className="text-2xl md:text-3xl mb-3">
                {result.itemName}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 grid-border">
                <span className="text-xs font-mono">
                  الحالة: {result.condition}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {result.conditionScore}%
                </span>
              </div>
            </div>

            {/* Suggested Price - Pink Section */}
            <div className="grid-border-b p-6 bg-section-pink text-section-pink-foreground">
              <p className="text-xs font-mono uppercase tracking-widest mb-2 opacity-70">
                السعر المقترح
              </p>
              <p className="text-4xl md:text-5xl font-mono">
                {formatPrice(result.suggestedPrice)}
              </p>
              <p className="text-xs font-mono uppercase tracking-widest mt-1 opacity-70">
                IQD
              </p>
            </div>
          </div>
        </motion.div>

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 grid-border-b"
        >
          <div className="p-6 grid-border-s">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              الأقل
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.lowestPrice)}
            </p>
          </div>
          <div className="p-6 grid-border-s">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              المتوسط
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.averagePrice)}
            </p>
          </div>
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              الأعلى
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.highestPrice)}
            </p>
          </div>
        </motion.div>

        {/* Confidence Section with Histogram */}
        <ConfidenceSection
          confidenceScore={result.confidenceScore}
          priceDistribution={result.priceDistribution}
          similarSales={result.similarSales}
          suggestedPrice={result.suggestedPrice}
        />

        {/* Recommendation - Purple Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-section-purple text-section-purple-foreground p-6"
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-3 opacity-70">
            استراتيجية البيع
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            {result.recommendation}
          </p>
        </motion.div>

        {/* Share Section */}
        <ShareSection result={result} governorateName={govData?.nameAr || ''} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <div className="grid-border-b py-4 px-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              إعلانات نشطة الآن
            </p>
          </div>
          
          <div className="divide-y divide-border">
            {result.listingLinks.map((listing, index) => (
              <a
                key={index}
                href={listing.url}
                className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate mb-1">{listing.title}</p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {formatPrice(listing.price)} IQD
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 me-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid-border-t p-6"
      >
        <Button onClick={onReset} className="w-full h-14 text-base">
          <RefreshCw className="w-4 h-4 ms-2" />
          سعّر شي ثاني
        </Button>
      </motion.div>
    </div>
  );
}
