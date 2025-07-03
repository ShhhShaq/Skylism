'use client'

import { useState, useEffect, useRef } from 'react'

export default function ScrollRevealSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const sectionHeight = containerRef.current.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate progress based on how much of the section has been scrolled through
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Section is in "sticky" mode
        const scrolled = Math.abs(rect.top)
        const maxScroll = sectionHeight - windowHeight
        const rawProgress = Math.min(Math.max(scrolled / maxScroll, 0), 1)
        setScrollProgress(rawProgress)
      } else if (rect.top > 0) {
        // Section hasn't started yet
        setScrollProgress(0)
      } else {
        // Section is fully past
        setScrollProgress(1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate card growth and blend progress
  const cardScale = Math.min(0.85 + (scrollProgress * 0.15), 1) // Grows from 85% to 100%
  const cardRadius = Math.max(24 - (scrollProgress * 24), 0) // Border radius decreases from 24px to 0
  const blendProgress = Math.max((scrollProgress - 0.2) / 0.8, 0) // Blend starts at 20% scroll

  return (
    <div 
      ref={containerRef}
      className="relative px-4"
      style={{ height: '200vh' }} // Double viewport height for scroll effect
    >
      <div 
        ref={sectionRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center"
      >
        <div 
          className="relative w-full h-full overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            transform: `scale(${cardScale})`,
            borderRadius: `${cardRadius}px`
          }}
        >
          {/* Background Image - Original */}
          <div className="absolute inset-0">
            <img
              src="/images/scroll-reveal-before.jpg"
              alt="Original property photo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Image - Enhanced */}
          <div 
            className="absolute inset-0 transition-opacity duration-100 ease-out"
            style={{ opacity: blendProgress }}
          >
            <img
              src="/images/scroll-reveal-after.jpg"
              alt="AI enhanced property photo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10">
              <div 
                className="transition-all duration-500 ease-out"
                style={{
                  transform: `translateY(${(1 - scrollProgress) * 20}px)`,
                  opacity: 0.4 + (scrollProgress * 0.6)
                }}
              >
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-2 text-shadow-xl tracking-tight">
                  Real AI.
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-8 text-shadow-xl tracking-tight">
                  Real results.
                </h2>
                <div className="max-w-3xl mx-auto px-4">
                  <p 
                    className="text-xl sm:text-2xl font-light text-shadow-lg transition-all duration-500 tracking-wide"
                    style={{ 
                      opacity: blendProgress,
                      transform: `translateY(${(1 - blendProgress) * 10}px)`
                    }}
                  >
                    Watch ordinary photos become extraordinary listings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex flex-col items-center space-y-3">
              <div className="text-white/80 text-sm font-light tracking-wider">
                {Math.round(blendProgress * 100)}% Enhanced
              </div>
              <div className="w-40 h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${blendProgress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Before/After Labels */}
          <div className="absolute bottom-6 left-6 text-white text-sm font-light z-20">
            <div 
              className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded transition-opacity duration-300"
              style={{ opacity: 1 - blendProgress }}
            >
              Original
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 text-white text-sm font-light z-20">
            <div 
              className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded transition-opacity duration-300"
              style={{ opacity: blendProgress }}
            >
              AI Enhanced
            </div>
          </div>

          {/* Scroll hint - only visible at start */}
          <div 
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/70 text-center transition-all duration-500 z-20"
            style={{ 
              opacity: 1 - scrollProgress,
              transform: `translate(-50%, ${scrollProgress * 20}px)`
            }}
          >
            <div className="animate-bounce">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div className="text-sm font-light tracking-wide">Scroll to experience the transformation</div>
          </div>
        </div>
      </div>
    </div>
  )
}