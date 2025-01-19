import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [userType, setUserType] = useState('staff');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <Image
              src="/logo.png"
              alt="ExtraStaff360"
              width={40}
              height={40}
              className="mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold">EXTRASTAFF360 PLATFORM</h1>
              <p className="text-gray-600 text-sm">
                Connecting Companies, Agencies, and Staff on One Platform
              </p>
            </div>
          </div>

          {/* User Type Selector */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={userType === 'companies' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setUserType('companies')}
            >
              Companies
            </Button>
            <Button
              variant={userType === 'agencies' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setUserType('agencies')}
            >
              Agencies
            </Button>
            <Button
              variant={userType === 'staff' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setUserType('staff')}
            >
              Staff
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center text-sm text-gray-500">OR</div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked })
                }
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms
                </Link>{' '}
                &{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy
                </Link>
              </label>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Image
                src="/google-logo.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Stats Dashboard */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 p-12 text-white">
        <div className="h-full flex flex-col">
          <h2 className="text-4xl font-bold mb-4">
            Powering Hospitality, One Extra Staff at a Time
          </h2>
          <p className="text-xl mb-12">
            Your Ideal Shift or Staff is Just a Click Away
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Active Staff</span>
                <span className="text-green-400 text-sm">+12%</span>
              </div>
              <div className="text-3xl font-bold">1,234</div>
            </div>
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Shifts</span>
                <span className="text-green-400 text-sm">+8%</span>
              </div>
              <div className="text-3xl font-bold">856</div>
            </div>
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Revenue</span>
                <span className="text-green-400 text-sm">+15%</span>
              </div>
              <div className="text-3xl font-bold">$45.2K</div>
            </div>
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Growth</span>
                <span className="text-green-400 text-sm">+5%</span>
              </div>
              <div className="text-3xl font-bold">23%</div>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <h3 className="text-lg mb-4">Weekly Performance</h3>
              <div className="flex justify-between text-sm">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="bg-blue-600/30 p-6 rounded-lg">
              <h3 className="text-lg mb-4">Monthly Trend</h3>
              {/* Add chart component here */}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-auto flex space-x-8">
            <div>
              <span className="text-sm">Active Jobs</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">2,145</span>
                <span className="text-green-400 text-sm">+12.5%</span>
              </div>
            </div>
            <div>
              <span className="text-sm">Staff Placed</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">15,890</span>
                <span className="text-green-400 text-sm">+8.3%</span>
              </div>
            </div>
            <div>
              <span className="text-sm">Companies</span>
              <div className="text-2xl font-bold">450</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}