# Video Production Pipeline

A fully automated video production system that sources assets, generates media, and outputs high-impact short-form videos using Remotion.

## Features

- **Automated Script Generation** - AI-powered script creation from simple topics
- **Asset Sourcing** - Automatic gathering of images, videos, and music from multiple APIs
- **Media Generation** - AI voiceovers, subtitles, and dynamic graphics
- **Smart Composition** - Intelligent scene assembly with timing and transitions
- **Multi-Platform Support** - Optimized for YouTube, TikTok, Instagram, and more
- **Batch Processing** - Generate multiple video variants simultaneously
- **Brand Customization** - Consistent branding across all videos
- **Template Library** - Pre-built templates for different video types

## Pipeline Architecture

```
Topic Input → Script Generation → Asset Sourcing → Composition Building → Rendering → Output
     ↓              ↓                    ↓                  ↓                ↓          ↓
  Keywords      Narration          Images/Videos       Scene Assembly    MP4 Export  CDN
                                     + Music          + Animations
                                   + Voiceover        + Transitions
```

## Quick Start

### 1. Installation

```bash
cd video-production
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **OpenAI** - For script generation and voiceovers ([Get API Key](https://platform.openai.com/api-keys))
- **Unsplash** (optional) - For stock images ([Get API Key](https://unsplash.com/developers))
- **Pexels** (optional) - For stock images and videos ([Get API Key](https://www.pexels.com/api/))

### 3. Generate Your First Video

```bash
# Run the demo script
npm run demo single
```

This will:
1. Generate a script using AI
2. Source relevant images and videos
3. Create a complete video specification
4. Save the spec to `output/video-spec.json`

### 4. Preview in Remotion Studio

```bash
npm run dev
```

Open the Remotion Studio in your browser and load the generated video spec to preview your video.

### 5. Render the Video

```bash
npm run build
```

## Usage Examples

### Generate a Single Video

```typescript
import { VideoPipeline } from './src/pipeline/videoPipeline';
import { BrandConfig } from './src/types';

const pipeline = new VideoPipeline({
  openaiApiKey: process.env.OPENAI_API_KEY!,
  unsplashApiKey: process.env.UNSPLASH_API_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
});

