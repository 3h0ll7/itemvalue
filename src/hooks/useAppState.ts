import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { GovernorateId } from "@/lib/governorates";
import { analyzeItem } from "@/lib/api/analyzeItem";

export type AppScreen = "idle" | "analyzing" | "results";
export type ItemCondition = "new" | "clean_used" | "worn";

export interface PriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface SimilarSale {
  title: string;
  price: number;
  soldDate: string;
  condition: string;
}

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
  priceDistribution?: PriceDistribution[];
  similarSales?: SimilarSale[];
  confidenceScore?: number;
}

export function useAppState() {
  const [screen, setScreen] = useState<AppScreen>("idle");
  const [governorate, setGovernorate] = useState<GovernorateId | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [itemCondition, setItemCondition] = useState<ItemCondition | null>(null);
  const [purchaseYear, setPurchaseYear] = useState<number | null>(null);

  const selectGovernorate = useCallback((gov: GovernorateId) => {
    setGovernorate(gov);
  }, []);

  const uploadImage = useCallback((file: File) => {
    setImageFile(file);
    // Compress image to avoid payload size issues with the edge function
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1024;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      setImagePreview(compressedBase64);
    };
    img.src = objectUrl;
  }, []);

  const selectItemCondition = useCallback((condition: ItemCondition) => {
    setItemCondition(condition);
  }, []);

  const selectPurchaseYear = useCallback((year: number) => {
    setPurchaseYear(year);
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!imagePreview || !governorate) {
      toast.error("الرجاء اختيار صورة ومحافظة أولاً");
      return;
    }

    if (!itemCondition) {
      toast.error("الرجاء اختيار حالة المنتج");
      return;
    }

    setScreen("analyzing");
    
    try {
      const result = await analyzeItem(imagePreview, governorate, itemCondition, purchaseYear);
      
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
  }, [imagePreview, governorate, itemCondition, purchaseYear]);

  const reset = useCallback(() => {
    setScreen("idle");
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setGovernorate(null);
    setItemCondition(null);
    setPurchaseYear(null);
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
    itemCondition,
    purchaseYear,
    selectGovernorate,
    uploadImage,
    selectItemCondition,
    selectPurchaseYear,
    startAnalysis,
    reset,
    goBack,
  };
}
