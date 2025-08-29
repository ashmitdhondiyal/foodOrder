import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

export const seedConfig = {
  // Database connection
  databaseUrl: process.env.DATABASE_URL,
  
  // Seed options
  clearExistingData: true,
  
  // Sample data counts
  users: {
    admin: 1,
    restaurantOwners: 3,
    drivers: 2,
    customers: 3,
  },
  
  restaurants: 3,
  menuItemsPerRestaurant: 3,
  orders: 3,
  
  // Test account passwords
  passwords: {
    admin: 'admin123',
    restaurant: 'restaurant123',
    driver: 'driver123',
    customer: 'customer123',
  },
};

// Validate required environment variables
if (!seedConfig.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}
