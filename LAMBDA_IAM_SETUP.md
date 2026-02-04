# AWS IAM Setup for Remotion Lambda

Before deploying Lambda functions, you need to create the required IAM role.

## Quick Setup

Run this command to automatically create the role:

```bash
npx remotion lambda roles create
```

This creates a role named `remotion-lambda-role` with the necessary permissions.

## Manual Setup (if automatic fails)

### 1. Go to AWS IAM Console
https://console.aws.amazon.com/iam/

### 2. Create Role
1. Click "Roles" → "Create role"
2. Select "AWS service"
3. Choose "Lambda"
4. Click "Next"

### 3. Add Permissions
Attach these policies:
- `AWSLambdaBasicExecutionRole`
- `AmazonS3FullAccess`

### 4. Name the Role
- Role name: `remotion-lambda-role`
- Click "Create role"

### 5. Add Custom Policy
1. Go to the role you just created
2. Click "Add permissions" → "Create inline policy"
3. Click "JSON" tab
4. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "lambda:InvokeFunction",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

5. Name it: `remotion-lambda-policy`
6. Click "Create policy"

## Verify Setup

```bash
# This should now work:
npx remotion lambda functions deploy
```

## After Role is Created

Deploy the Lambda function:

```bash
npx remotion lambda functions deploy --memory 3008 --disk 2048 --timeout 240
```

You should see:
```
✅ Deployed function remotion-render-us-east-1-memory3008mb-disk2048mb-240sec
```

## Test Rendering

```bash
# Generate a video spec from the web UI, download it, then:
npx remotion lambda render video-pipeline ExplainerVideo output.mp4 \
  --props='$(cat your-video-spec.json)'
```

## Environment Variables for Vercel

Once Lambda is deployed, add these to Vercel:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION=us-east-1`
- `REMOTION_SITE_NAME=video-pipeline`

Then the web UI "Render with Lambda" button will work!
