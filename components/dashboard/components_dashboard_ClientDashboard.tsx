'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostExtraShiftForm } from "@/components/forms/PostExtraShiftForm"
import { ExtraShiftsList } from "@/components/ExtraShiftsList"
import { NoticeBoardClient } from "@/components/NoticeBoardClient"
import { FinancialOverview } from "@/components/FinancialOverview"

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("shifts")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Client Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shifts">Extra Shifts</TabsTrigger>
          <TabsTrigger value="notice-board">Notice Board</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <CardTitle>Manage Extra Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveTab("post-shift")}>Post New Extra Shift</Button>
              <ExtraShiftsList userType="client" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="post-shift">
          <Card>
            <CardHeader>
              <CardTitle>Post New Extra Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <PostExtraShiftForm onSuccess={() => setActiveTab("shifts")} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notice-board">
          <NoticeBoardClient />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialOverview />
        </TabsContent>
      </Tabs>
    </div>
  )
}

