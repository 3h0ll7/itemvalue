import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, ChevronDown, Sparkles, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";
import type { ItemCondition } from "@/hooks/useAppState";

interface ScanScreenProps {
  governorate: GovernorateId | null;
  imagePreview: string | null;
  itemCondition: ItemCondition | null;
  purchaseYear: number | null;
  onSelectGovernorate: (gov: GovernorateId) => void;
  onUploadImage: (file: File) => void;
  onSelectCondition: (condition: ItemCondition) => void;
  onSelectPurchaseYear: (year: number) => void;
  onStartAnalysis: () => void;
  showGovernorateSelect: boolean;
  onToggleGovernorateSelect: () => void;
}

const CONDITION_OPTIONS: { id: ItemCondition; label: string; description: string }[] = [
  { id: "new", label: "جديد", description: "لم يُستخدم أو استُخدم مرات قليلة" },
  { id: "clean_used", label: "مستعمل نظيف", description: "استخدام عادي بدون عيوب واضحة" },
  { id: "worn", label: "مستهلك", description: "علامات استخدام واضحة أو عيوب بسيطة" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 15 }, (_, i) => currentYear - i);

export function ScanScreen({
  governorate,
  imagePreview,
  itemCondition,
  purchaseYear,
  onSelectGovernorate,
  onUploadImage,
  onSelectCondition,
  onSelectPurchaseYear,
  onStartAnalysis,
  showGovernorateSelect,
  onToggleGovernorateSelect,
}: ScanScreenProps) {
  const [showConditionSelect, setShowConditionSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const govData = governorate ? GOVERNORATES.find((g) => g.id === governorate) : null;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadImage(file);
      }
    },
    [onUploadImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onUploadImage(file);
      }
    },
    [onUploadImage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir="rtl">
      {/* Header - Teal Section */}
      <div className="bg-section-teal text-section-teal-foreground py-4 px-4 text-center">
        <h1 className="text-xl font-semibold">فحص جديد</h1>
        <p className="text-xs opacity-80 mt-1">
          صوّر الغرض واعرف سعره فوراً
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid-border p-6"
        >
          <p className="text-sm font-semibold mb-4">صورة العنصر</p>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative cursor-pointer transition-colors ${
              imagePreview 
                ? 'aspect-square' 
                : 'aspect-video border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
            } flex flex-col items-center justify-center`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="صورة الغرض"
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <div className="w-16 h-16 bg-muted flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-1">اضغط لرفع صورة</p>
                <p className="text-xs text-muted-foreground">
                  أو اسحب الصورة وأفلتها هنا
                </p>
              </>
            )}
          </div>

          {imagePreview && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              تغيير الصورة
            </button>
          )}
        </motion.div>

        {/* Location Section - Yellow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid-border bg-section-yellow text-section-yellow-foreground p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 opacity-70" />
            <p className="text-sm font-semibold">موقع البيع (المحافظة)</p>
          </div>

          <button
            onClick={onToggleGovernorateSelect}
            className="w-full border border-foreground/30 p-3 flex items-center justify-between hover:bg-foreground/10 transition-colors bg-background text-foreground"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showGovernorateSelect ? 'rotate-180' : ''}`} />
            <span className="font-mono">
              {govData?.nameAr || 'اختر المحافظة'}
            </span>
          </button>

          {showGovernorateSelect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 max-h-48 overflow-y-auto grid-border"
            >
              {GOVERNORATES.map((gov) => (
                <button
                  key={gov.id}
                  onClick={() => {
                    onSelectGovernorate(gov.id);
                    onToggleGovernorateSelect();
                  }}
                  className={`w-full p-3 text-end hover:bg-muted/30 transition-colors grid-border-b last:border-b-0 ${
                    governorate === gov.id ? 'bg-foreground text-background' : ''
                  }`}
                >
                  <span className="font-mono">{gov.nameAr}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Condition Section - Purple */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid-border bg-section-purple text-section-purple-foreground p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 opacity-70" />
            <p className="text-sm font-semibold">حالة المنتج</p>
          </div>

          <button
            onClick={() => setShowConditionSelect(!showConditionSelect)}
            className="w-full border border-white/30 p-3 flex items-center justify-between hover:bg-white/10 transition-colors bg-background text-foreground"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showConditionSelect ? 'rotate-180' : ''}`} />
            <span className="font-mono">
              {itemCondition 
                ? CONDITION_OPTIONS.find(c => c.id === itemCondition)?.label 
                : 'اختر الحالة'}
            </span>
          </button>

          {showConditionSelect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 grid-border bg-background z-10"
            >
              {CONDITION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelectCondition(option.id);
                    setShowConditionSelect(false);
                  }}
                  className={`w-full p-3 text-end hover:bg-muted/30 transition-colors grid-border-b last:border-b-0 ${
                    itemCondition === option.id ? 'bg-foreground text-background' : ''
                  }`}
                >
                  <span className="font-mono block">{option.label}</span>
                  <span className={`text-xs ${itemCondition === option.id ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {option.description}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Purchase Year Section - Orange */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid-border bg-section-orange text-section-orange-foreground p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 opacity-70" />
            <p className="text-sm font-semibold">سنة الشراء (اختياري)</p>
          </div>

          <button
            onClick={() => setShowYearSelect(!showYearSelect)}
            className="w-full border border-white/30 p-3 flex items-center justify-between hover:bg-white/10 transition-colors bg-background text-foreground"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showYearSelect ? 'rotate-180' : ''}`} />
            <span className="font-mono">
              {purchaseYear || 'اختر السنة'}
            </span>
          </button>

          {showYearSelect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 max-h-48 overflow-y-auto grid-border bg-background z-10"
            >
              {YEAR_OPTIONS.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onSelectPurchaseYear(year);
                    setShowYearSelect(false);
                  }}
                  className={`w-full p-3 text-end hover:bg-muted/30 transition-colors grid-border-b last:border-b-0 ${
                    purchaseYear === year ? 'bg-foreground text-background' : ''
                  }`}
                >
                  <span className="font-mono">{year}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            onClick={onStartAnalysis}
            disabled={!imagePreview || !governorate || !itemCondition}
            className="w-full h-14 text-base"
          >
            <Sparkles className="w-4 h-4 ms-2" />
            قيّم العنصر
          </Button>
        </motion.div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
