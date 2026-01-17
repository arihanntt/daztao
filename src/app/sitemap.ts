import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://daztao.online';

  // 1. Fetch Dynamic Products
  // Optimization: We only select '_id', 'slug', and 'updatedAt' to speed up the query
  await connectDB();
  const products = await Product.find({}).select('slug updatedAt');

  // 2. Generate Product URLs (The "Money" Pages)
  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/buy/${product.slug}`,
    // If your DB has updatedAt, use it. Otherwise, use current date.
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly', // Products don't change every day
    priority: 0.8, // High priority, but lower than the main collection
  }));

  // 3. Define Static Routes (The "Core" Pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl, // Home
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Highest priority
    },
    {
      url: `${baseUrl}/products`, // Main Collection
      lastModified: new Date(),
      changeFrequency: 'daily', // Changes whenever you add a product
      priority: 0.9, // Very high priority (Hub page)
    },
    {
      url: `${baseUrl}/about`, // Brand Story
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // Medium priority
    },
    {
      url: `${baseUrl}/contact`, // Trust Page
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6, // Lower priority (Content rarely changes)
    },
    
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    
  ];

  // 4. Merge and Return
  return [...staticRoutes, ...productUrls];
}