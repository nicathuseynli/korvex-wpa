const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    // NOTE: 'unsafe-eval' is required by Next.js webpack runtime and
    // cannot be removed without replacing the bundler.
    // 'unsafe-inline' is required by React for style attributes.
    // All other directives are kept strict.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://telegram.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.korvex.app https://api.media-flow-api.com https://telegram.org wss:",
      "frame-src https://telegram.org",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "worker-src 'self' blob:",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'no-referrer' },
          { key: 'Permissions-Policy',         value: 'geolocation=(), camera=(), microphone=(), payment=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy',    value: csp },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },

  images: {
    domains: [],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['korvex.app', 'app.media-flow-api.com'],
    },
    // pg is a Node-only package; mark external so Next doesn't try to bundle it.
    serverComponentsExternalPackages: ['pg'],
  },
};

module.exports = withPWA(nextConfig);
