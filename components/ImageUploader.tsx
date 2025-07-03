'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { formatFileSize, PRESETS, PresetKey } from '@/lib/utils'
import ImageEditor from './ImageEditor'

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploaded: boolean
  sessionId?: string
}

interface ImageUploaderProps {
  userId: string
  credits: number
  onCreditsUpdate: (credits: number) => void
}

export default function ImageUploader({ userId, credits, onCreditsUpdate }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }))
    
    setImages(prev => [...prev, ...newImages])
    uploadFiles(newImages)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    maxFiles: 20
  })

  const uploadFiles = async (filesToUpload: UploadedImage[]) => {
    setUploading(true)
    
    try {
      // Create upload session
      const { data: session } = await supabase
        .from('upload_sessions')
        .insert({
          user_id: userId,
          total_images: filesToUpload.length
        })
        .select()
        .single()

      if (!session) throw new Error('Failed to create upload session')

      // Upload each file
      for (const image of filesToUpload) {
        const fileName = `${userId}/${session.id}/${image.id}.${image.file.name.split('.').pop()}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)

        // Save image record
        await supabase
          .from('images')
          .insert({
            session_id: session.id,
            user_id: userId,
            original_url: publicUrl,
            original_size: image.file.size
          })

        // Update local state
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, uploaded: true, sessionId: session.id }
            : img
        ))
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSelectImage = (image: UploadedImage) => {
    if (image.uploaded) {
      setSelectedImage(image)
    }
  }

  if (selectedImage) {
    return (
      <ImageEditor
        image={selectedImage}
        userId={userId}
        credits={credits}
        onCreditsUpdate={onCreditsUpdate}
        onBack={() => setSelectedImage(null)}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm ${
          isDragActive 
            ? 'border-white/60 bg-white/20' 
            : 'border-white/30 hover:border-white/50 hover:bg-white/10'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="text-5xl animate-pulse">📸</div>
          <div>
            <h3 className="text-2xl font-light text-white mb-2">
              {isDragActive ? 'Drop your images here' : 'Upload your images'}
            </h3>
            <p className="text-white/70 font-light">
              Drag and drop up to 20 images, or click to browse
            </p>
            <p className="text-sm text-white/60 mt-2 font-light">
              Supports JPEG, PNG, WebP • Max 25MB per image
            </p>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-xl font-light text-white mb-6">
            Uploaded Images ({images.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  image.uploaded 
                    ? 'border-green-400/50 hover:border-white/50' 
                    : 'border-white/20'
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <div className="aspect-square">
                  <img
                    src={image.preview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-sm">
                  {!image.uploaded && (
                    <div className="text-white text-sm font-light">Uploading...</div>
                  )}
                  {image.uploaded && (
                    <div className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity font-light">
                      Click to edit
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="absolute top-2 right-2">
                  {image.uploaded ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                {/* File info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm text-white text-xs p-2 rounded-b-2xl">
                  <div className="truncate font-light">{image.file.name}</div>
                  <div className="font-light">{formatFileSize(image.file.size)}</div>
                </div>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="text-center py-4">
              <div className="text-sm text-white/70 font-light animate-pulse">
                Uploading images... Please wait.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Presets Preview */}
      {images.length === 0 && (
        <div>
          <h3 className="text-xl font-light text-white mb-6">Available Presets</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <div key={key} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">{preset.icon}</div>
                <h4 className="font-light text-white mb-2">{preset.name}</h4>
                <p className="text-sm text-white/70 mb-3 font-light">
                  {preset.prompt.split(',')[0]}
                </p>
                <div className="text-xs text-white/90 font-light bg-white/10 px-2 py-1 rounded-lg inline-block">
                  {preset.credits} credit{preset.credits !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}