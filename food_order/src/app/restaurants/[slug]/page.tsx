'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number;
  rating: number;
  reviews: number;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisine: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  isOpen: boolean;
  phone: string;
  hours: string;
  categories: string[];
}

export default function RestaurantPage() {
  const params = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock restaurant data
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Pizza Palace',
      description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes. Our wood-fired ovens create the perfect crispy crust every time.',
      address: '123 Main St, Downtown, City, State 12345',
      cuisine: 'Italian',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      minimumOrder: 15,
      isOpen: true,
      phone: '(555) 123-4567',
      hours: '11:00 AM - 10:00 PM',
      categories: ['Pizza', 'Pasta', 'Salads', 'Desserts', 'Beverages']
    },
    {
      id: '2',
      name: 'Burger House',
      description: 'Juicy burgers, crispy fries, and classic American comfort food. Made with premium beef and fresh ingredients.',
      address: '456 Oak Ave, Midtown, City, State 12345',
      cuisine: 'American',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      rating: 4.5,
      deliveryTime: '20-30 min',
      minimumOrder: 12,
      isOpen: true,
      phone: '(555) 234-5678',
      hours: '10:00 AM - 11:00 PM',
      categories: ['Burgers', 'Sides', 'Desserts', 'Beverages']
    },
    {
      id: '3',
      name: 'Sushi Express',
      description: 'Fresh sushi and Japanese cuisine prepared by expert chefs. Premium fish and authentic Japanese ingredients.',
      address: '789 Pine St, Uptown, City, State 12345',
      cuisine: 'Japanese',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
      rating: 4.7,
      deliveryTime: '30-45 min',
      minimumOrder: 20,
      isOpen: true,
      phone: '(555) 345-6789',
      hours: '11:30 AM - 10:30 PM',
      categories: ['Sushi', 'Ramen', 'Appetizers', 'Desserts', 'Beverages']
    },
    {
      id: '4',
      name: 'Taco Fiesta',
      description: 'Authentic Mexican tacos, burritos, and traditional dishes. Spicy flavors and fresh ingredients.',
      address: '321 Elm St, Westside, City, State 12345',
      cuisine: 'Mexican',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
      rating: 4.3,
      deliveryTime: '15-25 min',
      minimumOrder: 10,
      isOpen: true,
      phone: '(555) 456-7890',
      hours: '10:00 AM - 9:00 PM',
      categories: ['Tacos', 'Burritos', 'Quesadillas', 'Sides', 'Beverages']
    },
    {
      id: '5',
      name: 'Curry Corner',
      description: 'Spicy Indian curries, naan bread, and aromatic rice dishes. Authentic spices and traditional recipes.',
      address: '654 Maple Dr, Eastside, City, State 12345',
      cuisine: 'Indian',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
      rating: 4.6,
      deliveryTime: '25-40 min',
      minimumOrder: 18,
      isOpen: true,
      phone: '(555) 567-8901',
      hours: '11:00 AM - 10:00 PM',
      categories: ['Curries', 'Breads', 'Rice', 'Appetizers', 'Beverages']
    }
  ];

  // Mock menu items data
  const mockMenuItems: MenuItem[] = [
    // Pizza Palace Menu
    {
      id: 'p1',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, fresh mozzarella, basil, and extra virgin olive oil',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop',
      category: 'Pizza',
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 20,
      rating: 4.9,
      reviews: 127
    },
    {
      id: 'p2',
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni, mozzarella, and our signature tomato sauce',
      price: 17.99,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: 'Pizza',
      isVegetarian: false,
      isSpicy: true,
      preparationTime: 20,
      rating: 4.8,
      reviews: 89
    },
    {
      id: 'p3',
      name: 'BBQ Chicken Pizza',
      description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      category: 'Pizza',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 22,
      rating: 4.7,
      reviews: 64
    },
    {
      id: 'p4',
      name: 'Spaghetti Carbonara',
      description: 'Eggs, pancetta, parmesan cheese, and black pepper',
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      category: 'Pasta',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 18,
      rating: 4.6,
      reviews: 42
    },
    {
      id: 'p5',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, parmesan cheese, croutons, and caesar dressing',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'Salads',
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 8,
      rating: 4.5,
      reviews: 38
    },
    {
      id: 'p6',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category: 'Desserts',
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 5,
      rating: 4.9,
      reviews: 56
    },

    // Burger House Menu
    {
      id: 'b1',
      name: 'Classic Cheeseburger',
      description: '1/3 lb beef patty, cheddar cheese, lettuce, tomato, onion, and special sauce',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'Burgers',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 15,
      rating: 4.6,
      reviews: 89
    },
    {
      id: 'b2',
      name: 'Bacon Deluxe Burger',
      description: '1/2 lb beef patty, bacon, cheddar, lettuce, tomato, and BBQ sauce',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
      category: 'Burgers',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 18,
      rating: 4.8,
      reviews: 67
    },
    {
      id: 'b3',
      name: 'Crispy Fries',
      description: 'Golden crispy french fries seasoned with sea salt',
      price: 4.99,
      imageUrl: 'https://images.unsplash.com/photo-1573086211208-9c0e6a0b9b0c?w=400&h=300&fit=crop',
      category: 'Sides',
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 8,
      rating: 4.4,
      reviews: 45
    },

    // Sushi Express Menu
    {
      id: 's1',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber with tobiko on top',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      category: 'Sushi',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 12,
      rating: 4.7,
      reviews: 78
    },
    {
      id: 's2',
      name: 'Spicy Tuna Roll',
      description: 'Spicy tuna and cucumber with spicy mayo',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
      category: 'Sushi',
      isVegetarian: false,
      isSpicy: true,
      preparationTime: 12,
      rating: 4.8,
      reviews: 92
    },
    {
      id: 's3',
      name: 'Tonkotsu Ramen',
      description: 'Rich pork bone broth, chashu pork, soft-boiled egg, and green onions',
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
      category: 'Ramen',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 20,
      rating: 4.9,
      reviews: 56
    },

    // Taco Fiesta Menu
    {
      id: 't1',
      name: 'Beef Tacos',
      description: 'Three soft corn tortillas with seasoned beef, lettuce, cheese, and salsa',
      price: 11.99,
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      category: 'Tacos',
      isVegetarian: false,
      isSpicy: true,
      preparationTime: 10,
      rating: 4.5,
      reviews: 73
    },
    {
      id: 't2',
      name: 'Chicken Burrito',
      description: 'Large flour tortilla filled with grilled chicken, rice, beans, and vegetables',
      price: 13.99,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
      category: 'Burritos',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 12,
      rating: 4.6,
      reviews: 58
    },

    // Curry Corner Menu
    {
      id: 'c1',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato and cream sauce with aromatic spices',
      price: 18.99,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      category: 'Curries',
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 25,
      rating: 4.8,
      reviews: 81
    },
    {
      id: 'c2',
      name: 'Paneer Tikka Masala',
      description: 'Grilled paneer cheese in creamy tomato sauce with Indian spices',
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      category: 'Curries',
      isVegetarian: true,
      isSpicy: true,
      preparationTime: 22,
      rating: 4.7,
      reviews: 64
    },
    {
      id: 'c3',
      name: 'Garlic Naan',
      description: 'Soft bread brushed with garlic butter and herbs',
      price: 3.99,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      category: 'Breads',
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 8,
      rating: 4.6,
      reviews: 47
    }
  ];

  useEffect(() => {
    const restaurantId = params.slug as string;
    const foundRestaurant = mockRestaurants.find(r => r.id === restaurantId);
    
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      // Filter menu items by restaurant (using cuisine as a simple filter)
      const restaurantMenu = mockMenuItems.filter(item => {
        if (foundRestaurant.cuisine === 'Italian') {
          return ['Pizza', 'Pasta', 'Salads', 'Desserts'].includes(item.category);
        } else if (foundRestaurant.cuisine === 'American') {
          return ['Burgers', 'Sides', 'Desserts'].includes(item.category);
        } else if (foundRestaurant.cuisine === 'Japanese') {
          return ['Sushi', 'Ramen', 'Appetizers', 'Desserts'].includes(item.category);
        } else if (foundRestaurant.cuisine === 'Mexican') {
          return ['Tacos', 'Burritos', 'Quesadillas', 'Sides'].includes(item.category);
        } else if (foundRestaurant.cuisine === 'Indian') {
          return ['Curries', 'Breads', 'Rice', 'Appetizers'].includes(item.category);
        }
        return false;
      });
      setMenuItems(restaurantMenu);
    }
    setLoading(false);
  }, [params.slug]);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      restaurantId: restaurant?.id || '',
      restaurantName: restaurant?.name || ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
            <p className="text-xl mb-2">{restaurant.cuisine} Cuisine</p>
            <div className="flex items-center justify-center space-x-4 text-lg">
              <span>⭐ {restaurant.rating}</span>
              <span>🕒 {restaurant.deliveryTime}</span>
              <span>💰 Min ${restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>📍 {restaurant.address}</p>
                <p>📞 {restaurant.phone}</p>
                <p>🕒 {restaurant.hours}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <div className="space-y-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  restaurant.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                </span>
                <p className="text-gray-600">Delivery: {restaurant.deliveryTime}</p>
                <p className="text-gray-600">Min Order: ${restaurant.minimumOrder}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Menu</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {restaurant.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {item.isVegetarian && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">🌱 Veg</span>
                    )}
                    {item.isSpicy && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🌶️ Spicy</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-blue-600">${item.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>⭐ {item.rating}</span>
                      <span>•</span>
                      <span>{item.reviews} reviews</span>
                    </div>
                    <span className="text-sm text-gray-500">🕒 {item.preparationTime} min</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Add to Cart - ${item.price}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
