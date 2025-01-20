import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

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
    <div className="flex min-h-screen">
      {/* Left Panel - Login */}
      <div className="w-1/2 px-16 py-12 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold mb-2">EXTRASTAFF360 PLATFORM</h1>
            <p className="text-gray-500">
              Connecting Companies, Agencies, and Staff on One Platform
            </p>
          </div>

          <div className="flex space-x-2 mb-8">
            {['Companies', 'Agencies', 'Staff'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Email address</label>
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-purple-500"
              />
              <Button variant="link" className="mt-1 h-auto p-0 text-purple-600">
                Forgot password?
              </Button>
            </div>

            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-purple-600" />
              <span className="text-sm text-gray-600">
                I agree to the Terms & Privacy
              </span>
            </label>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-purple-600">
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Dashboard */}
      <div className="w-1/2 bg-gradient-to-br from-purple-600 to-purple-900 px-16 py-12">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">
            Powering Hospitality, One Extra Staff at a Time
          </h2>
          <p className="text-xl text-purple-100 mb-12">
            Your Ideal Shift or Staff is Just a Click Away
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            {[
              { icon: Users, label: "Active Staff", value: "1,234", growth: "+12%" },
              { icon: Calendar, label: "Shifts", value: "856", growth: "+8%" },
              { icon: DollarSign, label: "Revenue", value: "$45.2K", growth: "+15%" },
              { icon: TrendingUp, label: "Growth", value: "23%", growth: "+5%" }
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/10 border-0 p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <stat.icon className="h-6 w-6 text-purple-200" />
                  <span className="text-green-400 text-sm">{stat.growth}</span>
                </div>
                <div className="mt-4 text-2xl font-bold">{stat.value}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 border-0 p-6 backdrop-blur-sm">
              <h3 className="text-lg mb-4">Weekly Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#e2e8f0" />
                    <YAxis stroke="#e2e8f0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="bg-white/10 rounded-lg p-6 flex justify-between items-center text-sm">
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