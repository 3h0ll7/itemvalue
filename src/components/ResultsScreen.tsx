import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid-border-b py-4 px-6 flex items-center justify-between"
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg">PRICE ANALYSIS</h1>
          <p className="text-xs font-mono text-muted-foreground">
            {govData?.name}
          </p>
        </div>
        
        <button 
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
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
            <div className="aspect-square md:aspect-auto grid-border-b md:grid-border-r bg-muted/30">
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
                {result.itemName.toUpperCase()}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 grid-border">
                <span className="text-xs font-mono uppercase">
                  {result.condition}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {result.conditionScore}%
                </span>
              </div>
            </div>

            {/* Suggested Price */}
            <div className="grid-border-b p-6 bg-foreground text-background">
              <p className="text-xs font-mono uppercase tracking-widest mb-2 opacity-70">
                Suggested Price
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
          <div className="p-6 grid-border-r">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Lowest
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.lowestPrice)}
            </p>
          </div>
          <div className="p-6 grid-border-r">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Average
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.averagePrice)}
            </p>
          </div>
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Highest
            </p>
            <p className="text-xl md:text-2xl font-mono">
              {formatPrice(result.highestPrice)}
            </p>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid-border-b p-6"
        >
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Selling Strategy
          </p>
          <p className="text-sm leading-relaxed">
            {result.recommendation}
          </p>
        </motion.div>

        {/* Similar Listings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid-border-b py-4 px-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Similar Listings
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
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid-border-t p-6"
      >
        <Button onClick={onReset} className="w-full h-14 text-base">
          <RefreshCw className="w-4 h-4 mr-2" />
          PRICE ANOTHER ITEM
        </Button>
      </motion.div>
    </div>
  );
}
