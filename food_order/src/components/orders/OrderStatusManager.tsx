'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OrderStatusManagerProps {
  currentStatus: string;
  onStatusUpdate: (status: string, estimatedTime?: string) => Promise<void>;
}

export default function OrderStatusManager({  currentStatus, onStatusUpdate }: OrderStatusManagerProps) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');

  if (user?.role !== 'RESTAURANT') {
    return null;
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
      default:
        return null;
    }
  };

  const getStatusButtonText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirm Order';
      case 'PREPARING':
        return 'Start Preparing';
      case 'READY':
        return 'Mark as Ready';
      default:
        return 'Update Status';
    }
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600 hover:bg-green-700';
      case 'PREPARING':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'READY':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(nextStatus, estimatedTime || undefined);
      setEstimatedTime('');
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate('CANCELLED');
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus(currentStatus);
  const canUpdate = nextStatus && currentStatus !== 'CANCELLED' && currentStatus !== 'READY';

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Management</h3>
      
      {/* Current Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
        <div className="px-3 py-2 bg-gray-100 rounded-md">
          <span className="font-medium text-gray-900">{currentStatus}</span>
        </div>
      </div>

      {/* Status Flow */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Status Flow</label>
        <div className="flex items-center space-x-2">
          {['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].map((status, index) => (
            <React.Fragment key={status}>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === currentStatus 
                  ? 'bg-indigo-600 text-white' 
                  : status === 'READY' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
              }`}>
                {status}
              </div>
              {index < 3 && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Estimated Time Input */}
      {nextStatus === 'CONFIRMED' && (
        <div className="mb-4">
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Ready Time
          </label>
          <input
            type="datetime-local"
            id="estimatedTime"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Let customers know when their order will be ready
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canUpdate && (
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className={`w-full px-4 py-2 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getStatusButtonColor(nextStatus!)}`}
          >
            {isUpdating ? 'Updating...' : getStatusButtonText(nextStatus!)}
          </button>
        )}

        {currentStatus === 'PENDING' && (
          <button
            onClick={handleCancelOrder}
            disabled={isUpdating}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}

        {currentStatus === 'READY' && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-center">
            <span className="font-medium">Order is ready for pickup!</span>
          </div>
        )}

        {currentStatus === 'CANCELLED' && (
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md text-center">
            <span className="font-medium">Order has been cancelled</span>
          </div>
        )}
      </div>
    </div>
  );
}
