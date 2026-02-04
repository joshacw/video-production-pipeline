import { VercelRequest, VercelResponse } from '@vercel/node';
import { VideoPipeline } from '../src/pipeline/videoPipeline';
import { VideoRequest, BrandConfig } from '../src/types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, branding } = req.body;

    if (!request) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    console.log(`📹 Generating video for: "${request.topic}"`);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OpenAI API key not configured, returning mock data');

      // Return mock data if API key is missing
      const mockVideoSpec = {
        id: `video-${Date.now()}`,
        title: `Video: ${request.topic}`,
        script: {
          title: request.topic,
          hook: "Attention-grabbing opening line about " + request.topic,
          content: [
            "Key point 1 about " + request.topic,
            "Key point 2 with more details",
            "Key point 3 wrapping up"
          ],
          cta: "Like, subscribe, and follow for more!",
          estimatedDuration: request.duration || 30
        },
        assets: {
          images: [],
          videos: [],
          music: null
        },
        timing: {
          intro: 3,
          content: (request.duration || 30) - 6,
          outro: 3
        },
        platform: request.platform,
        style: request.style,
        tone: request.tone,
        branding: branding || {
          name: 'Your Brand',
          colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6'
          }
        }
      };

      return res.status(200).json({
        success: true,
        videoSpec: mockVideoSpec,
        message: 'Mock video specification (configure OPENAI_API_KEY in Vercel for AI generation)',
      });
    }

    // Initialize pipeline with API keys
    const pipeline = new VideoPipeline({
      openaiApiKey: process.env.OPENAI_API_KEY,
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

    const brand = branding || defaultBrand;
    const videoRequest: VideoRequest = {
      topic: request.topic,
      duration: request.duration || 30,
      platform: request.platform || 'youtube-shorts',
      style: request.style || 'modern',
      tone: request.tone || 'professional',
    };

    // Generate video specification using AI pipeline
    const videoSpec = await pipeline.generateVideo(videoRequest, brand);

    return res.status(200).json({
      success: true,
      videoSpec,
      message: 'Video specification generated successfully with AI',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video',
    });
  }
}
