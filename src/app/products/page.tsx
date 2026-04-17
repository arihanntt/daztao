import { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Buy NFC Keychains India — Instagram, Snapchat, YouTube, Facebook | Daztao',
  description:
    'Shop all Daztao NFC smart keychains. Choose from Instagram, Snapchat, YouTube, and Facebook NFC keychains. Share your profile with one tap — no app required. Starts at Rs. 299. Free shipping. COD available. Ships pan-India in 3–7 days.',
  keywords: [
    'buy NFC keychain India',
    'Instagram NFC keychain buy',
    'Snapchat NFC keychain India',
    'YouTube NFC keychain India',
    'Facebook NFC keychain',
    'tap keychain India buy online',
    'NFC keychain collection India',
    'smart social media keychain catalog',
    'Daztao keychain shop',
    'digital business card keychain India',
    'NFC keychain Rs 299',
    'NFC keychain free shipping India',
    'NFC keychain COD',
    'best NFC keychain India 2026',
  ],
  alternates: {
    canonical: `${BASE_URL}/products`,
  },
  openGraph: {
    title: 'Shop All NFC Keychains — Daztao India | Instagram, Snapchat, YouTube, Facebook',
    description:
      'The full Daztao NFC keychain catalog. Share Instagram, Snapchat, YouTube, or Facebook with one tap. No app required. Rs. 299 onwards. Free shipping on prepaid. COD available.',
    url: `${BASE_URL}/products`,
    siteName: 'Daztao',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Daztao NFC Keychain Catalog — Instagram, Snapchat, YouTube, Facebook' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daztao NFC Keychains — Instagram, Snapchat, YouTube & More',
    description: 'Share any social profile with one tap. No app. Ships pan-India. Rs. 299 onwards.',
    images: ['/og-image.jpg'],
  },
};

// Server-rendered JSON-LD for the catalog
async function buildCollectionJsonLd() {
  try {
    await connectDB();
    const products = await Product.find({}, { title: 1, slug: 1, price: 1, images: 1 }).lean() as any[];

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'NFC Keychains', item: `${BASE_URL}/products` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Daztao NFC Keychain Collection — Instagram, Snapchat, YouTube, Facebook',
        description:
          'Browse and buy all Daztao NFC smart keychains. Share your Instagram, Snapchat, YouTube, or Facebook profile with one tap. No app required. Ships pan-India.',
        url: `${BASE_URL}/products`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'Daztao NFC Keychain Catalog',
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.title,
              url: `${BASE_URL}/buy/${product.slug}`,
              image: Array.isArray(product.images) ? product.images[0] : '',
              brand: { '@type': 'Brand', name: 'Daztao' },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: product.price,
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Organization', name: 'Daztao' },
              },
            },
          })),
        },
      },
    ];
  } catch {
    return null;
  }
}

export default async function ProductsPageWrapper() {
  const jsonLd = await buildCollectionJsonLd();

  const { default: ProductsPage } = await import('./client');

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductsPage />
    </>
  );
}