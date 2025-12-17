# PWA Icon Setup

The PWA requires icon files for proper installation. The vite-plugin-pwa will automatically generate icons from a source icon.

## Quick Setup

1. Create or obtain a 512x512 PNG icon for your app
2. Save it as `fe/public/icon-512.png`
3. The plugin will automatically generate other sizes

## Manual Icon Generation

If you need to create icons manually:

1. **icon-192.png** - 192x192 pixels (required)
2. **icon-512.png** - 512x512 pixels (required)
3. **apple-touch-icon.png** - 180x180 pixels (optional, for iOS)
4. **favicon.ico** - 32x32 pixels (optional)

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Or use ImageMagick/GraphicsMagick:
```bash
# Convert SVG to PNG (if you have ImageMagick)
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

## Current Status

The app is configured for PWA but needs actual icon files. The vite-plugin-pwa will handle icon generation during build if you provide a source icon.

