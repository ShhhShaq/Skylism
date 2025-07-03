'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CreditBalanceProps {
  credits: number
  onCreditsUpdate: (credits: number) => void
  showPurchaseButton?: boolean
}

const creditPackages = [
  { credits: 10, price: 799, popular: false },
  { credits: 25, price: 1799, popular: true },
  { credits: 50, price: 3199, popular: false }
]

export default function CreditBalance({ credits, onCreditsUpdate, showPurchaseButton = false }: CreditBalanceProps) {
  const [showPurchase, setShowPurchase] = useState(showPurchaseButton)
  const [loading, setLoading] = useState<number | null>(null)

  const handlePurchase = async (packageIndex: number) => {
    setLoading(packageIndex)
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: creditPackages[packageIndex].credits,
          price: creditPackages[packageIndex].price,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
        }
      }
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-light text-white/80">Credits:</span>
        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-light border border-white/20">
          {credits}
        </span>
      </div>

      <button
        onClick={() => setShowPurchase(!showPurchase)}
        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl hover:bg-white/30 transition-all duration-300 text-sm font-light border border-white/20 hover:scale-105"
      >
        Buy Credits
      </button>

      {showPurchase && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl max-w-md w-full mx-4 border border-white/20 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-white">Purchase Credits</h3>
              <button
                onClick={() => setShowPurchase(false)}
                className="text-white/60 hover:text-white w-8 h-8 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {creditPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl p-4 relative backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    pkg.popular ? 'border-white/40 bg-white/15' : 'border-white/20 bg-white/5'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-4 bg-white/90 text-gray-900 px-3 py-1 rounded-xl text-xs font-light">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-light text-white text-lg">{pkg.credits} Credits</div>
                      <div className="text-sm text-white/70 font-light">
                        ${(pkg.price / 100).toFixed(2)} • ${(pkg.price / pkg.credits / 100).toFixed(2)} per credit
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePurchase(index)}
                      disabled={loading === index}
                      className="bg-white/90 text-gray-900 px-4 py-2 rounded-xl hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light hover:scale-105"
                    >
                      {loading === index ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/60 mt-4 text-center font-light">
              Secure payments powered by Stripe
            </p>
          </div>
        </div>
      )}
    </div>
  )
}