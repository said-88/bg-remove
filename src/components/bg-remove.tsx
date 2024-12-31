"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, UploadCloud, Loader2, Download, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ACCEPTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export default function BackgroundRemove() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
  });

  const handleRemoveBackground = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    try {
      // Simulating AI processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessedImage(originalImage); // In a real app, this would be the processed image
      toast({
        title: "Success!",
        description: "Background removed successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "removed-background.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                originalImage && "border-none p-0"
              )}
            >
              <input {...getInputProps()} />
              {originalImage ? (
                <div className="relative group">
                  <Image
                    src={originalImage}
                    alt="Original"
                    className="rounded-lg w-full h-auto"
                    height={400}
                    width={400}
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white">Click or drag to replace</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag and drop your image here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPG, PNG, and WEBP formats
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Area */}
          <div>
            <div className="border-2 border-dashed rounded-lg p-8 h-full flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Processing image...</p>
                </div>
              ) : processedImage ? (
                <Image
                  src={processedImage}
                  alt="Processed"
                  className="rounded-lg w-full h-auto"
                  height={400}
                  width={400}
                  style={{
                    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                    transition: "transform 0.3s ease",
                  }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-4" />
                  <p>Processed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        {originalImage && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleRemoveBackground}
                disabled={isProcessing || !originalImage}
              >
                {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Remove Background
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!processedImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rotation</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRotation(r => r - 90)}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[rotation]}
                    onValueChange={([value]) => setRotation(value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Zoom</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(z => Math.max(50, z - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={50}
                    max={200}
                    step={1}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(z => Math.min(200, z + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}