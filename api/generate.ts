import { VercelRequest, VercelResponse } from '@vercel/node';

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

    // TODO: Implement full pipeline - for now return mock data
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
      message: 'Video specification generated successfully (mock data - full pipeline coming soon)',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video',
    });
  }
}
