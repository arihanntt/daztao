import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST() {
  await connectDB();

  // Clear existing products to avoid duplicates
  await Product.deleteMany({});

  const products = [
    {
      slug: "instagram-keychain",
      title: "Instagram NFC Keychain",
      description: "Tap to open your Instagram profile instantly. Perfect for creators and influencers.",
      price: 599,
      originalPrice: 1000,
      stock: 50,
      images: ["/images/instagram-card.jpg"], 
      iconType: "instagram",
      features: ["Share profile instantly", "No typing required", "Works on iPhone & Android"],
      isVisible: true
    },
    {
      slug: "snapchat-keychain",
      title: "Snapchat NFC Keychain",
      description: "Add friends instantly at parties. No need to open the camera to scan Snapcodes.",
      price: 599,
      originalPrice: 1000,
      stock: 35,
      images: ["/images/snapchat-card.jpg"],
      iconType: "snapchat",
      features: ["Instant Add", "Party essential", "Streak saver"],
      isVisible: true
    },
    {
      slug: "whatsapp-keychain",
      title: "WhatsApp NFC Keychain",
      description: "Start a chat without saving the number. Ideal for businesses and networking.",
      price: 599,
      originalPrice: 1000,
      stock: 100,
      images: ["/images/whatsapp-card.jpg"],
      iconType: "whatsapp",
      features: ["Direct Chat", "Business Ready", "Zero Friction"],
      isVisible: true
    }
  ];

  await Product.insertMany(products);

  return NextResponse.json({ message: "Database seeded successfully!" });
}