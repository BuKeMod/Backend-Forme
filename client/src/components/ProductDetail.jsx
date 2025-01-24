import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { useToast } from "../components/ui/use-toast";
import { useCart } from '../contexts/CartContext';

const ProductDetail = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                  {/* Image Section */}
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                    <span className="text-indigo-600 font-semibold mt-2">{product.category}</span>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">฿{product.price?.toLocaleString()}</p>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600">{product.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail;
