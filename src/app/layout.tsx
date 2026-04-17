import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from '@vercel/analytics/react';
import SideCart from '@/components/SideCart';
import AuthSessionProvider from '@/components/AuthSessionProvider';

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://daztao.online";

// ---------------------------------------------------------------------------
// PILLAR 1: Exhaustive Default Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Daztao — Premium NFC Keychains India | Tap to Share Socials",
    template: "%s | Daztao NFC Keychains India",
  },

  description:
    "Daztao NFC keychains let you share your Instagram, Snapchat, YouTube, and Facebook with one tap. No app needed. Waterproof. Ships across India. Starting at Rs. 299.",

  keywords: [
    "NFC keychain India",
    "buy NFC keychain India",
    "Instagram NFC keychain India",
    "Snapchat NFC keychain India",
    "Facebook NFC keychain",
    "YouTube NFC keychain India",
    "tap keychain India",
    "Daztao keychain",
    "Daztao NFC",
    "smart social media keychain",
    "digital business card keychain India",
    "NFC smart keychain",
    "contactless sharing keychain",
    "tap to share socials India",
    "NFC keychain no app required",
    "best NFC keychain India 2026",
  ],

  authors: [{ name: "Daztao", url: BASE_URL }],
  creator: "Daztao",
  publisher: "Daztao",

  verification: {
    google: "-apTbKGQMXyMZ2CH6tNn1J3S0xYfTYUEIDMicAgZWX8",
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Daztao",
    title: "Daztao — Premium NFC Keychains | Tap to Share Socials Instantly",
    description:
      "Share your Instagram, Snapchat, YouTube, or any link with a single tap. Daztao NFC keychains are waterproof, require no app, and ship pan-India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daztao Premium NFC Keychain — Tap to Share Your Socials",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@daztaoo",
    creator: "@daztaoo",
    title: "Daztao NFC Keychains — Share Socials with One Tap",
    description:
      "Premium NFC keychains that share your Instagram, Snapchat, YouTube, and more. No app. No battery. Ships across India.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "ecommerce",
};

// ---------------------------------------------------------------------------
// PILLAR 2: Global JSON-LD (Organization + WebSite schema for AEO/GEO)
// ---------------------------------------------------------------------------
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Daztao",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    "Daztao sells premium NFC smart keychains in India. Tap once to share your Instagram, Snapchat, YouTube, or Facebook profile instantly. No app required. Ships pan-India.",
  foundingDate: "2024",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "India",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-7889386542",
      contactType: "customer service",
      contactOption: "TollFree",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      email: "daztaoo@gmail.com",
      contactType: "customer support",
      areaServed: "IN",
    },
  ],
  sameAs: [
    "https://www.instagram.com/daztaoo",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Daztao",
  url: BASE_URL,
  description:
    "Premium NFC keychains for sharing Instagram, Snapchat, YouTube, and digital profiles with one tap. No app required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ---------------------------------------------------------------------------
// ROOT LAYOUT
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} antialiased bg-[#FAFAFA] text-[#1A1A1A]`}
      >
        {/* Organization Schema — establishes brand entity for Google Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* WebSite Schema — enables Sitelinks Search Box in SERP */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />

        <Analytics />

        <AuthSessionProvider>
          <CartProvider>
            <SideCart />
            {children}
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}