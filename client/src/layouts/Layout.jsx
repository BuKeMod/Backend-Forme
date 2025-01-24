import Navbar from '@/components/navbar/Navbar'
import React from 'react'
import { Outlet } from 'react-router'
import { Toaster } from "@/components/ui/toaster"
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Layout = () => {
  const { getCartCount } = useCart();
  
  return (
    <main>
      <div className="fixed top-4 right-4 z-50">
        <Link 
          to="/cart" 
          className="relative inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ShoppingCart className="h-6 w-6" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
              {getCartCount()}
            </span>
          )}
        </Link>
      </div>
      <Navbar />
      <Outlet />
      <Toaster />
    </main>
  )
}

export default Layout;