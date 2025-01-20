import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TickerItem {
  id: string
  message: string
  status: 'completed' | 'pending' | 'urgent'
  details: {
    location?: string
    payRate?: string
    shiftTiming?: string
    applicants?: number
  }
}

interface DashboardTickerProps {
  userType: 'company' | 'agency' | 'staff'
}

const mockFetchTickerData = async (userType: string): Promise<TickerItem[]> => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  const allItems: TickerItem[] = [
    { id: '1', message: `📌 Bartender Shift Posted (${formattedDate})`, status: 'pending', details: { location: 'Dubai', payRate: '$20/hr' } },
    { id: '2', message: `⚠️ 3 Applications Pending Approval (${formattedDate})`, status: 'pending', details: { applicants: 3 } },
    { id: '3', message: `🔥 Chef Needed Urgently (${formattedDate})`, status: 'urgent', details: { location: 'Abu Dhabi', shiftTiming: '6 PM - 12 AM' } },
    { id: '4', message: `✅ 5 Shifts Completed (${formattedDate})`, status: 'completed', details: {} },
    { id: '5', message: `📊 High Demand for Waitstaff (${formattedDate})`, status: 'urgent', details: {} },
  ]

  // Filter items based on user type
  return allItems.filter(item => {
    switch (userType) {
      case 'company':
        return ['2', '4', '5'].includes(item.id)
      case 'agency':
        return ['1', '2', '3', '5'].includes(item.id)
      case 'staff':
        return ['1', '3', '5'].includes(item.id)
      default:
        return false
    }
  })
}

export function DashboardTicker({ userType }: DashboardTickerProps) {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockFetchTickerData(userType)
      setTickerItems(data)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [userType])

  useEffect(() => {
    if (tickerRef.current) {
      const width = tickerRef.current.scrollWidth
      tickerRef.current.style.setProperty('--ticker-width', `${width}px`)
    }
  }, [tickerItems])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'urgent':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 overflow-hidden relative">
      <motion.div
        ref={tickerRef}
        className="flex whitespace-nowrap"
        animate={{
          x: ['0%', '-100%']
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {tickerItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`inline-flex items-center mx-4 ${getStatusColor(item.status)} px-2 py-1 rounded`}>
                  {item.message}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Location: {item.details.location || 'N/A'}</p>
                <p>Pay Rate: {item.details.payRate || 'N/A'}</p>
                <p>Shift Timing: {item.details.shiftTiming || 'N/A'}</p>
                {item.details.applicants && <p>Applicants: {item.details.applicants}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </motion.div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-foreground text-primary px-2 py-1 rounded text-sm">
            View All
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>All Updates</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickerItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    <Badge variant={item.status as 'default' | 'secondary' | 'destructive'}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.details.location && <p>Location: {item.details.location}</p>}
                    {item.details.payRate && <p>Pay Rate: {item.details.payRate}</p>}
                    {item.details.shiftTiming && <p>Shift Timing: {item.details.shiftTiming}</p>}
                    {item.details.applicants && <p>Applicants: {item.details.applicants}</p>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}

