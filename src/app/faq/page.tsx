import { Metadata } from 'next';
import FAQClient from '@/components/FAQClient';

const BASE_URL = 'https://daztao.online';

export const metadata: Metadata = {
  title: 'FAQ — Daztao NFC Keychains | How Do NFC Keychains Work?',
  description:
    'Answers to the most common questions about Daztao NFC smart keychains. Learn how NFC technology works, which phones are compatible, how to set up your keychain, and how to place an order in India.',
  keywords: [
    'how do NFC keychains work', 'Daztao smart keychain setup',
    'NFC keychain FAQ India', 'does NFC keychain need an app',
    'NFC keychain iPhone Android compatible', 'how to use NFC keychain',
    'Daztao order help', 'NFC keychain waterproof',
  ],
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: 'FAQ — Daztao NFC Keychains',
    description: 'Everything you need to know about Daztao NFC smart keychains — setup, compatibility, shipping, and returns.',
    url: `${BASE_URL}/faq`,
    siteName: 'Daztao',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Daztao NFC Keychain FAQ' }],
  },
};

const FAQ_ITEMS = [
  { question: 'How does a Daztao NFC keychain work?', answer: 'A Daztao NFC keychain contains a small NTAG215 NFC chip. When tapped against an NFC-enabled smartphone, the phone reads the chip and instantly opens the link you programmed — no apps required on the receiving side.' },
  { question: 'Do I need to download an app to use the Daztao keychain?', answer: 'No. The person tapping your keychain does not need to install any app. The link opens directly in their browser. iPhone 7 and newer users can tap without opening any app.' },
  { question: 'Which phones are compatible with Daztao NFC keychains?', answer: 'All NFC-enabled smartphones. This includes iPhone 7 and newer, and virtually all Android smartphones released after 2015 — Samsung, OnePlus, Xiaomi, Vivo, Oppo, and Realme.' },
  { question: 'What can I link to my Daztao keychain?', answer: 'Any publicly accessible URL. Instagram, Snapchat, YouTube, Facebook, WhatsApp, Spotify, LinkedIn, personal portfolios, or a custom digital business card. Update the link at any time.' },
  { question: 'Can I change the link on my keychain after purchase?', answer: 'Yes, at any time for free. Use any NFC writer app. The process takes under one minute. No limit on how many times you can reprogram it.' },
  { question: 'Is the Daztao keychain waterproof?', answer: 'Yes. Daztao keychains have a waterproof casing suitable for daily use in all weather. Safe in rain, sweat, and everyday carry.' },
  { question: 'Does the Daztao keychain need a battery or charging?', answer: 'No battery required. The NTAG215 chip draws power inductively from the reading phone. No charging, no battery replacement, indefinite lifespan.' },
  { question: 'How long does Daztao take to ship across India?', answer: 'Orders dispatched within 1 to 2 business days. Delivery across India takes 3 to 7 business days. Prepaid orders receive free shipping. COD orders incur a Rs. 100 handling fee.' },
  { question: 'What is the Daztao bundle deal?', answer: 'The Duo Pack gives 2 keychains for Rs. 500. The Creator Bundle gives 5 keychains for Rs. 1000. Both offers are available to signed-in members on the Exclusive Offers page.' },
  { question: 'What is the return or refund policy?', answer: 'Returns accepted within 7 days of delivery if unused and in original condition. For defective items, email daztaoo@gmail.com and we arrange a replacement at no cost.' },
  { question: 'How do I contact Daztao for order support?', answer: 'Email daztaoo@gmail.com with your Order ID in the subject line. We respond within 24 to 48 hours.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FAQClient />
    </>
  );
}
