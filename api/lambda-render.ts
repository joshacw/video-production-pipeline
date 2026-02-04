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

  try {
    const { videoSpec } = req.body;

    if (!videoSpec) {
      return res.status(400).json({ error: 'videoSpec is required' });
    }

    // Return instructions for Lambda rendering
    // The actual rendering needs to be done via CLI or a dedicated worker service
    return res.status(200).json({
      success: false,
      error: 'Lambda rendering from Vercel is not yet configured',
      instructions: {
        message: 'To render with Lambda, use the command line:',
        steps: [
          '1. Download the JSON spec',
          '2. Run: npx remotion lambda render video-pipeline ExplainerVideo output.mp4 --props=\'$(cat spec.json)\'',
          '3. The video will be rendered in AWS Lambda and saved to S3'
        ],
        alternative: 'Or use the "Local Render" option to render on your machine',
        documentation: 'https://github.com/joshacw/video-production-pipeline/blob/main/LAMBDA_SETUP.md'
      },
      note: 'Full Lambda integration requires a dedicated worker service due to Vercel serverless limitations'
    });
  } catch (error: any) {
    console.error('Error in lambda-render endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
