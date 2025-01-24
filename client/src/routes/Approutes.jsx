import Layout from '@/layouts/Layout';
import Product from '@/pages/admin/Product';
import Home from '@/pages/Home';
import NotFound from '@/pages/Notfound';
import Profile from '@/pages/user/Profile';
import Products from '@/pages/Products';
import Cart from '@/pages/Cart';
import Payment from '@/pages/Payment';
import ShippingPage from '../pages/ShippingPage';

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { 
  SignIn, 
  SignUp, 
  SignedIn, 
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { clerkTheme } from '../utils/clerkTheme';

const PrivateRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const Approutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} /> {/* Add Cart route */}
          <Route path="/payment" element={<Payment />} /> {/* Make sure this route exists */}
          <Route path="/shipping" element={<ShippingPage />} /> {/* Add ShippingPage route */}
          
          {/* Auth Routes */}
          <Route
            path="/sign-in/*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-4">
                <SignIn 
                  routing="path" 
                  path="/sign-in" 
                  appearance={{
                    baseTheme: clerkTheme,
                    elements: {
                      rootBox: "w-full max-w-md mx-auto",
                      card: "bg-white rounded-2xl shadow-2xl p-8",
                      socialButtons: "gap-4",
                      socialButtonsIconButton: 
                        "flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600",
                      formButtonPrimary: 
                        "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg",
                    }
                  }}
                />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-4">
                <SignUp 
                  routing="path" 
                  path="/sign-up" 
                  appearance={{
                    baseTheme: clerkTheme,
                    elements: {
                      rootBox: "w-full max-w-md mx-auto",
                      card: "bg-white rounded-2xl shadow-2xl p-8",
                      socialButtons: "gap-4",
                      socialButtonsIconButton: 
                        "flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600",
                      formButtonPrimary: 
                        "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg",
                    }
                  }}
                />
              </div>
            }
          />

          {/* Protected User Routes */}
          <Route path="user" element={<PrivateRoute><Profile /></PrivateRoute>}>
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route 
            path="admin" 
            element={<PrivateRoute><Outlet /></PrivateRoute>}
          >
            <Route path="addProduct" element={<Product />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Approutes;