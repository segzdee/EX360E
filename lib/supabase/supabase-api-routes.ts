// app/api/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}

// app/api/shifts/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      location,
      startTime,
      endTime,
      hourlyRate,
      requiredSkills,
      specialInstructions,
    } = body

    const totalHours = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60)
    const totalPay = hourlyRate * totalHours

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        title,
        description,
        location,
        start_time: startTime,
        end_time: endTime,
        hourly_rate: hourlyRate,
        total_pay: totalPay,
        required_skills: requiredSkills,
        special_instructions: specialInstructions,
        company_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating shift:', error)
    return new NextResponse('Error creating shift', { status: 500 })
  }
}

// app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse('Webhook error', { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Update payment status
      await supabase
        .from('payments')
        .update({ 
          status: 'escrowed',
          escrow_funded_at: new Date().toISOString(),
          transaction_reference: paymentIntent.id
        })
        .eq('id', paymentIntent.metadata.payment_id)

      break
    // Handle other webhook events...
  }

  return new NextResponse(null, { status: 200 })
}

// app/api/shifts/[id]/complete/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { workReport } = body

    // Update shift status and work report
    const { data: shiftAssignment, error: shiftError } = await supabase
      .from('shift_assignments')
      .update({
        work_report: workReport,
        clock_out_time: new Date().toISOString()
      })
      .eq('shift_id', params.id)
      .eq('freelancer_id', session.user.id)
      .select()
      .single()

    if (shiftError) throw shiftError

    // Update shift status
    const { error: statusError } = await supabase
      .from('shifts')
      .update({ status: 'completed' })
      .eq('id', params.id)

    if (statusError) throw statusError

    return NextResponse.json(shiftAssignment)
  } catch (error) {
    console.error('Error completing shift:', error)
    return new NextResponse('Error completing shift', { status: 500 })
  }
}