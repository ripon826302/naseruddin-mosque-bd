export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      committee: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          join_date: string
          name: string
          phone: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          join_date: string
          name: string
          phone: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          join_date?: string
          name?: string
          phone?: string
          role?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          address: string
          created_at: string | null
          id: string
          monthly_amount: number
          name: string
          phone: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id: string
          monthly_amount: number
          name: string
          phone: string
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          monthly_amount?: number
          name?: string
          phone?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          imam_id: string | null
          month: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          description?: string | null
          id: string
          imam_id?: string | null
          month?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          imam_id?: string | null
          month?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_imam_id_fkey"
            columns: ["imam_id"]
            isOneToOne: false
            referencedRelation: "imam"
            referencedColumns: ["id"]
          },
        ]
      }
      imam: {
        Row: {
          address: string
          created_at: string | null
          id: string
          join_date: string
          monthly_salary: number
          name: string
          phone: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          join_date: string
          monthly_salary: number
          name: string
          phone: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          join_date?: string
          monthly_salary?: number
          name?: string
          phone?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          donor_id: string | null
          id: string
          month: string | null
          receipt_number: string
          source: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          donor_id?: string | null
          id: string
          month?: string | null
          receipt_number: string
          source: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          donor_id?: string | null
          id?: string
          month?: string | null
          receipt_number?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      mosque_settings: {
        Row: {
          address: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          prayer_times: Json
          ramadan_times: Json | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          prayer_times: Json
          ramadan_times?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          prayer_times?: Json
          ramadan_times?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          created_at: string | null
          date: string
          id: string
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id: string
          message: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          message?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      salary_history: {
        Row: {
          change_date: string
          created_at: string | null
          id: string
          imam_id: string | null
          new_salary: number
          old_salary: number
          reason: string | null
        }
        Insert: {
          change_date?: string
          created_at?: string | null
          id?: string
          imam_id?: string | null
          new_salary: number
          old_salary: number
          reason?: string | null
        }
        Update: {
          change_date?: string
          created_at?: string | null
          id?: string
          imam_id?: string | null
          new_salary?: number
          old_salary?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_history_imam_id_fkey"
            columns: ["imam_id"]
            isOneToOne: false
            referencedRelation: "imam"
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
