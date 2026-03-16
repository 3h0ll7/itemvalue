// أنواع نظام الاشتراك — Subscription system types

export interface UserUsage {
  id: string;
  user_id: string;
  evaluations_used: number;
  evaluations_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "pro";
  status: "active" | "expired" | "cancelled";
  started_at: string;
  expires_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  amount_iqd: number | null;
  activated_by: string;
  created_at: string;
}

export interface SubscriptionState {
  isPro: boolean;
  isFree: boolean;
  evaluationsUsed: number;
  evaluationsLimit: number;
  evaluationsRemaining: number;
  isAtLimit: boolean;
  subscription: Subscription | null;
  usage: UserUsage | null;
  isLoading: boolean;
  refetch: () => void;
}
