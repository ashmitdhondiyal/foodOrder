'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryInfo {
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
}

interface OrderTrackingProps {
  orderStatus: string;
  delivery?: DeliveryInfo;
  estimatedTime?: string;
}

export default function OrderTracking({ orderStatus, delivery, estimatedTime }: OrderTrackingProps) {
  const { user } = useAuth();

  const getOrderStepStatus = (step: string) => {
    switch (step) {
      case 'PENDING':
        return orderStatus === 'PENDING' ? 'current' : 
               ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus) ? 'completed' : 'pending';
      case 'CONFIRMED':
        return orderStatus === 'CONFIRMED' ? 'current' : 
               ['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus) ? 'completed' : 'pending';
      case 'PREPARING':
        return orderStatus === 'PREPARING' ? 'current' : 
               ['READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus) ? 'completed' : 'pending';
      case 'READY':
        return orderStatus === 'READY' ? 'current' : 
               ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(orderStatus) ? 'completed' : 'pending';
      case 'DELIVERY':
        return orderStatus === 'OUT_FOR_DELIVERY' ? 'current' : 
               orderStatus === 'DELIVERED' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const getDeliveryStepStatus = (step: string) => {
    if (!delivery) return 'pending';
    
    switch (step) {
      case 'ASSIGNED':
        return delivery.status === 'ASSIGNED' ? 'current' : 
               ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.status) ? 'completed' : 'pending';
      case 'PICKED_UP':
        return delivery.status === 'PICKED_UP' ? 'current' : 
               ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.status) ? 'completed' : 'pending';
      case 'OUT_FOR_DELIVERY':
        return delivery.status === 'OUT_FOR_DELIVERY' ? 'current' : 
               delivery.status === 'DELIVERED' ? 'completed' : 'pending';
      case 'DELIVERED':
        return delivery.status === 'DELIVERED' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const getStepIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = () => {
    if (delivery?.estimatedDeliveryTime) {
      return formatDateTime(delivery.estimatedDeliveryTime);
    }
    if (estimatedTime) {
      return formatDateTime(estimatedTime);
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
      
      {/* Restaurant Progress */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Restaurant Progress</h4>
        <div className="space-y-4">
          {[
            { step: 'PENDING', label: 'Order Placed', description: 'Your order has been received' },
            { step: 'CONFIRMED', label: 'Order Confirmed', description: 'Restaurant has confirmed your order' },
            { step: 'PREPARING', label: 'Preparing Food', description: 'Chef is cooking your meal' },
            { step: 'READY', label: 'Ready for Pickup', description: 'Your food is ready!' }
          ].map((stepInfo, index) => {
            const status = getOrderStepStatus(stepInfo.step);
            return (
              <div key={stepInfo.step} className="flex items-start space-x-3">
                {getStepIcon(status)}
                <div className="flex-1">
                  <p className={`font-medium ${status === 'completed' ? 'text-green-600' : status === 'current' ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {stepInfo.label}
                  </p>
                  <p className="text-sm text-gray-600">{stepInfo.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Progress */}
      {delivery && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-4">Delivery Progress</h4>
          <div className="space-y-4">
            {[
              { step: 'ASSIGNED', label: 'Driver Assigned', description: 'Delivery partner assigned to your order' },
              { step: 'PICKED_UP', label: 'Order Picked Up', description: 'Driver has collected your order' },
              { step: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Driver is on the way to you' },
              { step: 'DELIVERED', label: 'Delivered', description: 'Order has been delivered!' }
            ].map((stepInfo) => {
              const status = getDeliveryStepStatus(stepInfo.step);
              return (
                <div key={stepInfo.step} className="flex items-start space-x-3">
                  {getStepIcon(status)}
                  <div className="flex-1">
                    <p className={`font-medium ${status === 'completed' ? 'text-green-600' : status === 'current' ? 'text-indigo-600' : 'text-gray-500'}`}>
                      {stepInfo.label}
                    </p>
                    <p className="text-sm text-gray-600">{stepInfo.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Information */}
      {delivery && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-blue-900 mb-3">Delivery Details</h4>
          
          {delivery.driver && (
            <div className="mb-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Driver:</span> {delivery.driver.name}
              </p>
            </div>
          )}

          {getEstimatedTime() && (
            <div className="mb-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Estimated Delivery:</span> {getEstimatedTime()}
              </p>
            </div>
          )}

          {delivery.assignedAt && (
            <div className="mb-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Assigned:</span> {formatDateTime(delivery.assignedAt)}
              </p>
            </div>
          )}

          {delivery.pickedUpAt && (
            <div className="mb-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Picked Up:</span> {formatDateTime(delivery.pickedUpAt)}
              </p>
            </div>
          )}

          {delivery.deliveredAt && (
            <div className="mb-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Delivered:</span> {formatDateTime(delivery.deliveredAt)}
              </p>
            </div>
          )}

          {delivery.deliveryNotes && (
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Notes:</span> {delivery.deliveryNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Estimated Time (if no delivery assigned yet) */}
      {!delivery && getEstimatedTime() && (
        <div className="bg-green-50 p-4 rounded-md">
          <h4 className="font-medium text-green-900 mb-2">Estimated Ready Time</h4>
          <p className="text-sm text-green-800">{getEstimatedTime()}</p>
        </div>
      )}

      {/* Current Status Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
        <p className="text-sm text-gray-700">
          {orderStatus === 'DELIVERED' && delivery ? 
            'Your order has been delivered successfully!' :
            orderStatus === 'OUT_FOR_DELIVERY' && delivery ? 
            'Your order is on its way to you!' :
            `Your order is currently: ${orderStatus.toLowerCase()}`
          }
        </p>
      </div>
    </div>
  );
}
