'use client'

import { useState, useRef } from 'react'

interface BeforeAfterSliderProps {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({ 
  beforeImage = "/images/before.jpg", 
  afterImage = "/images/after.jpg", 
  beforeLabel = "Before", 
  afterLabel = "After" 
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-[3/4] sm:aspect-[4/3] overflow-hidden cursor-col-resize select-none group rounded-2xl"
      data-lenis-prevent
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <img 
          src={beforeImage} 
          alt={beforeLabel}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6">
          <div className="text-white text-xs sm:text-sm font-light tracking-wider drop-shadow-lg bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded">
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* After Image - Clipped */}
      <div 
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={afterImage} 
          alt={afterLabel}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6">
          <div className="text-white text-xs sm:text-sm font-light tracking-wider drop-shadow-lg bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
            {afterLabel}
          </div>
        </div>
      </div>

      {/* Minimalist Slider */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Minimal Handle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-10 sm:h-10 cursor-col-resize touch-none"
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY
            })
            handleMouseDown(mouseEvent as any)
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}