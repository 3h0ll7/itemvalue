import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { GovernorateId } from "@/lib/governorates";
import { analyzeItem } from "@/lib/api/analyzeItem";

export type AppScreen = "idle" | "analyzing" | "results";

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
  const [screen, setScreen] = useState<AppScreen>("idle");
  const [governorate, setGovernorate] = useState<GovernorateId | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const selectGovernorate = useCallback((gov: GovernorateId) => {
    setGovernorate(gov);
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
      toast.error("الرجاء اختيار صورة ومحافظة أولاً");
      return;
    }

    setScreen("analyzing");
    
    try {
      const result = await analyzeItem(imagePreview, governorate);
      
      if (result.success === true) {
        setAnalysisResult(result.data);
        setAnalysisHistory(prev => [result.data, ...prev]);
        setScreen("results");
      } else {
        const errorData = result.error;
        const errorMessage = errorData.message || errorData.error;
        toast.error(errorMessage);
        setScreen("idle");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("حدث خطأ أثناء التحليل. الرجاء المحاولة مرة أخرى.");
      setScreen("idle");
    }
  }, [imagePreview, governorate]);

  const reset = useCallback(() => {
    setScreen("idle");
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setGovernorate(null);
  }, []);

  const goBack = useCallback(() => {
    if (screen === "results") {
      setScreen("idle");
      setImageFile(null);
      setImagePreview(null);
      setAnalysisResult(null);
    }
  }, [screen]);

  return {
    screen,
    governorate,
    imageFile,
    imagePreview,
    analysisResult,
    analysisHistory,
    selectGovernorate,
    uploadImage,
    startAnalysis,
    reset,
    goBack,
  };
}
