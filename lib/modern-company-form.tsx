import React, { useState } from 'react';

// Modern form components
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

export default function CompanyForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Company Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company Name
        </label>
        <Input placeholder="Enter your company name" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Type
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="bar">Bar/Nightclub</option>
            <option value="cafe">Café</option>
            <option value="catering">Catering Service</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Years in Operation
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Experience</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-5">1-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </Select>
        </div>
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
            Business Phone
          </label>
          <Input type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company Registration Number
        </label>
        <Input placeholder="Enter registration number" />
      </div>
    </div>
  );

  // Step 2: Location & Operations
  const renderLocationOperations = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Primary Location Address
        </label>
        <div className="space-y-4">
          <Input placeholder="Street Address" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="City" />
            <Input placeholder="State/Region" />
            <Input placeholder="Postal Code" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Locations
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Range</option>
            <option value="1">Single Location</option>
            <option value="2-5">2-5 Locations</option>
            <option value="6-10">6-10 Locations</option>
            <option value="10+">10+ Locations</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Operating Hours
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Schedule</option>
            <option value="standard">Standard (9AM-5PM)</option>
            <option value="extended">Extended (7AM-10PM)</option>
            <option value="24h">24/7 Operation</option>
            <option value="custom">Custom Hours</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Peak Business Hours
        </label>
        <div className="grid grid-cols-2 gap-4">
          <select multiple 
            className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
            transition-all duration-200 min-h-[120px]"
          >
            <option value="breakfast">Breakfast (6AM-10AM)</option>
            <option value="lunch">Lunch (11AM-2PM)</option>
            <option value="dinner">Dinner (5PM-10PM)</option>
            <option value="latenight">Late Night (10PM-2AM)</option>
          </select>
          <select multiple 
            className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
            transition-all duration-200 min-h-[120px]"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
        <p className="mt-2 text-sm text-gray-500">Select peak hours and busy days</p>
      </div>
    </div>
  );

  // Step 3: Staff Requirements
  const renderStaffRequirements = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Required Staff Types
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
          <option value="cleaning">Cleaning Staff</option>
          <option value="security">Security Personnel</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">Select all required positions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Average Staff per Shift
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Range</option>
            <option value="1-5">1-5 Staff</option>
            <option value="6-10">6-10 Staff</option>
            <option value="11-20">11-20 Staff</option>
            <option value="20+">20+ Staff</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Staff Type
          </label>
          <Select defaultValue="">
            <option value="" disabled>Select Preference</option>
            <option value="permanent">Permanent Staff</option>
            <option value="temporary">Temporary Staff</option>
            <option value="mixed">Mixed (Both)</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Requirements
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded-md border-2 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Staff must have food handling certification</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded-md border-2 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Background check required</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded-md border-2 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Uniform provided by company</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded-md border-2 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Flexible scheduling required</span>
          </label>
        </div>
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
              Company Registration
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Step {step} of 3: {
                step === 1 ? "Company Information" :
                step === 2 ? "Location & Operations" :
                "Staff Requirements"
              }
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {step === 1 && renderBasicInfo()}
            {step === 2 && renderLocationOperations()}
            {step === 3 && renderStaffRequirements()}

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
