import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const specializationOptions = [
  { value: 'general', label: 'General Staffing' },
  { value: 'hospitality', label: 'Hospitality Specific' },
  { value: 'events', label: 'Events & Catering' },
  { value: 'culinary', label: 'Culinary Professionals' }
];

export default function AgencySignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [fileError, setFileError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      event.target.value = '';
    } else {
      setFileError('');
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/agency/signup', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Signup failed. Please try again.');
      setStep(3);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Indicator */}
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Agency Registration
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 && "Let's start with your agency details"}
              {step === 2 && "Tell us about your specialization"}
              {step === 3 && "Registration Complete!"}
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-rose-100 bg-rose-50">
              <AlertDescription className="text-rose-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Agency Name
                  </label>
                  <Input
                    name="agencyName"
                    type="text"
                    required
                    className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Phone
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Registration Number
                  </label>
                  <Input
                    name="registrationNumber"
                    type="text"
                    required
                    className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                    font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02]
                    active:scale-[0.98] transition-all duration-200"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Primary Specialization
                  </label>
                  <select
                    name="specialization"
                    required
                    className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 
                      focus:ring-indigo-200 bg-white"
                  >
                    <option value="">Select specialization</option>
                    {specializationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Years in Operation
                  </label>
                  <select
                    name="yearsInOperation"
                    required
                    className="w-full h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 
                      focus:ring-indigo-200 bg-white"
                  >
                    <option value="">Select years</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Upload Business License
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                  {fileError && (
                    <p className="mt-1 text-sm text-rose-600">{fileError}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 h-12 bg-gray-100 text-gray-700 rounded-xl font-medium
                      hover:bg-gray-200 transition-all duration-200"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                      font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02]
                      active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Registration Complete!</h3>
                <p className="text-gray-600">
                  Your agency registration is being reviewed. We'll notify you once approved.
                </p>
                <Button
                  type="button"
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                    font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </form>

          {step < 3 && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already registered?{" "}
              <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in to your account
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}