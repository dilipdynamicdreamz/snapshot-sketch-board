import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Download, 
  Trash2, 
  Search,
  Calendar,
  FileImage,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HeroButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getStoredImages, deleteImageFromHistory } from "@/utils/storage";
import { downloadImage } from "@/utils/imageUtils";
import { HistoryImage } from "@/types/image";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<HistoryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const storedImages = getStoredImages();
    setImages(storedImages);
  };

  const filteredImages = images
    .filter(img => 
      img.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "date":
        default:
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      }
    });

  const handleEdit = (image: HistoryImage) => {
    navigate("/editor", { 
      state: { 
        imageData: image.dataUrl, 
        fileName: image.name 
      } 
    });
  };

  const handleView = (image: HistoryImage) => {
    // Open image in a new tab
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>${image.name}</title></head>
          <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;">
            <img src="${image.dataUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" alt="${image.name}"/>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleDownload = (image: HistoryImage) => {
    downloadImage(image.dataUrl, image.name);
    toast.success("Image downloaded!");
  };

  const handleDelete = (image: HistoryImage) => {
    if (confirm(`Are you sure you want to delete "${image.name}"?`)) {
      deleteImageFromHistory(image.id);
      loadImages();
      toast.success("Image deleted from history");
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="hover:bg-secondary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Image History
              </h1>
              <Badge variant="secondary" className="bg-secondary/50">
                {images.length} images
              </Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {filteredImages.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <FileImage className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              {searchTerm ? "No images found" : "No images in history"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start editing images to build your history"
              }
            </p>
            {!searchTerm && (
              <HeroButton onClick={() => navigate("/")}>
                Create Your First Edit
              </HeroButton>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card 
                key={image.id} 
                className="overflow-hidden hover:shadow-card transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50"
              >
                {/* Image Preview */}
                <div className="aspect-video relative bg-muted/50 overflow-hidden">
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 truncate" title={image.name}>
                    {image.name}
                  </h3>
                  
                  <div className="text-xs text-muted-foreground space-y-1 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(image.modifiedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{image.dimensions.width} × {image.dimensions.height}</span>
                      <span>{formatFileSize(image.size)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(image)}
                      className="h-8 w-full hover:bg-primary/10"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(image)}
                      className="h-8 w-full hover:bg-accent/10"
                      title="View"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(image)}
                      className="h-8 w-full hover:bg-extension-green/10"
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(image)}
                      className="h-8 w-full hover:bg-destructive/10 text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};