import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createClient } from '@/lib/supabase/server'
import { SKY_OPTIONS, ENHANCEMENTS, FLUX_DEV_COST, calculateCreditsNeeded } from '@/lib/utils'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, selectedSky, selectedEnhancements, customInstructions, userId } = await request.json()

    if (!imageUrl || !selectedSky || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check user credits
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (!user || user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Build combined prompt from sky, enhancements, and custom instructions
    const skyOption = SKY_OPTIONS[selectedSky as keyof typeof SKY_OPTIONS]
    if (!skyOption) {
      return NextResponse.json({ error: 'Invalid sky option' }, { status: 400 })
    }

    // Start with sky prompt
    let combinedPrompt = skyOption.prompt

    // Add selected enhancements
    if (selectedEnhancements && selectedEnhancements.length > 0) {
      const enhancementPrompts = selectedEnhancements
        .map((key: string) => ENHANCEMENTS[key as keyof typeof ENHANCEMENTS]?.prompt)
        .filter(Boolean)
        .join(', ')
      
      if (enhancementPrompts) {
        combinedPrompt += `, ${enhancementPrompts}`
      }
    }

    // Add custom instructions
    if (customInstructions && customInstructions.trim()) {
      combinedPrompt += `, ${customInstructions.trim()}`
    }

    // Always end with professional real estate photography for consistency
    combinedPrompt += ', professional real estate photography'

    // Deduct credits
    const { data: deductResult } = await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: 1
    })

    if (!deductResult) {
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 })
    }

    // Run Flux Dev model
    const output = await replicate.run(
      "black-forest-labs/flux-dev",
      {
        input: {
          prompt: combinedPrompt,
          image: imageUrl,
          prompt_strength: 0.8,
          num_outputs: 4,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90,
          seed: Math.floor(Math.random() * 1000000)
        }
      }
    ) as unknown as string[]

    // Create edit job record
    const { data: editJob } = await supabase
      .from('edit_jobs')
      .insert({
        image_id: userId, // This should be actual image ID
        prompt: combinedPrompt,
        preset_used: selectedSky, // Store the sky option as the preset
        api_provider: 'flux-dev',
        api_cost: FLUX_DEV_COST * 4, // 4 variations
        credits_charged: 1,
        status: 'completed'
      })
      .select()
      .single()

    // Save variations
    if (editJob && output) {
      const variations = output.map(url => ({
        edit_job_id: editJob.id,
        variation_url: url
      }))

      await supabase
        .from('variations')
        .insert(variations)
    }

    return NextResponse.json({ 
      success: true, 
      variations: output,
      creditsRemaining: user.credits - 1
    })

  } catch (error) {
    console.error('Enhancement error:', error)
    return NextResponse.json({ 
      error: 'Failed to enhance image' 
    }, { status: 500 })
  }
}