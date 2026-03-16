import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GlobalStats {
  todayCount: number;
  totalCount: number;
  lastItemType: string | null;
  lastGovernorate: string | null;
}

async function fetchGlobalStats(): Promise<GlobalStats> {
  const today = new Date().toISOString().split("T")[0];

  // Fetch today's stats
  const { data: todayData } = await supabase
    .from("app_stats")
    .select("evaluations_count, last_item_type, last_governorate")
    .eq("stat_date", today)
    .maybeSingle();

  // Fetch total count across all days
  const { data: allData } = await supabase
    .from("app_stats")
    .select("evaluations_count");

  const totalCount = allData?.reduce((sum, row) => sum + (row.evaluations_count || 0), 0) ?? 0;

  return {
    todayCount: todayData?.evaluations_count ?? 0,
    totalCount,
    lastItemType: todayData?.last_item_type ?? null,
    lastGovernorate: todayData?.last_governorate ?? null,
  };
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ["global-stats"],
    queryFn: fetchGlobalStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
