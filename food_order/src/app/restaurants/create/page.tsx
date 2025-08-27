'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantForm from '@/components/restaurants/RestaurantForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CreateRestaurantPage() {
  return (
    <ProtectedRoute allowedRoles={['RESTAURANT']}>
      <CreateRestaurantContent />
    </ProtectedRoute>
  );
}

function CreateRestaurantContent() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Restaurant created successfully!');
        router.push(`/restaurants/${result.restaurant.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create restaurant');
      }
    } catch (error) {
      throw error;
    }
  };

  if (user?.role !== 'RESTAURANT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Restaurant role required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Restaurant Profile</h1>
          <p className="text-gray-600 mt-2">
            Set up your restaurant profile to start accepting orders from customers.
          </p>
        </div>

        <RestaurantForm
          onSubmit={handleSubmit}
          mode="create"
        />
      </div>
    </div>
  );
}
