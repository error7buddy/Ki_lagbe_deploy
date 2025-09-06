import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 text-2xl font-bold text-gray-900">
              合Basa Lagbe?
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
              <Link to="/advertise" className="text-gray-700 hover:text-gray-900 font-medium">Advertise</Link>
            </div>
          </div>

          {/* Right side - Business Links and Login */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <Link to="#" className="text-gray-700 hover:text-gray-900 font-medium">Manage rentals</Link>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors font-medium">
              Login
            </button>

            <button className="md:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-gray-900">About</Link>
          <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Rent</a>
          <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Sell</a>
          <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Mortgage</a>
          <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Manage rentals</a>
          <Link to="/advertise" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Advertise</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
