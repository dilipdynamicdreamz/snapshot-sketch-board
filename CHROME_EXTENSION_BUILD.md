# Chrome Extension Build Instructions

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from your project

## Important Notes

- The extension files are built to the `dist` folder
- The `manifest.json` in the `public` folder will be copied to `dist` during build
- Make sure to rebuild (`npm run build`) after any code changes
- Reload the extension in `chrome://extensions/` after rebuilding

## File Structure After Build

```
dist/
├── index.html          # Main popup file
├── manifest.json       # Extension manifest
├── favicon.ico         # Extension icons
└── assets/            # JS, CSS, and other assets
    ├── index-[hash].js
    ├── index-[hash].css
    └── [other assets]
```

## Troubleshooting

- **ERR_FILE_NOT_FOUND**: Make sure you've run `npm run build` and loaded the `dist` folder (not the project root)
- **Extension not updating**: Reload the extension in `chrome://extensions/`
- **Permission errors**: Check that all required permissions are listed in `manifest.json`