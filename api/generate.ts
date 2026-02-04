import { VercelRequest, VercelResponse } from '@vercel/node';
import { VideoPipeline } from '../src/pipeline/videoPipeline';
import { VideoRequestSchema, BrandConfig } from '../src/types';

// Initialize pipeline with environment variables
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

    // Validate request
    const validatedRequest = VideoRequestSchema.parse(request);
    const brand = branding || defaultBrand;

    console.log(`📹 Generating video for: "${validatedRequest.topic}"`);

    // Generate video specification
    const videoSpec = await pipeline.generateVideo(validatedRequest, brand);

    return res.status(200).json({
      success: true,
      videoSpec,
      message: 'Video specification generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video',
    });
  }
}
