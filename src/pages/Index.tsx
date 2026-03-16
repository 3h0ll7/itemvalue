import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { ScanScreen } from "@/components/ScanScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { AnalyzingScreen } from "@/components/AnalyzingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { useAppState } from "@/hooks/useAppState";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showGovernorateSelect, setShowGovernorateSelect] = useState(false);

  const sub = useSubscription();

  const {
    screen,
    governorate,
    imagePreview,
    analysisResult,
    analysisHistory,
    itemCondition,
    purchaseYear,
    showUpgradeModal,
    upgradeReason,
    setShowUpgradeModal,
    setUpgradeReason,
    selectGovernorate,
    uploadImage,
    selectItemCondition,
    selectPurchaseYear,
    startAnalysis,
    reset,
    goBack,
  } = useAppState();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    setActiveTab("scan");
  }, []);

  const handleViewHistory = useCallback(() => {
    setActiveTab("history");
  }, []);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      if (tab !== "scan") {
        reset();
      }
    },
    [reset]
  );

  const handleStartAnalysis = useCallback(() => {
    startAnalysis().then(() => {
      // Refetch subscription data after analysis
      sub.refetch();
    });
  }, [startAnalysis, sub]);

  const handleUpgradeClick = useCallback(() => {
    setUpgradeReason("manual");
    setShowUpgradeModal(true);
  }, [setUpgradeReason, setShowUpgradeModal]);

  if (!authChecked) return null;

  if (screen === "analyzing") {
    return <AnalyzingScreen />;
  }

  if (screen === "results" && analysisResult && governorate) {
    return (
      <>
        <ResultsScreen
          result={analysisResult}
          governorate={governorate}
          imagePreview={imagePreview}
          isPro={sub.isPro}
          onUpgradeClick={handleUpgradeClick}
          onReset={() => {
            reset();
            setActiveTab("home");
          }}
          onBack={() => {
            goBack();
            setActiveTab("scan");
          }}
        />
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          triggerReason={upgradeReason}
          evaluationsUsed={sub.evaluationsUsed}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {activeTab === "home" && (
        <HomeScreen
          onStartScan={handleStartScan}
          recentItems={analysisHistory}
          onViewHistory={handleViewHistory}
          isPro={sub.isPro}
          evaluationsUsed={sub.evaluationsUsed}
          evaluationsRemaining={sub.evaluationsRemaining}
          onUpgradeClick={handleUpgradeClick}
        />
      )}

      {activeTab === "scan" && (
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
          isPro={sub.isPro}
          evaluationsUsed={sub.evaluationsUsed}
          evaluationsLimit={sub.evaluationsLimit}
          evaluationsRemaining={sub.evaluationsRemaining}
          onUpgradeClick={handleUpgradeClick}
        />
      )}

      {activeTab === "history" && <HistoryScreen items={analysisHistory} />}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerReason={upgradeReason}
        evaluationsUsed={sub.evaluationsUsed}
      />
    </div>
  );
};

export default Index;
