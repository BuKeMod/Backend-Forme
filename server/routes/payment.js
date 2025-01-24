import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const SLIPOK_API_KEY = process.env.SLIPOK_API_KEY || 'your-api-key';
const SLIPOK_API_URL = process.env.SLIPOK_API_URL || 'apturl'

const verifyEndpoint = new URL(SLIPOK_API_URL);

// Add payment status tracking (temporary storage)
const paymentStore = new Map();

// Add helper function to store payment result
const storePaymentResult = (transRef, details) => {
  paymentStore.set(transRef, {
    ...details,
    storedAt: new Date().toISOString()
  });
};

// Add status route
router.get('/payment/status/:transRef', (req, res) => {
  const { transRef } = req.params;
  const paymentDetails = paymentStore.get(transRef);

  if (!paymentDetails) {
    return res.status(404).json({
      status: 'error',
      message: 'Payment record not found'
    });
  }

  res.json({
    status: 'success',
    data: paymentDetails
  });
});

// Add helper function to format payment details
const formatPaymentDetails = (data) => {
  if (!data) return null;
  try {
    return {
      transactionRef: data.transRef,
      timestamp: data.transTimestamp,
      amount: parseFloat(data.amount || 0),
      sender: {
        name: data.sender?.name || '',
        displayName: data.sender?.displayName || ''
      },
      receiver: {
        name: data.receiver?.name || '',
        displayName: data.receiver?.displayName || ''
      },
      status: "VERIFIED",
      details: {
        date: data.transDate || '',
        time: data.transTime || '',
        sendingBank: data.sendingBank || '',
        receivingBank: data.receivingBank || '',
        qrCode: data.qrcodeData || ''
      }
    };
  } catch (error) {
    console.error('Error formatting payment details:', error);
    return null;
  }
};

// Add upload directory path configuration
const UPLOAD_DIR = path.join(dirname(fileURLToPath(import.meta.url)), '../uploads/receipts');

// Ensure upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Update storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `receipt-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Update upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('receipt'); // Match the field name with client-side

// Update the success check function
const isSuccessfulPayment = (result) => {
  return (
    result && 
    (result.success === true || result.status === 'success') && 
    result.data?.success === true
  );
};

router.post('/payment/verify', async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message || 'File upload failed'
      });
    }

    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      console.log('File received:', req.file);
      console.log('Amount received:', req.body.amount);

      const { amount } = req.body;
      console.log('Processing payment verification:', {
        amount,
        filepath: req.file.path
      });

      // Add file path logging
      console.log('Upload directory:', UPLOAD_DIR);
      console.log('File path:', req.file?.path);

      // Create FormData for SlipOK API
      const formData = new FormData();
      formData.append('files', fs.createReadStream(req.file.path));
      if (amount) {
        formData.append('amount', parseFloat(amount));
      }

      // Call SlipOK API with updated configuration
      const response = await fetch(verifyEndpoint.toString(), {
        method: 'POST',
        headers: {
          'x-authorization': SLIPOK_API_KEY,
          'Accept': 'application/json'
        },
        body: formData
      });

      let verificationResult;
      const responseText = await response.text();
      
      try {
        verificationResult = JSON.parse(responseText);
        console.log('Parsed verification result:', verificationResult);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Raw response:', responseText);
        throw new Error('Invalid JSON response from payment API');
      }

      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      if (isSuccessfulPayment(verificationResult)) {
        const paymentData = verificationResult.data;
        const paymentDetails = formatPaymentDetails(paymentData);

        const successResponse = {
          status: 'success',
          message: 'Payment verified successfully',
          transRef: paymentData.transRef,
          paymentStatus: {
            verified: true,
            timestamp: new Date().toISOString(),
            verificationMessage: paymentData.message || '✅'
          },
          paymentDetails
        };

        // Store payment result
        storePaymentResult(paymentData.transRef, successResponse);
        
        return res.json(successResponse);
      } else {
        console.error('Payment verification failed:', verificationResult);
        return res.status(400).json({
          status: 'error',
          message: 'Payment verification failed',
          details: verificationResult?.message || 'Unknown error',
          paymentStatus: {
            verified: false,
            timestamp: new Date().toISOString(),
            verificationMessage: 'Verification failed'
          }
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      // Clean up file if it exists
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Payment verification failed'
      });
    }
  });
});

export default router;
