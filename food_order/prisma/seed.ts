import { PrismaClient, Role, OrderStatus, DeliveryStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log('👥 Creating users...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@foodorder.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create restaurant owners
  const restaurant1Password = await bcrypt.hash('restaurant123', 10);
  const restaurant1Owner = await prisma.user.create({
    data: {
      name: 'Chef Maria Rodriguez',
      email: 'maria@italianbistro.com',
      password: restaurant1Password,
      role: Role.RESTAURANT,
    },
  });

  const restaurant2Password = await bcrypt.hash('restaurant123', 10);
  const restaurant2Owner = await prisma.user.create({
    data: {
      name: 'Chef John Smith',
      email: 'john@burgerjoint.com',
      password: restaurant2Password,
      role: Role.RESTAURANT,
    },
  });

  const restaurant3Password = await bcrypt.hash('restaurant123', 10);
  const restaurant3Owner = await prisma.user.create({
    data: {
      name: 'Chef Sarah Chen',
      email: 'sarah@sushibar.com',
      password: restaurant3Password,
      role: Role.RESTAURANT,
    },
  });

  // Create delivery drivers
  const driver1Password = await bcrypt.hash('driver123', 10);
  const driver1 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike@delivery.com',
      password: driver1Password,
      role: Role.DELIVERY,
    },
  });

  const driver2Password = await bcrypt.hash('driver123', 10);
  const driver2 = await prisma.user.create({
    data: {
      name: 'Lisa Wang',
      email: 'lisa@delivery.com',
      password: driver2Password,
      role: Role.DELIVERY,
    },
  });

  // Create customers
  const customer1Password = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@email.com',
      password: customer1Password,
      role: Role.CUSTOMER,
    },
  });

  const customer2Password = await bcrypt.hash('customer123', 10);
  const customer2 = await prisma.user.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob@email.com',
      password: customer2Password,
      role: Role.CUSTOMER,
    },
  });

  const customer3Password = await bcrypt.hash('customer123', 10);
  const customer3 = await prisma.user.create({
    data: {
      name: 'Carol Davis',
      email: 'carol@email.com',
      password: customer3Password,
      role: Role.CUSTOMER,
    },
  });

  console.log('🍕 Creating restaurants...');

  // Create restaurants
  const italianBistro = await prisma.restaurant.create({
    data: {
      name: 'Italian Bistro',
      address: '123 Main St, Downtown',
      description: 'Authentic Italian cuisine with a modern twist',
      phone: '+1-555-0123',
      cuisine: 'Italian',
      ownerId: restaurant1Owner.id,
    },
  });

  const burgerJoint = await prisma.restaurant.create({
    data: {
      name: 'Burger Joint',
      address: '456 Oak Ave, Midtown',
      description: 'Gourmet burgers and comfort food',
      phone: '+1-555-0456',
      cuisine: 'American',
      ownerId: restaurant2Owner.id,
    },
  });

  const sushiBar = await prisma.restaurant.create({
    data: {
      name: 'Sushi Bar',
      address: '789 Pine St, Uptown',
      description: 'Fresh sushi and Japanese cuisine',
      phone: '+1-555-0789',
      cuisine: 'Japanese',
      ownerId: restaurant3Owner.id,
    },
  });

  console.log('🍽️ Creating menu items...');

  // Create menu items for Italian Bistro
  const italianMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        price: 18.99,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
        category: 'Pizza',
        isAvailable: true,
        restaurantId: italianBistro.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Spaghetti Carbonara',
        description: 'Pasta with eggs, cheese, pancetta, and black pepper',
        price: 16.99,
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        category: 'Pasta',
        isAvailable: true,
        restaurantId: italianBistro.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 8.99,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        category: 'Dessert',
        isAvailable: true,
        restaurantId: italianBistro.id,
      },
    }),
  ]);

  // Create menu items for Burger Joint
  const burgerMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Classic Cheeseburger',
        description: 'Angus beef with cheddar, lettuce, tomato, and special sauce',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        category: 'Burgers',
        isAvailable: true,
        restaurantId: burgerJoint.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Truffle Fries',
        description: 'Crispy fries with truffle oil and parmesan',
        price: 6.99,
        imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop',
        category: 'Sides',
        isAvailable: true,
        restaurantId: burgerJoint.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 5.99,
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
        category: 'Beverages',
        isAvailable: true,
        restaurantId: burgerJoint.id,
      },
    }),
  ]);

  // Create menu items for Sushi Bar
  const sushiMenuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3d17c4f4a6c?w=400&h=300&fit=crop',
        category: 'Rolls',
        isAvailable: true,
        restaurantId: sushiBar.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 8.99,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3d17c4f4a6c?w=400&h=300&fit=crop',
        category: 'Nigiri',
        isAvailable: true,
        restaurantId: sushiBar.id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Miso Soup',
        description: 'Traditional Japanese miso soup with tofu',
        price: 4.99,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3d17c4f4a6c?w=400&h=300&fit=crop',
        category: 'Soup',
        isAvailable: true,
        restaurantId: sushiBar.id,
      },
    }),
  ]);

  console.log('📦 Creating orders...');

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      restaurantId: italianBistro.id,
      status: OrderStatus.CONFIRMED,
      estimatedTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      specialInstructions: 'Extra cheese on the pizza please',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      restaurantId: burgerJoint.id,
      status: OrderStatus.PREPARING,
      estimatedTime: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
      specialInstructions: 'Well done burger',
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer3.id,
      restaurantId: sushiBar.id,
      status: OrderStatus.READY,
      estimatedTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
      specialInstructions: 'No wasabi',
    },
  });

  console.log('🛒 Creating order items...');

  // Create order items for order 1 (Italian)
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        menuItemId: italianMenuItems[0].id, // Margherita Pizza
        quantity: 1,
        price: 18.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        menuItemId: italianMenuItems[2].id, // Tiramisu
        quantity: 1,
        price: 8.99,
      },
    }),
  ]);

  // Create order items for order 2 (Burger)
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        menuItemId: burgerMenuItems[0].id, // Classic Cheeseburger
        quantity: 2,
        price: 14.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        menuItemId: burgerMenuItems[1].id, // Truffle Fries
        quantity: 1,
        price: 6.99,
      },
    }),
  ]);

  // Create order items for order 3 (Sushi)
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order3.id,
        menuItemId: sushiMenuItems[0].id, // California Roll
        quantity: 1,
        price: 12.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order3.id,
        menuItemId: sushiMenuItems[1].id, // Salmon Nigiri
        quantity: 2,
        price: 8.99,
      },
    }),
  ]);

  console.log('🚚 Creating deliveries...');

  // Create deliveries
  const delivery1 = await prisma.delivery.create({
    data: {
      orderId: order1.id,
      driverId: driver1.id,
      status: DeliveryStatus.ASSIGNED,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    },
  });

  const delivery2 = await prisma.delivery.create({
    data: {
      orderId: order2.id,
      driverId: driver2.id,
      status: DeliveryStatus.ASSIGNED,
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000), // 40 minutes from now
    },
  });

  console.log('💳 Creating payments...');

  // Create payments
  const payment1 = await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 27.98, // Pizza + Tiramisu
      status: PaymentStatus.SUCCESS,
      stripePaymentIntentId: 'pi_test_1234567890',
      processedAt: new Date(),
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      orderId: order2.id,
      amount: 36.97, // 2 Burgers + Fries
      status: PaymentStatus.PENDING,
    },
  });

  const payment3 = await prisma.payment.create({
    data: {
      orderId: order3.id,
      amount: 30.97, // California Roll + 2 Salmon Nigiri
      status: PaymentStatus.SUCCESS,
      stripePaymentIntentId: 'pi_test_0987654321',
      processedAt: new Date(),
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Sample data created:');
  console.log(`- ${await prisma.user.count()} users (Admin, Restaurant Owners, Drivers, Customers)`);
  console.log(`- ${await prisma.restaurant.count()} restaurants`);
  console.log(`- ${await prisma.menuItem.count()} menu items`);
  console.log(`- ${await prisma.order.count()} orders`);
  console.log(`- ${await prisma.delivery.count()} deliveries`);
  console.log(`- ${await prisma.payment.count()} payments`);
  
  console.log('\n🔑 Test accounts:');
  console.log('Admin: admin@foodorder.com / admin123');
  console.log('Restaurant: maria@italianbistro.com / restaurant123');
  console.log('Driver: mike@delivery.com / driver123');
  console.log('Customer: alice@email.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
