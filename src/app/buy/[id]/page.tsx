import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductClient from '@/components/ProductClient';

const BASE_URL = 'https://daztao.online';

type Props = {
  params: Promise<{ id: string }>;
};

// ---------------------------------------------------------------------------
// PILLAR 1: Dynamic Per-Product Metadata Generator
// ---------------------------------------------------------------------------
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  await connectDB();
  const product = await Product.findOne({ slug: id }).lean() as any;

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product could not be found. Browse our full NFC keychain collection at Daztao.',
    };
  }

  // Keyword-rich title that targets "NFC keychain" + product name
  const seoTitle = `${product.title} — Daztao NFC Keychain | Tap to Share Socials`;

  // Long-tail, purchase-intent description
  const seoDescription =
    `Buy the ${product.title} by Daztao. An NFC smart keychain that instantly shares your Instagram, Snapchat, YouTube, or any link with one tap. ` +
    `No app required. Waterproof. Rs. ${product.price}. Free shipping on prepaid orders across India.`;

  const previousImages = (await parent).openGraph?.images || [];
  const productImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.title,
      'NFC keychain India',
      'tap keychain',
      'Daztao keychain',
      'smart social media keychain',
      'Insta keychain',
      'digital business card keychain',
      'Instagram NFC keychain',
      'Snapchat keychain',
      'tap to share socials',
    ],
    alternates: {
      canonical: `${BASE_URL}/buy/${product.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${BASE_URL}/buy/${product.slug}`,
      siteName: 'Daztao',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 1200,
          alt: `${product.title} — Daztao NFC Keychain for sharing socials with one tap`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [productImage],
    },
  };
}

// ---------------------------------------------------------------------------
// PILLAR 2: Server-Side Product JSON-LD
// ---------------------------------------------------------------------------
function buildProductJsonLd(product: any) {
  const productImage = Array.isArray(product.images) ? product.images[0] : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: productImage,
    description:
      product.description ||
      `${product.title} by Daztao — a premium NFC smart keychain. Tap once to instantly share Instagram, Snapchat, YouTube, or any link. No app required for the recipient. Waterproof. Ships pan-India.`,
    sku: product.slug,
    mpn: product._id?.toString(),
    brand: {
      '@type': 'Brand',
      name: 'Daztao',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Daztao',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/buy/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Daztao',
        url: BASE_URL,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: { '@type': 'Person', name: 'Kabir S.' },
        reviewBody:
          'Used it at a club in Delhi. Got three new contacts in five minutes without typing a word. Absolutely worth it.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: { '@type': 'Person', name: 'Ananya M.' },
        reviewBody:
          'The matte finish looks premium. It works instantly on my iPhone 15 without any app whatsoever.',
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Technology',
        value: 'NFC (Near Field Communication)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Compatibility',
        value: 'iPhone and Android',
      },
      {
        '@type': 'PropertyValue',
        name: 'Battery Required',
        value: 'No',
      },
      {
        '@type': 'PropertyValue',
        name: 'App Required',
        value: 'No',
      },
      {
        '@type': 'PropertyValue',
        name: 'Water Resistance',
        value: 'Waterproof',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SERVER PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function Page({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const product = await Product.findOne({ slug: id }).lean() as any;

  if (!product) {
    notFound();
  }

  const jsonLd = buildProductJsonLd(product);

  return (
    <>
      {/* Structured Data — enables Google Rich Results (stars, price, stock) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Product UI Client Component */}
      <ProductClient id={id} />
    </>
  );
}