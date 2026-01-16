import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// --- GET SINGLE PRODUCT (For the Buy Page) ---
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // 👈 Await params (Next.js 15 requirement)
    
    // Debug Log
    console.log(`🔍 Searching API for slug: "${id}"`);

    // We search by 'slug', not '_id'. 
    const product = await Product.findOne({ slug: id });
    
    if (!product) {
      console.log("❌ Product not found in DB");
      return NextResponse.json({ error: "Product not found in Database" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("🔥 API GET Error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}

// --- PUT (UPDATE PRODUCT) (For Admin "Save Changes") ---
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    console.log(`📝 Updating product with slug: "${id}"`);

    const updatedProduct = await Product.findOneAndUpdate(
      { slug: id }, 
      body, 
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found to update" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("🔥 API PUT Error:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// --- DELETE PRODUCT (For Admin "Delete") ---
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    console.log(`🗑️ Deleting product with slug: "${id}"`);

    const deletedProduct = await Product.findOneAndDelete({ slug: id });

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("🔥 API DELETE Error:", error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}