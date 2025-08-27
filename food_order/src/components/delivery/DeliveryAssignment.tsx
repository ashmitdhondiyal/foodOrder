'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryDriver {
  id: string;
  name: string;
  email: string;
}

interface DeliveryAssignmentProps {
  orderId: string;
  onAssignmentComplete: () => void;
}

export default function DeliveryAssignment({ orderId, onAssignmentComplete }: DeliveryAssignmentProps) {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveryDrivers();
  }, []);

  const fetchDeliveryDrivers = async () => {
    try {
      const response = await fetch('/api/admin/users?role=DELIVERY', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers(data.users);
      } else {
        setError('Failed to fetch delivery drivers');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleAssignment = async () => {
    if (!selectedDriver) {
      setError('Please select a delivery driver');
      return;
    }

    setIsAssigning(true);
    setError(null);

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          orderId,
          driverId: selectedDriver,
          estimatedDeliveryTime: estimatedDeliveryTime || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Delivery assigned successfully!');
        onAssignmentComplete();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign delivery');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign delivery');
    } finally {
      setIsAssigning(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Delivery Partner</h3>
      
      {/* Driver Selection */}
      <div className="mb-4">
        <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-2">
          Select Delivery Driver *
        </label>
        <select
          id="driver"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Choose a driver...</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} ({driver.email})
            </option>
          ))}
        </select>
      </div>

      {/* Estimated Delivery Time */}
      <div className="mb-6">
        <label htmlFor="estimatedDeliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Delivery Time (Optional)
        </label>
        <input
          type="datetime-local"
          id="estimatedDeliveryTime"
          value={estimatedDeliveryTime}
          onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          min={new Date().toISOString().slice(0, 16)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Let customers know when to expect their delivery
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleAssignment}
        disabled={isAssigning || !selectedDriver}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAssigning ? 'Assigning...' : 'Assign Delivery'}
      </button>

      {/* Driver Information */}
      {drivers.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="text-sm">
            No delivery drivers found. Make sure you have users with the DELIVERY role.
          </p>
        </div>
      )}
    </div>
  );
}
