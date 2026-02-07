import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- 1. GLOBAL SEO CONFIGURATION ---
export const metadata: Metadata = {
  // IMPORTANT: Replace with your actual live domain to fix OG Image issues
  metadataBase: new URL('https://daztao.online'), 
  
  title: {
    default: "DAZTAO - Premium NFC Keychains & Smart Cards India",
    template: "%s | DAZTAO India"
  },
  description: "Premium NFC keychains in India. Share Instagram, Spotify, and digital profiles with a single tap. No app, no battery, fast shipping.",
  keywords: ["NFC India", "Smart Business Card", "Instagram Tag", "Snapchat Keychain", "Contactless Sharing", "NFC Gifts India"],
  
  // ✅ GOOGLE VERIFICATION ADDED HERE
  verification: {
    google: '-apTbKGQMXyMZ2CH6tNn1J3S0xYfTYUEIDMicAgZWX8',
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://daztao.online',
    siteName: 'DAZTAO Store',
    title: "DAZTAO - Share Socials with a Tap",
    description: "Upgrade your networking with premium NFC accessories. No App Required.",
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'DAZTAO Premium NFC',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: "DAZTAO India",
    description: "Premium NFC Keychains & Cards.",
  },
  
  icons: {
    icon: '/favicon.ico', 
    apple: '/apple-touch-icon.png',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // --- 2. ORGANIZATION SCHEMA (Brand Authority) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DAZTAO',
    url: 'https://daztao.online',
    logo: 'https://daztao.online/logo.png', 
    sameAs: [
      'https://instagram.com/daztaoo',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7889386542',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: 'en'
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white`}
      >
        {/* Inject JSON-LD for Google Brand Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
<Analytics /> {/* <--- ADD THIS */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}