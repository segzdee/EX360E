import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, Star, Briefcase } from 'lucide-react'

interface StaffDashboardProps {
  staffType: string;
}

export function StaffDashboard({ staffType }: StaffDashboardProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Staff Dashboard - {staffType}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$640</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Out of 5</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shifts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shifts">My Shifts</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Upcoming Shifts</h2>
            <Button>Find New Shifts</Button>
          </div>
          {/* Add a table or list of upcoming shifts here */}
        </TabsContent>
        <TabsContent value="availability" className="space-y-4">
          <h2 className="text-xl font-semibold">Set Your Availability</h2>
          {/* Add an availability calendar or form here */}
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          {/* Add a table of payment history here */}
        </TabsContent>
        <TabsContent value="training" className="space-y-4">
          <h2 className="text-xl font-semibold">Training Modules</h2>
          {/* Add a list of available training modules here */}
        </TabsContent>
        <TabsContent value="profile" className="space-y-4">
          <h2 className="text-xl font-semibold">Staff Profile</h2>
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Staff Type:</strong> {staffType}</p>
              <p><strong>Specialization:</strong> Hospitality</p>
              <p><strong>Experience:</strong> 5 years</p>
            </CardContent>
          </Card>
          {/* Add more profile-related features specific to the staff type */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

