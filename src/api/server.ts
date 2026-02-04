import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { VideoPipeline } from '../pipeline/videoPipeline';
import { VideoRequest, BrandConfig, VideoRequestSchema } from '../types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize pipeline
const pipeline = new VideoPipeline({
  openaiApiKey: process.env.OPENAI_API_KEY!,
  unsplashApiKey: process.env.UNSPLASH_API_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
});

// Default brand config
const defaultBrand: BrandConfig = {
  name: 'Default Brand',
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

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate a single video
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const request = VideoRequestSchema.parse(req.body.request);
    const branding = req.body.branding || defaultBrand;

    console.log(`📹 Received video generation request for: "${request.topic}"`);

    const videoSpec = await pipeline.generateVideo(request, branding);

    res.json({
      success: true,
      videoSpec,
      message: 'Video specification generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video',
    });
  }
});

// Generate multiple variants
app.post('/api/generate/variants', async (req: Request, res: Response) => {
  try {
    const request = VideoRequestSchema.parse(req.body.request);
    const branding = req.body.branding || defaultBrand;
    const count = req.body.count || 3;

    console.log(`📹 Generating ${count} variants for: "${request.topic}"`);

    const variants = await pipeline.generateMultipleVariants(
      request,
      branding,
      count
    );

    res.json({
      success: true,
      variants,
      message: `${count} video variants generated successfully`,
    });
  } catch (error: any) {
    console.error('Error generating variants:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate variants',
    });
  }
});

// Batch generation
app.post('/api/generate/batch', async (req: Request, res: Response) => {
  try {
    const requests: VideoRequest[] = req.body.requests;
    const branding = req.body.branding || defaultBrand;

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid requests array',
      });
    }

    console.log(`📹 Batch generating ${requests.length} videos`);

    const videos = await Promise.all(
      requests.map((request) => pipeline.generateVideo(request, branding))
    );

    res.json({
      success: true,
      videos,
      message: `${videos.length} videos generated successfully`,
    });
  } catch (error: any) {
    console.error('Error in batch generation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate batch',
    });
  }
});

// Get supported platforms
app.get('/api/platforms', (req: Request, res: Response) => {
  const platforms = [
    'youtube',
    'youtube-shorts',
    'tiktok',
    'instagram-feed',
    'instagram-reels',
    'instagram-stories',
    'linkedin',
    'twitter',
    'facebook',
  ];
  res.json({ platforms });
});

// Get available styles
app.get('/api/styles', (req: Request, res: Response) => {
  const styles = [
    'modern',
    'corporate',
    'energetic',
    'minimal',
    'playful',
    'elegant',
    'bold',
  ];
  res.json({ styles });
});

// Get available templates
app.get('/api/templates', (req: Request, res: Response) => {
  const templates = [
    {
      id: 'explainer',
      name: 'Explainer Video',
      description: 'Educational content with clear messaging',
    },
    {
      id: 'product-showcase',
      name: 'Product Showcase',
      description: 'Highlight product features and benefits',
    },
    {
      id: 'social-post',
      name: 'Social Post',
      description: 'Quick, engaging content for social media',
    },
  ];
  res.json({ templates });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`🚀 Video Production Pipeline API`);
  console.log(`   Server running on http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/health`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   POST /api/generate         - Generate a single video`);
  console.log(`   POST /api/generate/variants - Generate multiple variants`);
  console.log(`   POST /api/generate/batch   - Batch generate videos`);
  console.log(`   GET  /api/platforms        - Get supported platforms`);
  console.log(`   GET  /api/styles           - Get available styles`);
  console.log(`   GET  /api/templates        - Get available templates`);
});

export default app;
