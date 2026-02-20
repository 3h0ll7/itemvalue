import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { ScanScreen } from "@/components/ScanScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { AnalyzingScreen } from "@/components/AnalyzingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useAppState } from "@/hooks/useAppState";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showGovernorateSelect, setShowGovernorateSelect] = useState(false);

  const {
    screen,
    governorate,
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
  } = useAppState();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
      setAuthChecked(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleStartScan = useCallback(() => {
    setActiveTab('scan');
  }, []);

  const handleViewHistory = useCallback(() => {
    setActiveTab('history');
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'scan') {
      reset();
    }
  }, [reset]);

  const handleStartAnalysis = useCallback(() => {
    startAnalysis();
  }, [startAnalysis]);

  if (!authChecked) return null;

  if (screen === 'analyzing') {
    return <AnalyzingScreen />;
  }

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          itemCondition={itemCondition}
          purchaseYear={purchaseYear}
          onSelectGovernorate={selectGovernorate}
          onUploadImage={uploadImage}
          onSelectCondition={selectItemCondition}
          onSelectPurchaseYear={selectPurchaseYear}
          onStartAnalysis={handleStartAnalysis}
          showGovernorateSelect={showGovernorateSelect}
          onToggleGovernorateSelect={() => setShowGovernorateSelect(!showGovernorateSelect)}
        />
      )}

      {activeTab === 'history' && (
        <HistoryScreen items={analysisHistory} />
      )}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
