import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const weeklyData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 75 },
  { name: 'Wed', value: 85 },
  { name: 'Thu', value: 70 },
  { name: 'Fri', value: 90 },
  { name: 'Sat', value: 80 },
  { name: 'Sun', value: 75 },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = React.useState('Staff');

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel - Login */}
      <div className="w-1/2 px-16 py-12 flex flex-col justify-center bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg">
              <img src="/icon.png" alt="Logo" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 inline-block text-transparent bg-clip-text">
              EXTRASTAFF360 PLATFORM
            </h1>
            <p className="text-gray-600 text-lg">
              Connecting Companies, Agencies, and Staff on One Platform
            </p>
          </div>

          <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-xl">
            {['Companies', 'Agencies', 'Staff'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                    : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email address</label>
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl h-12"
              />
              <Button variant="link" className="mt-2 h-auto p-0 text-blue-600 font-medium">
                Forgot password?
              </Button>
            </div>

            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded-md text-blue-600 w-5 h-5" />
              <span className="text-sm text-gray-600">
                I agree to the <span className="text-blue-600 font-medium">Terms & Privacy</span>
              </span>
            </label>

            <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
              Login
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>

            <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <button className="font-medium text-blue-600 hover:text-blue-700">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Dashboard */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 px-16 py-12">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Powering Hospitality,{" "}
            <span className="bg-gradient-to-r from-blue-200 to-blue-100 text-transparent bg-clip-text">
              One Extra Staff at a Time
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 opacity-90">
            Your Ideal Shift or Staff is Just a Click Away
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            {[
              { label: "Active Staff", value: "1,234", growth: "+12%" },
              { label: "Shifts", value: "856", growth: "+8%" },
              { label: "Revenue", value: "$45.2K", growth: "+15%" },
              { label: "Growth", value: "23%", growth: "+5%" }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <span className="text-green-400 text-sm font-medium">{stat.growth}</span>
                </div>
                <div className="mt-4 text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-6">Weekly Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#e2e8f0" />
                    <YAxis stroke="#e2e8f0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#60a5fa"
                      strokeWidth={3}
                      dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex justify-between items-center text-sm font-medium">
              <div>
                Active Jobs <span className="font-bold">2,145</span>{" "}
                <span className="text-green-400">+12.5%</span>
              </div>
              <div>
                Staff Placed <span className="font-bold">15,890</span>{" "}
                <span className="text-green-400">+8.3%</span>
              </div>
              <div>
                Companies <span className="font-bold">450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}