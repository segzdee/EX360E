'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const companyTypes = [
  "Full-Service Hotel", "Limited-Service Hotel", "Boutique Hotel", "Luxury Hotel", "Extended Stay Hotel",
  "Budget Hotel", "Capsule Hotel", "Motel", "Heritage Hotel", "Eco-Hotel", "Beach Resort", "Ski Resort",
  "Golf Resort", "Spa Resort", "All-Inclusive Resort", "Eco-Resort", "Adventure Resort", "Family Resort",
  "Casino Resort", "Luxury Resort", "Bed and Breakfast (B&B)", "Hostel", "Vacation Rental", "Timeshare",
  "Serviced Apartment", "Inn", "Lodge", "Cruise Ship", "Campground", "Glamping Site", "Treehouse", "Yurt",
  "Houseboat", "Boutique Lodge", "Caravan Park", "Ice Hotel", "Monastic Stay", "Floating Hotel", "Pousada",
  "Floating Villa", "Luxury Villa", "Farm Stay", "Boutique Inn", "Timeshare Villa", "Palace Hotel",
  "Palace Resort", "Luxury Chalet", "Wellness Retreat", "Medical Tourism Hotel", "All-Suite Hotel",
  "Business Hotel", "Airport Hotel", "Heritage Inn", "Heritage Lodge", "Backpackers Hostel", "Budget Hostel",
  "Design Hotel", "Theme Hotel", "Boutique Resort", "Capsule Hostel", "Micro Hotel", "Apartment Hotel",
  "Executive Suites", "Country Inn", "Riverboat Hotel", "Ski Chalet", "Surf Hostel", "Boutique B&B",
  "Guesthouse", "Hostel Motel", "Short-Term Rental", "Hotel Apartment", "Premium Hostel", "Budget Motel",
  "Boutique Bungalow", "Luxury Bungalow", "Boutique Villa", "Heritage Bungalow", "Rooftop Hotel",
  "Pop-up Hotel", "Underground Hotel", "Pet-Friendly Hotel", "LGBTQ+ Friendly Hotel", "All-Business Hotel",
  "Adults-Only Hotel", "Family-Friendly Hotel", "Boutique Castle Hotel", "Historic Mansion Hotel",
  "Art Hotel", "Themed Resort", "Eco-Lodge", "Desert Resort", "Island Resort", "Mountain Resort",
  "Urban Resort", "River Resort", "Lake Resort", "Jungle Resort", "Sustainable Hotel", "Luxury Caravan"
];

const agencyTypes = [
  "Staffing Agency", "Temping Agency", "Recruitment Agency", "Executive Search Firm",
  "Management Consulting Agency", "Marketing and PR Agency", "Event Planning Agency",
  "Technology and Software Agency", "Design and Branding Agency", "Destination Management Company (DMC)",
  "Tour Operator Agency", "Food and Beverage Consulting Agency", "Sustainability and Green Consulting Agency",
  "Financial and Accounting Agency", "Legal Agency Specializing in Hospitality Law",
  "Training and Development Agency", "Social Media Management Agency", "Advertising Agency",
  "Online Booking and Distribution Agency", "Risk Management Agency", "Vendor and Supplier Agency"
];

const staffTypes = [
  "Full-Time Staff", "Part-Time Staff", "Casual Staff", "Extra-Hands", "Seasonal Staff",
  "Interns", "Apprentices", "Freelancers", "Independent Contractors", "Shift Workers",
  "Temporary Staff", "Contract Employees", "On-Call Staff", "Rotational Staff",
  "Per Diem Staff", "Live-In Staff", "Probationary Staff", "Permanent Staff",
  "Resident Staff", "Alumni Employees", "Retiree Employees", "Trainees",
  "Commission-Based Staff", "Rotational Employees", "Temporary Full-Time", "Temporary Part-Time"
];

const positionCategories = [
  "Hotel General Manager", "Assistant General Manager", "Front Office Manager", "Concierge", "Receptionist",
  "Housekeeping Manager", "Room Attendant", "Bellhop/Bellperson", "Valet Attendant", "Maintenance Technician",
  "Guest Services Manager", "Night Auditor", "Reservations Manager", "Lobby Manager", "Guest Relations Representative",
  "Security Manager", "Security Officer", "Laundry Manager", "Engineering Manager", "Spa Manager",
  "Food and Beverage Director", "Restaurant General Manager", "Assistant Restaurant Manager", "Executive Chef",
  "Sous Chef", "Pastry Chef", "Line Cook", "Prep Cook", "Kitchen Manager", "Dishwasher", "Server/Waitstaff",
  "Bartender", "Bar Manager", "Sommelier", "Host/Hostess", "Banquet Manager", "Catering Manager", "Food Runner",
  "Barista", "Mixologist", "Event Coordinator", "Event Planner", "Banquet Captain", "Wedding Planner",
  "Conference Services Manager", "Meeting Planner", "Exhibition Coordinator", "Trade Show Manager",
  "Corporate Event Planner", "Social Event Coordinator", "Event Marketing Manager", "Venue Manager",
  "Stage Manager", "Lighting Technician", "Sound Engineer", "Decor Coordinator", "Catering Coordinator",
  "Entertainment Manager", "Security Coordinator for Events", "Logistics Manager", "Travel Agent", "Tour Guide",
  "Tour Coordinator", "Cruise Director", "Flight Attendant", "Airport Services Manager", "Transportation Coordinator",
  "Travel Concierge", "Destination Specialist", "Tourism Marketing Manager", "Hotel and Tourism Consultant",
  "Travel Operations Manager", "Tour Operator", "Adventure Travel Guide", "Ecotourism Specialist",
  "Cultural Liaison Officer", "Hospitality Trainer", "Travel Writer/Blogger", "Tour Planner", "Destination Manager",
  "Human Resources Manager", "Training and Development Manager", "Recruitment Specialist", "Payroll Specialist",
  "Accountant/Financial Analyst", "Revenue Manager", "Marketing Manager", "Public Relations Manager",
  "Social Media Manager", "Graphic Designer (Hospitality)", "IT Manager", "IT Support Specialist",
  "Procurement Manager", "Purchasing Agent", "Compliance Officer", "Sustainability Coordinator",
  "Environmental Services Manager", "Customer Service Manager", "Linen Coordinator", "Executive Assistant"
];

export default function Signup() {
  const [userType, setUserType] = useState<string | undefined>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up for EXTRASTAFF360</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Full Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email address
              </label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                id="password"
                placeholder="Create a password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="user-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I am a
              </label>
              <Select name="user-type" onValueChange={setUserType} required>
                <SelectTrigger id="user-type">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>User Type</SelectLabel>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {userType && (
              <div className="space-y-2">
                <label htmlFor="specific-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Specific Type
                </label>
                <Select name="specific-type" required>
                  <SelectTrigger id="specific-type">
                    <SelectValue placeholder="Select specific type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{userType === 'company' ? 'Company Types' : userType === 'agency' ? 'Agency Types' : 'Staff Types'}</SelectLabel>
                      {(userType === 'company' ? companyTypes : userType === 'agency' ? agencyTypes : staffTypes).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {userType === 'staff' && (
              <div className="space-y-2">
                <label htmlFor="position-category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Position Category
                </label>
                <Select name="position-category" required>
                  <SelectTrigger id="position-category">
                    <SelectValue placeholder="Select position category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Position Categories</SelectLabel>
                      {positionCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

