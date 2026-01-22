import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/hooks/useAppState";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";

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
  }).format(price) + " IQD";
}

function ConditionBadge({ condition, score }: { condition: string; score: number }) {
  const getColor = () => {
    if (score >= 80) return "bg-success/10 text-success border-success/20";
    if (score >= 60) return "bg-primary/10 text-primary border-primary/20";
    if (score >= 40) return "bg-secondary/30 text-secondary-foreground border-secondary/30";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getColor()}`}>
      <Check className="w-3.5 h-3.5" />
      {condition} ({score}%)
    </span>
  );
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
    <div className="min-h-screen gradient-hero flex flex-col pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground">Price Analysis</h1>
          <p className="text-sm text-muted-foreground">📍 {govData?.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onReset}>
          <RefreshCw className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto">
        {/* Item Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl shadow-card overflow-hidden"
        >
          <div className="flex gap-4 p-4">
            {imagePreview && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0">
                <img
                  src={imagePreview}
                  alt="Item"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">{result.itemType}</p>
              <h2 className="text-lg font-bold text-foreground mb-2 truncate">
                {result.itemName}
              </h2>
              <ConditionBadge condition={result.condition} score={result.conditionScore} />
            </div>
          </div>
        </motion.div>

        {/* Suggested Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-primary rounded-3xl p-6 text-center shadow-lg"
        >
          <p className="text-primary-foreground/80 text-sm mb-2">
            Suggested Selling Price
          </p>
          <p className="text-4xl font-bold text-primary-foreground mb-1">
            {formatPrice(result.suggestedPrice)}
          </p>
          <p className="text-primary-foreground/70 text-sm">
            Based on {govData?.name} market data
          </p>
        </motion.div>

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl shadow-card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Market Price Range</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-success" />
                </div>
                <span className="text-muted-foreground">Lowest</span>
              </div>
              <span className="font-semibold text-foreground">{formatPrice(result.lowestPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground">Average</span>
              </div>
              <span className="font-semibold text-foreground">{formatPrice(result.averagePrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-muted-foreground">Highest</span>
              </div>
              <span className="font-semibold text-foreground">{formatPrice(result.highestPrice)}</span>
            </div>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/20 rounded-3xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Selling Strategy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Similar Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-3xl shadow-card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Similar Listings</h3>
          
          <div className="space-y-3">
            {result.listingLinks.map((listing, index) => (
              <a
                key={index}
                href={listing.url}
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{listing.title}</p>
                  <p className="text-sm text-primary font-semibold">{formatPrice(listing.price)}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* New Analysis Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={onReset}
          >
            <RefreshCw className="w-5 h-5" />
            Price Another Item
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
