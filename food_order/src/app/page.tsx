'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Home() {
  const { user, logout } = useAuth();
  const { hasItems, getTotalItems, getTotalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header with Auth */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FoodOrder</h1>
                <p className="text-xs text-gray-500">Delicious food, delivered</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Shopping Cart Icon */}
              {user?.role === 'CUSTOMER' && hasItems && (
                <Link
                  href="/cart"
                  className="relative bg-indigo-100 p-2 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042h1.096a1 1 0 00.01-.042L6.34 3H19a1 1 0 000-2H3zM18 5H4.72l-.5 2H17l-.5-2zM6 14a1 1 0 100 2 1 1 0 000-2zm0 0a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm0 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                </Link>
              )}

              {user ? (
                <>
                  <span className="text-gray-700 hidden sm:block">Welcome, {user.name}!</span>
                  <Link
                    href="/dashboard"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Order Delicious Food
            <span className="block text-indigo-200">Delivered to Your Door</span>
          </h1>
                       <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
               Discover amazing restaurants, browse delicious menus, and enjoy hassle-free food delivery. 
               From local favorites to international cuisine, we&apos;ve got your cravings covered.
             </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/restaurants"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Browse Restaurants
            </Link>
            {!user && (
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FoodOrder?</h2>
                           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                 We&apos;re not just another food delivery app. We&apos;re your culinary companion, 
                 connecting you with the best restaurants and ensuring every meal is memorable.
               </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from hundreds of restaurants offering diverse cuisines, from local favorites 
                to international delights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered quickly with our efficient delivery network. 
                Track your order in real-time from kitchen to doorstep.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Pay securely with multiple payment options. Your financial information 
                is protected with bank-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Getting delicious food delivered is as easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Restaurant</h3>
              <p className="text-gray-600">
                Browse our curated selection of restaurants and find the perfect place 
                for your next meal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Food</h3>
              <p className="text-gray-600">
                Explore menus, customize your order, and add items to your cart 
                with just a few taps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enjoy Delivery</h3>
              <p className="text-gray-600">
                Place your order, track delivery progress, and enjoy your delicious 
                meal delivered to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h2>
                           <p className="text-xl text-gray-600">
                 Whether you&apos;re a food lover, restaurant owner, or delivery partner, 
                 we have a place for you.
               </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customers */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Food Lovers</h3>
                <p className="text-gray-600 mb-6">
                  Discover amazing restaurants and enjoy delicious food delivered to your door.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/restaurants"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Restaurants
                </Link>
                {user?.role === 'CUSTOMER' && (
                  <Link
                    href="/orders"
                    className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors font-medium border border-blue-600"
                  >
                    View My Orders
                  </Link>
                )}
              </div>
            </div>
            
            {/* Restaurants */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Owners</h3>
                <p className="text-gray-600 mb-6">
                  Grow your business with our platform. Manage orders, menus, and reach more customers.
                </p>
              </div>
              <div className="space-y-3">
                {user?.role === 'RESTAURANT' ? (
                  <>
                    <Link
                      href="/restaurants/create"
                      className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg text-center hover:bg-green-700 transition-colors font-medium"
                    >
                      Manage Restaurant
                    </Link>
                    <Link
                      href="/orders"
                      className="block w-full bg-white text-green-600 px-6 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors font-medium border border-green-600"
                    >
                      View Orders
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/register"
                    className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg text-center hover:bg-green-700 transition-colors font-medium"
                  >
                    Join as Restaurant
                  </Link>
                )}
              </div>
            </div>
            
            {/* Admins */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl border border-purple-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">System Admins</h3>
                <p className="text-gray-600 mb-6">
                  Monitor system performance, manage users, and ensure smooth operations.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-700 transition-colors font-medium"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Ordering?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of satisfied customers who trust FoodOrder for their daily meals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/restaurants"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Explore Restaurants
            </Link>
            {!user && (
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">FoodOrder</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting food lovers with amazing restaurants. Delicious meals delivered 
                to your doorstep with convenience and care.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                {user?.role === 'CUSTOMER' && (
                  <li>
                    <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                      Cart
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                {user ? (
                  <>
                    <li>
                      <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        My Account
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="text-gray-400 hover:text-white transition-colors text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 FoodOrder. All rights reserved. Made with ❤️ for food lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
