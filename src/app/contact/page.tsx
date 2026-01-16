import { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';

export const metadata: Metadata = {
  title: "Contact DAZTAO – NFC Keychain Support & Orders (India)",

  description: "Contact DAZTAO for help with orders, shipping, refunds, or general questions. We provide email support for NFC keychain customers across India.",

  keywords: ["Daztao Contact", "NFC Support India", "Order Status"],
};

export default function ContactPage() {
  return <ContactClient />;
}