import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

// --- 7. SEO METADATA ---
export const metadata: Metadata = {
  title: "DAZTAO NFC Keychain – Share Snapchat & Instagram with One Tap",
  description: "Premium NFC keychain to instantly share links with a tap. No app. No battery. Works on iPhone & Android. Ships fast across India.",
  keywords: ["NFC Keychain", "Spotify Keychain", "Instagram Tag", "Smart Business Card India", "Daztao"],
  openGraph: {
    title: "DAZTAO - The Future of Connecting",
    description: "Stop typing. Just tap. The premium NFC keychain for creators.",
    images: ['/og-home.jpg'], // Make sure to add this image to public folder
  }
};

export default function Page() {
  return <HomeClient />;
}