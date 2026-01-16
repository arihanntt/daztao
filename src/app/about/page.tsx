import { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: "DAZTAO NFC Keychain – Share Instagram & Spotify with One Tap",
  description: "DAZTAO is a premium NFC keychain that lets you instantly share your Instagram, Spotify, or any link with a single tap. No app. No battery. Works on iPhone & Android.",
  keywords: ["Daztao About", "NFC India Brand", "Drixe Group", "Premium Smart Tags"],
  openGraph: {
    title: "About DAZTAO - The Future of Networking",
    description: "We don't sell plastic. We sell identity. Discover why creators choose DAZTAO.",
    url: 'https://daztao.online/about',
    images: ['/about-og.jpg'], // Add an image to your public folder for best results
  }
};

export default function AboutPage() {
  
  // --- ORGANIZATION SCHEMA FOR GOOGLE ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'DAZTAO',
      description: 'Premium NFC Accessories Brand based in India.',
      foundingDate: '2025',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Drixe Group'
      },
      areaServed: {
        '@type': 'Country',
        name: 'India'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}