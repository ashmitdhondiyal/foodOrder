import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCancellation(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'SUCCESS',
        stripePaymentMethodId: paymentIntent.payment_method as string,
        processedAt: new Date(),
      },
    });

    // Update order status to confirmed
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });

    console.log(`Payment succeeded for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        processedAt: new Date(),
      },
    });

    // Update order status to cancelled
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    console.log(`Payment failed for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        processedAt: new Date(),
      },
    });

    // Update order status to cancelled
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    console.log(`Payment cancelled for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

  async function handleRefund(charge: Stripe.Charge) {
  try {
    // Find payment by charge ID
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (!payment) {
      console.error('Payment not found for refund:', charge.id);
      return;
    }

    // Create refund record
    await prisma.refund.create({
      data: {
        paymentId: payment.id,
        amount: charge.amount / 100, // Convert from cents
        stripeRefundId: charge.id,
        status: 'SUCCESS',
        processedAt: new Date(),
      },
    });

    console.log(`Refund processed for payment: ${payment.id}`);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}
