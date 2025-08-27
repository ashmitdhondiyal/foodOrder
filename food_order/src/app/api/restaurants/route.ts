import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all restaurants (public)
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
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
            price: true,
            imageUrl: true
          }
        },
        _count: {
          select: {
            menuItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new restaurant (RESTAURANT role only)
export async function POST(request: NextRequest) {
  const payload = requireRole(request, ['RESTAURANT']);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Access denied. Restaurant role required.' },
      { status: 403 }
    );
  }

  try {
    const { name, address, description, phone, cuisine } = await request.json();

    // Check if user already has a restaurant
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { ownerId: payload.userId }
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'You already have a restaurant' },
        { status: 400 }
      );
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        description,
        phone,
        cuisine,
        ownerId: payload.userId
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
      message: 'Restaurant created successfully',
      restaurant
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
