import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update menu item (restaurant owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; menuId: string } }
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
        { error: 'Access denied. You can only edit menu items in your own restaurant.' },
        { status: 403 }
      );
    }

    // Check if menu item exists
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: params.menuId }
    });

    if (!existingMenuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    const { name, description, price, imageUrl, category, isAvailable } = await request.json();

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: params.menuId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        category,
        isAvailable
      }
    });

    return NextResponse.json({
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item (restaurant owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; menuId: string } }
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
        { error: 'Access denied. You can only delete menu items in your own restaurant.' },
        { status: 403 }
      );
    }

    // Check if menu item exists
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: params.menuId }
    });

    if (!existingMenuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Delete menu item
    await prisma.menuItem.delete({
      where: { id: params.menuId }
    });

    return NextResponse.json({
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
