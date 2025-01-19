import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle } from 'lucide-react'

export default function UserRolesDashboard() {
  const [activeTab, setActiveTab] = useState("client")

  const roles = {
    client: {
      title: "Client Dashboard",
      description: "For hospitality companies and individuals",
      features: [
        "Login & Security with 2FA",
        "Active Shifts Overview",
        "Staff Performance Metrics",
        "Financial Summary",
        "Post Extra Shift",
        "Manage Applications",
        "Escrow Deposit",
        "Real-Time Staff Tracking",
        "Shift Completion Review",
        "Advanced Reporting & Analytics",
        "Shift Templates & Recurring Shifts",
        "Collaboration Tools",
        "Enhanced Financial Tools",
        "Live Chat Support"
      ]
    },
    staff: {
      title: "Extra Staff Dashboard",
      description: "For freelance hospitality professionals",
      features: [
        "Login & Security with 2FA",
        "Profile Setup",
        "Availability Management",
        "Browse and Apply for Shifts",
        "Active Shift Process Management",
        "Earnings Dashboard",
        "Skill Development",
        "Job Matching & Recommendations",
        "Enhanced Profile with Portfolio",
        "Gamification & Rewards",
        "Dispute Resolution & Support"
      ]
    },
    agency: {
      title: "Agency Dashboard",
      description: "For recruitment agencies",
      features: [
        "Login & Security with Team Roles",
        "Staff Management",
        "Client Management",
        "Shift Operations",
        "Financial Operations",
        "Performance Analytics",
        "Advanced Staff Management",
        "Client Relationship Management (CRM)",
        "Shift Optimization",
        "Financial Tools Enhancements",
        "Marketing & Growth Tools",
        "Integration with HR Tools"
      ]
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>EXTRASTAFF360 User Roles</CardTitle>
        <CardDescription>Explore the features available for each user type</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="staff">Extra Staff</TabsTrigger>
            <TabsTrigger value="agency">Agency</TabsTrigger>
          </TabsList>
          {Object.entries(roles).map(([key, role]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

