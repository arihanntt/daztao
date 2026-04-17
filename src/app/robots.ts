import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers — public-facing pages only
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',             // Admin panel
          '/api/',              // API routes
          '/checkout',          // Transactional
          '/cart',              // Transactional
          '/account',           // Auth-protected user pages
          '/login',             // Auth page — no SEO value
          '/order-confirmed',
          '/order-confirmation',
          '/success',
        ],
      },
      {
        // Block GPTBot (OpenAI) from training on your content
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        // Block common scrapers used for AI training datasets
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://daztao.online/sitemap.xml',
    host: 'https://daztao.online',
  };
}