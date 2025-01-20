import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Users, Briefcase, Building } from 'lucide-react'

interface CompanyDashboardProps {
  companyType: string;
}

export function CompanyDashboard({ companyType }: CompanyDashboardProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company Dashboard - {companyType}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shifts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="property">Property Management</TabsTrigger>
        </TabsList>
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Recent Shifts</h2>
            <Button>Post New Shift</Button>
          </div>
          {/* Add a table or list of recent shifts here */}
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Staff Management</h2>
            <Button>Invite Staff</Button>
          </div>
          {/* Add a table or list of staff members here */}
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Financial Reports</h2>
          {/* Add financial reports and charts here */}
        </TabsContent>
        <TabsContent value="property" className="space-y-4">
          <h2 className="text-xl font-semibold">Property Management</h2>
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Type:</strong> {companyType}</p>
              <p><strong>Capacity:</strong> 100 rooms</p>
              <p><strong>Location:</strong> City Center</p>
            </CardContent>
          </Card>
          {/* Add more property management features specific to the company type */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

