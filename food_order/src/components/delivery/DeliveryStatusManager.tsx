'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryStatusManagerProps {
  deliveryId: string;
  currentStatus: string;
  onStatusUpdate: (status: string, notes?: string) => Promise<void>;
}

export default function DeliveryStatusManager({ currentStatus, onStatusUpdate }: DeliveryStatusManagerProps) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  if (user?.role !== 'DELIVERY') {
    return null;
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ASSIGNED':
        return 'PICKED_UP';
      case 'PICKED_UP':
        return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const getStatusButtonText = (status: string) => {
    switch (status) {
      case 'PICKED_UP':
        return 'Mark as Picked Up';
      case 'OUT_FOR_DELIVERY':
        return 'Start Delivery';
      case 'DELIVERED':
        return 'Mark as Delivered';
      default:
        return 'Update Status';
    }
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case 'PICKED_UP':
        return 'bg-green-600 hover:bg-green-700';
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'DELIVERED':
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
      await onStatusUpdate(nextStatus, deliveryNotes || undefined);
      setDeliveryNotes('');
    } catch (error) {
      console.error('Error updating delivery status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelDelivery = async () => {
    if (!confirm('Are you sure you want to cancel this delivery?')) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate('CANCELLED', deliveryNotes || undefined);
      setDeliveryNotes('');
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFailedDelivery = async () => {
    if (!confirm('Are you sure you want to mark this delivery as failed?')) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate('FAILED', deliveryNotes || undefined);
      setDeliveryNotes('');
    } catch (error) {
      console.error('Error marking delivery as failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus(currentStatus);
  const canUpdate = nextStatus && currentStatus !== 'CANCELLED' && currentStatus !== 'FAILED' && currentStatus !== 'DELIVERED';

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Status Management</h3>
      
      {/* Current Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
        <div className="px-3 py-2 bg-gray-100 rounded-md">
          <span className="font-medium text-gray-900">{currentStatus}</span>
        </div>
      </div>

      {/* Delivery Flow */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Flow</label>
        <div className="flex items-center space-x-2">
          {['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status, index) => (
            <React.Fragment key={status}>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === currentStatus 
                  ? 'bg-indigo-600 text-white' 
                  : status === 'DELIVERED' 
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

      {/* Delivery Notes */}
      <div className="mb-6">
        <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Notes (Optional)
        </label>
        <textarea
          id="deliveryNotes"
          rows={3}
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add any notes about the delivery..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Include any relevant information for customers or admin
        </p>
      </div>

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

        {currentStatus === 'ASSIGNED' && (
          <div className="space-y-2">
            <button
              onClick={handleCancelDelivery}
              disabled={isUpdating}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Cancelling...' : 'Cancel Delivery'}
            </button>
            <button
              onClick={handleFailedDelivery}
              disabled={isUpdating}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Marking...' : 'Mark as Failed'}
            </button>
          </div>
        )}

        {currentStatus === 'DELIVERED' && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-center">
            <span className="font-medium">Delivery completed successfully!</span>
          </div>
        )}

        {(currentStatus === 'CANCELLED' || currentStatus === 'FAILED') && (
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md text-center">
            <span className="font-medium">
              Delivery has been {currentStatus.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
