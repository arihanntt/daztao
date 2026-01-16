import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // 👈 Import Product Model

// --- CREATE ORDER (Used by Checkout) ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // ============================================================
    // 1. STOCK CHECK & UPDATE LOGIC (New Addition)
    // ============================================================
    
    // First, verify ALL items are in stock before touching anything
    for (const item of body.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Sorry, ${item.title} is out of stock. Only ${product.stock} left.` 
        }, { status: 400 });
      }
    }

    // If verification passes, NOW subtract the stock
    for (const item of body.items) {
      await Product.findByIdAndUpdate(item.productId, { 
        $inc: { stock: -item.quantity } 
      });
    }
    // ============================================================


    // 2. Generate Order ID
    const shortId = Math.floor(10000 + Math.random() * 90000).toString();
    const orderId = `DAZ-${shortId}`;

    // 3. Create Order
    const newOrder = await Order.create({
      ...body,
      orderId,
      status: 'Pending Verification' // Set initial status
    });

    return NextResponse.json({ success: true, orderId: newOrder.orderId });

  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status: 500 });
  }
}

// --- GET ALL ORDERS (Used by Admin Panel) ---
export async function GET() {
  try {
    await connectDB();
    // Fetch all orders, sorted by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}