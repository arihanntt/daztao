import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

// GET /api/orders/mine — returns orders for the currently signed-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find({
      'customer.email': session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('User orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}
