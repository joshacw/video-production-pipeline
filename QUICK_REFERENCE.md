# Video Production Pipeline - Quick Reference

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start Remotion Studio
npm run demo single      # Generate one video
npm run demo variants    # Generate 3 variants
npm run demo batch       # Batch generate multiple videos

# Server
npm run server           # Start API server on :3000

# Rendering
remotion render ExplainerVideo output/video.mp4
```

## 📝 Code Snippets

### Generate a Video

```typescript
import { VideoPipeline } from './src/pipeline/videoPipeline';

const pipeline = new VideoPipeline({
  openaiApiKey: process.env.OPENAI_API_KEY!,
  unsplashApiKey: process.env.UNSPLASH_API_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
});

const videoSpec = await pipeline.generateVideo(
  {
    topic: 'Your topic here',
    duration: 30,
    style: 'modern',
    platform: 'youtube-shorts',
    options: {
      includeVoiceover: true,
      includeCaptions: true,
      includeMusic: true,
    },
  },
  yourBrandConfig
);
```

### Custom Brand Config

```typescript
const myBrand: BrandConfig = {
  name: 'My Company',
  logo: 'https://example.com/logo.png',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#1F2937',
    text: '#F9FAFB',
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Poppins',
  },
};
```

### API Request

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "topic": "5 productivity tips",
      "duration": 30,
      "style": "modern",
      "platform": "instagram-reels"
    }
  }'
```

## 🎨 Available Options

### Platforms
- `youtube` (1920x1080, 600s max)
- `youtube-shorts` (1080x1920, 60s max)
- `tiktok` (1080x1920, 180s max)
- `instagram-feed` (1080x1080, 60s max)
- `instagram-reels` (1080x1920, 90s max)
- `instagram-stories` (1080x1920, 15s max)
- `linkedin` (1920x1080, 600s max)
- `twitter` (1280x720, 140s max)
- `facebook` (1280x720, 240s max)

### Styles
- `modern` - Clean, contemporary
- `corporate` - Professional
- `energetic` - Fast-paced
- `minimal` - Simple, elegant
- `playful` - Fun, colorful
- `elegant` - Sophisticated
- `bold` - Strong, impactful

### Templates
- `ExplainerVideo` - Educational content
- `ProductShowcase` - Product features
- `SocialPost` - Quick social content

## 📦 File Structure

```
video-production/
├── src/
│   ├── pipeline/              # Core logic
│   │   ├── videoPipeline.ts
│   │   ├── assetSourcer.ts
│   │   └── compositionBuilder.ts
│   ├── services/              # API integrations
│   ├── remotion/              # Video components
│   ├── api/                   # REST API
│   ├── types/                 # TypeScript types
│   └── examples/              # Demo scripts
├── README.md                  # Main docs
├── GETTING_STARTED.md         # Setup guide
└── ARCHITECTURE.md            # Technical details
```

## 🔑 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Optional (for assets)
UNSPLASH_API_KEY=...
PEXELS_API_KEY=...

# Server
PORT=3000
NODE_ENV=development
```

## 📊 Typical Workflow

```
1. Define Request
   ↓
2. Generate Video Spec (13-30s)
   - Script generation
   - Asset sourcing
   - Composition building
   ↓
3. Preview in Studio
   ↓
4. Render Video (60-120s)
   ↓
5. Export & Publish
```

## 🐛 Common Issues

### "API key not found"
```bash
# Create .env file
cp .env.example .env
# Add your keys
```

### "Module not found"
```bash
npm install
```

### "Out of memory"
```bash
# Reduce video duration or quality
# Close other applications
```

## 📞 API Endpoints

```
GET  /health                    # Health check
POST /api/generate              # Generate video
POST /api/generate/variants     # Multiple variants
POST /api/generate/batch        # Batch generation
GET  /api/platforms             # List platforms
GET  /api/styles                # List styles
GET  /api/templates             # List templates
```

## 💰 Cost Estimates

| Operation | Cost |
|-----------|------|
| Script generation | ~$0.01 |
| Voiceover (30s) | ~$0.05 |
| Asset APIs | Free |
| Rendering | Free (local) |
| **Total per video** | **~$0.10** |

## ⚡ Performance Tips

- Cache API responses
- Use batch processing
- Parallel asset sourcing
- Optimize video length
- Use CDN for assets

## 🎯 Best Practices

### Script Writing
- Keep it concise
- Start with a hook
- Clear message
- Strong CTA

### Asset Selection
- High quality (1920px+)
- Match topic
- Check licenses
- Consistent style

### Branding
- Consistent colors
- Clear hierarchy
- Readable fonts
- Logo placement

## 🔗 Useful Links

- [Remotion Docs](https://remotion.dev/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Unsplash API](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)

## 🎓 Learning Path

1. ✅ Run demo script
2. ✅ Preview in Studio
3. ✅ Customize branding
4. ✅ Try different styles
5. ✅ Generate variants
6. ✅ Use API server
7. ✅ Deploy to production

## 💡 Pro Tips

1. **Cache Everything** - API responses, assets, rendered frames
2. **Batch Processing** - Generate multiple videos in parallel
3. **Platform First** - Design for the target platform
4. **Test Quickly** - Use low quality for previews
5. **Monitor Costs** - Track API usage
6. **Version Assets** - Keep asset library organized
7. **A/B Test** - Generate variants and measure
8. **Automate Publishing** - Use platform APIs

## 🎬 Example Topics

### Tech/Business
- "5 AI tools every developer needs"
- "How to scale your startup"
- "Remote work productivity hacks"

### Education
- "Python basics in 60 seconds"
- "Understanding blockchain"
- "Data science explained"

### Marketing
- "Product launch announcement"
- "Customer testimonial highlight"
- "Behind the scenes tour"

### Social
- "Monday motivation quote"
- "Fun fact of the day"
- "Quick tip Tuesday"

## 🚦 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid request |
| 401 | Missing API key |
| 429 | Rate limit exceeded |
| 500 | Server error |

## 📈 Metrics to Track

- Videos generated
- Success rate
- Generation time
- API costs
- Cache hit rate
- Rendering errors
- User engagement

---

**Need more help?** Check the full documentation:
- [README.md](./README.md)
- [GETTING_STARTED.md](./GETTING_STARTED.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
