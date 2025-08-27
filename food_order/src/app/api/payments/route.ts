import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { createRefund } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch payments (role-based access)
export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let payments;

    switch (payload.role) {
      case 'CUSTOMER':
        // Customers can see their own payments
        payments = await prisma.payment.findMany({
          where: {
            order: {
              customerId: payload.userId,
            },
          },
          include: {
            order: {
              include: {
                restaurant: {
                  select: {
                    name: true,
                  },
                },
                items: {
                  include: {
                    menuItem: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            refunds: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      case 'RESTAURANT':
        // Restaurant owners can see payments for their orders
        payments = await prisma.payment.findMany({
          where: {
            order: {
              restaurant: {
                ownerId: payload.userId,
              },
            },
          },
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                items: {
                  include: {
                    menuItem: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            refunds: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      case 'ADMIN':
        // Admins can see all payments
        payments = await prisma.payment.findMany({
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                restaurant: {
                  select: {
                    name: true,
                  },
                },
                items: {
                  include: {
                    menuItem: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            refunds: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST: Process refund (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const payload = requireRole(request, ['ADMIN']);
    if (!payload) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { paymentId, amount, reason } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Fetch payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'SUCCESS') {
      return NextResponse.json(
        { error: 'Can only refund successful payments' },
        { status: 400 }
      );
    }

    if (payment.refunded) {
      return NextResponse.json(
        { error: 'Payment has already been refunded' },
        { status: 400 }
      );
    }

    // Check if partial refund amount is valid
    if (amount && (amount <= 0 || amount > payment.amount)) {
      return NextResponse.json(
        { error: 'Invalid refund amount' },
        { status: 400 }
      );
    }

    // Process refund through Stripe
    const refundResult = await createRefund(
      payment.stripePaymentIntentId!,
      amount
    );

    if (!refundResult.success) {
      return NextResponse.json(
        { error: refundResult.error },
        { status: 500 }
      );
    }

    // Create refund record in database
    const refund = await prisma.refund.create({
      data: {
        paymentId: payment.id,
        amount: amount || payment.amount,
        reason: reason || 'Admin refund',
        status: 'SUCCESS',
        stripeRefundId: refundResult.refund.id,
        processedAt: new Date(),
      },
    });

    // Update payment status if full refund
    if (!amount || amount === payment.amount) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          refunded: true,
          refundedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      refund,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}
