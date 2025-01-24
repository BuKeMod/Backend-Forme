import express from 'express';

import { getProducts,getProductById }  from '../controllers/product.js';
const router = express.Router();

// GET all products
router.get('/product', getProducts);

// GET single product by ID
router.get('/product/:id',getProductById);

// POST create new product
// router.post('/', createProduct);

// PUT update product
// router.put('/:id', productController.updateProduct);

// DELETE product
// router.delete('/:id', productController.deleteProduct);
export default router