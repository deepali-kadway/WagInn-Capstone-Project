#!/bin/bash
set -e

echo "=== NETLIFY DEPLOYMENT SCRIPT ==="

# Navigate to the correct directory
cd WagInn-Project/dist/WagInn-Project/browser

# Create _redirects file
echo "Creating _redirects file..."
echo "/*    /index.html   200" > _redirects

# Create zip file
echo "Creating deployment zip..."
zip -r ../../../site.zip .
cd ../../..

# Check variables
echo "Checking environment variables..."
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "ERROR: NETLIFY_AUTH_TOKEN is not set"
    exit 1
fi

if [ -z "$NETLIFY_SITE_ID" ]; then
    echo "ERROR: NETLIFY_SITE_ID is not set"
    exit 1
fi

echo "Variables are set correctly"

# Deploy to Netlify
echo "Deploying to Netlify..."
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    -H "Content-Type: application/zip" \
    --data-binary @site.zip \
    "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys")

# Parse response
HTTP_CODE=$(echo $RESPONSE | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
RESPONSE_BODY=$(echo $RESPONSE | sed 's/HTTPSTATUS:[0-9]*$//')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Deployment successful!"
    echo "🚀 Site URL: https://$NETLIFY_SITE_ID.netlify.app/"
else
    echo "❌ Deployment failed with status: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi

echo "=== DEPLOYMENT COMPLETE ==="