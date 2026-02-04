import { VercelRequest, VercelResponse } from '@vercel/node';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

// Lightweight Lambda rendering without heavy Remotion imports
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
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const siteName = process.env.REMOTION_SITE_NAME || 'video-pipeline';

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

    // Initialize Lambda client
    const lambdaClient = new LambdaClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Prepare Lambda invocation payload
    const functionName = `remotion-render-4-0-417-mem3008mb-disk2048mb-240sec`;
    const serveUrl = `https://remotionlambda-useast1-9d6puc96ya.s3.us-east-1.amazonaws.com/sites/${siteName}/index.html`;

    const renderPayload = {
      type: 'start',
      serveUrl,
      composition,
      inputProps: videoSpec,
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      privacy: 'public',
      logLevel: 'info',
      outName: `video-${videoSpec.id || Date.now()}.mp4`,
    };

    // Invoke Lambda function
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(renderPayload),
    });

    const response = await lambdaClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    if (result.type === 'success') {
      return res.status(200).json({
        success: true,
        renderId: result.renderId,
        bucketName: result.bucketName,
        message: 'Render started successfully',
        estimatedTime: '1-2 minutes',
      });
    } else {
      throw new Error(result.message || 'Failed to start render');
    }
  } catch (error: any) {
    console.error('Error starting cloud render:', error);

    // Check if it's a function not found error
    if (error.message?.includes('Function not found') || error.name === 'ResourceNotFoundException') {
      return res.status(500).json({
        success: false,
        error: 'Lambda function not deployed',
        instructions: {
          message: 'Deploy the Remotion Lambda function:',
          steps: [
            '1. Run: npx remotion lambda functions deploy',
            '2. This creates the render function in your AWS account',
            '3. Try rendering again'
          ],
          documentation: 'https://remotion.dev/docs/lambda/setup'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to start render',
      details: error.toString()
    });
  }
}
