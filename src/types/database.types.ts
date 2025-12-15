export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          total_earnings: number
          reputation_score: number
          total_reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          total_earnings?: number
          reputation_score?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          total_earnings?: number
          reputation_score?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string
          website_url: string | null
          logo_url: string | null
          pricing_type: string | null
          average_rating: number
          total_reviews: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category: string
          website_url?: string | null
          logo_url?: string | null
          pricing_type?: string | null
          average_rating?: number
          total_reviews?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          website_url?: string | null
          logo_url?: string | null
          pricing_type?: string | null
          average_rating?: number
          total_reviews?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          tool_id: string
          user_id: string
          rating: number
          title: string
          content: string
          output_description: string | null
          output_files: Json | null
          prompt_used: string | null
          use_case: string | null
          time_spent: number | null
          is_verified: boolean
          ai_quality_score: number | null
          upvotes: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tool_id: string
          user_id: string
          rating: number
          title: string
          content: string
          output_description?: string | null
          output_files?: Json | null
          prompt_used?: string | null
          use_case?: string | null
          time_spent?: number | null
          is_verified?: boolean
          ai_quality_score?: number | null
          upvotes?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tool_id?: string
          user_id?: string
          rating?: number
          title?: string
          content?: string
          output_description?: string | null
          output_files?: Json | null
          prompt_used?: string | null
          use_case?: string | null
          time_spent?: number | null
          is_verified?: boolean
          ai_quality_score?: number | null
          upvotes?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          tool_id: string | null
          creator_id: string | null
          title: string
          description: string
          requirements: string | null
          reward_amount: number
          total_slots: number
          filled_slots: number
          deadline: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          tool_id?: string | null
          creator_id?: string | null
          title: string
          description: string
          requirements?: string | null
          reward_amount: number
          total_slots: number
          filled_slots?: number
          deadline?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          tool_id?: string | null
          creator_id?: string | null
          title?: string
          description?: string
          requirements?: string | null
          reward_amount?: number
          total_slots?: number
          filled_slots?: number
          deadline?: string | null
          status?: string
          created_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string | null
          created_at?: string
        }
      }
    }
  }
}

