'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type Job = Database['public']['Tables']['jobs']['Row']

export function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching jobs:', error)
    } else {
      setSearchResults(data)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {searchResults.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.location}</p>
                <p className="text-sm mb-4">{job.description.substring(0, 100)}...</p>
                <Button asChild>
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

