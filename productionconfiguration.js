# EXTRASTAFF360 Production Configuration
# Platform: Netlify Enterprise
# Version: 2.0.0

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(self)"
    Content-Security-Policy = """
      default-src 'self' https://extrastaff360.netlify.app; 
      script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://js.stripe.com; 
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
      font-src 'self' https://fonts.gstatic.com data:; 
      img-src 'self' data: https: blob:; 
      connect-src 'self' https://api.extrastaff360.com https://matching.extrastaff360.com https://escrow.extrastaff360.com wss://realtime.extrastaff360.com https://api.stripe.com;
      frame-src 'self' https://js.stripe.com;
      worker-src 'self' blob:;
      manifest-src 'self';
      base-uri 'self'"""

[build]
  publish = "dist"
  command = """
    npm ci && 
    npm run build:production && 
    npm run generate-sitemap
  """
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18.17.0"
  NPM_VERSION = "9.6.7"
  PLATFORM_ENV = "production"
  DEPLOYMENT_CONTEXT = "production"
  NODE_OPTIONS = "--max-old-space-size=4096"

[functions]
  directory = "netlify/functions"
  included_files = [
    "netlify/functions/**/*.json",
    "netlify/functions/**/*.sql",
    "netlify/functions/shared/**"
  ]
  node_bundler = "esbuild"
  external_node_modules = [
    "bcrypt",
    "jsonwebtoken",
    "sharp",
    "pdf-lib"
  ]

# Function-specific configurations
[functions.user-authentication]
  timeout = 10
  memory = 512
  included_files = ["netlify/functions/auth/**"]

[functions.payment-processing]
  timeout = 30
  memory = 1024
  included_files = ["netlify/functions/payment/**"]

[functions.matching-algorithm]
  timeout = 60
  memory = 2048
  included_files = ["netlify/functions/matching/**"]

[dev]
  framework = "#custom"
  command = "npm run dev"
  targetPort = 3000
  port = 8888
  publish = "dist"
  autoLaunch = true

# Performance optimization plugins
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"

[[plugins]]
  package = "netlify-plugin-inline-critical-css"
  [plugins.inputs]
    minify = true

[[plugins]]
  package = "@netlify/plugin-nextjs"
  [plugins.inputs]
    enable_preview_mode = false

# API and application routing
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true
  [redirects.headers]
    X-Frame-Options = "DENY"
    Cache-Control = "no-cache"

[[redirects]]
  from = "/dashboard/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["client", "staff", "agency"]}

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true

# Asset optimization and caching
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "https://extrastaff360.netlify.app"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Type = "application/javascript; charset=utf-8"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Type = "text/css; charset=utf-8"

# Environment-specific configurations
[context.production]
  environment = { 
    NODE_ENV = "production", 
    API_ENDPOINT = "https://api.extrastaff360.com",
    ENABLE_MONITORING = "true"
  }

[context.deploy-preview]
  environment = { 
    NODE_ENV = "staging", 
    API_ENDPOINT = "https://staging-api.extrastaff360.com",
    ENABLE_MONITORING = "true"
  }

# Build optimization settings
[build.processing]
  skip_processing = false
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
  tree_shaking = true
[build.processing.html]
  pretty_urls = true
  minify = true
[build.processing.images]
  compress = true
  quality = 85

# Production environment variables
[context.production.environment]
  SITE_URL = "https://extrastaff360.netlify.app"
  DATABASE_URL = "mysql://segzdee:kiyingi8844@127.0.0.1:3306/extrastaff360"
  REDIS_URL = "redis://production-cache.extrastaff360.com:6379"
  STRIPE_PUBLIC_KEY = "pk_live_"
  ESCROW_SERVICE_URL = "https://escrow.extrastaff360.com"
  MATCHING_SERVICE_URL = "https://matching.extrastaff360.com"
  WEBSOCKET_URL = "wss://realtime.extrastaff360.com"

# Preview environment variables
[context.deploy-preview.environment]
  SITE_URL = "https://deploy-preview-${REVIEW_ID}--extrastaff360.netlify.app"
  DATABASE_URL = "mysql://segzdee:kiyingi8844@127.0.0.1:3306/extrastaff360"
  REDIS_URL = "redis://staging-cache.extrastaff360.com:6379"
  STRIPE_PUBLIC_KEY = "pk_test_"