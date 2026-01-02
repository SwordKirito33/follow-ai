/**
 * CRITICAL: This must match the Supabase schema from PART A SQL
 * Last synced: 2025-12-17
 * 
 * JSONB HANDLING NOTE:
 * Fields like `skills` and `ai_tools` are JSONB in PostgreSQL
 * but TypeScript sees them as arrays. Supabase automatically
 * handles serialization both ways.
 * 
 * ✅ CORRECT:
 * await supabase.from('profiles').update({
 *   skills: ['React', 'TypeScript'] // Pass JavaScript array
 * })
 * 
 * ❌ WRONG:
 * await supabase.from('profiles').update({
 *   skills: '["React","TypeScript"]' // Don't stringify
 * })
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          xp: number;
          level: number;
          total_xp: number;
          profile_completion: number;
          skills: string[]; // JSONB → array
          ai_tools: string[]; // JSONB → array
          reputation_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          total_xp?: number;
          profile_completion?: number;
          skills?: string[];
          ai_tools?: string[];
          reputation_score?: number;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      
      xp_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          source: string;
          source_id: string | null;
          is_penalty: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          amount: number;
          reason?: string;
          source: string;
          source_id?: string | null;
          is_penalty?: boolean;
        };
      };
      
      tasks: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string;
          task_type: 'xp_challenge' | 'bounty' | 'hire';
          reward_xp: number;
          reward_amount_cents: number;
          currency: string;
          min_level: number;
          min_profile_completion: number;
          required_ai_tools: string[];
          required_word_count: number;
          required_language: 'auto' | 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr';
          max_submissions_per_user: number;
          max_approved_submissions: number | null;
          category: string | null;
          difficulty: number;
          priority: number;
          submission_count: number;
          approved_count: number;
          status: 'draft' | 'active' | 'closed' | 'archived';
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      
      task_submissions: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          output_url: string | null;
          output_text: string | null;
          word_count: number;
          ai_tools_used: string[];
          experience_text: string | null;
          review_language: 'auto' | 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr';
          quality_score_ai: number | null;
          quality_score_manual: number | null;
          status: 'pending' | 'approved' | 'rejected' | 'flagged';
          reward_xp_awarded: number;
          reward_amount_cents_awarded: number;
          is_cheating: boolean;
          similarity_score: number | null; // Reserved for Phase 2
          ai_generated_prob: number | null; // Reserved for Phase 2
          created_at: string;
          updated_at: string;
        };
        Insert: {
          task_id: string;
          user_id: string;
          output_url?: string | null;
          output_text?: string | null;
          word_count?: number;
          ai_tools_used?: string[];
          experience_text?: string | null;
          review_language?: 'auto' | 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr';
          status?: 'pending' | 'approved' | 'rejected' | 'flagged';
        };
      };
      
      task_applications: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
        Insert: {
          task_id: string;
          user_id: string;
          status?: 'pending' | 'accepted' | 'rejected';
        };
        Update: Partial<Database['public']['Tables']['task_applications']['Insert']>;
      };
      
      portfolio_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          link?: string | null;
        };
      };
      
      upload_logs: {
        Row: {
          id: string;
          user_id: string;
          bucket: string;
          file_size: number | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          bucket: string;
          file_size?: number | null;
          ip_address?: string | null;
        };
      };
      
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          total_purchased: number;
          total_spent: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          total_purchased?: number;
          total_spent?: number;
          currency?: string;
        };
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>;
      };
      
      payments: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_id: string;
          amount: number;
          xp_amount: number | null;
          status: 'pending' | 'completed' | 'failed';
          type?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_payment_id: string;
          amount: number;
          xp_amount?: number | null;
          status?: 'pending' | 'completed' | 'failed';
          type?: string | null;
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
    };
    Functions: {
      admin_grant_xp: {
        Args: {
          p_user_id: string;
          p_delta_xp: number;
          p_source: string;
          p_ref_type: string | null;
          p_ref_id: string | null;
          p_note: string | null;
          p_metadata: Record<string, any>;
        };
        Returns: void;
      };
    };
  };
}

