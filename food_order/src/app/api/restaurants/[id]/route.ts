import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get restaurant by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        menuItems: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true
          },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// PUT - Update restaurant (owner only)
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

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if user owns this restaurant
    if (restaurant.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only edit your own restaurant.' },
        { status: 403 }
      );
    }

    const { name, address, description, phone, cuisine } = await request.json();

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name,
        address,
        description,
        phone,
        cuisine
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant
    });

  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Delete restaurant (owner only)
export async function DELETE(
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
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if user owns this restaurant
    if (restaurant.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only delete your own restaurant.' },
        { status: 403 }
      );
    }

    // Delete restaurant (cascades to menu items)
    await prisma.restaurant.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Restaurant deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
