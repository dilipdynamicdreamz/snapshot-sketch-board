# Image Editor Pro - Chrome Extension

A powerful Chrome Extension for professional image editing with an intuitive interface and advanced tools.

## Features

### 🎨 **Professional Image Editor**
- **Crop, Resize & Transform** - Precision editing tools
- **Drawing Tools** - Pen, Rectangle, Ellipse, Arrow, Text
- **Effects** - Blur and other visual enhancements
- **Undo/Redo** - Non-destructive editing workflow

### 📸 **Capture & Upload**
- **Screenshot Capture** - Capture any visible tab
- **Image Upload** - Support for various image formats
- **Quick Access** - One-click editing from popup

### 📚 **History Management**
- **Auto-Save** - All edits automatically saved
- **Search & Filter** - Find images by name, date, or size
- **Preview & Download** - Quick access to saved edits
- **Bulk Actions** - Edit, view, download, or delete multiple images

### 🎯 **User Experience**
- **Dark Theme** - Beautiful dark interface with gradients
- **Responsive Design** - Works on all screen sizes
- **Fast Performance** - Optimized for speed and efficiency
- **Intuitive Controls** - Professional tools made simple

## Installation (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project directory
5. The extension will appear in your Chrome toolbar

## Usage

### Getting Started
1. Click the Image Editor Pro icon in your Chrome toolbar
2. Choose from three options:
   - **Upload Image** - Select an image from your device
   - **Take Screenshot** - Capture the current tab
   - **History** - View previously edited images

### Image Editing
- Select tools from the left toolbar
- Use the canvas to edit your image
- Save your work with Copy, Download, or Save As
- All edits are automatically saved to history

### Managing History
- Access all your edited images from the History page
- Search by filename or sort by date/size
- Quick actions: Edit, View, Download, Delete

## Technical Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Fabric.js** - Advanced canvas manipulation
- **Vite** - Fast build system
- **Shadcn/ui** - Beautiful component library

## File Structure

```
src/
├── components/          # Main application components
│   ├── Popup.tsx       # Extension popup interface
│   ├── ImageEditor.tsx # Main editing interface
│   ├── HistoryPage.tsx # History management
│   └── ui/             # Reusable UI components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage management
│   └── imageUtils.ts   # Image processing utilities
└── assets/             # Static assets
```

## Chrome Extension Manifest

The extension uses Manifest V3 with the following permissions:
- `activeTab` - For screenshot capture
- `storage` - For saving image history

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.