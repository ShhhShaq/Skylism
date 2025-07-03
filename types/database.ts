export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          stripe_customer_id: string | null
          created_at: string
          credits: number
          total_spent: number
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string | null
          created_at?: string
          credits?: number
          total_spent?: number
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string | null
          created_at?: string
          credits?: number
          total_spent?: number
        }
      }
      upload_sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          status: 'active' | 'completed' | 'abandoned'
          total_images: number
          processed_images: number
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          status?: 'active' | 'completed' | 'abandoned'
          total_images?: number
          processed_images?: number
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          status?: 'active' | 'completed' | 'abandoned'
          total_images?: number
          processed_images?: number
        }
      }
      images: {
        Row: {
          id: string
          session_id: string
          user_id: string
          original_url: string
          original_size: number
          uploaded_at: string
          status: 'uploaded' | 'processing' | 'completed' | 'failed'
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          original_url: string
          original_size: number
          uploaded_at?: string
          status?: 'uploaded' | 'processing' | 'completed' | 'failed'
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          original_url?: string
          original_size?: number
          uploaded_at?: string
          status?: 'uploaded' | 'processing' | 'completed' | 'failed'
        }
      }
      edit_jobs: {
        Row: {
          id: string
          image_id: string
          prompt: string
          preset_used: string | null
          api_provider: string
          api_cost: number
          credits_charged: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          completed_at: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          image_id: string
          prompt: string
          preset_used?: string | null
          api_provider: string
          api_cost: number
          credits_charged: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          completed_at?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          image_id?: string
          prompt?: string
          preset_used?: string | null
          api_provider?: string
          api_cost?: number
          credits_charged?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          completed_at?: string | null
          error_message?: string | null
        }
      }
      variations: {
        Row: {
          id: string
          edit_job_id: string
          variation_url: string
          is_selected: boolean
          created_at: string
        }
        Insert: {
          id?: string
          edit_job_id: string
          variation_url: string
          is_selected?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          edit_job_id?: string
          variation_url?: string
          is_selected?: boolean
          created_at?: string
        }
      }
      final_outputs: {
        Row: {
          id: string
          image_id: string
          variation_id: string
          upscaled_url: string
          download_count: number
          created_at: string
        }
        Insert: {
          id?: string
          image_id: string
          variation_id: string
          upscaled_url: string
          download_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          image_id?: string
          variation_id?: string
          upscaled_url?: string
          download_count?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          credits_purchased: number
          amount_paid: number
          stripe_payment_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits_purchased: number
          amount_paid: number
          stripe_payment_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credits_purchased?: number
          amount_paid?: number
          stripe_payment_id?: string
          created_at?: string
        }
      }
    }
  }
}