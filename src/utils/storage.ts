import { HistoryImage } from '@/types/image';

const STORAGE_KEY = 'imageEditorHistory';

export const getStoredImages = (): HistoryImage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stored images:', error);
    return [];
  }
};

export const saveImageToHistory = (image: Omit<HistoryImage, 'id' | 'createdAt'>): HistoryImage => {
  const newImage: HistoryImage = {
    ...image,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };

  const images = getStoredImages();
  images.unshift(newImage);
  
  // Keep only the last 100 images
  const limitedImages = images.slice(0, 100);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedImages));
  return newImage;
};

export const deleteImageFromHistory = (id: string): void => {
  const images = getStoredImages().filter(img => img.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const updateImageInHistory = (id: string, updates: Partial<HistoryImage>): void => {
  const images = getStoredImages().map(img => 
    img.id === id ? { ...img, ...updates, modifiedAt: new Date() } : img
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};
