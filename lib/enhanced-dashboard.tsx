import React, { useState } from 'react';
import { 
  Bell, Calendar, ChevronDown, Clock, DollarSign, 
  Users, Building, Settings, LogOut, TrendingUp,
  Briefcase, UserCheck, Award
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Sample data for visualizations
const revenueData = [
  { month: 'Jan', revenue: 45000, shifts: 280 },
  { month: 'Feb', revenue: 52000, shifts: 290 },
  { month: 'Mar', revenue: 49000, shifts: 285 },
  { month: 'Apr', revenue: 58000, shifts: 305 },
  { month: 'May', revenue: 55000, shifts: 300 },
  { month: 'Jun', revenue: 62000, shifts: 320 }
];

const staffingData = [
  { name: 'Mon', completed: 85, scheduled: 95 },
  { name: 'Tue', completed: 88, scheduled: 92 },
  { name: 'Wed', completed: 92, scheduled: 98 },
  { name: 'Thu', completed: 86, scheduled: 90 },
  { name: 'Fri', completed: 95, scheduled: 100 },
  { name: 'Sat', completed: 90, scheduled: 95 },
  { name: 'Sun', completed: 82, scheduled: 88 }
];

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Enhanced with gradient background */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">EXTRASTAFF360</h2>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {[
              { icon: Users, label: 'Dashboard', id: 'dashboard' },
              { icon: Calendar, label: 'Shifts', id: 'shifts' },
              { icon: Clock, label: 'Timesheet', id: 'timesheet' },
              { icon: DollarSign, label: 'Payments', id: 'payments' },
              { icon: Building, label: 'Venues', id: 'venues' }
            ].map((item) => (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg ${
                  activePage === item.id 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-blue-700'
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Enhanced Header with Gradient */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Dashboard Content */}
        <main className="p-8">
          {/* Refined Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
              { icon: UserCheck, label: 'Active Staff', value: '245', color: 'blue' },
              { icon: Briefcase, label: 'Open Shifts', value: '18', color: 'green' },
              { icon: Clock, label: 'Hours This Month', value: '1,240', color: 'purple' },
              { icon: TrendingUp, label: 'Revenue MTD', value: '$24.5k', color: 'yellow' }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Staffing Performance */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Staffing Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={staffingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10b981" name="Completed Shifts" />
                  <Bar dataKey="scheduled" fill="#6366f1" name="Scheduled Shifts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Activity Sections */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                {/* Activity items would go here */}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Shifts</h3>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                {/* Shifts items would go here */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;