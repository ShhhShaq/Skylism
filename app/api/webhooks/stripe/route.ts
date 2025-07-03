import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId
          const credits = parseInt(session.metadata?.credits || '0')
          const amountPaid = session.amount_total! / 100 // Convert from cents

          if (userId && credits > 0) {
            // Add credits to user account
            await supabase.rpc('add_credits', {
              user_id: userId,
              amount: credits
            })

            // Record transaction
            await supabase
              .from('transactions')
              .insert({
                user_id: userId,
                credits_purchased: credits,
                amount_paid: amountPaid,
                stripe_payment_id: session.payment_intent as string
              })

            console.log(`Added ${credits} credits to user ${userId}`)
          }
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ 
      error: 'Webhook handler failed' 
    }, { status: 500 })
  }
}