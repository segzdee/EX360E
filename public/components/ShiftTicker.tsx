'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface ShiftData {
  id: string
  position: string
  hourlyRate: number
  change: number
}

const fetchShiftData = async (): Promise<ShiftData[]> => {
  const response = await fetch('/api/shifts/ticker')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export function ShiftTicker() {
  const { data: shifts, error, isLoading } = useQuery<ShiftData[]>('shiftTicker', fetchShiftData, {
    refetchInterval: 60000, // Refetch every minute
  })

  const [tickerPosition, setTickerPosition] = useState(0)

  useEffect(() => {
    if (shifts && shifts.length > 0) {
      const tickerWidth = shifts.length * 200 // Assuming each item is about 200px wide
      const animationDuration = shifts.length * 5 // 5 seconds per item

      const animation = setInterval(() => {
        setTickerPosition((prevPosition) => {
          if (prevPosition <= -tickerWidth) {
            return 0
          }
          return prevPosition - 1
        })
      }, animationDuration / tickerWidth)

      return () => clearInterval(animation)
    }
  }, [shifts])

  if (isLoading) return <div className="bg-gray-900 text-white p-2">Loading Shift Ticker Index...</div>
  if (error) return <div className="bg-gray-900 text-white p-2">Error loading Shift Ticker Index</div>

  return (
    <div className="bg-gray-900 text-white p-2 overflow-hidden">
      <div className="flex items-center" style={{ transform: `translateX(${tickerPosition}px)` }}>
        <span className="mr-4 font-bold">Shift Ticker Index:</span>
        {shifts?.map((shift) => (
          <div key={shift.id} className="flex items-center space-x-2 mr-8">
            <span className="font-bold">{shift.position}</span>
            <span>${shift.hourlyRate.toFixed(2)}</span>
            <span className={`flex items-center ${shift.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {shift.change >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
              {Math.abs(shift.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

