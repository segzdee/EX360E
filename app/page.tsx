"use client";

import React from "react";

const HomePage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white p-8">
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </div>
        {/* Title and Subtitle */}
        <h1 className="text-2xl font-bold mb-4">EXTRASTAFF360 PLATFORM</h1>
        <p className="text-gray-600 mb-6 text-center">
          Connecting Companies, Agencies, and Staff on One Platform
        </p>
        {/* Tabs */}
        <div className="flex mb-4">
          <button className="px-4 py-2 border-b-2 border-gray-300 hover:border-blue-500">
            Companies
          </button>
          <button className="px-4 py-2 border-b-2 border-gray-300 hover:border-blue-500">
            Agencies
          </button>
          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-500">
            Staff
          </button>
        </div>
        {/* Login Form */}
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end text-sm text-blue-500 mb-4">
            <a href="#">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <button
            type="button"
            className="w-full flex justify-center items-center border border-gray-300 py-2 px-4 rounded hover:bg-gray-100"
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account? <a href="#" className="text-blue-500">Sign up</a>
          </p>
        </form>
        <p className="text-gray-400 text-xs mt-8">
          © 2025 EXTRASTAFF360™ | HOSPITALITY PLATFORM
          <br />
          <a href="#" className="text-blue-500">Terms of Service</a> | <a href="#" className="text-blue-500">Privacy</a> | <a href="#" className="text-blue-500">Cookies Policy</a> | <a href="#" className="text-blue-500">Contact Us</a>
        </p>
      </div>
      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Powering Hospitality, One Extra Staff at a Time
        </h1>
        <p className="text-lg mb-8 text-center">
          Your Ideal Shift or Staff is Just a Click Away
        </p>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-500 p-4 rounded text-center">
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm">Active Staff</p>
          </div>
          <div className="bg-blue-500 p-4 rounded text-center">
            <p className="text-2xl font-bold">$45.2K</p>
            <p className="text-sm">Revenue</p>
          </div>
          <div className="bg-blue-500 p-4 rounded text-center">
            <p className="text-2xl font-bold">856</p>
            <p className="text-sm">Shifts</p>
          </div>
          <div className="bg-blue-500 p-4 rounded text-center">
            <p className="text-2xl font-bold">23%</p>
            <p className="text-sm">Growth</p>
          </div>
        </div>
        {/* Graphs */}
        <div className="flex flex-col w-full max-w-lg">
          <div className="bg-blue-500 rounded p-4 text-center mb-4">
            Weekly Performance (Graph Placeholder)
          </div>
          <div className="bg-blue-500 rounded p-4 text-center">
            Monthly Trend (Graph Placeholder)
          </div>
        </div>
        <p className="mt-8 text-sm text-center">
          Active Jobs <span className="font-bold">+2,145</span> (+12.5%) | Staff Placed <span className="font-bold">15,890</span> (+8.3%) | Companies <span className="font-bold">450</span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;