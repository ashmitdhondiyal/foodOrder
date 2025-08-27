import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get all menu items for a restaurant (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: params.id },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new menu item (restaurant owner only)
export async function POST(
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
    // Check if user owns this restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (restaurant.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only add menu items to your own restaurant.' },
        { status: 403 }
      );
    }

    const { name, description, price, imageUrl, category, isAvailable = true } = await request.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        isAvailable,
        restaurantId: params.id
      }
    });

    return NextResponse.json({
      message: 'Menu item added successfully',
      menuItem
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
