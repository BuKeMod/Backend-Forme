import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingPage = () => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    reference: '',
    amount: 0
  });

  useEffect(() => {
    // Get payment details from localStorage
    const paymentRef = localStorage.getItem('paymentReference');
    const paymentAmount = localStorage.getItem('paymentAmount');

    if (!paymentRef || !paymentAmount) {
      // Redirect to payment page if no payment info
      navigate('/payment');
      return;
    }

    setPaymentInfo({
      reference: paymentRef,
      amount: parseFloat(paymentAmount)
    });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle shipping form submission
    // ... your shipping logic here ...
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
      <div className="bg-green-50 p-4 rounded-md mb-6">
        <p className="text-green-700">Payment Reference: {paymentInfo.reference}</p>
        <p className="text-green-700">Amount Paid: ฿{paymentInfo.amount}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Address</label>
          <textarea
            name="address"
            required
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Continue to Order Confirmation
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
