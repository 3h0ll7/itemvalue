import { Crown } from "lucide-react";

interface ProBadgeProps {
  size?: "sm" | "lg";
}

export function ProBadge({ size = "sm" }: ProBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1.5 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 ${sizeClasses}`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, transparent 20%, rgba(255,215,0,0.15) 40%, rgba(255,215,0,0.15) 60%, transparent 80%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s ease-in-out infinite",
      }}
    >
      <Crown className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      PRO
    </span>
  );
}
