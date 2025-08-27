'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    address: string;
    description?: string;
    phone?: string;
    cuisine?: string;
    imageUrl?: string;
    _count?: {
      menuItems: number;
    };
    menuItems?: Array<{
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    }>;
  };
  showMenuPreview?: boolean;
}

export default function RestaurantCard({ restaurant, showMenuPreview = false }: RestaurantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {restaurant.imageUrl ? (
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {restaurant.cuisine && (
          <span className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {restaurant.cuisine}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
          {restaurant._count && (
            <span className="text-sm text-gray-500">
              {restaurant._count.menuItems} items
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3">{restaurant.address}</p>
        
        {restaurant.description && (
          <p className="text-gray-700 mb-4 line-clamp-2">{restaurant.description}</p>
        )}

        {restaurant.phone && (
          <p className="text-sm text-gray-600 mb-4">
            📞 {restaurant.phone}
          </p>
        )}

        {showMenuPreview && restaurant.menuItems && restaurant.menuItems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Popular Items:</h4>
            <div className="space-y-2">
              {restaurant.menuItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-indigo-600 font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            View Menu
          </Link>
          <Link
            href={`/restaurants/${restaurant.id}/edit`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
