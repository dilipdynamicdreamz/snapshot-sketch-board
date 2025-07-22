import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Camera, History, Sparkles } from "lucide-react";
import { HeroButton } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import extensionLogo from "@/assets/extension-logo.png";
import { captureScreenshot } from "@/utils/imageUtils";

export const Popup = () => {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          navigate("/editor", { state: { imageData, fileName: file.name } });
        };
        reader.readAsDataURL(file);
        toast.success("Image uploaded successfully!");
      }
    };
    input.click();
  };

  const handleTakeScreenshot = async () => {
    setIsCapturing(true);
    try {
      const screenshot = await captureScreenshot();
      navigate("/editor", { 
        state: { 
          imageData: screenshot, 
          fileName: `screenshot-${Date.now()}.png` 
        } 
      });
      toast.success("Screenshot captured!");
    } catch (error) {
      toast.error("Failed to capture screenshot");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleHistory = () => {
    navigate("/history");
  };

  return (
    <div className="w-80 h-96 bg-background p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={extensionLogo} 
              alt="Extension Logo" 
              className="w-16 h-16 rounded-xl shadow-glow"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Image Editor Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            Professional image editing tools
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex-1 space-y-4">
          <Card 
            className="p-4 cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={handleUploadImage}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Upload Image</h3>
                <p className="text-sm text-muted-foreground">
                  Select from your device
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={handleTakeScreenshot}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-accent">
                <Camera className={`h-5 w-5 text-white ${isCapturing ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h3 className="font-medium">Take Screenshot</h3>
                <p className="text-sm text-muted-foreground">
                  Capture current tab
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={handleHistory}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-extension-green">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">History</h3>
                <p className="text-sm text-muted-foreground">
                  View saved images
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Powered by advanced AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};