import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { DeliveryStatus, PrismaClient } from '@prisma/client';

interface DeliveryUpdateData {
  status: DeliveryStatus;
  deliveryNotes?: string;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  actualDeliveryTime?: Date;
}

const prisma = new PrismaClient();

// GET - Get delivery details
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
    const delivery = await prisma.delivery.findUnique({
      where: { id: params.id },
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

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (payload.role === 'DELIVERY' && delivery.driverId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ delivery });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// PUT - Update delivery status (delivery partners only)
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

  if (payload.role !== 'DELIVERY') {
    return NextResponse.json(
      { error: 'Only delivery partners can update delivery status' },
      { status: 403 }
    );
  }

  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: params.id },
      include: {
        order: true
      }
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // Check if user is the assigned driver
    if (delivery.driverId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only update your own deliveries.' },
        { status: 403 }
      );
    }

    const { status, deliveryNotes } = await request.json();

    // Validate status transition
    const validStatuses = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: DeliveryUpdateData = {
      status: status as DeliveryStatus,
      deliveryNotes
    };

    // Set timestamps based on status
    if (status === 'PICKED_UP' && !delivery.pickedUpAt) {
      updateData.pickedUpAt = new Date();
    } else if (status === 'DELIVERED' && !delivery.deliveredAt) {
      updateData.deliveredAt = new Date();
      updateData.actualDeliveryTime = new Date();
    }

    // Update delivery
    const updatedDelivery = await prisma.delivery.update({
      where: { id: params.id },
      data: updateData,
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

    // Update order status if delivery is completed
    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' }
      });
    }

    return NextResponse.json({
      message: 'Delivery status updated successfully',
      delivery: updatedDelivery
    });

  } catch (error) {
    console.error('Error updating delivery:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
