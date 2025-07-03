'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MobileMenuProps {
  isWhite?: boolean
}

export default function MobileMenu({ isWhite = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuColor = isWhite ? 'text-gray-900' : 'text-white'
  const menuBg = isWhite ? 'bg-white' : 'bg-slate-800'
  const borderColor = isWhite ? 'border-gray-200' : 'border-white/20'

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center ${menuColor}`}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 ${isWhite ? 'bg-gray-900' : 'bg-white'} transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`block w-6 h-0.5 ${isWhite ? 'bg-gray-900' : 'bg-white'} mt-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 ${isWhite ? 'bg-gray-900' : 'bg-white'} mt-1.5 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Background overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu panel */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-sm ${menuBg} transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-20 px-6 pb-6">
            {/* Logo */}
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="block mb-8"
            >
              <img 
                src={isWhite ? "/images/logo/skylism-logo-black.png" : "/images/logo/skylism-logo-white.png"} 
                alt="Skylism.ai" 
                className="h-7 w-auto"
              />
            </Link>
            
            {/* Menu items */}
            <nav className="flex flex-col space-y-6">
              <Link 
                href="#features" 
                onClick={() => setIsOpen(false)}
                className={`${menuColor} opacity-80 hover:opacity-100 text-lg font-light transition-all duration-300 py-2 border-b ${borderColor}`}
              >
                Features
              </Link>
              <Link 
                href="#pricing" 
                onClick={() => setIsOpen(false)}
                className={`${menuColor} opacity-80 hover:opacity-100 text-lg font-light transition-all duration-300 py-2 border-b ${borderColor}`}
              >
                Pricing
              </Link>
              
              {/* CTA Button */}
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className={`mt-6 ${isWhite ? 'bg-gray-900 text-white' : 'bg-white/20 backdrop-blur-sm text-white border border-white/20'} px-6 py-3 rounded-2xl text-center font-light hover:scale-105 transition-all duration-300`}
              >
                Get Started →
              </Link>
            </nav>
            
            {/* Bottom content */}
            <div className="mt-auto">
              <p className={`text-sm ${menuColor} opacity-60 font-light`}>
                Perfect listing photos. Every time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}