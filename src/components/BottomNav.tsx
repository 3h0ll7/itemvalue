import { motion } from "framer-motion";
import { Home, Camera, Clock } from "lucide-react";

export type TabId = 'home' | 'scan' | 'history';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'history' as TabId, label: 'سجلي', icon: Clock },
    { id: 'scan' as TabId, label: 'فحص', icon: Camera, isCenter: true },
    { id: 'home' as TabId, label: 'الرئيسية', icon: Home },
  ];

  return (
    <nav className="grid-border-t bg-background">
      <div className="flex items-end justify-around px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isCenter) {
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.95 }}
                className="relative -mt-6 flex flex-col items-center"
              >
                <div className={`w-14 h-14 flex items-center justify-center grid-border ${
                  isActive ? 'bg-section-pink text-section-pink-foreground' : 'bg-background text-foreground'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-mono mt-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center py-2 px-4"
            >
              <div className={`w-10 h-10 flex items-center justify-center ${
                isActive ? 'grid-border bg-foreground text-background' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs font-mono mt-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
