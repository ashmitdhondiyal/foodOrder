import Stripe from 'stripe';

// Initialize Stripe server-side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Payment intent creation
export async function createPaymentIntent(amount: number, orderId: string, customerEmail: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId,
        customerEmail,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}

// Payment intent retrieval
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
    };
  }
}

// Payment method retrieval
export async function getPaymentMethod(paymentMethodId: string) {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return {
      success: true,
      paymentMethod,
    };
  } catch (error) {
    console.error('Error retrieving payment method:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment method',
    };
  }
}

// Refund creation
export async function createRefund(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
    });

    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create refund',
    };
  }
}

// Customer creation
export async function createCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
}

// Customer retrieval
export async function getCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve customer',
    };
  }
}

// Payment status mapping
export function mapStripeStatusToPaymentStatus(stripeStatus: string): 'PENDING' | 'SUCCESS' | 'FAILED' {
  switch (stripeStatus) {
    case 'succeeded':
      return 'SUCCESS';
    case 'processing':
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'PENDING';
    case 'canceled':
    case 'failed':
    default:
      return 'FAILED';
  }
}

// Amount formatting
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Amount conversion (dollars to cents)
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

// Amount conversion (cents to dollars)
export function fromCents(amount: number): number {
  return amount / 100;
}