const myBrand: BrandConfig = {
  name: 'My Company',
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

const videoSpec = await pipeline.generateVideo(
  {
    topic: 'How to boost productivity with AI',
    duration: 30,
    style: 'modern',
    platform: 'youtube-shorts',
    options: {
      includeVoiceover: true,
      includeCaptions: true,
      includeMusic: true,
    },
  },
  myBrand
);
```

### Generate Multiple Variants

```typescript
const variants = await pipeline.generateMultipleVariants(
  {
    topic: 'Top 5 productivity tips',
    duration: 60,
    style: 'energetic',
    platform: 'instagram-reels',
  },
  myBrand,
  3 // Number of variants
);
```

### Batch Processing

```bash
npm run demo batch
```

## Video Styles

Choose from multiple style presets:

- **modern** - Clean, contemporary design with smooth animations
- **corporate** - Professional, business-focused aesthetic
- **energetic** - Fast-paced, dynamic, and attention-grabbing
- **minimal** - Simple, elegant, less-is-more approach
- **playful** - Fun, colorful, and lighthearted
- **elegant** - Sophisticated and refined
- **bold** - Strong, impactful, and memorable

## Supported Platforms

Each platform has optimized dimensions and duration limits:

| Platform | Dimensions | Max Duration |
|----------|------------|--------------|
| YouTube | 1920x1080 | 10 minutes |
| YouTube Shorts | 1080x1920 | 60 seconds |
| TikTok | 1080x1920 | 3 minutes |
| Instagram Feed | 1080x1080 | 60 seconds |
| Instagram Reels | 1080x1920 | 90 seconds |
| Instagram Stories | 1080x1920 | 15 seconds |
| LinkedIn | 1920x1080 | 10 minutes |
| Twitter | 1280x720 | 2:20 minutes |
| Facebook | 1280x720 | 4 minutes |

## Template Types

Built-in templates for common video types:

- **Explainer Video** - Educational content with clear messaging
- **Product Showcase** - Highlight product features and benefits
- **Social Post** - Quick, engaging content for social media
- **Tutorial** - Step-by-step instructional videos
- **Testimonial** - Customer stories and reviews
- **News/Update** - Company announcements and updates
- **Promo** - Marketing and promotional content

## Project Structure

```
video-production/
├── src/
│   ├── pipeline/          # Core pipeline logic
│   │   ├── videoPipeline.ts       # Main orchestrator
│   │   ├── assetSourcer.ts        # Asset collection
│   │   └── compositionBuilder.ts  # Scene assembly
│   ├── remotion/          # Remotion components
│   │   ├── compositions/          # Video templates
│   │   │   ├── ExplainerVideo.tsx
│   │   │   ├── ProductShowcase.tsx
│   │   │   └── SocialPost.tsx
│   │   └── components/            # Reusable components
│   │       └── scenes/
│   │           ├── IntroScene.tsx
│   │           ├── ContentScene.tsx
│   │           └── OutroScene.tsx
│   ├── services/          # External API integrations
│   │   ├── openai.ts              # OpenAI API
│   │   ├── unsplash.ts            # Unsplash API
│   │   └── pexels.ts              # Pexels API
│   ├── types/             # TypeScript definitions
│   └── examples/          # Demo scripts
├── templates/             # Video templates
├── config/                # Configuration files
└── output/                # Generated videos
```

## API Reference

### VideoPipeline

Main class for generating videos.

```typescript
const pipeline = new VideoPipeline(config: PipelineConfig)

await pipeline.generateVideo(
  request: VideoRequest,
  branding: BrandConfig
): Promise<VideoSpec>

await pipeline.generateMultipleVariants(
  request: VideoRequest,
  branding: BrandConfig,
  variantCount: number
): Promise<VideoSpec[]>
```

### VideoRequest

```typescript
{
  topic: string;           // Video topic/subject
  duration: number;        // Duration in seconds (5-300)
  style: StylePreset;      // Visual style preset
  platform: Platform;      // Target platform
  template?: string;       // Optional template ID
  customPrompt?: string;   // Additional instructions
  options?: {
    includeVoiceover: boolean;
    includeCaptions: boolean;
    includeMusic: boolean;
    autoPublish: boolean;
  }
}
```

### BrandConfig

```typescript
{
  name: string;
  logo?: string;           // Logo URL
  colors: {
    primary: string;       // Hex color
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;       // Font family name
    secondary: string;
  };
}
```

## Advanced Features

### Custom Templates

Create your own video templates by extending the base composition:

```typescript
import { VideoSpec } from '../../types';
import { AbsoluteFill, Sequence } from 'remotion';

export const CustomTemplate: React.FC<VideoSpec> = (props) => {
  // Your custom video logic
  return <AbsoluteFill>{/* Your scenes */}</AbsoluteFill>;
};
```

### Dynamic Metadata

Use Remotion's `calculateMetadata` to dynamically set video properties:

```typescript
export const calculateMetadata = ({ props }) => {
  return {
    durationInFrames: props.duration * props.fps,
    width: props.dimensions.width,
    height: props.dimensions.height,
  };
};
```

## Performance Tips

- **Parallel Processing** - Asset sourcing happens in parallel for faster generation
- **Caching** - Assets are cached to avoid redundant API calls
- **Queue System** - Use Bull queue for batch processing
- **CDN Delivery** - Host rendered videos on a CDN for fast delivery

## Roadmap

- [ ] Real-time preview in web UI
- [ ] Advanced text animations and effects
- [ ] Integration with more stock asset providers
- [ ] Automated thumbnail generation
- [ ] Direct upload to social platforms
- [ ] Analytics and performance tracking
- [ ] AI-powered A/B testing
- [ ] Voice cloning support
- [ ] Multi-language support

## Troubleshooting

### API Rate Limits

If you hit rate limits on asset APIs, consider:
- Using multiple API keys (load balancing)
- Implementing exponential backoff
- Caching frequently used assets

### Rendering Issues

- Ensure all asset URLs are accessible
- Check that fonts are properly loaded
- Verify audio file formats are supported

### Out of Memory

For large batches:
- Process videos sequentially instead of parallel
- Reduce video quality or duration
- Use streaming rendering

## Contributing

Contributions welcome! Areas for improvement:

- Additional video templates
- More asset source integrations
- Enhanced animation effects
- Performance optimizations
- Documentation improvements

## License

MIT

## Support

For issues and questions:
- Check the [documentation](./docs/)
- Review [examples](./src/examples/)
- Open an issue on GitHub

---

Built with [Remotion](https://remotion.dev) and powered by AI.
