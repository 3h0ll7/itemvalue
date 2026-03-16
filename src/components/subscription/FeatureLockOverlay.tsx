import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureLockOverlayProps {
  children: React.ReactNode;
  featureName: string;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export function FeatureLockOverlay({
  children,
  featureName,
  isPro,
  onUpgradeClick,
}: FeatureLockOverlayProps) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      <div className="filter blur-[4px] pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
        <Lock className="w-6 h-6 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-muted-foreground mb-2">
          متاح لمشتركي PRO
        </p>
        <Button variant="outline" size="sm" onClick={onUpgradeClick} className="gap-1.5">
          👑 ترقية
        </Button>
      </div>
    </div>
  );
}
