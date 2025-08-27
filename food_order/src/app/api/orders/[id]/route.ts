import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = requireAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            ownerId: true
          }
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (payload.role === 'CUSTOMER' && order.customerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (payload.role === 'RESTAURANT' && order.restaurant.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update order status (restaurant owners only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = requireAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (payload.role !== 'RESTAURANT') {
    return NextResponse.json(
      { error: 'Only restaurant owners can update order status' },
      { status: 403 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        restaurant: {
          select: { ownerId: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this restaurant
    if (order.restaurant.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only update orders for your own restaurant.' },
        { status: 403 }
      );
    }

    const { status, estimatedTime } = await request.json();

    // Validate status transition
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status as any,
        estimatedTime
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
