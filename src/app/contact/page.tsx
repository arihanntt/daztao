import { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'Contact Daztao — NFC Keychain Support India | Order Help & Returns',
  description:
    'Contact Daztao for order support, shipping queries, returns, or product questions. We respond within 24 hours. Email: daztaoo@gmail.com. Serving customers across India.',
  keywords: [
    'contact Daztao',
    'Daztao NFC keychain support',
    'Daztao order help India',
    'NFC keychain customer service India',
    'Daztao refund contact',
    'daztaoo@gmail.com',
  ],
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Daztao — NFC Keychain Support India',
    description:
      'Need help with your Daztao NFC keychain order? Contact our support team. We reply within 24 hours.',
    url: `${BASE_URL}/contact`,
    siteName: 'Daztao',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Contact Daztao NFC Keychain Support' }],
  },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${BASE_URL}/contact`,
  name: 'Contact Daztao',
  description:
    'Reach Daztao support for questions about NFC keychains, orders, shipping, refunds, or any other queries. We serve customers across India and respond within 24 to 48 hours.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Daztao',
    url: BASE_URL,
    email: 'daztaoo@gmail.com',
    sameAs: ['https://www.instagram.com/daztaoo'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'daztaoo@gmail.com',
        telephone: '+91-7889386542',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: 'English',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      },
      {
        '@type': 'ContactPoint',
        email: 'daztaoo@gmail.com',
        contactType: 'returns',
        areaServed: 'IN',
        availableLanguage: 'English',
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactClient />
    </>
  );
}