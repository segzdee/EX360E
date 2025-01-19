'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

type FinancialSummary = {
  totalBilled: number
  pendingPayments: number
  completedPayments: number
}

export function FinancialOverview() {
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/financial-summary')
      if (!response.ok) {
        throw new Error('Failed to fetch financial data')
      }
      const data = await response.json()
      setFinancialData(data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({
        title: "Error",
        description: "Failed to load financial data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading financial overview...</div>
  }

  if (!financialData) {
    return <div>No financial data available.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Billed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${financialData.totalBilled.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${financialData.pendingPayments.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${financialData.completedPayments.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

