import { useAppState } from "@/hooks/useAppState";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { UploadScreen } from "@/components/UploadScreen";
import { AnalyzingScreen } from "@/components/AnalyzingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";

const Index = () => {
  const {
    screen,
    governorate,
    imagePreview,
    analysisResult,
    selectGovernorate,
    uploadImage,
    startAnalysis,
    reset,
    goBack,
  } = useAppState();

  if (screen === "onboarding") {
    return <OnboardingScreen onSelectGovernorate={selectGovernorate} />;
  }

  if (screen === "upload" && governorate) {
    return (
      <UploadScreen
        governorate={governorate}
        imagePreview={imagePreview}
        onUploadImage={uploadImage}
        onStartAnalysis={startAnalysis}
        onBack={goBack}
      />
    );
  }

  if (screen === "analyzing") {
    return <AnalyzingScreen />;
  }

  if (screen === "results" && analysisResult && governorate) {
    return (
      <ResultsScreen
        result={analysisResult}
        governorate={governorate}
        imagePreview={imagePreview}
        onReset={reset}
        onBack={goBack}
      />
    );
  }

  return null;
};

export default Index;
