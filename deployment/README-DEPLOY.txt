Cell Shield Guardian — production deployment package
====================================================

CONTENTS OF THIS ARCHIVE = CONTENTS OF YOUR WEB ROOT.
Upload everything here (including the hidden .htaccess) into public_html/
(or the document root of your Nginx/Cloudflare Pages site). Do not create a
subfolder — index.html must sit at the web root.

Included:
  index.html              application shell with SEO + Open Graph metadata
  assets/                 hashed, immutable JS/CSS bundles
  favicon.svg/.ico        icons
  manifest.webmanifest    installable web-app manifest
  robots.txt              crawl rules + sitemap reference
  sitemap.xml             all 11 public routes
  .htaccess               Apache SPA fallback, HTTPS redirect, security headers, caching

Apache / cPanel / DirectAdmin
  Nothing else to do. Make sure mod_rewrite and mod_headers are enabled and
  that "AllowOverride All" applies to the web root.

Nginx (translate .htaccess)
  location / { try_files $uri $uri/ /index.html; }
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }

Cloudflare Pages / Netlify
  SPA fallback is automatic (or add a _redirects file with: /*  /index.html  200).
  Configure the security headers in the dashboard / _headers file.

DNS (NOT configured by this package — do it at your registrar)
  A     @      -> your host IPv4
  CNAME www    -> markouzelacuzy.com
  Then issue an SSL certificate and force HTTPS.

Rebuilding from source
  npm install && npm run build      # output in dist/
