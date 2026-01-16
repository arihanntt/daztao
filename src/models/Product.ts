import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // e.g., 'instagram-keychain'
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: [{ type: String }], // Array of image URLs
    iconType: { type: String, enum: ['instagram', 'snapchat', 'whatsapp', 'spotify', 'default'], default: 'default' },
    themeColor: { type: String, default: 'text-white' }, // e.g., 'text-pink-500'
    features: [{ type: String }], // Use cases
    reviews: [{ type: String }],
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);