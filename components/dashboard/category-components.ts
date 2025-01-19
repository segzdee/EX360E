// components/categories/CategorySelect.tsx
'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface CategorySelectProps {
  type: 'company' | 'agency' | 'staff' | 'position'
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function CategorySelect({
  type,
  value,
  onChange,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
  }, [type])

  const fetchCategories = async () => {
    const tableMap = {
      company: 'company_categories',
      agency: 'agency_categories',
      staff: 'staff_categories',
      position: 'position_categories'
    }

    const { data } = await supabase
      .from(tableMap[type])
      .select('id, name')
      .order('name')

    if (data) {
      setCategories(data)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {value
            ? categories.find((category) => category.id === value)?.name
            : `Select ${type} category...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${type} category...`} />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.id}
                onSelect={() => {
                  onChange?.(category.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === category.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// components/shifts/PositionSelect.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Position {
  id: string
  name: string
  department: string
  quantity?: number
}

interface PositionSelectProps {
  onPositionsChange: (positions: Position[]) => void
  initialPositions?: Position[]
}

export function PositionSelect({ onPositionsChange, initialPositions = [] }: PositionSelectProps) {
  const [selectedPositions, setSelectedPositions] = useState<Position[]>(initialPositions)
  const [availablePositions, setAvailablePositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    const { data } = await supabase
      .from('position_categories')
      .select('id, name, department')
      .order('department', { ascending: true })

    if (data) {
      setAvailablePositions(data)
      const uniqueDepartments = [...new Set(data.map(p => p.department))]
      setDepartments(uniqueDepartments)
    }
  }

  const handlePositionSelect = (position: Position) => {
    const updatedPositions = [...selectedPositions]
    const existingIndex = updatedPositions.findIndex(p => p.id === position.id)

    if (existingIndex >= 0) {
      updatedPositions[existingIndex].quantity = (updatedPositions[existingIndex].quantity || 1) + 1
    } else {
      updatedPositions.push({ ...position, quantity: 1 })
    }

    setSelectedPositions(updatedPositions)
    onPositionsChange(updatedPositions)
  }

  const handleQuantityChange = (positionId: string, quantity: number) => {
    const updatedPositions = selectedPositions.map(p =>
      p.id === positionId ? { ...p, quantity } : p
    )
    setSelectedPositions(updatedPositions)
    onPositionsChange(updatedPositions)
  }

  const removePosition = (positionId: string) => {
    const updatedPositions = selectedPositions.filter(p => p.id !== positionId)
    setSelectedPositions(updatedPositions)
    onPositionsChange(updatedPositions)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map(department => (
          <Card key={department} className="p-4">
            <h3 className="font-semibold mb-3">{department}</h3>
            <div className="space-y-2">
              {availablePositions
                .filter(p => p.department === department)
                .map(position => (
                  <Button
                    key={position.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handlePositionSelect(position)}
                  >
                    {position.name}
                  </Button>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedPositions.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Selected Positions</h3>
          <div className="space-y-2">
            {selectedPositions.map(position => (
              <div key={position.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>{position.department}</Badge>
                  <span>{position.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={position.quantity || 1}
                    onChange={(e) => handleQuantityChange(position.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePosition(position.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}