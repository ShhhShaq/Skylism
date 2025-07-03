'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [origin, setOrigin] = useState('')
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setOrigin(window.location.origin)
    try {
      setSupabase(createClient())
    } catch (error) {
      setMessage('Application not configured. Please set up Supabase credentials.')
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) return
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/15 rounded-full animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/15 rounded-full animate-float"></div>
        <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-white/10 rounded-full animate-float-delay"></div>
      </div>
      
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 animate-scale-in relative z-10 mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="block">
            <img 
              src="/images/logo/skylism-logo-white.png" 
              alt="Skylism.ai" 
              className="h-8 w-auto mx-auto"
            />
          </Link>
          <p className="text-white/80 mt-2 font-light">Sign in to transform your images</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-light text-white/90 mb-2 tracking-wide">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/60 font-light transition-all duration-300 hover:bg-white/15 text-base"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-2xl font-light hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 md:hover:scale-105 hover:shadow-xl border border-white/20 min-h-[44px]"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/10 backdrop-blur-sm text-white/80 font-light rounded-xl">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-3 w-full flex items-center justify-center px-6 py-3 border border-white/20 rounded-2xl shadow-sm text-sm font-light text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-2xl text-sm font-light backdrop-blur-sm ${
            message.includes('Check your email') 
              ? 'bg-green-500/20 text-green-100 border border-green-400/30'
              : 'bg-red-500/20 text-red-100 border border-red-400/30'
          }`}>
            {message}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-white/70 font-light">
          By signing in, you get 3 free credits to try Skylism.ai.
        </p>
      </div>
    </div>
  )
}