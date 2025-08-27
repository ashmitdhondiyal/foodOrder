import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get deliveries (ADMIN, DELIVERY partners)
export async function GET(request: NextRequest) {
  const payload = requireAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let deliveries;
    
    if (payload.role === 'ADMIN') {
      // Admins see all deliveries
      deliveries = await prisma.delivery.findMany({
        include: {
          order: {
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
              }
            }
          },
          driver: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { assignedAt: 'desc' }
      });
    } else if (payload.role === 'DELIVERY') {
      // Delivery partners see their own deliveries
      deliveries = await prisma.delivery.findMany({
        where: { driverId: payload.userId },
        include: {
          order: {
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
              }
            }
          }
        },
        orderBy: { assignedAt: 'desc' }
      });
    } else {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ deliveries });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Assign delivery partner to order (ADMIN only)
export async function POST(request: NextRequest) {
  const payload = requireRole(request, ['ADMIN']);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Access denied. Admin role required.' },
      { status: 403 }
    );
  }

  try {
    const { orderId, driverId, estimatedDeliveryTime } = await request.json();

    if (!orderId || !driverId) {
      return NextResponse.json(
        { error: 'Order ID and driver ID are required' },
        { status: 400 }
      );
    }

    // Verify order exists and is ready for delivery
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        delivery: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'READY') {
      return NextResponse.json(
        { error: 'Order must be ready before assigning delivery' },
        { status: 400 }
      );
    }

    if (order.delivery) {
      return NextResponse.json(
        { error: 'Order already has a delivery assigned' },
        { status: 400 }
      );
    }

    // Verify driver exists and has DELIVERY role
    const driver = await prisma.user.findUnique({
      where: { id: driverId }
    });

    if (!driver || driver.role !== 'DELIVERY') {
      return NextResponse.json(
        { error: 'Invalid delivery driver' },
        { status: 400 }
      );
    }

    // Create delivery assignment
    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        driverId,
        estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : null
      },
      include: {
        order: {
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
            }
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Update order status to OUT_FOR_DELIVERY
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'OUT_FOR_DELIVERY' }
    });

    return NextResponse.json({
      message: 'Delivery assigned successfully',
      delivery
    }, { status: 201 });

  } catch (error) {
    console.error('Error assigning delivery:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
