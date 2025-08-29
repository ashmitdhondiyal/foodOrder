'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalRestaurants: number;
  averageOrderValue: number;
  orderCompletionRate: number;
}

interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

interface TopRestaurant {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface TopMenuItem {
  id: string;
  name: string;
  restaurant: string;
  orders: number;
  revenue: number;
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7d');

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    router.push('/unauthorized');
    return null;
  }

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalOrders: 1247,
    totalRevenue: 45678.90,
    totalUsers: 892,
    totalRestaurants: 45,
    averageOrderValue: 36.67,
    orderCompletionRate: 94.2
  };

  // Mock order trends data
  const orderTrends: OrderTrend[] = [
    { date: '2024-01-14', orders: 45, revenue: 1650.50 },
    { date: '2024-01-15', orders: 52, revenue: 1890.75 },
    { date: '2024-01-16', orders: 48, revenue: 1725.25 },
    { date: '2024-01-17', orders: 61, revenue: 2180.00 },
    { date: '2024-01-18', orders: 58, revenue: 2050.30 },
    { date: '2024-01-19', orders: 67, revenue: 2380.45 },
    { date: '2024-01-20', orders: 73, revenue: 2650.80 }
  ];

  // Mock top restaurants data
  const topRestaurants: TopRestaurant[] = [
    { id: '1', name: 'Pizza Palace', orders: 156, revenue: 5840.50, rating: 4.8 },
    { id: '2', name: 'Sushi Express', orders: 142, revenue: 6230.75, rating: 4.7 },
    { id: '3', name: 'Burger House', orders: 134, revenue: 4020.00, rating: 4.5 },
    { id: '4', name: 'Curry Corner', orders: 128, revenue: 3840.25, rating: 4.6 },
    { id: '5', name: 'Taco Fiesta', orders: 115, revenue: 2875.50, rating: 4.3 }
  ];

  // Mock top menu items data
  const topMenuItems: TopMenuItem[] = [
    { id: '1', name: 'Margherita Pizza', restaurant: 'Pizza Palace', orders: 89, revenue: 1335.00 },
    { id: '2', name: 'California Roll', restaurant: 'Sushi Express', orders: 76, revenue: 1520.00 },
    { id: '3', name: 'Classic Burger', restaurant: 'Burger House', orders: 68, revenue: 1020.00 },
    { id: '4', name: 'Butter Chicken', restaurant: 'Curry Corner', orders: 62, revenue: 930.00 },
    { id: '5', name: 'Beef Tacos', restaurant: 'Taco Fiesta', orders: 58, revenue: 725.00 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="mt-2 text-gray-600">Comprehensive insights into your food delivery platform</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.totalOrders)}</p>
                <p className="text-xs text-green-600">+12.5% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <p className="text-xs text-green-600">+8.3% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.totalUsers)}</p>
                <p className="text-xs text-green-600">+5.2% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Restaurants</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.totalRestaurants)}</p>
                <p className="text-xs text-green-600">+2 new this period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
                <p className="text-xs text-green-600">+3.1% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.orderCompletionRate}%</p>
                <p className="text-xs text-green-600">+1.2% from last period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trends</h3>
            <div className="space-y-3">
              {orderTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{trend.orders} orders</div>
                    <div className="text-xs text-gray-500">{formatCurrency(trend.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Restaurants</h3>
            <div className="space-y-3">
              {topRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {restaurant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-xs text-gray-500">⭐ {restaurant.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{restaurant.orders} orders</div>
                    <div className="text-xs text-gray-500">{formatCurrency(restaurant.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Menu Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topMenuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.restaurant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.orders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.revenue)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Order Hours</span>
                <span className="text-sm font-medium text-gray-900">6-8 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Most Popular Cuisine</span>
                <span className="text-sm font-medium text-gray-900">Italian</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Delivery Time</span>
                <span className="text-sm font-medium text-gray-900">28 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-medium text-gray-900">4.6/5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Growth Rate</span>
                <span className="text-sm font-medium text-green-600">+15.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="text-sm font-medium text-green-600">87.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New User Acquisition</span>
                <span className="text-sm font-medium text-green-600">+23.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Restaurant Onboarding</span>
                <span className="text-sm font-medium text-green-600">+8.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
