import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "@/hooks/useAppState";
import type { GovernorateId } from "@/lib/governorates";
import { GOVERNORATES } from "@/lib/governorates";

export interface AnalyzeItemError {
  error: string;
  message?: string;
}

export async function analyzeItem(
  imageBase64: string,
  governorateId: GovernorateId
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: AnalyzeItemError }> {
  const govData = GOVERNORATES.find((g) => g.id === governorateId);
  const governorateName = govData?.name || governorateId;

  const { data, error } = await supabase.functions.invoke('analyze-item', {
    body: { 
      imageBase64,
      governorate: governorateName
    },
  });

  if (error) {
    console.error('Error calling analyze-item function:', error);
    return { 
      success: false, 
      error: { error: error.message || 'Failed to analyze item' } 
    };
  }

  if (data?.error) {
    return { 
      success: false, 
      error: data as AnalyzeItemError 
    };
  }

  return { success: true, data: data as AnalysisResult };
}
