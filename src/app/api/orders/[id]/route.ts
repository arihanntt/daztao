import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";

// Helper to find by _id OR orderId
const getQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { orderId: id };
};

// --- GET ORDER ---
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const order = await Order.findOne(getQuery(id));
  
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}

// --- UPDATE ORDER (Save UTR) ---
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  // Find and update
  const order = await Order.findOneAndUpdate(
    getQuery(id), 
    body, 
    { new: true }
  );

  return NextResponse.json(order);
}

// --- DELETE ORDER ---
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Order.findOneAndDelete(getQuery(id));
  return NextResponse.json({ message: "Order Deleted" });
}