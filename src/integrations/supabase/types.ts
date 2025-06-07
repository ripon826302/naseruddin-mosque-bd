export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          id: string
          month: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id: string
          month?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          month?: string | null
          type?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
