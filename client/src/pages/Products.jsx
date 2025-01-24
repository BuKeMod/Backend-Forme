import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useToast } from "../components/ui/use-toast"
import ProductDetail from '../components/ProductDetail';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { toast } = useToast()
  const isOutOfStock = !product || !product.price || !product.imageUrl;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`, // Changed from product.title to product.name
    })
  }

  const handleQuickView = () => {
    onQuickView(product);
    toast({
      title: "Quick view",
      description: `Viewing ${product.name} details.`, // Changed from product.title to product.name
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden group ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.imageUrl || '/placeholder-image.jpg'}
          alt={product.name || 'Product Image'}
          className={`object-cover w-full h-full transform transition-transform duration-500 ${
            isOutOfStock ? 'grayscale' : 'group-hover:scale-110'
          }`}
        />
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
        {/* Actions Overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-300"
            >
              <ShoppingCart size={20} />
            </motion.button>
            <motion.button
              onClick={handleAddToWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-300"
            >
              <Heart size={20} />
            </motion.button>
            <motion.button
              onClick={handleQuickView}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-300"
            >
              <Eye size={20} />
            </motion.button>
          </div>
        )}
      </div>

      <div className="p-6">
        <span className="text-sm text-indigo-500 font-semibold">
          {product.category || 'Uncategorized'}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-1">
          {product.name || 'Product Unavailable'}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {product.description || 'No description available'}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {product.price 
              ? `฿${product.price.toLocaleString()}` 
              : 'Price unavailable'}
          </span>
          <motion.button
            onClick={handleAddToCart}
            whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              isOutOfStock 
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');  // Changed default to 'All'
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/product');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json(); // Remove destructuring
      console.log('API Response:', data); // Add debug logging
      
      if (Array.isArray(data)) { // Handle direct array response
        setProducts(data);
      } else if (data.data && Array.isArray(data.data)) { // Handle nested data
        setProducts(data.data);
      } else {
        setProducts([]); 
        throw new Error('Invalid data format received');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err); // Add error logging
      setError(err.message);
      setProducts([]); // Set empty array on error
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products. Please try again later.",
      })
    }
  };

  // Add new function to check category availability
  const getCategoryAvailability = (category) => {
    if (category === 'All') return true;
    return products.some(product => 
      product.category && 
      product.category.toLowerCase() === category.toLowerCase() &&
      product.price && 
      product.imageUrl
    );
  };

  // Update filtered products logic
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => {
        const categoryMatch = product.category && 
          product.category.toLowerCase() === selectedCategory.toLowerCase();
        return categoryMatch || !product.category; // Include products without category
      });

  const categories = [
    'All',
    'Bed Sheet 3.5',
    'Bed Sheet 6',
    'Blanket 3.5',
    'Blanket 6',
    'Small Pillow',
    'Large Pillow',
    'Pillow Case'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // Add debug output
  console.log('Selected Category:', selectedCategory);
  console.log('Filtered Products:', filteredProducts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Our Products
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600"
        >
          Discover our collection of premium products
        </motion.p>
      </div>

      {/* Updated Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => {
            const isAvailable = getCategoryAvailability(category);
            return (
              <motion.button
                key={category}
                whileHover={isAvailable ? { scale: 1.05 } : {}}
                whileTap={isAvailable ? { scale: 0.95 } : {}}
                className={`px-6 py-2 rounded-full border-2 relative
                  ${selectedCategory === category 
                    ? 'bg-indigo-500 text-white border-indigo-500' 
                    : isAvailable
                      ? 'border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  } transition-colors duration-300`}
                onClick={() => isAvailable && setSelectedCategory(category)}
                disabled={!isAvailable}
              >
                {category}
                {!isAvailable && category !== 'All' && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(product) => {
                setSelectedProduct(product);
                setIsDetailOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Load More Button */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 shadow-lg"
        >
          Load More
        </motion.button>
      </div>
    </div>
  );
};

export default Products;
