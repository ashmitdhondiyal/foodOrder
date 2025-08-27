import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get user's orders (authenticated users)
export async function GET(request: NextRequest) {
  const payload = requireAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let orders;
    
    if (payload.role === 'CUSTOMER') {
      // Customers see their own orders
      orders = await prisma.order.findMany({
        where: { customerId: payload.userId },
        include: {
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
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (payload.role === 'RESTAURANT') {
      // Restaurant owners see orders for their restaurant
      const restaurant = await prisma.restaurant.findUnique({
        where: { ownerId: payload.userId }
      });

      if (!restaurant) {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      orders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
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
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order (customers only)
export async function POST(request: NextRequest) {
  const payload = requireAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (payload.role !== 'CUSTOMER') {
    return NextResponse.json(
      { error: 'Only customers can place orders' },
      { status: 403 }
    );
  }

  try {
    const { restaurantId, items } = await request.json();

    if (!restaurantId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Restaurant ID and items are required' },
        { status: 400 }
      );
    }

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Calculate total price
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 404 }
        );
      }

      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { error: `Menu item ${menuItem.name} is not available` },
          { status: 400 }
        );
      }

      if (menuItem.restaurantId !== restaurantId) {
        return NextResponse.json(
          { error: 'All items must be from the same restaurant' },
          { status: 400 }
        );
      }

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerId: payload.userId,
        restaurantId,
        status: 'PENDING',
        items: {
          create: orderItems
        }
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
      message: 'Order created successfully',
      order
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
