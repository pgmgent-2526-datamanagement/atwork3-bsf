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
      admin_users: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      device_blocklist: {
        Row: {
          created_at: string | null
          device_hash: string
          id: number
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          device_hash: string
          id?: never
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          device_hash?: string
          id?: never
          reason?: string | null
        }
        Relationships: []
      }
      edition: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: number
          is_active: boolean | null
          name: string
          start_time: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: never
          is_active?: boolean | null
          name: string
          start_time?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: never
          is_active?: boolean | null
          name?: string
          start_time?: string | null
          year?: number
        }
        Relationships: []
      }
      film: {
        Row: {
          created_at: string | null
          edition_id: number | null
          id: number
          image_url: string | null
          maker: string | null
          number: number
          tagline: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          edition_id?: number | null
          id?: never
          image_url?: string | null
          maker?: string | null
          number: number
          tagline?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          edition_id?: number | null
          id?: never
          image_url?: string | null
          maker?: string | null
          number?: number
          tagline?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "edition"
            referencedColumns: ["id"]
          },
        ]
      }
      vote: {
        Row: {
          created_at: string | null
          device_hash: string
          film_id: number | null
          id: number
          ip_address: string | null
          is_valid: boolean | null
          vote_session_id: number | null
        }
        Insert: {
          created_at?: string | null
          device_hash: string
          film_id?: number | null
          id?: never
          ip_address?: string | null
          is_valid?: boolean | null
          vote_session_id?: number | null
        }
        Update: {
          created_at?: string | null
          device_hash?: string
          film_id?: number | null
          id?: never
          ip_address?: string | null
          is_valid?: boolean | null
          vote_session_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "film"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_vote_session_id_fkey"
            columns: ["vote_session_id"]
            isOneToOne: false
            referencedRelation: "vote_session"
            referencedColumns: ["id"]
          },
        ]
      }
      vote_session: {
        Row: {
          created_at: string | null
          edition_id: number | null
          end_time: string
          id: number
          is_active: boolean | null
          qr_code_id: string | null
          start_time: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          edition_id?: number | null
          end_time: string
          id?: never
          is_active?: boolean | null
          qr_code_id?: string | null
          start_time: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          edition_id?: number | null
          end_time?: string
          id?: never
          is_active?: boolean | null
          qr_code_id?: string | null
          start_time?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_session_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "edition"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: "admin" | "user"
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
    Enums: {
      Role: ["admin", "user"],
    },
  },
} as const
