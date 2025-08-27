import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createPaymentIntent } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    if (!payload || payload.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Only customers can create payment intents' },
        { status: 403 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch the order and verify ownership
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        customerId: payload.userId,
      },
      include: {
        items: true,
        restaurant: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Check if order already has a payment
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment already exists for this order' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const paymentIntentResult = await createPaymentIntent(
      totalAmount,
      orderId,
      payload.email
    );

    if (!paymentIntentResult.success) {
      return NextResponse.json(
        { error: paymentIntentResult.error },
        { status: 500 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: totalAmount,
        status: 'PENDING',
        stripePaymentIntentId: paymentIntentResult.paymentIntentId,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntentResult.clientSecret,
      paymentId: payment.id,
      amount: totalAmount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
