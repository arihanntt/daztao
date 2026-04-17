import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

const BASE_URL = 'https://daztao.online';

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 1: Homepage Metadata
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    'Daztao — Buy NFC Smart Keychains India | Tap to Share Instagram, Snapchat, YouTube',
  description:
    'Buy premium Daztao NFC smart keychains in India. Share your Instagram, Snapchat, YouTube, and digital business card with one tap. No app required. Starts at Rs. 299. Ships pan-India within 2 days.',
  keywords: [
    'buy NFC keychain India',
    'NFC smart keychain',
    'tap to share socials',
    'digital business card keychain',
    'Daztao keychain',
    'Instagram NFC keychain',
    'Snapchat keychain India',
    'NFC keychain no app required',
    'smart social media keychain India',
    'NTAG215 keychain India',
    'best NFC keychain India 2026',
    'tap keychain India',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Daztao — Premium NFC Smart Keychains | Tap to Share Socials Instantly',
    description:
      'The Daztao NFC smart keychain shares your Instagram, Snapchat, YouTube, or digital business card with one tap. Waterproof, no app needed, Rs. 299. Ships across India.',
    url: BASE_URL,
    type: 'website',
    siteName: 'Daztao',
    locale: 'en_IN',
    images: [
      {
        url: `${BASE_URL}/og-home.jpg`,
        width: 1200,
        height: 630,
        alt: 'Daztao NFC smart keychain — tap once to share Instagram, Snapchat, and your digital business card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daztao NFC Smart Keychains — Tap to Share Socials',
    description:
      'Share Instagram, Snapchat, YouTube, and your digital business card with one tap. No app needed. Ships pan-India.',
    images: [`${BASE_URL}/og-home.jpg`],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 2: Structured Data
// HowTo — feeds Perplexity/ChatGPT "how does an NFC keychain work" queries
// FAQPage — feeds Google featured snippets for question queries
// Product — surfaces pricing in Google Shopping signals
// ─────────────────────────────────────────────────────────────────────────────
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use a Daztao NFC Smart Keychain',
  description:
    'A step-by-step guide on how to set up and use a Daztao NFC smart keychain to share your Instagram, Snapchat, YouTube, or digital business card with one tap.',
  totalTime: 'PT1M',
  tool: [
    { '@type': 'HowToTool', name: 'Daztao NFC Smart Keychain (NTAG215)' },
    { '@type': 'HowToTool', name: 'NFC-enabled smartphone (iPhone 7+ or Android)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Link your profile',
      text: 'Connect your Daztao NFC smart keychain to any URL — your Instagram handle, LinkedIn profile, YouTube channel, or a fully custom digital business card — in under 60 seconds using any free NFC writer app. No account required.',
      url: `${BASE_URL}/#how-it-works`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Tap to any phone',
      text: 'Tap the Daztao NFC keychain to any NFC-enabled smartphone. Compatible natively with Apple iPhone 7 and newer running iOS 14 without any app or camera scan. Compatible with virtually all Android devices from Samsung, OnePlus, Xiaomi, Realme, and more.',
      url: `${BASE_URL}/#how-it-works`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Connect instantly',
      text: 'Your digital profile opens directly in the receiver\'s default browser in under one second. Zero app downloads required for the person you are meeting. No Bluetooth, no Wi-Fi, no friction whatsoever.',
      url: `${BASE_URL}/#how-it-works`,
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Daztao NFC keychain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Daztao NFC keychain is a physical keychain with a built-in NFC chip that, when tapped to any smartphone, instantly opens a link — your Instagram profile, Snapchat, YouTube channel, Facebook page, or any URL. No app required. Works on all iPhones from the 7 onwards and all NFC-enabled Android phones.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which social media platforms can I link to my Daztao NFC keychain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can link any URL to your Daztao NFC keychain — Instagram, Snapchat, YouTube, Facebook, WhatsApp, Spotify, LinkedIn, a personal portfolio, or a custom digital business card. You can reprogramme the link at any time for free.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a Daztao NFC keychain cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A single Daztao NFC keychain starts at Rs. 299. The Duo Pack (2 keychains) is Rs. 500, saving you Rs. 98. The Creator Bundle (5 keychains) is Rs. 1000. All prices include free shipping on prepaid orders. COD is available with a Rs. 100 handling charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cash on Delivery (COD) available for Daztao NFC keychains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Daztao offers Cash on Delivery across India. COD orders have a Rs. 100 handling fee. Prepaid orders (UPI, card, net banking) receive free shipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to download an app to use a Daztao NFC keychain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No app is required — for you or the person receiving your details. Your link opens natively in their browser. On iPhone 7 and newer running iOS 14+, NFC reads happen automatically in the background. On Android, simply hold the keychain near the back of the phone.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does Daztao take to deliver across India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Daztao dispatches orders within 1–2 business days. Metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Pune) receive delivery in 3–5 business days. Tier-2 and Tier-3 cities take 5–7 business days. Remote areas may take up to 10 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I change the link on my Daztao NFC keychain after buying it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — unlimited times, for free. Download any free NFC writer app (NFC Tools works on both iOS and Android), tap your phone to the keychain, and write a new URL. The process takes under 60 seconds. Switch between Instagram, YouTube, LinkedIn, or any other link as often as you want.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the Daztao NFC keychain need a battery or charging?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The NFC chip inside your Daztao keychain requires zero battery and zero charging. It draws power inductively from the reading phone\'s NFC field. The chip lasts indefinitely with no maintenance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a monthly fee to use Daztao NFC keychains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No subscription, no monthly fees, no hidden charges whatsoever. You pay once and the keychain is yours permanently. You can update the link it stores as many times as you like at no cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which phones are compatible with Daztao NFC keychains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Daztao NFC keychains work with every NFC-enabled phone — iPhone 7, 8, SE (2nd gen), X, XS, 11, 12, 13, 14, 15, and 16 series, plus virtually all Android phones from Samsung, OnePlus, Xiaomi, Realme, Vivo, Oppo, Google Pixel, and more released after 2015.',
      },
    },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Daztao NFC Smart Keychain',
  description:
    'The Daztao NFC smart keychain is a premium physical keychain with a built-in NFC chip. Tap once to instantly share your Instagram, Snapchat, YouTube, Facebook, or any digital profile to any smartphone. No app required. Waterproof. Ships pan-India. Starts at Rs. 299.',
  brand: {
    '@type': 'Brand',
    name: 'Daztao',
    '@id': `${BASE_URL}/#organization`,
  },
  url: `${BASE_URL}/products`,
  image: `${BASE_URL}/og-home.jpg`,
  sku: 'DZT-NFC-001',
  category: 'NFC Accessories',
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
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Kabir S.' },
      reviewBody: 'Used it at a club in Delhi. Got 3 contacts in 5 minutes without typing a word. Absolutely worth it.',
    },
    {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Ananya M.' },
      reviewBody: 'Matte finish looks premium. Works instantly on my iPhone 15 — no app needed at all.',
    },
  ],
  offers: [
    {
      '@type': 'Offer',
      name: '1 Daztao NFC Keychain — Instagram / Snapchat / YouTube / Facebook',
      priceCurrency: 'INR',
      price: '299',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${BASE_URL}/products`,
      seller: { '@type': 'Organization', name: 'Daztao' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 7, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    {
      '@type': 'Offer',
      name: 'Daztao Duo Pack — 2 NFC Keychains',
      priceCurrency: 'INR',
      price: '500',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${BASE_URL}/products`,
      seller: { '@type': 'Organization', name: 'Daztao' },
    },
    {
      '@type': 'Offer',
      name: 'Daztao Creator Bundle — 5 NFC Keychains',
      priceCurrency: 'INR',
      price: '1000',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${BASE_URL}/account/offers`,
      seller: { '@type': 'Organization', name: 'Daztao' },
    },
  ],
};


// ─────────────────────────────────────────────────────────────────────────────
// SERVER PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <HomeClient />
    </>
  );
}