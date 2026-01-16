import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductClient from '@/components/ProductClient'; // Import your UI component

type Props = {
  params: Promise<{ id: string }>
}

// 1. DYNAMIC METADATA GENERATOR (The SEO Magic)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  await connectDB();
  const product = await Product.findOne({ slug: id }).lean();

  if (!product) {
    return { title: 'Product Not Found | DAZTAO' };
  }

  // Smart SEO Title & Description
  const title = `${product.title} - ${product.stock < 5 ? 'Limited Stock' : 'Best Price'}`;
  const description = `Buy ${product.title} online. Rated 5/5 Stars. Price: ₹${product.price}. Waterproof, Instant Setup, No App Required. Fast Shipping in India.`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: title,
    description: description,
    keywords: [product.title, 'NFC Keychain', 'Smart Business Card', 'Social Media Tag', 'Daztao'],
    openGraph: {
      title: title,
      description: description,
      url: `https://daztao.online/buy/${product.slug}`,
      images: [product.images[0], ...previousImages],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [product.images[0]],
    },
  };
}

// 2. THE SERVER PAGE
export default async function Page({ params }: Props) {
  const { id } = await params;
  
  // Fetch data for JSON-LD (Rich Snippets)
  await connectDB();
  const product = await Product.findOne({ slug: id }).lean();

  if (!product) {
    notFound();
  }

  // 3. RICH SNIPPET GENERATOR (Stars & Price on Google)
  // 
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images[0],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'DAZTAO',
    },
    offers: {
      '@type': 'Offer',
      url: `https://daztao.online/buy/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR'
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9', 
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      {/* Inject Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Load the Client UI */}
      <ProductClient id={id} />
    </>
  );
}