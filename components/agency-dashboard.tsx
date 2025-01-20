import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, DollarSign, Building } from 'lucide-react'

interface AgencyDashboardProps {
  agencyType: string;
}

export function AgencyDashboard({ agencyType }: AgencyDashboardProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agency Dashboard - {agencyType}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$52,450</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="shifts">Shift Operations</TabsTrigger>
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="services">Agency Services</TabsTrigger>
        </TabsList>
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Staff Overview</h2>
            <Button>Add New Staff</Button>
          </div>
          {/* Add a table or list of staff members here */}
        </TabsContent>
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Shift Operations</h2>
            <Button>Post New Shift</Button>
          </div>
          {/* Add a table or list of active and upcoming shifts here */}
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Client Management</h2>
            <Button>Add New Client</Button>
          </div>
          {/* Add a table or list of clients here */}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Performance Analytics</h2>
          {/* Add performance charts and analytics here */}
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <h2 className="text-xl font-semibold">Agency Services</h2>
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Agency Type:</strong> {agencyType}</p>
              <p><strong>Specialization:</strong> Hospitality Staffing</p>
              <p><strong>Service Area:</strong> Nationwide</p>
            </CardContent>
          </Card>
          {/* Add more service-related features specific to the agency type */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

