#!/bin/bash

# EXTRASTAFF360 Deployment Structure Generator
# Version: 2.0.0

# Configuration Variables
DEPLOY_ROOT="./extrastaff360-deploy"
FUNCTIONS_ROOT="${DEPLOY_ROOT}/netlify/functions"
BUILD_DIR="${DEPLOY_ROOT}/dist"

# Create Directory Structure
mkdir -p \
    "${BUILD_DIR}" \
    "${FUNCTIONS_ROOT}/auth" \
    "${FUNCTIONS_ROOT}/payment" \
    "${FUNCTIONS_ROOT}/matching"

# Generate netlify.toml
cat > "${DEPLOY_ROOT}/netlify.toml" <<EOL
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = """
      default-src 'self' https://extrastaff360.netlify.app; 
      script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://js.stripe.com; 
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
      font-src 'self' https://fonts.gstatic.com data:; 
      img-src 'self' data: https: blob:; 
      connect-src 'self' https://api.extrastaff360.com wss://realtime.extrastaff360.com"""

[build]
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18.17.0"
  NPM_VERSION = "9.6.7"
  DATABASE_URL = "mysql://segzdee:kiyingi8844@127.0.0.1:3306/extrastaff360"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true
EOL

# Generate index.html in dist
cat > "${BUILD_DIR}/index.html" <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EXTRASTAFF360</title>
</head>
<body>
    <div id="root"></div>
    <script src="/main.js"></script>
</body>
</html>
EOL

# Generate Function Files
cat > "${FUNCTIONS_ROOT}/auth/auth.js" <<EOL
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Authentication endpoint operational" })
  }
}
EOL

cat > "${FUNCTIONS_ROOT}/payment/payment.js" <<EOL
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Payment endpoint operational" })
  }
}
EOL

cat > "${FUNCTIONS_ROOT}/matching/matching.js" <<EOL
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Matching endpoint operational" })
  }
}
EOL

echo """
=====================================================
EXTRASTAFF360 Deployment Files Generated
=====================================================

Location: ${DEPLOY_ROOT}

Files Ready for Upload:
1. Build Directory (dist/):
   - Location: ${BUILD_DIR}
   - Contains: index.html, static assets

2. Functions Directory:
   - Location: ${FUNCTIONS_ROOT}
   - Contains: auth.js, payment.js, matching.js

3. Configuration:
   - Location: ${DEPLOY_ROOT}/netlify.toml
   - Contains: Headers, build settings, redirects

Upload Instructions:
1. Open Netlify Dashboard
2. Navigate to https://app.netlify.com/sites/extrastaff360
3. Click 'Deploys'
4. Drag and drop ${DEPLOY_ROOT} folder

Verification Steps:
1. Check deployed functions at:
   - /.netlify/functions/auth
   - /.netlify/functions/payment
   - /.netlify/functions/matching

2. Verify security headers using:
   curl -I https://extrastaff360.netlify.app

Support: devops@extrastaff360.com
=====================================================
"""
