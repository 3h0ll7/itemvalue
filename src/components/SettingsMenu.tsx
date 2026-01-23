import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, Languages, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, theme, toggleTheme, t, isRTL } = useApp();

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 grid-border hover:bg-muted/50 transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-foreground/20 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-72 bg-background grid-border z-50`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 grid-border-b">
                <h2 className="text-lg font-semibold uppercase">
                  {language === 'ar' ? 'الإعدادات' : 'Settings'}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="p-4 space-y-6">
                {/* Theme Toggle */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {language === 'ar' ? 'المظهر' : 'Theme'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-3 grid-border flex items-center justify-center gap-2 transition-colors ${
                        theme === 'light' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span className="text-sm font-mono">
                        {language === 'ar' ? 'فاتح' : 'Light'}
                      </span>
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-3 grid-border flex items-center justify-center gap-2 transition-colors ${
                        theme === 'dark' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span className="text-sm font-mono">
                        {language === 'ar' ? 'داكن' : 'Dark'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Languages className="w-3 h-3" />
                    {language === 'ar' ? 'اللغة' : 'Language'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLanguage('ar')}
                      className={`p-3 grid-border flex items-center justify-center transition-colors ${
                        language === 'ar' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-sm font-arabic">العربية</span>
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-3 grid-border flex items-center justify-center transition-colors ${
                        language === 'en' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-sm font-mono">English</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
