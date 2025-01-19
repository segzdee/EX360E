'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExtraStaffList } from "@/components/ExtraStaffList"
import { AgencyJobList } from "@/components/AgencyJobList"
import { AgencyFinancialOverview } from "@/components/AgencyFinancialOverview"
import { AgencyPerformanceMetrics } from "@/components/AgencyPerformanceMetrics"

export function AgencyDashboard() {
  const [activeTab, setActiveTab] = useState("staff")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agency Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="staff">Extra Staff</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Manage Extra Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveTab("add-staff")}>Add New Staff</Button>
              <ExtraStaffList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Manage Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <AgencyJobList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial">
          <AgencyFinancialOverview />
        </TabsContent>
        
        <TabsContent value="performance">
          <AgencyPerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

