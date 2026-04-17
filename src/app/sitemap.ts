import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const BASE_URL = 'https://daztao.online';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch live product slugs from the database
  await connectDB();
  const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();

  // Product pages — highest commercial intent
  const productUrls: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${BASE_URL}/buy/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...productUrls];
}