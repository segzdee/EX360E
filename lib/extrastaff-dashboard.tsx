import React, { useState } from 'react';
import { Bell, Calendar, ChevronDown, Clock, DollarSign, Users, Buildings, Settings, LogOut } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">EXTRASTAFF360</h2>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activePage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePage('dashboard')}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activePage === 'shifts' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePage('shifts')}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Shifts</span>
            </button>

            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activePage === 'timesheet' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePage('timesheet')}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Timesheet</span>
            </button>

            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activePage === 'payments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePage('payments')}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Payments</span>
            </button>

            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                activePage === 'venues' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePage('venues')}
            >
              <Buildings className="w-5 h-5" />
              <span className="font-medium">Venues</span>
            </button>
          </div>

          <div className="absolute bottom-0 w-64 border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <Bell className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">JD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Staff</p>
                  <p className="text-2xl font-semibold">245</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open Shifts</p>
                  <p className="text-2xl font-semibold">18</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours This Month</p>
                  <p className="text-2xl font-semibold">1,240</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue MTD</p>
                  <p className="text-2xl font-semibold">$24.5k</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Section */}
          <Alert className="mb-8">
            <AlertTitle className="text-blue-600">
              Quick Tips for Getting Started
            </AlertTitle>
            <AlertDescription>
              Complete your profile, set your availability, and start browsing open shifts in your area.
            </AlertDescription>
          </Alert>

          {/* Additional Dashboard Content */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              {/* Activity content would go here */}
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Upcoming Shifts</h3>
              {/* Shifts content would go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;