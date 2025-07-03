import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userId } = await request.json()

    if (!imageUrl || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run ESRGAN upscaling
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4f5e4de5cf67e5e2c2c5ee2e8",
      {
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: false
        }
      }
    ) as unknown as string

    return NextResponse.json({ 
      success: true, 
      upscaledUrl: output
    })

  } catch (error) {
    console.error('Upscaling error:', error)
    return NextResponse.json({ 
      error: 'Failed to upscale image' 
    }, { status: 500 })
  }
}