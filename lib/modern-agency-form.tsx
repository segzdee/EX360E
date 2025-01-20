import React, { useState } from 'react';

// Modernized form components
const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 
    transform hover:scale-[1.02] active:scale-[0.98] shadow-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
    transition-all duration-200 placeholder:text-gray-400 ${className}`}
    {...props}
  />
);

const Select = ({ className = '', ...props }) => (
  <select
    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
    transition-all duration-200 appearance-none 
    bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')] 
    bg-no-repeat bg-right-1 bg-[length:20px] bg-[center_right_1rem] ${className}`}
    {...props}
  />
);

export default function AgencyForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Country of Operation
        </label>
        <Select defaultValue="">
          <option value="" disabled>Select Country</option>
          <option value="UK">United Kingdom</option>
          <option value="US">United States</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Agency Name
        </label>
        <Input placeholder="Enter your agency name" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Email
          </label>
          <Input type="email" placeholder="business@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Phone
          </label>
          <Input type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Business Registration Number
        </label>
        <Input placeholder="Enter your registration number" />
      </div>
    </div>
  );

  // Step 2: Service Details
  const renderServiceDetails = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Primary Services
        </label>
        <Select defaultValue="">
          <option value="" disabled>Select Primary Service</option>
          <option value="hospitality">Hospitality Staffing</option>
          <option value="events">Event Staffing</option>
          <option value="catering">Catering Staff</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Years in Operation
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Team Size
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Size</option>
            <option value="small">Small (1-10)</option>
            <option value="medium">Medium (11-50)</option>
            <option value="large">Large (50+)</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Service Areas
        </label>
        <select multiple 
          className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
          transition-all duration-200 min-h-[160px]"
        >
          <option value="london">London</option>
          <option value="manchester">Manchester</option>
          <option value="birmingham">Birmingham</option>
          <option value="leeds">Leeds</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple cities</p>
      </div>
    </div>
  );

  // Step 3: Staff Types and Verification
  const renderStaffAndVerification = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Staff Categories Provided
        </label>
        <select multiple 
          className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
          transition-all duration-200 min-h-[160px]"
        >
          <option value="waiter">Waiters/Waitresses</option>
          <option value="chef">Chefs</option>
          <option value="bartender">Bartenders</option>
          <option value="host">Hosts/Hostesses</option>
          <option value="kitchen">Kitchen Staff</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Insurance Policy Number
          </label>
          <Input placeholder="Enter policy number" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tax Registration Number
          </label>
          <Input placeholder="Enter tax number" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Business License
        </label>
        <div className="relative">
          <Input 
            type="file" 
            accept=".pdf,.doc,.docx"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
            file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Agency Registration
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Step {step} of 3: {
                step === 1 ? "Basic Information" :
                step === 2 ? "Service Details" :
                "Verification"
              }
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {step === 1 && renderBasicInfo()}
            {step === 2 && renderServiceDetails()}
            {step === 3 && renderStaffAndVerification()}

            <div className="flex justify-between pt-8 border-t border-gray-200">
              {step > 1 ? (
                <Button
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Back
                </Button>
              ) : <div />}
              
              <Button
                onClick={() => {
                  if (step === 3) {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      // Handle submission
                    }, 1500);
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  step === 3 ? 'Complete Registration' : 'Continue'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
