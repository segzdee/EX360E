import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StaffForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    primaryRole: '',
    experience: '',
    availability: [],
    preferredLocation: '',
    nationalInsurance: '',
    qualifications: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setStep(3); // Move to success step
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Join Extrastaff360
            </h1>
            <p className="mt-2 text-gray-600">
              {step === 1 && "Let's get started with your basic details"}
              {step === 2 && "Tell us about your experience and preferences"}
              {step === 3 && "All set! You're ready to go"}
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-rose-100 bg-rose-50">
              <AlertDescription className="text-rose-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    National Insurance Number
                  </label>
                  <Input
                    name="nationalInsurance"
                    value={formData.nationalInsurance}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                    font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02]
                    active:scale-[0.98] transition-all duration-200"
                >
                  Continue to Experience
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Primary Role
                  </label>
                  <select
                    name="primaryRole"
                    value={formData.primaryRole}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200 bg-white"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="waiter">Waiter/Waitress</option>
                    <option value="chef">Chef</option>
                    <option value="bartender">Bartender</option>
                    <option value="kitchen">Kitchen Staff</option>
                    <option value="host">Host/Hostess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200 bg-white"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="entry">Entry Level (0-1 years)</option>
                    <option value="junior">Junior (1-3 years)</option>
                    <option value="mid">Mid-Level (3-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Location
                  </label>
                  <Input
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleInputChange}
                    placeholder="Enter city or region"
                    className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Weekdays', 'Weekends', 'Evenings', 'Nights'].map((period) => (
                      <label
                        key={period}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          name="availability"
                          value={period}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-200"
                        />
                        <span className="ml-2 text-sm">{period}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 h-12 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                      font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02]
                      active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Welcome to Extrastaff360!</h3>
                <p className="text-gray-600">
                  Your registration is complete. Check your email to verify your account.
                </p>
                <Button
                  type="button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl
                    font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </form>

          {step < 3 && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffForm;