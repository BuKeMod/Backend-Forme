import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext'; // Update path

const PaymentResult = ({ paymentDetails, paymentStatus }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  useEffect(() => {
    if (paymentStatus?.verified) {
      toast.success('Payment verified successfully!', {
        onClose: () => {
          clearCart();
          navigate('/shipping');
        }
      });
    }
  }, [paymentStatus, navigate, clearCart]);

  if (!paymentDetails) return null;

  const formatDateTime = (date, time) => {
    try {
      const dateStr = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
      return format(new Date(`${dateStr}T${time}`), 'dd MMM yyyy HH:mm:ss');
    } catch (error) {
      return `${date} ${time}`;
    }
  };

  const isVerified = paymentStatus?.verified;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Payment Verification Result</h2>
        <CheckCircleIcon className={`h-8 w-8 ${isVerified ? 'text-green-500' : 'text-red-500'}`} />
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-md ${isVerified ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={isVerified ? 'text-green-600' : 'text-red-600'}>
              {isVerified ? 'Verified ✅' : 'Verification Failed ❌'}
            </span>
          </div>
          
          {paymentDetails.amount && (
            <div className="flex justify-between mt-2">
              <span className="font-medium">Amount:</span>
              <span className={isVerified ? 'text-green-600' : 'text-red-600'}>
                {paymentDetails.amount.toFixed(2)} THB
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="font-medium text-gray-700">Transaction Details</h3>
            <p className="text-sm text-gray-600">Ref: {paymentDetails.transactionRef}</p>
            <p className="text-sm text-gray-600">
              Date: {formatDateTime(paymentDetails.details.date, paymentDetails.details.time)}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Bank Details</h3>
            <p className="text-sm text-gray-600">From: {paymentDetails.details.sendingBank}</p>
            <p className="text-sm text-gray-600">To: {paymentDetails.details.receivingBank || 'N/A'}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-2">Sender Information</h3>
          <p className="text-sm text-gray-600">Name: {paymentDetails.sender.name}</p>
          <p className="text-sm text-gray-600">Display Name: {paymentDetails.sender.displayName}</p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-2">Receiver Information</h3>
          <p className="text-sm text-gray-600">Name: {paymentDetails.receiver.name}</p>
          <p className="text-sm text-gray-600">Display Name: {paymentDetails.receiver.displayName}</p>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
