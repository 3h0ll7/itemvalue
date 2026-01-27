import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult, ItemCondition } from "@/hooks/useAppState";
import type { GovernorateId } from "@/lib/governorates";
import { GOVERNORATES } from "@/lib/governorates";

export interface AnalyzeItemError {
  error: string;
  message?: string;
}

const CONDITION_LABELS: Record<ItemCondition, string> = {
  new: "جديد",
  clean_used: "مستعمل نظيف",
  worn: "مستهلك"
};

export async function analyzeItem(
  imageBase64: string,
  governorateId: GovernorateId,
  itemCondition: ItemCondition,
  purchaseYear: number | null
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: AnalyzeItemError }> {
  const govData = GOVERNORATES.find((g) => g.id === governorateId);
  const governorateName = govData?.name || governorateId;
  const conditionLabel = CONDITION_LABELS[itemCondition];

  try {
    const { data, error } = await supabase.functions.invoke('analyze-item', {
      body: { 
        imageBase64,
        governorate: governorateName,
        itemCondition: conditionLabel,
        purchaseYear
      },
    });

    if (error) {
      console.error('Error calling analyze-item function:', error);
      
      // Try to extract the actual error message from the response
      // FunctionsHttpError contains context with the response body
      const errorContext = (error as any).context;
      if (errorContext) {
        try {
          const responseBody = await errorContext.json();
          if (responseBody?.message || responseBody?.error) {
            return { 
              success: false, 
              error: { 
                error: responseBody.error || 'error',
                message: responseBody.message || responseBody.error
              } 
            };
          }
        } catch {
          // Failed to parse response body, use default error
        }
      }
      
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
  } catch (err) {
    console.error('Unexpected error in analyzeItem:', err);
    return { 
      success: false, 
      error: { error: 'Unexpected error occurred' } 
    };
  }
}
