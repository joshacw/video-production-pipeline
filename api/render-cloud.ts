import { VercelRequest, VercelResponse } from '@vercel/node';

// Use Remotion Lambda CLI approach - simpler and more reliable
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

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoSpec, composition = 'ExplainerVideo' } = req.body;

    if (!videoSpec) {
      return res.status(400).json({ error: 'videoSpec is required' });
    }

    // Check environment variables
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return res.status(500).json({
        success: false,
        error: 'AWS credentials not configured in Vercel',
        instructions: {
          message: 'Add these environment variables to Vercel:',
          variables: [
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_REGION (optional, defaults to us-east-1)',
            'REMOTION_SITE_NAME (optional, defaults to video-pipeline)'
          ],
          link: 'https://vercel.com/joshacw/video-production-pipeline/settings/environment-variables'
        }
      });
    }

    console.log(`🎬 Starting cloud render for: "${videoSpec.title}"`);

    // Since Remotion Lambda packages are too heavy for Vercel,
    // we'll use a CLI-based approach
    // The actual rendering needs to be triggered via CLI or a worker service

    // For now, provide the command to run
    const renderCommand = `npx remotion lambda render video-pipeline ${composition} output.mp4 --props='${JSON.stringify({ videoSpec })}'`;

    return res.status(200).json({
      success: false,
      error: 'Direct Lambda invocation not available in Vercel serverless',
      renderCommand,
      instructions: {
        message: 'To render with Lambda, use the command line:',
        steps: [
          '1. Download the JSON spec (click "Download JSON" button)',
          '2. Save it to a file (e.g., spec.json)',
          `3. Run: npx remotion lambda render video-pipeline ${composition} output.mp4 --props='$(cat spec.json)'`,
          '4. The video will render in AWS Lambda and download automatically'
        ],
        alternative: 'Set up a dedicated worker service for web-based Lambda rendering',
        estimatedCost: '$0.05 per 30-second video'
      },
      note: 'Full web-based Lambda integration requires a dedicated worker service (Railway, Render, etc.) due to Vercel package size limits'
    });
  } catch (error: any) {
    console.error('Error in render-cloud endpoint:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process request',
      details: error.toString()
    });
  }
}
