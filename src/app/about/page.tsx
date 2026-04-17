import { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'About Daztao — Indian NFC Keychain Brand | Our Story',
  description:
    'Daztao is a premium Indian NFC keychain brand built for creators, professionals, and anyone who values effortless connection. Learn about our mission, our products, and who we build for.',
  keywords: [
    'About Daztao',
    'Daztao NFC brand India',
    'NFC keychain Indian brand',
    'Drixe Group brand',
    'premium NFC accessories India',
    'who makes Daztao keychains',
  ],
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: 'About Daztao — Indian NFC Keychain Brand',
    description:
      'Daztao builds premium NFC smart keychains for creators, professionals, and everyday connectors across India.',
    url: `${BASE_URL}/about`,
    siteName: 'Daztao',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'About Daztao — NFC Keychain Brand India' }],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${BASE_URL}/about`,
  name: 'About Daztao',
  description:
    'Daztao is a premium NFC keychain brand based in India, built under the Drixe Group. We design smart keychains that allow instant sharing of Instagram, Snapchat, YouTube, and any digital profile with one tap.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Daztao',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      'Daztao builds premium NFC smart keychains. Tap once to share your Instagram, Snapchat, YouTube, or any link instantly. No app required. Ships across India.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Drixe Group',
    },
    sameAs: ['https://www.instagram.com/daztaoo'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'daztaoo@gmail.com',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: 'English',
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutClient />
    </>
  );
}