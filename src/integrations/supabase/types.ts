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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      event_settings: {
        Row: {
          created_at: string
          currency: string | null
          emergency_fields_enabled: boolean
          event_date: string | null
          event_description: string | null
          event_distance: string | null
          event_location: string | null
          event_name: string
          event_time: string | null
          id: string
          payment_enabled: boolean | null
          registration_price: number | null
          terms_text: string
          terms_version: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          emergency_fields_enabled?: boolean
          event_date?: string | null
          event_description?: string | null
          event_distance?: string | null
          event_location?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          payment_enabled?: boolean | null
          registration_price?: number | null
          terms_text?: string
          terms_version?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          emergency_fields_enabled?: boolean
          event_date?: string | null
          event_description?: string | null
          event_distance?: string | null
          event_location?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          payment_enabled?: boolean | null
          registration_price?: number | null
          terms_text?: string
          terms_version?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          expense_date: string
          expense_status: Database["public"]["Enums"]["expense_status"] | null
          id: string
          notes: string | null
          receipt_url: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          expense_date?: string
          expense_status?: Database["public"]["Enums"]["expense_status"] | null
          id?: string
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          expense_date?: string
          expense_status?: Database["public"]["Enums"]["expense_status"] | null
          id?: string
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          created_at: string
          id: string
          instructions: string
          is_pix_active: boolean
          payment_qr_code_url: string | null
          payment_type: string
          pix_key: string
          receiver_document: string
          receiver_name: string
          registration_fee: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string
          is_pix_active?: boolean
          payment_qr_code_url?: string | null
          payment_type?: string
          pix_key?: string
          receiver_document?: string
          receiver_name?: string
          registration_fee?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string
          is_pix_active?: boolean
          payment_qr_code_url?: string | null
          payment_type?: string
          pix_key?: string
          receiver_document?: string
          receiver_name?: string
          registration_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          currency: string | null
          expires_at: string | null
          id: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          provider: string | null
          provider_order_id: string | null
          provider_payment_id: string | null
          provider_preference_id: string | null
          provider_status: string | null
          provider_status_detail: string | null
          registration_id: string | null
          rejection_reason: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          provider_preference_id?: string | null
          provider_status?: string | null
          provider_status_detail?: string | null
          registration_id?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          provider_preference_id?: string | null
          provider_status?: string | null
          provider_status_detail?: string | null
          registration_id?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          birth_date: string
          check_in_at: string | null
          city_neighborhood: string
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          full_name: string
          id: string
          registration_number: string | null
          status: Database["public"]["Enums"]["registration_status"]
          terms_accepted: boolean
          terms_accepted_at: string | null
          terms_version: string | null
          updated_at: string
          whatsapp: string
        }
        Insert: {
          birth_date: string
          check_in_at?: string | null
          city_neighborhood: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name: string
          id?: string
          registration_number?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          terms_version?: string | null
          updated_at?: string
          whatsapp: string
        }
        Update: {
          birth_date?: string
          check_in_at?: string | null
          city_neighborhood?: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          full_name?: string
          id?: string
          registration_number?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          terms_version?: string | null
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      next_registration_number: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user"
      expense_status: "pending" | "paid" | "cancelled"
      payment_method: "pix" | "credit_card" | "debit_card" | "other"
      payment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled"
        | "refunded"
        | "expired"
        | "awaiting_confirmation"
      registration_status:
        | "registered"
        | "confirmed"
        | "checked_in"
        | "cancelled"
        | "pending_payment"
        | "awaiting_confirmation"
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
      app_role: ["admin", "user"],
      expense_status: ["pending", "paid", "cancelled"],
      payment_method: ["pix", "credit_card", "debit_card", "other"],
      payment_status: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "refunded",
        "expired",
        "awaiting_confirmation",
      ],
      registration_status: [
        "registered",
        "confirmed",
        "checked_in",
        "cancelled",
        "pending_payment",
        "awaiting_confirmation",
      ],
    },
  },
} as const
