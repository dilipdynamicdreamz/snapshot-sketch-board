export const captureScreenshot = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For Chrome extension, we would use chrome.tabs.captureVisibleTab
    // For demo purposes, we'll create a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    // Create a gradient placeholder screenshot
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#06B6D4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some mock content
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '48px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Screenshot Preview', canvas.width / 2, canvas.height / 2);
    
    resolve(canvas.toDataURL('image/png'));
  });
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};