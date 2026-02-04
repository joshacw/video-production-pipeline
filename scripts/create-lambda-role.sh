#!/bin/bash

# Create IAM role for Remotion Lambda
echo "Creating IAM role for Remotion Lambda..."

# Trust policy
cat > /tmp/trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name remotion-lambda-role \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --description "Role for Remotion Lambda video rendering"

# Attach AWS managed policies
aws iam attach-role-policy \
  --role-name remotion-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name remotion-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# Create inline policy for additional permissions
cat > /tmp/remotion-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name remotion-lambda-role \
  --policy-name remotion-lambda-inline-policy \
  --policy-document file:///tmp/remotion-policy.json

echo "✅ IAM role created successfully!"
echo ""
echo "Now deploy the Lambda function:"
echo "npx remotion lambda functions deploy --memory 3008 --disk 2048 --timeout 240"

# Clean up temp files
rm /tmp/trust-policy.json /tmp/remotion-policy.json
