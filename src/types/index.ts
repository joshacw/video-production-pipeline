import { z } from 'zod';

// ============================================================================
// ASSET TYPES
// ============================================================================

export const AssetTypeSchema = z.enum(['image', 'video', 'audio', 'font']);
export type AssetType = z.infer<typeof AssetTypeSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  type: AssetTypeSchema,
  url: z.string(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    license: z.string().optional(),
    attribution: z.string().optional(),
  }),
});
export type Asset = z.infer<typeof AssetSchema>;

// ============================================================================
// SCRIPT & CONTENT TYPES
// ============================================================================

export const ScriptSegmentSchema = z.object({
  id: z.string(),
  text: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  sceneType: z.enum(['intro', 'content', 'transition', 'outro', 'cta']),
  visualDirection: z.string().optional(),
});
export type ScriptSegment = z.infer<typeof ScriptSegmentSchema>;

export const ScriptSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  segments: z.array(ScriptSegmentSchema),
  keywords: z.array(z.string()),
  narration: z.string(),
});
export type Script = z.infer<typeof ScriptSchema>;

// ============================================================================
// CAPTION TYPES
// ============================================================================

export const CaptionSchema = z.object({
  text: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  confidence: z.number().optional(),
});
export type Caption = z.infer<typeof CaptionSchema>;

// ============================================================================
// AUDIO TYPES
// ============================================================================

export const AudioTrackSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: z.enum(['music', 'voiceover', 'sfx']),
  duration: z.number(),
  volume: z.number().default(1),
  startFrom: z.number().default(0),
});
export type AudioTrack = z.infer<typeof AudioTrackSchema>;

// ============================================================================
// BRAND & STYLE TYPES
// ============================================================================

export const BrandColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
});

export const BrandConfigSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  colors: BrandColorsSchema,
  fonts: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
});
export type BrandConfig = z.infer<typeof BrandConfigSchema>;

export const StylePresetSchema = z.enum([
  'modern',
  'corporate',
  'energetic',
  'minimal',
  'playful',
  'elegant',
  'bold',
]);
export type StylePreset = z.infer<typeof StylePresetSchema>;

// ============================================================================
// SCENE TYPES
// ============================================================================

export const SceneSchema = z.object({
  id: z.string(),
  type: z.enum([
    'intro',
    'title',
    'content',
    'split-screen',
    'full-screen-text',
    'image-with-text',
    'video-overlay',
    'outro',
    'cta',
  ]),
  duration: z.number(),
  startTime: z.number(),
  assets: z.array(z.string()), // Asset IDs
  text: z.string().optional(),
  animation: z.string().optional(),
  transition: z.string().optional(),
});
export type Scene = z.infer<typeof SceneSchema>;

// ============================================================================
// VIDEO SPECIFICATION
// ============================================================================

export const PlatformSchema = z.enum([
  'youtube',
  'youtube-shorts',
  'tiktok',
  'instagram-feed',
  'instagram-reels',
  'instagram-stories',
  'linkedin',
  'twitter',
  'facebook',
]);
export type Platform = z.infer<typeof PlatformSchema>;

export const VideoDimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
});
export type VideoDimensions = z.infer<typeof VideoDimensionsSchema>;

export const VideoSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  style: StylePresetSchema,
  duration: z.number(),
  platform: PlatformSchema,
  dimensions: VideoDimensionsSchema,
  fps: z.number().default(30),
  scenes: z.array(SceneSchema),
  assets: z.record(z.string(), AssetSchema),
  music: AudioTrackSchema.optional(),
  voiceover: AudioTrackSchema.optional(),
  captions: z.array(CaptionSchema).optional(),
  branding: BrandConfigSchema,
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string(),
  }),
});
export type VideoSpec = z.infer<typeof VideoSpecSchema>;

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum([
    'explainer',
    'product-showcase',
    'social-post',
    'tutorial',
    'testimonial',
    'news',
    'promo',
  ]),
  defaultDuration: z.number(),
  sceneStructure: z.array(z.object({
    type: SceneSchema.shape.type,
    durationRatio: z.number(), // Percentage of total duration
    required: z.boolean(),
  })),
  requiredAssets: z.object({
    images: z.number(),
    videos: z.number().optional(),
  }),
  supportedPlatforms: z.array(PlatformSchema),
});
export type Template = z.infer<typeof TemplateSchema>;

// ============================================================================
// PIPELINE REQUEST/RESPONSE TYPES
// ============================================================================

export const VideoRequestSchema = z.object({
  topic: z.string(),
  duration: z.number().min(5).max(300),
  style: StylePresetSchema,
  platform: PlatformSchema,
  template: z.string().optional(),
  brandId: z.string().optional(),
  customPrompt: z.string().optional(),
  options: z.object({
    includeVoiceover: z.boolean().default(true),
    includeCaptions: z.boolean().default(true),
    includeMusic: z.boolean().default(true),
    autoPublish: z.boolean().default(false),
  }).optional(),
});
export type VideoRequest = z.infer<typeof VideoRequestSchema>;

export const RenderJobSchema = z.object({
  id: z.string(),
  videoSpec: VideoSpecSchema,
  status: z.enum(['pending', 'processing', 'rendering', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  outputUrl: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
});
export type RenderJob = z.infer<typeof RenderJobSchema>;

// ============================================================================
// PLATFORM SPECIFICATIONS
// ============================================================================

export const PLATFORM_SPECS: Record<Platform, VideoDimensions & { maxDuration: number }> = {
  'youtube': { width: 1920, height: 1080, maxDuration: 600 },
  'youtube-shorts': { width: 1080, height: 1920, maxDuration: 60 },
  'tiktok': { width: 1080, height: 1920, maxDuration: 180 },
  'instagram-feed': { width: 1080, height: 1080, maxDuration: 60 },
  'instagram-reels': { width: 1080, height: 1920, maxDuration: 90 },
  'instagram-stories': { width: 1080, height: 1920, maxDuration: 15 },
  'linkedin': { width: 1920, height: 1080, maxDuration: 600 },
  'twitter': { width: 1280, height: 720, maxDuration: 140 },
  'facebook': { width: 1280, height: 720, maxDuration: 240 },
};
