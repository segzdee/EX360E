import { NextResponse } from 'next/server'
import pool from '@/lib/db-config'

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()

    return NextResponse.json({ time: result.rows[0].now })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

