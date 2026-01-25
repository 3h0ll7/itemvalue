import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOVERNORATES, type GovernorateId } from "@/lib/governorates";

interface UploadScreenProps {
  governorate: GovernorateId;
  imagePreview: string | null;
  onUploadImage: (file: File) => void;
  onStartAnalysis: () => void;
  onBack: () => void;
}

export function UploadScreen({
  governorate,
  imagePreview,
  onUploadImage,
  onStartAnalysis,
  onBack,
}: UploadScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const govData = GOVERNORATES.find((g) => g.id === governorate);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUploadImage(file);
      }
    },
    [onUploadImage]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid-border-b py-4 px-6 flex items-center justify-between"
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg">رفع صورة</h1>
          <p className="text-xs font-mono text-muted-foreground">
            {govData?.nameAr}
          </p>
        </div>
        
        <div className="w-10 h-10" />
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {imagePreview ? (
          <>
            {/* Image Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 grid-border-b relative"
            >
              <img
                src={imagePreview}
                alt="Item preview"
                className="w-full h-full object-contain bg-muted/30"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-4 start-4 w-10 h-10 bg-background grid-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Button
                onClick={onStartAnalysis}
                className="w-full h-14 text-base"
              >
                حلّل السعر
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 grid-border-b flex flex-col items-center justify-center p-8"
            >
              <div className="w-20 h-20 grid-border flex items-center justify-center mb-8">
                <Camera className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl md:text-3xl mb-2 text-center">
                رفع صورة
              </h2>
              <p className="text-muted-foreground font-mono text-sm text-center max-w-xs mb-8">
                صوّر الشي اللي تبيعه
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 h-12"
                >
                  <Camera className="w-4 h-4 ms-2" />
                  التقط صورة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12"
                >
                  <Upload className="w-4 h-4 ms-2" />
                  اختر من الملفات
                </Button>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="grid-border p-4">
                <p className="text-xs font-mono text-muted-foreground text-center">
                  نصيحة: الإضاءة الجيدة والزوايا الواضحة تساعد على الحصول على أسعار أفضل
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
