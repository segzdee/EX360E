import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  last4: string
  brand?: string
  exp_month?: number
  exp_year?: number
  bank_name?: string
  routing_number?: string
  is_default: boolean
}

export interface Payment {
  id: string
  shift_id: string
  staff_id: string
  amount: number
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded'
  payment_date: Date
  payment_method: string
  reference: string
  fees: {
    platform: number
    processing: number
    tax: number
  }
}

export interface Invoice {
  id: string
  company_id: string
  amount: number
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
  due_date: Date
  line_items: Array<{
    shift_id: string
    description: string
    amount: number
    tax: number
  }>
  payment_terms: {
    days: number
    late_fee_percentage: number
  }
}

export class PaymentService {
  private supabase
  private stripe: Stripe

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia'
    })
  }

  // Payment Method Management
  async addPaymentMethod(userId: string, paymentMethodId: string) {
    const { data, error } = await this.supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        stripe_payment_method_id: paymentMethodId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const { error } = await this.supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId)

    if (error) throw error

    const { data, error: updateError } = await this.supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  }

  // Staff Payments
  async processStaffPayment(payment: Omit<Payment, 'id' | 'status' | 'payment_date'>) {
    try {
      // Create payment record
      const { data: paymentRecord, error } = await this.supabase
        .from('payments')
        .insert({
          ...payment,
          status: 'Pending',
          payment_date: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Process payment through Stripe
      const stripePayment = await this.stripe.paymentIntents.create({
        amount: payment.amount * 100, // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          payment_id: paymentRecord.id,
          shift_id: payment.shift_id,
          staff_id: payment.staff_id,
        },
      })

      // Update payment record with Stripe reference
      const { error: updateError } = await this.supabase
        .from('payments')
        .update({
          stripe_payment_intent_id: stripePayment.id,
          status: 'Completed',
        })
        .eq('id', paymentRecord.id)

      if (updateError) throw updateError

      return paymentRecord
    } catch (error) {
      // Handle payment failure
      console.error('Payment processing failed:', error)
      throw error
    }
  }

  // Company Invoicing
  async createInvoice(invoice: Omit<Invoice, 'id' | 'status'>) {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert({
        ...invoice,
        status: 'Draft',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async sendInvoice(invoiceId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .update({
        status: 'Sent',
        sent_date: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processInvoicePayment(invoiceId: string, paymentMethodId: string) {
    const { data: invoice, error: invoiceError } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (invoiceError) throw invoiceError

    try {
      const payment = await this.stripe.paymentIntents.create({
        amount: invoice.amount * 100,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        metadata: {
          invoice_id: invoiceId,
          company_id: invoice.company_id,
        },
      })

      const { error } = await this.supabase
        .from('invoices')
        .update({
          status: 'Paid',
          stripe_payment_intent_id: payment.id,
          paid_date: new Date().toISOString(),
        })
        .eq('id', invoiceId)

      if (error) throw error

      return payment
    } catch (error) {
      console.error('Invoice payment processing failed:', error)
      throw error
    }
  }

  // Payment Analytics
  async getPaymentAnalytics(userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await this.supabase
      .rpc('get_payment_analytics', {
        p_user_id: userId,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      })

    if (error) throw error
    return data
  }

  // Refunds
  async processRefund(paymentId: string, amount: number, reason: string) {
    const { data: payment, error: paymentError } = await this.supabase
      .from('payments')
      .select('stripe_payment_intent_id')
      .eq('id', paymentId)
      .single()

    if (paymentError) throw paymentError

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        amount: amount * 100,
        reason: reason as Stripe.RefundCreateParams.Reason,
      })

      const { error } = await this.supabase
        .from('payments')
        .update({
          status: 'Refunded',
          refund_id: refund.id,
          refund_amount: amount,
          refund_reason: reason,
          refund_date: new Date().toISOString(),
        })
        .eq('id', paymentId)

      if (error) throw error

      return refund
    } catch (error) {
      console.error('Refund processing failed:', error)
      throw error
    }
  }

  // Dispute Management
  async handleDispute(paymentId: string, disputeDetails: {
    reason: string
    evidence: string
    amount: number
  }) {
    const { data, error } = await this.supabase
      .from('payment_disputes')
      .insert({
        payment_id: paymentId,
        ...disputeDetails,
        status: 'Under Review',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
} 