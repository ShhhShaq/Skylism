'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SKY_OPTIONS, ENHANCEMENTS, SkyOptionKey, EnhancementKey } from '@/lib/utils'

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploaded: boolean
  sessionId?: string
}

interface Variation {
  id: string
  url: string
  selected: boolean
}

interface ImageEditorProps {
  image: UploadedImage
  userId: string
  credits: number
  onCreditsUpdate: (credits: number) => void
  onBack: () => void
}

export default function ImageEditor({ 
  image, 
  userId, 
  credits, 
  onCreditsUpdate, 
  onBack 
}: ImageEditorProps) {
  const [selectedSky, setSelectedSky] = useState<SkyOptionKey>('standard-blue')
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementKey[]>([])
  const [customInstructions, setCustomInstructions] = useState('')
  const [variations, setVariations] = useState<Variation[]>([])
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [upscaling, setUpscaling] = useState(false)
  const [finalImage, setFinalImage] = useState<string | null>(null)
  const supabase = createClient()

  const handleGenerate = async () => {
    if (credits < 1) {
      alert('Insufficient credits! Please purchase more credits.')
      return
    }

    setProcessing(true)
    setVariations([])

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: image.preview,
          selectedSky: selectedSky,
          selectedEnhancements: selectedEnhancements,
          customInstructions: customInstructions,
          userId: userId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      
      if (data.variations) {
        setVariations(data.variations.map((url: string, index: number) => ({
          id: `var-${index}`,
          url,
          selected: false
        })))
        
        // Update credits
        onCreditsUpdate(credits - 1)
      }
    } catch (error) {
      console.error('Processing error:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleVariationSelect = (variationId: string) => {
    setSelectedVariation(variationId)
    setVariations(prev => prev.map(v => ({
      ...v,
      selected: v.id === variationId
    })))
  }

  const handleUpscale = async () => {
    if (!selectedVariation) return

    setUpscaling(true)

    try {
      const selectedVar = variations.find(v => v.id === selectedVariation)
      if (!selectedVar) return

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedVar.url,
          userId: userId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upscale image')
      }

      const data = await response.json()
      setFinalImage(data.upscaledUrl)
    } catch (error) {
      console.error('Upscaling error:', error)
      alert('Failed to upscale image. Please try again.')
    } finally {
      setUpscaling(false)
    }
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 sm:space-x-2 text-white/80 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base">Back</span>
        </button>
        
        <div className="text-sm text-white/80">
          Credits: <span className="font-semibold">{credits}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
        {/* Left Panel - Controls */}
        <div className="md:col-span-2 lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-lg font-light text-white mb-4">Original Image</h3>
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/20">
              <img
                src={image.preview}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-sm text-white/60 truncate">
              {image.file.name}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-light text-white mb-4">Choose Sky</h3>
            <div className="space-y-2 mb-6">
              {Object.entries(SKY_OPTIONS).map(([key, option]) => (
                <label
                  key={key}
                  className={`block p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-300 md:hover:scale-105 backdrop-blur-sm ${
                    selectedSky === key
                      ? 'border-white/50 bg-white/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="sky"
                      value={key}
                      checked={selectedSky === key}
                      onChange={(e) => setSelectedSky(e.target.value as SkyOptionKey)}
                      className="sr-only"
                    />
                    <span className="text-xl">{option.icon}</span>
                    <div className="font-light text-white">{option.name}</div>
                  </div>
                </label>
              ))}
            </div>

            <h3 className="text-xl font-light text-white mb-4">Enhancements</h3>
            <div className="space-y-2">
              {Object.entries(ENHANCEMENTS).map(([key, enhancement]) => (
                <label
                  key={key}
                  className={`block p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-300 md:hover:scale-105 backdrop-blur-sm ${
                    selectedEnhancements.includes(key as EnhancementKey)
                      ? 'border-white/50 bg-white/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedEnhancements.includes(key as EnhancementKey)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEnhancements([...selectedEnhancements, key as EnhancementKey])
                        } else {
                          setSelectedEnhancements(selectedEnhancements.filter(k => k !== key))
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      selectedEnhancements.includes(key as EnhancementKey)
                        ? 'border-white bg-white'
                        : 'border-white/50 bg-transparent'
                    }`}>
                      {selectedEnhancements.includes(key as EnhancementKey) && (
                        <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="font-light text-white">{enhancement.name}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-light text-white/90 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Remove neighbor's car, brighten windows, fix broken shutters..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/60 font-light transition-all duration-300 hover:bg-white/15"
                rows={3}
              />
              <p className="text-xs text-white/60 mt-1 font-light">
                Add specific details to customize the enhancement
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={processing || credits < 1}
              className="w-full mt-4 bg-white/20 backdrop-blur-sm text-white py-3 px-4 sm:px-6 rounded-2xl font-light hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 md:hover:scale-105 hover:shadow-xl border border-white/20"
            >
              {processing ? 'Generating...' : 'Generate (1 credit)'}
            </button>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="md:col-span-2 lg:col-span-2 space-y-6">
          {processing && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
              <p className="text-white/70 font-light">Generating 4 variations...</p>
            </div>
          )}

          {variations.length > 0 && (
            <div>
              <h3 className="text-lg font-light text-white mb-4">AI Variations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {variations.map((variation) => (
                  <div
                    key={variation.id}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                      variation.selected
                        ? 'border-white/50 ring-2 ring-white/30'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                    onClick={() => handleVariationSelect(variation.id)}
                  >
                    <div className="aspect-video">
                      <img
                        src={variation.url}
                        alt={`Variation ${variation.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {variation.selected && (
                      <div className="absolute top-2 right-2 bg-white text-gray-900 p-1.5 rounded-full">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedVariation && (
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={processing}
                    className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-2.5 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 w-full sm:w-auto"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleUpscale}
                    disabled={upscaling}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2.5 rounded-2xl hover:bg-white/30 transition-all duration-300 border border-white/20 w-full sm:w-auto"
                  >
                    {upscaling ? 'Upscaling...' : 'Upscale & Finalize'}
                  </button>
                </div>
              )}
            </div>
          )}

          {finalImage && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Final Result</h3>
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={finalImage}
                  alt="Final result"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleDownload(finalImage, `skylism-${image.file.name}`)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Download High-Res Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}