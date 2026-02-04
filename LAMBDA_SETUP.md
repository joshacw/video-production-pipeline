# Remotion Lambda Setup Guide

This guide will help you set up AWS Lambda for automated video rendering.

## Prerequisites

- AWS Account with billing enabled
- AWS CLI installed and configured
- Node.js and npm installed

## Step-by-Step Setup

### 1. Fix NPM Permissions (One-time)

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Remotion Lambda Package

```bash
cd /Users/joshwilliams/Tenderboss/tenderboss/video-production
npm install @remotion/lambda
```

### 3. Configure AWS Credentials

**Option A: Using AWS CLI**
```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Get from AWS IAM Console
- **AWS Secret Access Key**: Get from AWS IAM Console
- **Default region**: `us-east-1` (recommended)
- **Default output format**: `json`

**Option B: Manual Configuration**

Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

Create `~/.aws/config`:
```ini
[default]
region = us-east-1
output = json
```

### 4. Deploy Your Site to Lambda

```bash
npx remotion lambda sites create src/index.ts --site-name=video-pipeline
```

**Expected Output:**
```
✅ Site created successfully!
📦 Site ID: video-pipeline-8a9f2c3d
🌐 Region: us-east-1
💾 Size: 45.2 MB
```

**⚠️ IMPORTANT:** Save your Site ID! You'll need it for rendering.

### 5. Verify Deployment

```bash
npx remotion lambda sites ls
```

This should list your deployed site.

## Rendering Videos

### Basic Render Command

```bash
npx remotion lambda render <SITE_ID> <COMPOSITION_NAME> <OUTPUT_FILE> \
  --props='<JSON_PROPS>'
```

### Example: Render with Video Spec

1. Generate a video spec from the web UI: https://video-production-pipeline-mimh.vercel.app/
2. Download the JSON spec
3. Run the render command:

```bash
npx remotion lambda render video-pipeline-8a9f2c3d ExplainerVideo output.mp4 \
  --props='$(cat video-spec-1234.json)'
```

### Render from Web UI

After generating a spec in the web UI, you can render it:

```bash
# Copy the JSON from the UI, save to file
cat > spec.json << 'EOF'
{
  "id": "video-1234",
  "title": "My Video",
  ...
}
EOF

# Render
npx remotion lambda render video-pipeline-8a9f2c3d ExplainerVideo output.mp4 \
  --props="$(cat spec.json)"
```

## Cost Estimates

Remotion Lambda uses AWS Lambda and S3:

- **Lambda Compute**: ~$0.03 per 30-second video
- **S3 Storage**: ~$0.02 per month per GB
- **Data Transfer**: Free for first 100GB/month

**Typical 30-second video**: $0.05 total

## Troubleshooting

### Error: "Unable to locate credentials"
**Solution**: Run `aws configure` to set up credentials

### Error: "Site not found"
**Solution**: Verify your Site ID with `npx remotion lambda sites ls`

### Error: "Function timed out"
**Solution**: Increase timeout with `--timeout 300`

### Error: "Out of memory"
**Solution**: Increase memory with `--memory 3008`

## Available Compositions

Based on your videoSpec, you can render these compositions:

- `ExplainerVideo` - Educational/explainer videos
- `ProductShowcase` - Product demonstration videos
- `SocialPost` - Short social media videos

## Advanced Usage

### List All Sites
```bash
npx remotion lambda sites ls
```

### Delete a Site
```bash
npx remotion lambda sites rm <SITE_ID>
```

### Render with Custom Props
```bash
npx remotion lambda render <SITE_ID> ExplainerVideo output.mp4 \
  --props='{"videoSpec": {...}, "branding": {...}}'
```

### Check Render Progress
```bash
npx remotion lambda renderprogress <RENDER_ID>
```

## Integration with Web UI (Future)

Next steps to integrate Lambda rendering into the web UI:

1. Store AWS credentials as environment variables in Vercel
2. Create `/api/lambda-render` endpoint
3. Add "Render with Lambda" button to UI
4. Poll for completion and return video URL

## Resources

- [Remotion Lambda Docs](https://remotion.dev/docs/lambda)
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [GitHub Repo](https://github.com/joshacw/video-production-pipeline)

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify credentials with `aws sts get-caller-identity`
3. Ensure billing is enabled on your AWS account
