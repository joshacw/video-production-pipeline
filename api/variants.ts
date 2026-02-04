import { VercelRequest, VercelResponse } from '@vercel/node';
import { VideoPipeline } from '../src/pipeline/videoPipeline';
import { VideoRequestSchema, BrandConfig } from '../src/types';

const pipeline = new VideoPipeline({
  openaiApiKey: process.env.OPENAI_API_KEY!,
  unsplashApiKey: process.env.UNSPLASH_API_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
});

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, branding, count = 3 } = req.body;

    if (!request) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const validatedRequest = VideoRequestSchema.parse(request);
    const brand = branding || defaultBrand;

    console.log(`📹 Generating ${count} variants for: "${validatedRequest.topic}"`);

    const variants = await pipeline.generateMultipleVariants(
      validatedRequest,
      brand,
      count
    );

    return res.status(200).json({
      success: true,
      variants,
      message: `${count} video variants generated successfully`,
    });
  } catch (error: any) {
    console.error('Error generating variants:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate variants',
    });
  }
}
