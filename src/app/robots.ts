import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/auth', '/checkout', '/success'], // Hide these from Google
    },
    sitemap: 'https://daztao.online/sitemap.xml', // Replace with your domain
  };
}