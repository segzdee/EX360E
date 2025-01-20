# Generate netlify.toml in project root
cat > netlify.toml << 'EOL'
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

# Generate auth function
cat > netlify/functions/auth/auth.js << 'EOL'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Authentication endpoint operational" })
  }
}
EOL

# Generate payment function
cat > netlify/functions/payment/payment.js << 'EOL'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Payment endpoint operational" })
  }
}
EOL

# Generate matching function
cat > netlify/functions/matching/matching.js << 'EOL'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Matching endpoint operational" })
  }
}
EOL

# Generate index.html in dist directory
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EXTRASTAFF360</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="/main.js"></script>
</body>
</html>
EOL
EOL