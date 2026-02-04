import { VercelRequest, VercelResponse } from '@vercel/node';
import { getRenderProgress, renderMediaOnLambda, speculateFunctionName } from '@remotion/lambda/client';
import { DISK, RenderMediaOnLambdaOutput } from '@remotion/lambda';

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

  if (req.method === 'POST') {
    return handleRender(req, res);
  }

  if (req.method === 'GET') {
    return handleProgress(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleRender(req: VercelRequest, res: VercelResponse) {
  try {
    const { videoSpec, composition = 'ExplainerVideo' } = req.body;

    if (!videoSpec) {
      return res.status(400).json({ error: 'videoSpec is required' });
    }

    // Check if AWS credentials and region are configured
    const region = process.env.AWS_REGION || 'us-east-1';
    const siteName = process.env.REMOTION_SITE_NAME || 'video-pipeline';

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return res.status(500).json({
        error: 'AWS credentials not configured',
        instructions: 'Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to Vercel environment variables'
      });
    }

    console.log(`🎬 Starting Lambda render for: "${videoSpec.title}"`);

    // Get the function name
    const functionName = await speculateFunctionName({
      diskSizeInMb: DISK,
      memorySizeInMb: 3008,
      timeoutInSeconds: 300,
    });

    // Trigger Lambda render
    const result: RenderMediaOnLambdaOutput = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl: `https://remotionlambda-${region.replace('-', '')}-9d6puc96ya.s3.${region}.amazonaws.com/sites/${siteName}/index.html`,
      composition,
      inputProps: { videoSpec },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      framesPerLambda: 20,
      privacy: 'public',
      logLevel: 'info',
    });

    return res.status(200).json({
      success: true,
      renderId: result.renderId,
      bucketName: result.bucketName,
      message: 'Render started successfully',
      pollUrl: `/api/lambda-render?renderId=${result.renderId}&bucketName=${result.bucketName}`,
    });
  } catch (error: any) {
    console.error('Error starting Lambda render:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to start render',
    });
  }
}

async function handleProgress(req: VercelRequest, res: VercelResponse) {
  try {
    const { renderId, bucketName } = req.query;

    if (!renderId || !bucketName) {
      return res.status(400).json({ error: 'renderId and bucketName are required' });
    }

    const region = process.env.AWS_REGION || 'us-east-1';
    const functionName = await speculateFunctionName({
      diskSizeInMb: DISK,
      memorySizeInMb: 3008,
      timeoutInSeconds: 300,
    });

    const progress = await getRenderProgress({
      renderId: renderId as string,
      bucketName: bucketName as string,
      functionName,
      region,
    });

    return res.status(200).json({
      success: true,
      progress: {
        done: progress.done,
        overallProgress: progress.overallProgress,
        renderedFrames: progress.renderedFrames,
        totalFrames: progress.encodedFrames,
        outputFile: progress.outputFile,
        costs: progress.costs,
      },
    });
  } catch (error: any) {
    console.error('Error checking render progress:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to check progress',
    });
  }
}
