# Video Assets Library

Store your reusable video assets here for use in compositions.

## 📁 Folder Structure

### `logos/`
Brand logos and wordmarks
- **Format**: PNG with transparency preferred
- **Size**: At least 500px wide
- **Naming**: `brand-name-logo.png`

### `screenshots/`
Product screenshots, UI captures, app interfaces
- **Format**: PNG or JPG
- **Size**: At least 1920px wide for best quality
- **Naming**: `product-feature-name.png`

### `graphics/`
Icons, illustrations, decorative elements
- **Format**: SVG preferred, PNG with transparency
- **Size**: Vector (SVG) or high-res (1000px+)
- **Naming**: `icon-name.svg` or `graphic-name.png`

### `backgrounds/`
Background images, patterns, textures
- **Format**: JPG for photos, PNG for patterns
- **Size**: At least 1920x1080
- **Naming**: `background-description.jpg`

### `footage/`
Stock video clips, b-roll footage
- **Format**: MP4, MOV
- **Size**: 1080p or higher
- **Naming**: `clip-description.mp4`

## 🎯 Usage in Video Specs

Reference assets by their relative path:

```json
{
  "script": {
    "title": "Welcome to Channel D"
  },
  "assets": {
    "logo": "assets/logos/channel-d-logo.png",
    "screenshot1": "assets/screenshots/dashboard.png",
    "icon": "assets/graphics/tooth-icon.svg",
    "background": "assets/backgrounds/gradient-blue.jpg"
  },
  "branding": {
    "logo": "assets/logos/channel-d-logo.png",
    "colors": {
      "primary": "#0ea5e9"
    }
  }
}
```

## 📸 Asset Best Practices

### **Quality Standards:**
- **Logos**: Transparent background, high contrast
- **Screenshots**: Clean, cropped, no sensitive data
- **Icons**: Simple, recognizable, consistent style
- **Backgrounds**: Not too busy, good contrast for text

### **File Size:**
- Keep individual files under 5MB
- Optimize images before adding (use TinyPNG, ImageOptim)
- Use appropriate formats (SVG > PNG > JPG)

### **Naming Conventions:**
- Use lowercase
- Separate words with hyphens
- Be descriptive but concise
- Examples:
  - ✅ `dental-practice-dashboard.png`
  - ✅ `timebuddy-logo-white.png`
  - ❌ `Screenshot 2024.png`
  - ❌ `IMG_1234.jpg`

## 🎨 Example Asset Library

```
assets/
├── logos/
│   ├── channel-d-logo.png
│   ├── channel-d-logo-white.png
│   └── channel-d-wordmark.svg
├── screenshots/
│   ├── waiting-room-screen.png
│   ├── admin-dashboard.png
│   └── patient-education-video.png
├── graphics/
│   ├── tooth-icon.svg
│   ├── checkmark-circle.svg
│   └── arrow-right.svg
├── backgrounds/
│   ├── gradient-teal-blue.jpg
│   └── dental-office-blur.jpg
└── footage/
    └── waiting-room-timelapse.mp4
```

## 🚀 Quick Start

1. **Add your assets:**
   ```bash
   cp ~/Desktop/my-logo.png assets/logos/company-logo.png
   ```

2. **Reference in video prompt:**
   > "Use pain-solution-CTA. Include logo from assets/logos/company-logo.png in top left. Show screenshot assets/screenshots/dashboard.png during solution section."

3. **Claude handles the rest!**

## 💡 Tips

- Update this folder regularly with new marketing assets
- Keep a backup of original, uncompressed files elsewhere
- Test assets in Remotion Studio before bulk rendering
- Organize by campaign or product if you have many assets
