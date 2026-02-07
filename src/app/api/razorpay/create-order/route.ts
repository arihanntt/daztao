import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay takes amount in paise (100 paise = 1 INR)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}