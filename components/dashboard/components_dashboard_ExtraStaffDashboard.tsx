'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailableShiftsList } from "@/components/AvailableShiftsList"
import { MyShiftsList } from "@/components/MyShiftsList"
import { ExtraStaffPerformance } from "@/components/ExtraStaffPerformance"
import { ExtraStaffEarnings } from "@/components/ExtraStaffEarnings"

export function ExtraStaffDashboard() {
  const [activeTab, setActiveTab] = useState("available-shifts")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Extra Staff Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available-shifts">Available Shifts</TabsTrigger>
          <TabsTrigger value="my-shifts">My Shifts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available-shifts">
          <Card>
            <CardHeader>
              <CardTitle>Available Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailableShiftsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-shifts">
          <Card>
            <CardHeader>
              <CardTitle>My Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <MyShiftsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <ExtraStaffPerformance />
        </TabsContent>
        
        <TabsContent value="earnings">
          <ExtraStaffEarnings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

