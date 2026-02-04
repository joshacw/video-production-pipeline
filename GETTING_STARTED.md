# Getting Started with Video Production Pipeline

This guide will walk you through setting up and creating your first automated video.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys (see below)

## Step 1: Get Your API Keys

### OpenAI (Required)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

**Cost**: Pay-as-you-go. A 30-second video costs approximately:
- Script generation: ~$0.01
- Voiceover (TTS): ~$0.05
- Total: ~$0.10 per video

### Unsplash (Optional - for images)

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key

**Cost**: Free (50 requests/hour)

### Pexels (Optional - for images & videos)

1. Go to [Pexels API](https://www.pexels.com/api/)
2. Sign up and get your API key

**Cost**: Free (unlimited requests, attribution required)

## Step 2: Install Dependencies

```bash
cd video-production
npm install
```

This will install:
- Remotion (video rendering)
- OpenAI SDK (AI generation)
- Asset sourcing libraries
- All dependencies

## Step 3: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
OPENAI_API_KEY=sk-your-openai-key-here
UNSPLASH_API_KEY=your-unsplash-key-here  # Optional
PEXELS_API_KEY=your-pexels-key-here      # Optional
```

## Step 4: Generate Your First Video

Run the demo script:

```bash
npm run demo single
```

You should see output like:

```
🎬 Starting video generation pipeline...
📝 Generating script...
✅ Script generated: "How AI is Revolutionizing Video Production"
🖼️  Sourcing assets...
✅ Sourced 7 assets
🎤 Generating voiceover...
✅ Voiceover generated
📝 Generating captions...
✅ Generated 8 captions
🎨 Building video composition...
✅ Video specification complete!
   Duration: 30s
   Scenes: 8
   Assets: 7
```

This creates a `video-spec.json` file in the `output` directory.

## Step 5: Preview Your Video

Start Remotion Studio:

```bash
npm run dev
```

This opens a browser at `http://localhost:3000` where you can:
- Preview your video in real-time
- Adjust timing and animations
- Test different compositions
- Export frames

## Step 6: Render Your Video

To render the final video:

```bash
remotion render ExplainerVideo output/my-video.mp4 --props='./output/video-spec.json'
```

Or use the Remotion Studio interface to render with a single click.

## Understanding the Output

Your generated video will have:

1. **Intro Scene** (3-5s)
   - Animated logo
   - Title with smooth entrance

2. **Content Scenes** (20-25s)
   - Images/videos from stock libraries
   - Text overlays synchronized with narration
   - Smooth transitions between scenes

3. **Outro Scene** (2-5s)
   - Call-to-action
   - Brand logo
   - Contact information

## Customization Options

### Change Video Topic

```bash
npm run demo single
```

Edit `src/examples/demo.ts` and change the `topic` field:

```typescript
const request: VideoRequest = {
  topic: 'Your custom topic here',
  duration: 30,
  style: 'modern',
  platform: 'youtube-shorts',
};
```

### Adjust Video Style

Available styles:
- `modern` - Clean, contemporary
- `corporate` - Professional, business
- `energetic` - Fast-paced, dynamic
- `minimal` - Simple, elegant
- `playful` - Fun, colorful
- `elegant` - Sophisticated
- `bold` - Strong, impactful

### Target Different Platforms

```typescript
platform: 'instagram-reels'  // 1080x1920, up to 90s
platform: 'youtube-shorts'   // 1080x1920, up to 60s
platform: 'tiktok'           // 1080x1920, up to 180s
platform: 'linkedin'         // 1920x1080, up to 600s
```

### Customize Branding

Edit the brand configuration:

```typescript
const myBrand: BrandConfig = {
  name: 'My Company',
  logo: 'https://example.com/logo.png',
  colors: {
    primary: '#FF0000',    // Your brand color
    secondary: '#00FF00',
    accent: '#0000FF',
    background: '#000000',
    text: '#FFFFFF',
  },
  fonts: {
    primary: 'Montserrat',
    secondary: 'Roboto',
  },
};
```

## Advanced Usage

### Generate Multiple Variants

Create A/B test variations:

```bash
npm run demo variants
```

This generates 3 different versions of the same topic with varied scripts and visuals.

### Batch Generation

Generate multiple videos from different topics:

```bash
npm run demo batch
```

### Use the API Server

Start the API server:

```bash
npm run server
```

Then use HTTP requests:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "topic": "5 Tips for Better Sleep",
      "duration": 30,
      "style": "modern",
      "platform": "instagram-reels",
      "options": {
        "includeVoiceover": true,
        "includeCaptions": true,
        "includeMusic": true
      }
    }
  }'
```

## Troubleshooting

### "OpenAI API key not found"

Make sure your `.env` file exists and contains:
```
OPENAI_API_KEY=sk-...
```

### "No assets found"

If asset APIs are not configured, the system will use placeholder images. Add Unsplash or Pexels API keys for real images.

### "Memory error during rendering"

For long videos or high resolution:
1. Reduce video duration
2. Lower resolution in video spec
3. Close other applications

### "Module not found" errors

Run:
```bash
npm install
```

## Next Steps

1. **Explore Templates** - Check `src/remotion/compositions/` for different video templates
2. **Create Custom Scenes** - Add new scene components in `src/remotion/components/scenes/`
3. **Integrate More APIs** - Add more asset sources in `src/services/`
4. **Build Custom Templates** - Create branded templates for your use case
5. **Deploy to Production** - Use the API server with a queue system for scale

## Best Practices

### Script Writing
- Keep it concise and focused
- Start with a strong hook
- End with a clear CTA
- Match tone to platform

### Asset Selection
- Use high-quality images (1920px+ width)
- Ensure assets match your topic
- Avoid copyrighted material
- Check licenses for commercial use

### Video Optimization
- Keep it under 60s for social platforms
- Use captions for accessibility
- Test on mobile devices
- Optimize file size for web

### Branding
- Use consistent colors across videos
- Include logo in intro/outro
- Match fonts to brand guidelines
- Maintain visual hierarchy

## Resources

- [Remotion Documentation](https://remotion.dev/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Remotion Best Practices](../remotion-skills/skills/remotion/SKILL.md)
- [Video Production Pipeline Architecture](../docs/video-production-pipeline.md)

## Support

Need help?
- Check the [README](./README.md)
- Review [examples](./src/examples/)
- Read the [architecture docs](../docs/video-production-pipeline.md)

## Example Workflow

Here's a complete workflow from idea to published video:

```bash
# 1. Generate video spec
npm run demo single

# 2. Preview in Remotion Studio
npm run dev

# 3. Make adjustments in Studio
# (adjust timing, colors, text, etc.)

# 4. Render final video
remotion render ExplainerVideo output/final.mp4

# 5. Upload to social media
# (Manual or use platform APIs)
```

## Cost Estimation

Per video (30 seconds):
- OpenAI API: ~$0.10
- Asset APIs: Free (with attribution)
- Rendering: Local (free) or cloud (~$0.50)

**Total**: ~$0.10-$0.60 per video

For 100 videos/day:
- $10-$60/day
- $300-$1,800/month

## Performance Tips

- Cache API responses to avoid duplicate requests
- Use batch processing for multiple videos
- Render at lower quality for previews
- Use a CDN for asset delivery
- Queue jobs during off-peak hours

---

Ready to create amazing videos? Let's go! 🎬
