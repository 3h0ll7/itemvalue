import { useState, useCallback } from "react";
import type { GovernorateId } from "@/lib/governorates";

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

  const startAnalysis = useCallback(() => {
    setScreen("analyzing");
    
    // Simulate AI analysis with mock data
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        itemType: "Electronics",
        itemName: "iPhone 13 Pro Max",
        condition: "Good",
        conditionScore: 78,
        averagePrice: 850000,
        lowestPrice: 720000,
        highestPrice: 980000,
        suggestedPrice: 830000,
        recommendation: "Market conditions are favorable. Consider listing at the suggested price for a quick sale within 3-5 days.",
        listingLinks: [
          { title: "iPhone 13 Pro Max 256GB", price: 850000, url: "#" },
          { title: "iPhone 13 Pro Max Gold", price: 880000, url: "#" },
          { title: "iPhone 13 Pro Max 128GB", price: 780000, url: "#" },
        ],
      };
      setAnalysisResult(mockResult);
      setScreen("results");
    }, 3000);
  }, []);

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
