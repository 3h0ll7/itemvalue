import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { GovernorateId } from "@/lib/governorates";
import { analyzeItem } from "@/lib/api/analyzeItem";

export type AppScreen = "onboarding" | "upload" | "analyzing" | "results";

export interface AnalysisResult {
  itemType: string;
  itemName: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  conditionScore: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  suggestedPrice: number;
  recommendation: string;
  listingLinks: { title: string; price: number; url: string }[];
}

export function useAppState() {
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [governorate, setGovernorate] = useState<GovernorateId | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const selectGovernorate = useCallback((gov: GovernorateId) => {
    setGovernorate(gov);
    setScreen("upload");
  }, []);

  const uploadImage = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!imagePreview || !governorate) {
      toast.error("الرجاء اختيار صورة أولاً");
      return;
    }

    setScreen("analyzing");
    
    try {
      const result = await analyzeItem(imagePreview, governorate);
      
      if (result.success === true) {
        setAnalysisResult(result.data);
        setScreen("results");
      } else {
        const errorData = result.error;
        const errorMessage = errorData.message || errorData.error;
        toast.error(errorMessage);
        setScreen("upload");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("حدث خطأ أثناء التحليل. الرجاء المحاولة مرة أخرى.");
      setScreen("upload");
    }
  }, [imagePreview, governorate]);

  const reset = useCallback(() => {
    setScreen("upload");
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
  }, []);

  const goBack = useCallback(() => {
    if (screen === "upload") {
      setScreen("onboarding");
      setGovernorate(null);
    } else if (screen === "results") {
      reset();
    }
  }, [screen, reset]);

  return {
    screen,
    governorate,
    imageFile,
    imagePreview,
    analysisResult,
    selectGovernorate,
    uploadImage,
    startAnalysis,
    reset,
    goBack,
  };
}
