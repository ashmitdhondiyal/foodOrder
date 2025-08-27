'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import OrderTracking from './OrderTracking';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  estimatedTime?: string;
  specialInstructions?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  restaurant?: {
    id: string;
    name: string;
    address: string;
  };
  items: OrderItem[];
  payment?: {
    id: string;
    status: string;
    amount: number;
    processedAt?: string;
    createdAt: string;
  };
  delivery?: {
    id: string;
    status: string;
    assignedAt: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    deliveryNotes?: string;
    driver?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export default function OrderCard({ order, showActions = false }: OrderCardProps) {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PREPARING':
        return 'Preparing';
      case 'READY':
        return 'Ready for Pickup';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-6">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(order.createdAt)}
          </p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Restaurant/Customer Info */}
      {user?.role === 'CUSTOMER' && order.restaurant && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-900">{order.restaurant.name}</h4>
          <p className="text-sm text-gray-600">{order.restaurant.address}</p>
        </div>
      )}

      {user?.role === 'RESTAURANT' && order.customer && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
          <p className="text-sm text-gray-600">{order.customer.email}</p>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.menuItem.name}
              </span>
              <span className="text-gray-900 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-900 mb-1">Special Instructions:</h4>
          <p className="text-sm text-blue-800">{order.specialInstructions}</p>
        </div>
      )}

      {/* Estimated Time */}
      {order.estimatedTime && (
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <h4 className="font-medium text-green-900 mb-1">Estimated Ready Time:</h4>
          <p className="text-sm text-green-800">
            {formatDate(order.estimatedTime)}
          </p>
        </div>
      )}

      {/* Order Total */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-indigo-600">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Status */}
      {order.payment && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Payment Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.payment.status === 'SUCCESS' 
                ? 'bg-green-100 text-green-800' 
                : order.payment.status === 'FAILED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.payment.status}
            </span>
          </div>
          {order.payment.status === 'SUCCESS' && (
            <p className="text-xs text-gray-600 mt-1">
              Paid ${order.payment.amount.toFixed(2)} on {new Date(order.payment.processedAt || order.payment.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Order Tracking */}
      {user?.role === 'CUSTOMER' && (
        <div className="mb-4">
          <OrderTracking
            orderStatus={order.status}
            delivery={order.delivery}
            estimatedTime={order.estimatedTime}
          />
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-3">
          <Link
            href={`/orders/${order.id}`}
            className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
          
          {user?.role === 'RESTAURANT' && order.status === 'PENDING' && (
            <button
              onClick={() => {/* Handle status update */}}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirm Order
            </button>
          )}
        </div>
      )}
    </div>
  );
}
