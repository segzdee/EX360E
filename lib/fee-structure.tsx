import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FeeStructure() {
  const [shiftCost, setShiftCost] = useState(100)

  const clientPays = shiftCost * 1.08
  const freelancerReceives = shiftCost * 0.9
  const agencyReceives = shiftCost * 0.94
  const platformFeeClient = shiftCost * 0.08
  const platformFeeFreelancer = shiftCost * 0.1
  const platformFeeAgency = shiftCost * 0.06

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>EXTRASTAFF360 Fee Structure</CardTitle>
        <CardDescription>Understand how payments and fees work on our platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label htmlFor="shift-cost" className="block text-sm font-medium text-gray-700 mb-2">
            Shift Cost: ${shiftCost}
          </label>
          <Slider
            id="shift-cost"
            min={50}
            max={500}
            step={10}
            value={[shiftCost]}
            onValueChange={(value) => setShiftCost(value[0])}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Client Pays</TableCell>
              <TableCell>${clientPays.toFixed(2)}</TableCell>
              <TableCell>${platformFeeClient.toFixed(2)} (8%)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Freelancer Receives</TableCell>
              <TableCell>${freelancerReceives.toFixed(2)}</TableCell>
              <TableCell>${platformFeeFreelancer.toFixed(2)} (10%)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Agency Receives</TableCell>
              <TableCell>${agencyReceives.toFixed(2)}</TableCell>
              <TableCell>${platformFeeAgency.toFixed(2)} (6%)</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Escrow Process:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Client funds the full shift amount + 8% into an escrow account.</li>
            <li>Upon shift completion and approval, the platform releases the net payment to the staff or agency.</li>
            <li>The platform retains the client's 8% fee.</li>
            <li>In case of a dispute, payment is held until resolution is reached.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

