import { useState, useCallback } from "react";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { ScanScreen } from "@/components/ScanScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { AnalyzingScreen } from "@/components/AnalyzingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useAppState } from "@/hooks/useAppState";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showGovernorateSelect, setShowGovernorateSelect] = useState(false);

  const {
    screen,
    governorate,
    imagePreview,
    analysisResult,
    analysisHistory,
    selectGovernorate,
    uploadImage,
    startAnalysis,
    reset,
    goBack,
  } = useAppState();

  const handleStartScan = useCallback(() => {
    setActiveTab('scan');
  }, []);

  const handleViewHistory = useCallback(() => {
    setActiveTab('history');
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'scan') {
      // Reset scan state when leaving scan tab
      reset();
    }
  }, [reset]);

  const handleStartAnalysis = useCallback(() => {
    startAnalysis();
  }, [startAnalysis]);

  // Show analyzing screen
  if (screen === 'analyzing') {
    return <AnalyzingScreen />;
  }

  // Show results screen
  if (screen === 'results' && analysisResult && governorate) {
    return (
      <ResultsScreen
        result={analysisResult}
        governorate={governorate}
        imagePreview={imagePreview}
        onReset={() => {
          reset();
          setActiveTab('home');
        }}
        onBack={() => {
          goBack();
          setActiveTab('scan');
        }}
      />
    );
  }

  // Main app with bottom navigation
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      {activeTab === 'home' && (
        <HomeScreen
          onStartScan={handleStartScan}
          recentItems={analysisHistory}
          onViewHistory={handleViewHistory}
        />
      )}

      {activeTab === 'scan' && (
        <ScanScreen
          governorate={governorate}
          imagePreview={imagePreview}
          onSelectGovernorate={selectGovernorate}
          onUploadImage={uploadImage}
          onStartAnalysis={handleStartAnalysis}
          showGovernorateSelect={showGovernorateSelect}
          onToggleGovernorateSelect={() => setShowGovernorateSelect(!showGovernorateSelect)}
        />
      )}

      {activeTab === 'history' && (
        <HistoryScreen items={analysisHistory} />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
