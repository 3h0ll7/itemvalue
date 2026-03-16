import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionState, UserUsage, Subscription } from "@/types/subscription";

export function useSubscription(): SubscriptionState {
  const { data: usageData, isLoading: usageLoading, refetch: refetchUsage } = useQuery({
    queryKey: ["user-usage"],
    queryFn: async (): Promise<UserUsage | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as UserUsage | null;
    },
    staleTime: 30000,
  });

  const { data: subscriptionData, isLoading: subLoading, refetch: refetchSub } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async (): Promise<Subscription | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    },
    staleTime: 30000,
  });

  const isPro =
    subscriptionData?.plan === "pro" &&
    subscriptionData?.status === "active" &&
    (subscriptionData?.expires_at === null ||
      new Date(subscriptionData.expires_at) > new Date());

  const evaluationsUsed = usageData?.evaluations_used ?? 0;
  const evaluationsLimit = usageData?.evaluations_limit ?? 5;
  const evaluationsRemaining = Math.max(0, evaluationsLimit - evaluationsUsed);
  const isAtLimit = !isPro && evaluationsUsed >= evaluationsLimit;

  return {
    isPro,
    isFree: !isPro,
    evaluationsUsed,
    evaluationsLimit,
    evaluationsRemaining,
    isAtLimit,
    subscription: subscriptionData ?? null,
    usage: usageData ?? null,
    isLoading: usageLoading || subLoading,
    refetch: () => {
      refetchUsage();
      refetchSub();
    },
  };
}
