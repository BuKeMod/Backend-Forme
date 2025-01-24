import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import PaymentResult from '../components/PaymentResult';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';

const PaymentVerification = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [debugResponse, setDebugResponse] = useState(null);
  const { getCartTotal } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setDebugResponse(null);
    
    if (!selectedFile) {
      toast.error('Please select a file first');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('receipt', selectedFile);
    formData.append('amount', getCartTotal().toString());

    try {
      console.log('Sending verification request...');
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!responseText) {
        throw new Error('Empty response received');
      }

      let result;
      try {
        result = JSON.parse(responseText);
        setDebugResponse(result); // Store raw response for debugging
      } catch (parseError) {
        console.error('Parse error:', parseError);
        toast.error('Invalid response format from server');
        return;
      }

      console.log('Parsed result:', result);
      
      if (result.status === 'success') {
        setVerificationResult(result);
        toast.success('Processing payment verification...');
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(`Failed to process payment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Payment</h2>
        <p className="text-gray-600 mt-2">Upload your payment slip to confirm the transaction</p>
      </div>

      {!verificationResult ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-colors
                ${selectedFile 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-indigo-500'}`}
            >
              <input
                type="file"
                name="receipt"
                accept="image/*"
                required
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center">
                <Upload 
                  className={`w-12 h-12 mx-auto mb-4 ${
                    selectedFile ? 'text-green-500' : 'text-gray-400'
                  }`} 
                />
                {selectedFile ? (
                  <>
                    <p className="text-green-600 font-medium">File selected</p>
                    <p className="text-sm text-green-500 mt-1">{selectedFile.name}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium">Drop your receipt here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Amount to verify:</p>
              <p className="text-lg font-semibold text-gray-800">
                ฿{getCartTotal().toLocaleString()}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className={`w-full p-4 rounded-xl font-medium flex items-center justify-center
                ${isLoading || !selectedFile
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'
                }`}
              onClick={handleFileUpload} // Add direct click handler
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                'Verify Payment'
              )}
            </button>

            {/* Add Debug Panel */}
            {debugResponse && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg text-white">
                <h3 className="text-sm font-semibold mb-2">Debug Response:</h3>
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugResponse, null, 2)}
                </pre>
              </div>
            )}
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <PaymentResult 
            paymentDetails={verificationResult.paymentDetails}
            paymentStatus={verificationResult.paymentStatus}
          />
        </motion.div>
      )}
    </div>
  );
};

export default PaymentVerification;
