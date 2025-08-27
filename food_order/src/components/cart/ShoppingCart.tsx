'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartItem from './CartItem';
import { useRouter } from 'next/navigation';

export default function ShoppingCart() {
  const { items, clearCart, getTotalItems, getTotalPrice, getRestaurantId } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      alert('Only customers can place orders');
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        restaurantId: getRestaurantId()!,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        })),
        specialInstructions
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Order placed successfully!');
        clearCart();
        router.push(`/orders/${result.order.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042h1.096a1 1 0 00.01-.042L6.34 3H19a1 1 0 000-2H3zM18 5H4.72l-.5 2H17l-.5-2zM6 14a1 1 0 100 2 1 1 0 000-2zm0 0a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm0 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">Start adding some delicious items to get started!</p>
        <button
          onClick={() => router.push('/restaurants')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} from {items[0]?.restaurantName}
        </p>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Special Instructions */}
      <div className="mb-6">
        <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          id="specialInstructions"
          rows={3}
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Any special requests or dietary requirements..."
        />
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Subtotal</span>
          <span className="text-lg font-semibold text-gray-900">${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">Items</span>
          <span className="text-sm text-gray-600">{getTotalItems()}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-indigo-600">${getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearCart}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Cart
            </button>
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCheckingOut ? 'Placing Order...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
