'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import ImageUploader from './ImageUploader'
import CreditBalance from './CreditBalance'
import ScrollAnimations from './ScrollAnimations'
import { useRouter } from 'next/navigation'

type Profile = Database['public']['Tables']['users']['Row']

interface DashboardProps {
  user: User
  profile: Profile | null
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const [credits, setCredits] = useState(profile?.credits || 0)
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
      <ScrollAnimations />
      {/* Floating particles background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/8 rounded-full animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/8 rounded-full animate-float"></div>
        <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-white/5 rounded-full animate-float-delay"></div>
      </div>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src="/images/logo/skylism-logo-white.png" 
                alt="Skylism.ai" 
                className="h-6 w-auto"
              />
              <span className="text-white/60 font-light hidden sm:inline">Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <CreditBalance credits={credits} onCreditsUpdate={updateCredits} />
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-white/80 font-light hidden md:inline">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-white/70 hover:text-white font-light hover:tracking-wide transition-all duration-300 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {credits === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 animate-scale-in">
            <div className="text-6xl mb-6 animate-pulse">💳</div>
            <h2 className="text-3xl font-light text-white mb-4">
              You're out of credits!
            </h2>
            <p className="text-white/70 mb-8 font-light text-lg">
              Purchase more credits to continue editing your images.
            </p>
            <CreditBalance credits={credits} onCreditsUpdate={updateCredits} showPurchaseButton />
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-light text-white mb-4 leading-tight">
                Transform Your Images
              </h2>
              <p className="text-white/70 font-light text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
                Upload your photos and enhance them with AI-powered sky replacement and decluttering.
              </p>
            </div>

            <div className="animate-on-scroll">
              <ImageUploader 
                userId={user.id} 
                credits={credits}
                onCreditsUpdate={updateCredits}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}