import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext'; // Update path
import PaymentVerification from './PaymentVerification';

const Payment = () => {
  const { getCartTotal } = useCart();

  const getQRCodeUrl = (amount) => {
    const baseUrl = new URL('https://promptpay.io');
    const qrPath = new URL('/1104200277708', baseUrl);
    qrPath.searchParams.append('amount', amount);
    return qrPath.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
            <p className="text-gray-600 mt-2">Total: ฿{getCartTotal().toLocaleString()}</p>
          </div>

          <div className="text-center">
            <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
              <img 
                src={getQRCodeUrl(getCartTotal())}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your banking app to pay
            </p>
          </div>
        </motion.div>

        <PaymentVerification />
      </div>
    </div>
  );
};

export default Payment;
