# Video Production Pipeline - Technical Architecture

## System Overview

The Video Production Pipeline is a fully automated system that transforms a simple topic into a professional video in minutes. It combines AI-powered content generation, intelligent asset sourcing, and Remotion's rendering engine.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                  │
│  Topic, Duration, Style, Platform, Brand Config                    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     VIDEO PIPELINE                                  │
│                   (videoPipeline.ts)                                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   SCRIPT     │  │    ASSET     │  │    MEDIA     │
│  GENERATOR   │  │   SOURCER    │  │  GENERATOR   │
│              │  │              │  │              │
│  OpenAI GPT  │  │  Unsplash    │  │  Voiceover   │
│              │  │  Pexels      │  │  Captions    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
                ▼                 ▼
       ┌─────────────────────────────────┐
       │    COMPOSITION BUILDER          │
       │  (compositionBuilder.ts)        │
       │                                 │
       │  • Scene Assembly               │
       │  • Timing Calculation           │
       │  • Platform Optimization        │
       │  • Branding Application         │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │       VIDEO SPECIFICATION       │
       │       (VideoSpec object)        │
       │                                 │
       │  {                              │
       │    scenes: [...],               │
       │    assets: {...},               │
       │    branding: {...},             │
       │    audio: {...}                 │
       │  }                              │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │       REMOTION RENDERER         │
       │                                 │
       │  • ExplainerVideo               │
       │  • ProductShowcase              │
       │  • SocialPost                   │
       │                                 │
       │  Components:                    │
       │  • IntroScene                   │
       │  • ContentScene                 │
       │  • OutroScene                   │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │        OUTPUT VIDEO             │
       │      (MP4, WebM, etc.)          │
       └─────────────────────────────────┘
```

## Component Architecture

### 1. Pipeline Layer

**VideoPipeline** (`src/pipeline/videoPipeline.ts`)
- Main orchestrator
- Coordinates all subsystems
- Manages parallel processing
- Handles error recovery

**Key Methods**:
```typescript
generateVideo(request, branding): Promise<VideoSpec>
generateMultipleVariants(request, branding, count): Promise<VideoSpec[]>
```

### 2. Content Generation Layer

**OpenAIService** (`src/services/openai.ts`)
- Script generation using GPT-4
- Text-to-speech voiceovers
- Caption generation via Whisper
- Content optimization for platform

**Flow**:
```
Topic → Prompt Engineering → GPT-4 → Structured Script
Script → TTS API → MP3 Audio → Voiceover
Audio → Whisper → Timestamped Text → Captions
```

### 3. Asset Sourcing Layer

**AssetSourcer** (`src/pipeline/assetSourcer.ts`)
- Parallel API calls to multiple providers
- Keyword-based search
- Quality filtering
- License management

**Supported Sources**:
- Unsplash (images)
- Pexels (images + videos)
- Custom asset library
- User uploads

**Selection Algorithm**:
1. Extract keywords from script
2. Query all available sources in parallel
3. Score results by relevance
4. Filter by license and quality
5. Deduplicate across sources
6. Return top N assets

### 4. Composition Layer

**CompositionBuilder** (`src/pipeline/compositionBuilder.ts`)
- Converts script + assets → video structure
- Calculates timing and pacing
- Applies platform constraints
- Adds branding elements

**Scene Types**:
```typescript
type SceneType =
  | 'intro'              // Logo + title animation
  | 'title'              // Text-only slide
  | 'content'            // Image/video + text
  | 'split-screen'       // Asset left, text right
  | 'full-screen-text'   // Text-only on gradient
  | 'video-overlay'      // Video with text overlay
  | 'outro'              // Ending credits
  | 'cta';               // Call-to-action
```

**Timing Algorithm**:
```
Total Duration = D seconds
Intro: 10% of D
Content: 75% of D (divided among scenes)
Outro: 15% of D
```

### 5. Rendering Layer

**Remotion Compositions** (`src/remotion/compositions/`)
- React components that render video
- Frame-by-frame animation
- Audio synchronization
- Real-time preview

**Scene Components** (`src/remotion/components/scenes/`)
- Reusable building blocks
- Animated with springs and interpolations
- Styled based on brand config
- Responsive to different platforms

## Data Flow

### Request → Response Flow

```typescript
// 1. User Input
const request: VideoRequest = {
  topic: "How AI improves productivity",
  duration: 30,
  style: "modern",
  platform: "youtube-shorts"
};

// 2. Script Generation (2-5s)
const script = await openai.generateScript(request);
// {
//   title: "AI: Your Productivity Superpower",
//   narration: "Discover how...",
//   segments: [...]
// }

// 3. Asset Sourcing (parallel, 3-8s)
const [images, videos, music] = await Promise.all([
  unsplash.search("productivity AI"),
  pexels.search("technology workspace"),
  musicLibrary.select("modern")
]);

// 4. Composition Building (instant)
const videoSpec = compositionBuilder.build({
  script,
  assets: [...images, ...videos],
  music,
  branding
});

