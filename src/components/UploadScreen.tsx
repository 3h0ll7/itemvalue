import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
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
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground">Price Your Item</h1>
          <p className="text-sm text-muted-foreground">
            📍 {govData?.name}
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8 flex flex-col">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-card rounded-3xl shadow-card overflow-hidden flex flex-col"
        >
          {imagePreview ? (
            <div className="relative flex-1 flex flex-col">
              <div className="flex-1 p-4">
                <img
                  src={imagePreview}
                  alt="Item preview"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <div className="p-4 pt-0 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-4 h-4" />
                  Change
                </Button>
                <Button
                  variant="hero"
                  className="flex-[2]"
                  onClick={onStartAnalysis}
                >
                  <Sparkles className="w-4 h-4" />
                  Get Price
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
              >
                <Camera className="w-12 h-12 text-primary" />
              </motion.div>
              
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Add Your Item Photo
              </h2>
              <p className="text-muted-foreground mb-8 max-w-[280px]">
                Take a clear photo of your item for the most accurate price estimate
              </p>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-5 h-5" />
                  Upload from Gallery
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 px-4 py-3 bg-secondary/20 rounded-2xl"
        >
          <p className="text-sm text-muted-foreground text-center">
            💡 <span className="font-medium">Tip:</span> Good lighting and clear angles help get better prices
          </p>
        </motion.div>
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
