import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas as FabricCanvas, Circle, Rect, FabricText, PencilBrush, FabricImage } from "fabric";
import { 
  Crop, 
  Square, 
  Circle as CircleIcon, 
  ArrowUpRight, 
  Pen, 
  Type, 
  Focus, 
  Undo, 
  Redo, 
  Copy, 
  Download, 
  Save,
  ArrowLeft,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { ToolButton, HeroButton } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { saveImageToHistory } from "@/utils/storage";
import { downloadImage, getImageDimensions } from "@/utils/imageUtils";

const tools = [
  { id: "crop", name: "Crop", icon: Crop },
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "ellipse", name: "Ellipse", icon: CircleIcon },
  { id: "arrow", name: "Arrow", icon: ArrowUpRight },
  { id: "pen", name: "Pen", icon: Pen },
  { id: "text", name: "Text", icon: Type },
  { id: "blur", name: "Blur", icon: Focus },
];

export const ImageEditor = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Load image data from localStorage or location state
  useEffect(() => {
    // First check localStorage for editor data
    const storedData = localStorage.getItem('editorData');
    if (storedData) {
      const { imageData: storedImageData, fileName: storedFileName } = JSON.parse(storedData);
      setImageData(storedImageData);
      setFileName(storedFileName);
      // Clear the data from localStorage after using it
      localStorage.removeItem('editorData');
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !imageData) return;

    // Load the image first to get its dimensions
    FabricImage.fromURL(imageData).then((img) => {
      const imgWidth = img.width || 800;
      const imgHeight = img.height || 600;
      
      // Set canvas size to match image dimensions (with max constraints for UI)
      const maxWidth = window.innerWidth - 300; // Account for sidebars
      const maxHeight = window.innerHeight - 200; // Account for header
      
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
      const canvasWidth = imgWidth * scale;
      const canvasHeight = imgHeight * scale;

      const canvas = new FabricCanvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "#ffffff",
      });

      // Scale image to fit canvas exactly
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        selectable: false, // Make the base image non-selectable
      });
      
      canvas.add(img);
      canvas.renderAll();
      setFabricCanvas(canvas);
    });

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [imageData]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handlePathCreated = () => {
      setCanUndo(true);
      setCanRedo(false);
    };

    const handleObjectAdded = () => {
      setCanUndo(true);
      setCanRedo(false);
    };

    fabricCanvas.on("path:created", handlePathCreated);
    fabricCanvas.on("object:added", handleObjectAdded);

    return () => {
      fabricCanvas.off("path:created", handlePathCreated);
      fabricCanvas.off("object:added", handleObjectAdded);
    };
  }, [fabricCanvas]);

  const handleToolClick = (toolId: string) => {
    if (!fabricCanvas) return;

    setActiveTool(toolId);
    fabricCanvas.isDrawingMode = toolId === "pen";

    if (toolId === "pen") {
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = 3;
      fabricCanvas.freeDrawingBrush.color = "#000000";
    } else if (toolId === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "rgba(255, 0, 0, 0.3)",
        stroke: "#ff0000",
        strokeWidth: 2,
        width: 100,
        height: 80,
      });
      fabricCanvas.add(rect);
    } else if (toolId === "ellipse") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "rgba(0, 255, 0, 0.3)",
        stroke: "#00ff00",
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas.add(circle);
    } else if (toolId === "text") {
      const text = new FabricText("Edit me", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "#000000",
        fontFamily: "Arial",
      });
      fabricCanvas.add(text);
    }

    fabricCanvas.renderAll();
  };

  const handleUndo = () => {
    // Simplified undo - remove last object
    if (fabricCanvas && fabricCanvas.getObjects().length > 0) {
      const objects = fabricCanvas.getObjects();
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
      setCanUndo(fabricCanvas.getObjects().length > 0);
    }
  };

  const handleCopy = async () => {
    if (!fabricCanvas) return;

    try {
      // Get the original image dimensions for export
      const objects = fabricCanvas.getObjects();
      const baseImage = objects[0]; // First object is the base image
      
      if (baseImage && baseImage.type === 'image') {
        const originalWidth = (baseImage as any).getOriginalElementWidth();
        const originalHeight = (baseImage as any).getOriginalElementHeight();
        
        const dataUrl = fabricCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: Math.max(originalWidth / fabricCanvas.getWidth(), originalHeight / fabricCanvas.getHeight()),
        });

        // Copy to clipboard if supported
        if (navigator.clipboard && window.ClipboardItem) {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          toast.success("Image copied to clipboard!");
        } else {
          toast.info("Copy to clipboard not supported. Use Download instead.");
        }
      }
    } catch (error) {
      toast.error("Failed to copy image");
    }
  };

  const handleDownload = async () => {
    if (!fabricCanvas) return;

    try {
      // Get the original image dimensions for export
      const objects = fabricCanvas.getObjects();
      const baseImage = objects[0]; // First object is the base image
      
      let dataUrl;
      if (baseImage && baseImage.type === 'image') {
        const originalWidth = (baseImage as any).getOriginalElementWidth();
        const originalHeight = (baseImage as any).getOriginalElementHeight();
        
        dataUrl = fabricCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: Math.max(originalWidth / fabricCanvas.getWidth(), originalHeight / fabricCanvas.getHeight()),
        });
      } else {
        dataUrl = fabricCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 1,
        });
      }

      const downloadName = fileName || `edited-image-${Date.now()}.png`;
      downloadImage(dataUrl, downloadName);
      
      // Save to history
      const dimensions = await getImageDimensions(dataUrl);
      await saveImageToHistory({
        name: downloadName,
        url: dataUrl,
        dataUrl,
        modifiedAt: new Date(),
        size: dataUrl.length,
        dimensions,
      });

      toast.success("Image downloaded and saved to history!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleZoomIn = () => {
    if (fabricCanvas && zoom < 3) {
      const newZoom = Math.min(zoom + 0.2, 3);
      setZoom(newZoom);
      fabricCanvas.setZoom(newZoom);
      fabricCanvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    if (fabricCanvas && zoom > 0.2) {
      const newZoom = Math.max(zoom - 0.2, 0.2);
      setZoom(newZoom);
      fabricCanvas.setZoom(newZoom);
      fabricCanvas.renderAll();
    }
  };

  const handleGoBack = () => {
    // Close the current tab and return to the extension popup
    window.close();
  };

  if (!imageData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Image Found</h2>
          <p className="text-muted-foreground mb-6">
            Please upload an image or take a screenshot to start editing.
          </p>
          <Button onClick={handleGoBack}>
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Close
            </Button>
            <h1 className="text-lg font-semibold">Image Editor</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Tools Sidebar */}
        <div className="w-20 border-r border-border/50 bg-card/30 backdrop-blur-sm p-3">
          <div className="space-y-2">
            {tools.map((tool) => (
              <ToolButton
                key={tool.id}
                active={activeTool === tool.id}
                onClick={() => handleToolClick(tool.id)}
                title={tool.name}
              >
                <tool.icon className="h-4 w-4" />
              </ToolButton>
            ))}
            
            <Separator className="my-4" />
            
            <ToolButton onClick={handleUndo} disabled={!canUndo} title="Undo">
              <Undo className="h-4 w-4" />
            </ToolButton>
            
            <ToolButton onClick={() => {}} disabled={!canRedo} title="Redo">
              <Redo className="h-4 w-4" />
            </ToolButton>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-muted/20">
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className="border border-border rounded-lg shadow-card bg-white"
            />
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="w-48 border-l border-border/50 bg-card/30 backdrop-blur-sm p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Actions
            </h3>
            
            <HeroButton
              size="sm"
              className="w-full"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </HeroButton>
            
            <HeroButton
              size="sm"
              className="w-full"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </HeroButton>
            
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleDownload}
            >
              <Save className="h-4 w-4 mr-2" />
              Save As
            </Button>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Transform
              </h4>
              <div className="flex space-x-1">
                <ToolButton title="Rotate Left">
                  <RotateCcw className="h-4 w-4" />
                </ToolButton>
                <ToolButton title="Rotate Right">
                  <RotateCw className="h-4 w-4" />
                </ToolButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