// 5. Return to User
return videoSpec; // Ready for rendering
```

### Rendering Flow

```typescript
// Remotion renders frame-by-frame
for (let frame = 0; frame < totalFrames; frame++) {
  // Calculate current time
  const time = frame / fps;

  // Find active scenes at this time
  const activeScenes = scenes.filter(s =>
    time >= s.startTime &&
    time < s.startTime + s.duration
  );

  // Render each scene
  activeScenes.forEach(scene => {
    renderScene(scene, frame, fps);
  });

  // Mix audio
  mixAudio(music, voiceover, frame);

  // Output frame
  writeFrame(frame);
}
```

## Performance Characteristics

### Timing Breakdown

| Stage | Time | Cacheable |
|-------|------|-----------|
| Script Generation | 2-5s | ✅ |
| Asset Sourcing | 3-8s | ✅ |
| Voiceover Generation | 5-10s | ✅ |
| Caption Generation | 3-6s | ✅ |
| Composition Building | <1s | ❌ |
| **Total Generation** | **13-30s** | - |
| Rendering (30s video) | 60-120s | ❌ |

### Scalability

**Vertical Scaling** (single instance):
- 10-20 videos/hour with caching
- Limited by API rate limits
- Good for prototyping

**Horizontal Scaling** (distributed):
- Queue-based job processing
- Multiple worker nodes
- 100+ videos/hour possible
- Good for production

### Bottlenecks

1. **API Rate Limits**
   - OpenAI: 60 requests/minute (tier 1)
   - Unsplash: 50 requests/hour (free)
   - Pexels: Unlimited (free)

2. **Rendering**
   - CPU-intensive
   - Scales with video length and complexity
   - Can be offloaded to cloud (AWS Lambda, etc.)

3. **Asset Downloads**
   - Network bandwidth
   - Asset size (especially videos)
   - Mitigated with CDN caching

## Error Handling

### Retry Strategy

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### Fallback Mechanisms

1. **Asset Sourcing**
   - If Unsplash fails → try Pexels
   - If all fail → use placeholder images

2. **Content Generation**
   - If GPT-4 fails → try GPT-3.5
   - If TTS fails → render without voiceover

3. **Rendering**
   - If memory error → reduce quality
   - If timeout → split into chunks

## Security Considerations

### API Key Management
- Store in environment variables
- Never commit to version control
- Rotate keys regularly
- Use separate keys for dev/prod

### Content Safety
- Script validation before generation
- Asset filtering (NSFW, copyright)
- Rate limiting per user
- Audit logs for all generations

### Output Validation
- Check video duration
- Verify asset licenses
- Validate audio sync
- Test platform compatibility

## Future Enhancements

### Phase 2 (Q2 2024)
- [ ] Real-time preview API
- [ ] Advanced text animations
- [ ] Multi-language support
- [ ] Voice cloning integration

### Phase 3 (Q3 2024)
- [ ] AI-powered A/B testing
- [ ] Automated thumbnail generation
- [ ] Direct social media publishing
- [ ] Analytics dashboard

### Phase 4 (Q4 2024)
- [ ] Collaborative editing
- [ ] Template marketplace
- [ ] White-label solution
- [ ] Mobile app

## Technology Stack

### Core
- **Remotion 4.x** - Video rendering engine
- **React 18** - UI components
- **TypeScript** - Type safety
- **Node.js 18+** - Runtime

### AI & ML
- **OpenAI GPT-4** - Script generation
- **OpenAI TTS** - Voiceovers
- **Whisper** - Transcription

### Asset Sources
- **Unsplash API** - Stock images
- **Pexels API** - Stock images/videos
- **Custom CDN** - User uploads

### Infrastructure
- **Express** - API server
- **Bull** - Job queue
- **Redis** - Cache & queue storage
- **PostgreSQL** - Metadata storage

### Deployment
- **Docker** - Containerization
- **AWS Lambda** - Serverless rendering
- **CloudFront** - CDN delivery
- **GitHub Actions** - CI/CD

## Monitoring & Observability

### Metrics to Track
- Generation success rate
- Average generation time
- API usage and costs
- Rendering errors
- Asset cache hit rate

### Logging Strategy
```typescript
// Structured logging
logger.info('video.generation.started', {
  videoId,
  topic,
  platform,
  duration
});

logger.info('video.generation.completed', {
  videoId,
  generationTime: endTime - startTime,
  sceneCount,
  assetCount
});
```

### Alerting
- API failures (>5% error rate)
- High generation times (>60s)
- Low cache hit rate (<70%)
- Rendering failures

## Cost Analysis

### Per Video (30s)
- OpenAI API: $0.10
- Asset APIs: Free
- Rendering: $0.00 (local) or $0.50 (cloud)
- Storage: $0.01
- **Total: $0.11-$0.61**

### At Scale (1000 videos/day)
- Generation: $100-$150/day
- Rendering: $500/day (cloud)
- Storage: $30/month
- Infrastructure: $200/month
- **Total: ~$4,000/month**

## Maintenance

### Regular Tasks
- Update dependencies weekly
- Rotate API keys monthly
- Review and optimize costs
- Monitor error rates
- Update documentation

### Testing Strategy
- Unit tests for pipeline logic
- Integration tests for API calls
- Visual regression for renderings
- Performance benchmarks
- Load testing for scale

---

Built with ❤️ using Remotion and AI
