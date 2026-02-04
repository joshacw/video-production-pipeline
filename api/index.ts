import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'text/html');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Production Pipeline API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #0f172a;
      color: #e2e8f0;
    }
    h1 { color: #60a5fa; margin-bottom: 10px; }
    h2 { color: #818cf8; margin-top: 30px; }
    .subtitle { color: #94a3b8; margin-bottom: 30px; }
    .endpoint {
      background: #1e293b;
      border-left: 3px solid #60a5fa;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .method {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;
    }
    .get { background: #10b981; color: white; }
    .post { background: #3b82f6; color: white; }
    code {
      background: #334155;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 14px;
    }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🎬 Video Production Pipeline API</h1>
  <p class="subtitle">Automated video generation powered by AI</p>

  <h2>Available Endpoints</h2>

  <div class="endpoint">
    <span class="method get">GET</span>
    <code>/api/health</code>
    <p>Health check endpoint to verify API is running</p>
  </div>

  <div class="endpoint">
    <span class="method post">POST</span>
    <code>/api/generate</code>
    <p>Generate a video specification from a topic and platform</p>
    <pre><code>{
  "request": {
    "topic": "AI tips for developers",
    "duration": 30,
    "platform": "youtube-shorts",
    "style": "modern"
  },
  "branding": {
    "name": "Your Brand",
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#8B5CF6"
    }
  }
}</code></pre>
  </div>

  <div class="endpoint">
    <span class="method post">POST</span>
    <code>/api/variants</code>
    <p>Generate multiple video variants for A/B testing</p>
  </div>

  <h2>Documentation</h2>
  <p>
    View full documentation on
    <a href="https://github.com/joshacw/video-production-pipeline" target="_blank">GitHub</a>
  </p>

  <h2>Quick Test</h2>
  <p>Try the health endpoint: <a href="/api/health">/api/health</a></p>
</body>
</html>
  `;

  return res.status(200).send(html);
}
