'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DeliveryStatusManager from '@/components/delivery/DeliveryStatusManager';

interface Delivery {
  id: string;
  status: string;
  assignedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryNotes?: string;
  order: {
    id: string;
    status: string;
    createdAt: string;
    specialInstructions?: string;
    customer: {
      name: string;
      email: string;
      phone?: string;
    };
    restaurant: {
      name: string;
      address: string;
      phone?: string;
    };
    items: Array<{
      quantity: number;
      price: number;
      menuItem: {
        name: string;
        price: number;
      };
    }>;
  };
}

export default function DeliveryDashboardPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }

      const data = await response.json();
      setDeliveries(data.deliveries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-100 text-orange-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'Assigned';
      case 'PICKED_UP':
        return 'Picked Up';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
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

  const calculateOrderTotal = (items: Delivery['order']['items']) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filterStatus === 'all') return true;
    return delivery.status === filterStatus;
  });

  const activeDeliveries = deliveries.filter(delivery => 
    ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(delivery.status)
  );

  const completedDeliveries = deliveries.filter(delivery => 
    ['DELIVERED', 'CANCELLED', 'FAILED'].includes(delivery.status)
  );

  const handleDeliveryUpdated = async () => {
    await fetchDeliveries(); // Refresh the list
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['DELIVERY']}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your deliveries...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['DELIVERY']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name}! Manage your deliveries here.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDeliveries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{completedDeliveries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Deliveries List */}
          <div className="grid gap-6">
            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No deliveries found.</p>
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-lg shadow-md border p-6">
                  {/* Delivery Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Delivery #{delivery.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Assigned: {formatDate(delivery.assignedAt)}
                      </p>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {getStatusText(delivery.status)}
                    </span>
                  </div>

                  {/* Order Information */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Order ID:</span> {delivery.order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Customer:</span> {delivery.order.customer.name}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Restaurant:</span> {delivery.order.restaurant.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Order Status:</span> {delivery.order.status}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Order Date:</span> {formatDate(delivery.order.createdAt)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Total:</span> ${calculateOrderTotal(delivery.order.items).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-800">
                          <span className="font-medium">Customer:</span> {delivery.order.customer.name}
                        </p>
                        <p className="text-blue-800">
                          <span className="font-medium">Email:</span> {delivery.order.customer.email}
                        </p>
                        {delivery.order.customer.phone && (
                          <p className="text-blue-800">
                            <span className="font-medium">Phone:</span> {delivery.order.customer.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-blue-800">
                          <span className="font-medium">Restaurant:</span> {delivery.order.restaurant.name}
                        </p>
                        <p className="text-blue-800">
                          <span className="font-medium">Address:</span> {delivery.order.restaurant.address}
                        </p>
                        {delivery.order.restaurant.phone && (
                          <p className="text-blue-800">
                            <span className="font-medium">Phone:</span> {delivery.order.restaurant.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2 text-sm">
                      {delivery.order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
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
                  {delivery.order.specialInstructions && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                      <h4 className="font-medium text-yellow-900 mb-1">Special Instructions:</h4>
                      <p className="text-sm text-yellow-800">{delivery.order.specialInstructions}</p>
                    </div>
                  )}

                  {/* Delivery Status Manager */}
                  <div className="mb-4">
                    <DeliveryStatusManager
                      deliveryId={delivery.id} 
                      currentStatus={delivery.status}
                      onStatusUpdate={handleDeliveryUpdated}
                    />
                  </div>

                  {/* Delivery Progress */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Progress</h4>
                    <div className="space-y-2 text-sm">
                      {delivery.assignedAt && (
                        <p className="text-gray-600">
                          <span className="font-medium">Assigned:</span> {formatDate(delivery.assignedAt)}
                        </p>
                      )}
                      {delivery.pickedUpAt && (
                        <p className="text-gray-600">
                          <span className="font-medium">Picked Up:</span> {formatDate(delivery.pickedUpAt)}
                        </p>
                      )}
                      {delivery.deliveredAt && (
                        <p className="text-gray-600">
                          <span className="font-medium">Delivered:</span> {formatDate(delivery.deliveredAt)}
                        </p>
                      )}
                      {delivery.estimatedDeliveryTime && (
                        <p className="text-gray-600">
                          <span className="font-medium">Estimated Delivery:</span> {formatDate(delivery.estimatedDeliveryTime)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  {delivery.deliveryNotes && (
                    <div className="mb-4 p-3 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-900 mb-1">Your Notes:</h4>
                      <p className="text-sm text-green-800">{delivery.deliveryNotes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
