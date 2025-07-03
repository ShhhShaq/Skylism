'use client'

import { useState, useEffect, useRef } from 'react'

const testimonialImages = [
  {
    id: 1,
    photographer: "Sarah Chen",
    specialty: "Luxury Real Estate",
    location: "Los Angeles, CA",
    quote: "Skylism turned my overcast listing photos into stunning sunny-day shots that sold the property in 3 days",
    gradient: "from-gray-700 to-gray-800"
  },
  {
    id: 2,
    photographer: "Marcus Rodriguez", 
    specialty: "Real Estate Photography",
    location: "Miami, FL",
    quote: "The twilight enhancement feature makes every property look like a million-dollar listing",
    gradient: "from-gray-600 to-gray-700"
  },
  {
    id: 3,
    photographer: "Emily Thompson",
    specialty: "Real Estate Marketing", 
    location: "New York, NY",
    quote: "Removing construction debris and cars from driveways saves me hours of staging time",
    gradient: "from-gray-800 to-gray-900"
  },
  {
    id: 4,
    photographer: "David Park",
    specialty: "Property Photography",
    location: "Seattle, WA", 
    quote: "Perfect blue skies in Seattle? My clients think I wait weeks for the weather - they have no idea!",
    gradient: "from-gray-700 to-gray-800"
  },
  {
    id: 5,
    photographer: "Jessica Williams",
    specialty: "Real Estate Media",
    location: "Denver, CO",
    quote: "The curb appeal enhancement makes lawns greener and driveways cleaner than reality",
    gradient: "from-gray-600 to-gray-700"
  },
  {
    id: 6,
    photographer: "Alex Turner",
    specialty: "Commercial Real Estate", 
    location: "Austin, TX",
    quote: "Power line removal and sky replacement transformed my commercial property portfolio",
    gradient: "from-gray-800 to-gray-900"
  },
  {
    id: 7,
    photographer: "Maria Santos",
    specialty: "Residential Photography",
    location: "San Francisco, CA",
    quote: "Neighbors' trash bins and cars disappear like magic - my listings look pristine",
    gradient: "from-gray-700 to-gray-800"
  },
  {
    id: 8,
    photographer: "James Wilson",
    specialty: "Vacation Rentals",
    location: "Chicago, IL", 
    quote: "Bright blue skies make my Airbnb listings get 3x more bookings",
    gradient: "from-gray-600 to-gray-700"
  }
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2) // Start at 2 to account for duplicates
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // Create seamless loop by duplicating first 2 and last 2 items
  const extendedImages = [
    ...testimonialImages.slice(-2), // Last 2 items at beginning
    ...testimonialImages,           // All original items
    ...testimonialImages.slice(0, 2) // First 2 items at end
  ]

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1)
    }, 2500)

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    // Handle seamless loop transitions
    if (currentIndex >= testimonialImages.length + 2) {
      // When we reach the duplicated items at the end, jump to beginning
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(2) // Jump to real first item
        setTimeout(() => setIsTransitioning(true), 50)
      }, 1000) // Wait for transition to complete
    } else if (currentIndex <= 1) {
      // When we reach the duplicated items at the beginning, jump to end
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(testimonialImages.length + 1) // Jump to real last item
        setTimeout(() => setIsTransitioning(true), 50)
      }, 1000)
    }
  }, [currentIndex])

  return (
    <div className="relative">
      {/* Testimonial Text */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <h3 className="text-xl sm:text-2xl font-light text-white mb-3 md:mb-4">
          Trusted by real estate photographers worldwide
        </h3>
        <p className="text-white/70 font-light max-w-xl mx-auto text-sm sm:text-base">
          Join thousands of professional photographers who deliver consistent, stunning results to their clients
        </p>
      </div>

      {/* Infinite Carousel */}
      <div 
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={carouselRef}
          className={`flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${currentIndex * (isMobile ? 100 : 100 / 3)}%)` }}
        >
          {extendedImages.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-full md:w-1/3 flex-shrink-0 px-3"
            >
              <div className={`aspect-[3/2] bg-gradient-to-br ${testimonial.gradient} rounded-2xl relative overflow-hidden group md:hover:scale-105 transition-transform duration-500`}>
                {/* Photo placeholder with photographer info */}
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4 sm:p-6">
                  <div className="text-right">
                    <div className="text-white/90 text-xs font-light mb-1">{testimonial.specialty}</div>
                    <div className="text-white/70 text-xs font-light">{testimonial.location}</div>
                  </div>
                  
                  <div className="text-white">
                    <p className="text-xs sm:text-sm font-light mb-2 sm:mb-3 italic">"{testimonial.quote}"</p>
                    <h4 className="font-light text-base sm:text-lg">{testimonial.photographer}</h4>
                  </div>
                </div>
                
                {/* Subtle animation effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/2 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}