export interface HistoryImage {
  id: string;
  name: string;
  url: string;
  dataUrl: string;
  createdAt: Date;
  modifiedAt: Date;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ImageEditorTool {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface CanvasState {
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  tool: string;
}