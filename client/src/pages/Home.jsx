// import React from 'react'

// const Home = () => {
//   return (
//     <>

//       <div className="container mx-auto p-4">
//         <header className="text-center my-8">
//           <h1 className="text-4xl font-bold">Welcome to Our E-Commerce Store</h1>
//           <p className="text-lg mt-2">Find the best products at the best prices</p>
//         </header>
        
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="border p-4 rounded-lg shadow-lg">
//             <img src="https://via.placeholder.com/150" alt="Product 1" className="w-full h-48 object-cover rounded-t-lg" />
//             <h2 className="text-xl font-semibold mt-2">Product 1</h2>
//             <p className="text-gray-700 mt-1">$10.00</p>
//             <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Add to Cart</button>
//           </div>
//           <div className="border p-4 rounded-lg shadow-lg">
//             <img src="https://via.placeholder.com/150" alt="Product 2" className="w-full h-48 object-cover rounded-t-lg" />
//             <h2 className="text-xl font-semibold mt-2">Product 2</h2>
//             <p className="text-gray-700 mt-1">$20.00</p>
//             <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Add to Cart</button>
//           </div>
//           <div className="border p-4 rounded-lg shadow-lg">
//             <img src="https://via.placeholder.com/150" alt="Product 3" className="w-full h-48 object-cover rounded-t-lg" />
//             <h2 className="text-xl font-semibold mt-2">Product 3</h2>
//             <p className="text-gray-700 mt-1">$30.00</p>
//             <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Add to Cart</button>
//           </div>
//         </section>
//       </div>
//     </>
//   )
// }

// export default Home
import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Summer Collection 2024</h1>
            <p className="text-xl mb-8">Discover the latest trends and exclusive deals</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Electronics', 'Fashion', 'Home', 'Beauty'].map((category) => (
            <div key={category} className="group relative overflow-hidden rounded-lg cursor-pointer">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={`https://placehold.co/400x400?${category}`}
                  alt={category}
                  className="object-cover w-full h-full group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{category}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={`https://placehold.co/400x400?product=${i}`}
                  alt={`Product ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Product {i + 1}</h3>
                <p className="text-gray-600 mb-2">$99.99</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get the latest updates and exclusive offers</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home