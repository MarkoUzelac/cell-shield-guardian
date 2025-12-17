export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_logs: {
        Row: {
          browser: string | null
          device_type: string | null
          geolocation: Json | null
          id: string
          ip_address: string | null
          isp: string | null
          link_id: string | null
          os: string | null
          timestamp: string
        }
        Insert: {
          browser?: string | null
          device_type?: string | null
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          isp?: string | null
          link_id?: string | null
          os?: string | null
          timestamp?: string
        }
        Update: {
          browser?: string | null
          device_type?: string | null
          geolocation?: Json | null
          id?: string
          ip_address?: string | null
          isp?: string | null
          link_id?: string | null
          os?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          label: string | null
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          label?: string | null
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          label?: string | null
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      circuit_breakers: {
        Row: {
          failure_count: number | null
          last_failure_at: string | null
          service_name: string
          state: string | null
        }
        Insert: {
          failure_count?: number | null
          last_failure_at?: string | null
          service_name: string
          state?: string | null
        }
        Update: {
          failure_count?: number | null
          last_failure_at?: string | null
          service_name?: string
          state?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          error: string | null
          id: string
          recipient: string | null
          sent_at: string | null
          status: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          error?: string | null
          id?: string
          recipient?: string | null
          sent_at?: string | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          error?: string | null
          id?: string
          recipient?: string | null
          sent_at?: string | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          digest_frequency: string | null
          marketing_emails: boolean | null
          updated_at: string | null
          user_id: string
          visitor_alerts: boolean | null
        }
        Insert: {
          digest_frequency?: string | null
          marketing_emails?: boolean | null
          updated_at?: string | null
          user_id: string
          visitor_alerts?: boolean | null
        }
        Update: {
          digest_frequency?: string | null
          marketing_emails?: boolean | null
          updated_at?: string | null
          user_id?: string
          visitor_alerts?: boolean | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          request_type: string
          scheduled_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          request_type: string
          scheduled_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          request_type?: string
          scheduled_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_usage_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "gdpr_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      idempotency_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          key: string
          response_body: Json | null
          response_status: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          key: string
          response_body?: Json | null
          response_status?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          key?: string
          response_body?: Json | null
          response_status?: number | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          stripe_invoice_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_usage_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_whitelist: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          label: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          label?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          label?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempts: number | null
          ip_address: string
          last_attempt_at: string | null
          locked_until: string | null
        }
        Insert: {
          attempts?: number | null
          ip_address: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Update: {
          attempts?: number | null
          ip_address?: string
          last_attempt_at?: string | null
          locked_until?: string | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          attempted_at: string | null
          browser: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          location: string | null
          os: string | null
          status: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempted_at?: string | null
          browser?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          os?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_at?: string | null
          browser?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          os?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      password_history: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          blocked_until: string | null
          count: number | null
          endpoint: string
          ip_address: string
          window_start: string | null
        }
        Insert: {
          blocked_until?: string | null
          count?: number | null
          endpoint: string
          ip_address: string
          window_start?: string | null
        }
        Update: {
          blocked_until?: string | null
          count?: number | null
          endpoint?: string
          ip_address?: string
          window_start?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          endpoint: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          method: string | null
          status: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          endpoint?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          method?: string | null
          status?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          method?: string | null
          status?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          cloud_flare_enabled: boolean | null
          notify_failed_login: boolean | null
          notify_new_ip: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cloud_flare_enabled?: boolean | null
          notify_failed_login?: boolean | null
          notify_new_ip?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cloud_flare_enabled?: boolean | null
          notify_failed_login?: boolean | null
          notify_new_ip?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          owner_id: string
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          owner_id: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          owner_id?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tower_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          lat_chunk: number
          lng_chunk: number
          payload: Json
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          lat_chunk: number
          lng_chunk: number
          payload: Json
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          lat_chunk?: number
          lng_chunk?: number
          payload?: Json
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          browser: string | null
          device_type: string | null
          geolocation: Json | null
          gps_accuracy: number | null
          gps_lat: number | null
          gps_lng: number | null
          gps_timestamp: string | null
          id: string
          ip_address: string | null
          isp: string | null
          link_id: string | null
          load_time: number | null
          network_type: string | null
          os: string | null
          signal_strength: number | null
          timestamp: string | null
          user_consent: boolean | null
        }
        Insert: {
          browser?: string | null
          device_type?: string | null
          geolocation?: Json | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gps_timestamp?: string | null
          id?: string
          ip_address?: string | null
          isp?: string | null
          link_id?: string | null
          load_time?: number | null
          network_type?: string | null
          os?: string | null
          signal_strength?: number | null
          timestamp?: string | null
          user_consent?: boolean | null
        }
        Update: {
          browser?: string | null
          device_type?: string | null
          geolocation?: Json | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gps_timestamp?: string | null
          id?: string
          ip_address?: string | null
          isp?: string | null
          link_id?: string | null
          load_time?: number | null
          network_type?: string | null
          os?: string | null
          signal_strength?: number | null
          timestamp?: string | null
          user_consent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "tracking_links"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_links: {
        Row: {
          allow_gps: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          link_settings: Json | null
          password_hash: string | null
          slug: string
          user_id: string
          visit_count: number | null
        }
        Insert: {
          allow_gps?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          link_settings?: Json | null
          password_hash?: string | null
          slug: string
          user_id: string
          visit_count?: number | null
        }
        Update: {
          allow_gps?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          link_settings?: Json | null
          password_hash?: string | null
          slug?: string
          user_id?: string
          visit_count?: number | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          created_at: string | null
          granted: boolean
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          version: string
        }
        Insert: {
          consent_type: string
          created_at?: string | null
          granted: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          version: string
        }
        Update: {
          consent_type?: string
          created_at?: string | null
          granted?: boolean
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_usage_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_searches: {
        Row: {
          created_at: string
          id: string
          lat: number
          lng: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lat: number
          lng: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visitor_alert_limits: {
        Row: {
          last_sent_at: string | null
          link_id: string
        }
        Insert: {
          last_sent_at?: string | null
          link_id: string
        }
        Update: {
          last_sent_at?: string | null
          link_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_alert_limits_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "tracking_links"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_usage_stats: {
        Row: {
          links_created: number | null
          links_limit: number | null
          subscription_plan: string | null
          total_visits: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_data: { Args: never; Returns: undefined }
      update_subscription_status: {
        Args: {
          p_customer_id: string
          p_end_date: string
          p_plan: string
          p_status: string
          p_subscription_id: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
