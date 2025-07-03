import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Pricing utilities
export const FLUX_DEV_COST = 0.0025 // $0.0025 per image
export const ESRGAN_COST = 0.01 // $0.01 per upscale
export const API_MARKUP = 1.7
export const CREDIT_PRICE = 0.4 // $0.40 per credit

export function calculateCreditsNeeded(apiCost: number): number {
  const totalCost = apiCost * API_MARKUP
  return Math.ceil(totalCost / CREDIT_PRICE)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Sky options (only one can be selected)
export const SKY_OPTIONS = {
  'standard-blue': {
    name: 'Standard Blue',
    prompt: 'Clear blue sky, perfect sunny day, professional real estate photography',
    icon: '☀️'
  },
  'blue-with-clouds': {
    name: 'Blue with Clouds',
    prompt: 'Blue sky with pleasant white clouds, natural daylight, professional real estate photography',
    icon: '⛅'
  },
  'golden-hour': {
    name: 'Golden Hour',
    prompt: 'Golden hour warm sunset sky, luxury real estate photography, warm tones',
    icon: '🌅'
  },
  'twilight': {
    name: 'Twilight',
    prompt: 'Twilight blue hour sky, warm interior lights glowing, luxury real estate photography',
    icon: '🌆'
  }
} as const

// Enhancement options (multiple can be selected)
export const ENHANCEMENTS = {
  'remove-bins': {
    name: 'Remove bins',
    prompt: 'remove all trash bins, recycling bins, and waste containers'
  },
  'remove-cars': {
    name: 'Remove cars',
    prompt: 'remove all cars, vehicles, and trucks from driveway and street'
  },
  'remove-powerlines': {
    name: 'Remove powerlines',
    prompt: 'remove all power lines, telephone wires, and utility cables'
  },
  'green-grass': {
    name: 'Green up grass',
    prompt: 'make lawn lush green, healthy grass, remove brown patches'
  },
  'remove-clutter': {
    name: 'Remove general clutter',
    prompt: 'remove general clutter, debris, toys, tools, and miscellaneous items'
  }
} as const

export type SkyOptionKey = keyof typeof SKY_OPTIONS
export type EnhancementKey = keyof typeof ENHANCEMENTS