'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantCard from '@/components/restaurants/RestaurantCard';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisine: string;
  imageUrl?: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  isOpen: boolean;
}

export default function RestaurantsPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const cuisines = [
    'all', 'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 
    'American', 'Thai', 'Mediterranean', 'Korean', 'Vietnamese'
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      if (response.ok) {
        const data = await response.json();
        // Add mock data for demo
        const mockRestaurants: Restaurant[] = [
          {
            id: '1',
            name: 'Pizza Palace',
            description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes.',
            address: '123 Main St, Downtown',
            cuisine: 'Italian',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.8,
            deliveryTime: '25-35 min',
            minimumOrder: 15,
            isOpen: true
          },
          {
            id: '2',
            name: 'Burger House',
            description: 'Juicy burgers, crispy fries, and classic American comfort food.',
            address: '456 Oak Ave, Midtown',
            cuisine: 'American',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.5,
            deliveryTime: '20-30 min',
            minimumOrder: 12,
            isOpen: true
          },
          {
            id: '3',
            name: 'Sushi Express',
            description: 'Fresh sushi and Japanese cuisine prepared by expert chefs.',
            address: '789 Pine St, Uptown',
            cuisine: 'Japanese',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.7,
            deliveryTime: '30-45 min',
            minimumOrder: 20,
            isOpen: true
          },
          {
            id: '4',
            name: 'Taco Fiesta',
            description: 'Authentic Mexican tacos, burritos, and traditional dishes.',
            address: '321 Elm St, Westside',
            cuisine: 'Mexican',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.3,
            deliveryTime: '15-25 min',
            minimumOrder: 10,
            isOpen: true
          },
          {
            id: '5',
            name: 'Curry Corner',
            description: 'Spicy Indian curries, naan bread, and aromatic rice dishes.',
            address: '654 Maple Dr, Eastside',
            cuisine: 'Indian',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.6,
            deliveryTime: '35-50 min',
            minimumOrder: 18,
            isOpen: true
          },
          {
            id: '6',
            name: 'Pho Delight',
            description: 'Traditional Vietnamese pho and fresh spring rolls.',
            address: '987 Cedar Ln, Southside',
            cuisine: 'Vietnamese',
            imageUrl: '/api/placeholder/400/300',
            rating: 4.4,
            deliveryTime: '25-40 min',
            minimumOrder: 14,
            isOpen: true
          }
        ];
        setRestaurants(mockRestaurants);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
        case 'minimumOrder':
          return a.minimumOrder - b.minimumOrder;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FoodOrder</h1>
                <p className="text-xs text-gray-500">Delicious food, delivered</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'RESTAURANT' && (
                <Link
                  href="/restaurants/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Add Restaurant
                </Link>
              )}
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Amazing Restaurants
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            From local favorites to international cuisine, find the perfect place for your next meal
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Restaurants
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by restaurant name..."
                />
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                id="cuisine"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="minimumOrder">Lowest Minimum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCuisine('all');
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        {user?.role === 'RESTAURANT' && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Own a Restaurant?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our platform and reach thousands of hungry customers. Manage your menu, 
              track orders, and grow your business with our easy-to-use tools.
            </p>
            <Link
              href="/restaurants/create"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Add Your Restaurant
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
