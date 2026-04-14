import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

const SUPABASE_URL = 'https://sqaszlwpphfpoaxacjke.supabase.co'

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              `default-src 'self'`,
              `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
              `font-src 'self' https://fonts.gstatic.com`,
              `img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com`,
              `connect-src 'self' ${SUPABASE_URL} wss://*.supabase.co https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
              `frame-ancestors 'none'`,
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    // Never let the service worker intercept admin routes
    navigateFallbackDenylist: [/^\/admin/],
    exclude: [/^\/admin\//],
  },
})(nextConfig)
