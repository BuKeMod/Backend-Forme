import Logo from './Logo'
import Searchbar from './Searchbar'
import DropdownList from './DropdownList'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const { isSignedIn, user } = useUser()
  const location = useLocation()

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
  ]

  const isActiveLink = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Searchbar />
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActiveLink(item.path)
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-blue-600'
                } transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
            
            {isSignedIn ? (
              <>
                <button className="relative p-2">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    0
                  </span>
                </button>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/user/profile"
                    className={`text-sm ${
                      isActiveLink('/user/profile') 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {user.firstName || user.emailAddresses[0].emailAddress}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate('/sign-in')}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Searchbar />
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActiveLink(item.path)
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isSignedIn ? (
                <>
                  <Link 
                    to="/user/profile"
                    className={`text-sm ${
                      isActiveLink('/user/profile') 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/sign-in');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar