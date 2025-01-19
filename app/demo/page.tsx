import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

const monthlyData = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 35 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 48 }
];

export default function Demo() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow grid lg:grid-cols-2">
        {/* Left Panel - Login */}
        <div className="flex flex-col h-full">
          <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-full">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0"></div>
                <h1 className="text-xl font-semibold">EXTRASTAFF360 PLATFORM</h1>
              </div>
              <p className="text-sm text-gray-500 ml-11">
                Connecting Companies, Agencies, and Staff on One Platform
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-1 flex mb-8">
              <button className="flex-1 py-2 px-4 rounded text-sm">Companies</button>
              <button className="flex-1 py-2 px-4 rounded text-sm">Agencies</button>
              <button className="flex-1 py-2 px-4 bg-white rounded shadow text-sm">Staff</button>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg"
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3 border rounded-lg"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  👁
                </button>
              </div>

              <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium">
                Login
              </button>

              <div className="relative text-center my-6">
                <hr className="my-3" />
                <span className="bg-white px-4 text-gray-500 text-sm relative -top-[1.75rem]">
                  OR
                </span>
              </div>

              <button className="w-full border p-3 rounded-lg flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <span>Sign up with Google</span>
              </button>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="terms-checkbox"
                  aria-label="Accept terms and privacy policy" 
                />
                <label 
                  htmlFor="terms-checkbox" 
                  className="text-sm text-gray-500"
                >
                  I agree to the Terms & Privacy
                </label>
              </div>
            </div>

            <p className="mt-auto pt-8 text-center text-sm text-gray-500">
              Don't have an account? <button className="text-blue-600">Sign up</button>
            </p>
          </div>
        </div>

        {/* Right Panel - Stats */}
        <div className="bg-blue-600 text-white relative">
          <div className="max-w-xl mx-auto w-full px-6 py-8">
            <h2 className="text-4xl font-bold mb-4">
              Powering Hospitality, One Extra Staff at a Time
            </h2>
            <p className="text-xl mb-8">
              Your Ideal Shift or Staff is Just a Click Away
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Active Staff</span>
                  <span className="text-green-400">+12%</span>
                </div>
                <div className="text-2xl font-bold">1,234</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Shifts</span>
                  <span className="text-green-400">+8%</span>
                </div>
                <div className="text-2xl font-bold">856</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Revenue</span>
                  <span className="text-green-400">+15%</span>
                </div>
                <div className="text-2xl font-bold">$45.2K</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Growth</span>
                  <span className="text-green-400">+5%</span>
                </div>
                <div className="text-2xl font-bold">23%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg h-64">
                <div className="text-sm mb-4">Weekly Performance</div>
                <LineChart width={300} height={200} data={monthlyData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Line type="monotone" dataKey="value" stroke="#fff" />
                </LineChart>
              </div>
              <div className="bg-white/10 p-4 rounded-lg h-64">
                <div className="text-sm mb-4">Monthly Trend</div>
                <LineChart width={300} height={200} data={monthlyData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Line type="monotone" dataKey="value" stroke="#fff" />
                </LineChart>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold">Active Jobs</div>
                <div>2,145 <span className="text-green-400">+12.5%</span></div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold">Staff Placed</div>
                <div>15,890 <span className="text-green-400">+8.3%</span></div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-bold">Companies</div>
                <div>450</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t">
        <div className="container mx-auto px-4">
          <span>© 2025 EXTRASTAFF360 ™️ | HOSPITALITY PLATFORM ©️</span>
          <div className="space-x-2 mt-1">
            <a href="/terms" className="hover:text-blue-600">Terms of Service</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            <span>|</span>
            <a href="/cookies" className="hover:text-blue-600">Cookies Policy</a>
            <span>|</span>
            <a href="/contact" className="hover:text-blue-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
