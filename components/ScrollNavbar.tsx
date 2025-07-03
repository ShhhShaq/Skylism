'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileMenu from './MobileMenu'

export default function ScrollNavbar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling 100px
      const shouldShow = window.scrollY > 100
      setIsVisible(shouldShow)
    }

    // Add delay for smooth appearance
    const debouncedHandleScroll = () => {
      setTimeout(() => handleScroll(), 200)
    }

    window.addEventListener('scroll', debouncedHandleScroll)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [])

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <img 
                src="/images/logo/skylism-logo-black.png" 
                alt="Skylism.ai" 
                className="h-6 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 md:space-x-6 lg:space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-gray-900 text-sm transition-all duration-300 hover:tracking-wide font-light">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm transition-all duration-300 hover:tracking-wide font-light">
                Pricing
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-gray-900 text-white px-4 sm:px-6 py-2 rounded-2xl text-sm font-light hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started →
              </Link>
            </div>
            
            {/* Mobile Menu */}
            <MobileMenu isWhite={true} />
          </div>
        </div>
      </nav>
    </div>
  )
}