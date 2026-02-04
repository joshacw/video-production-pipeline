import { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
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
    // For serverless deployment, we'll convert files to base64
    // In production, you'd upload to S3, Cloudinary, or similar

    // Note: Vercel serverless functions have a 4.5MB payload limit
    // For larger files, use a dedicated file storage service

    return res.status(200).json({
      success: true,
      message: 'File upload endpoint ready',
      note: 'Full implementation requires external storage (S3, Cloudinary, etc.)',
      instructions: [
        'For now, you can:',
        '1. Use image URLs directly in the brand config',
        '2. Upload logo to Cloudinary/Imgur and use the URL',
        '3. For PDFs, manually extract brand colors and fonts',
        '',
        'Coming soon: Direct file upload with cloud storage integration'
      ]
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process upload',
    });
  }
}
