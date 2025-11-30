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
      careers: {
        Row: {
          description: string | null
          id: string
          name: string
          recommended_certifications: string[] | null
          required_skills: string[]
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          recommended_certifications?: string[] | null
          required_skills: string[]
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          recommended_certifications?: string[] | null
          required_skills?: string[]
        }
        Relationships: []
      }
      college_profiles: {
        Row: {
          achievements: string[] | null
          career_goal: string
          certificates: string[] | null
          cgpa: number | null
          created_at: string | null
          current_skills: string[]
          degree: string
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
          year: string
        }
        Insert: {
          achievements?: string[] | null
          career_goal: string
          certificates?: string[] | null
          cgpa?: number | null
          created_at?: string | null
          current_skills: string[]
          degree: string
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
          year: string
        }
        Update: {
          achievements?: string[] | null
          career_goal?: string
          certificates?: string[] | null
          cgpa?: number | null
          created_at?: string | null
          current_skills?: string[]
          degree?: string
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
          year?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          courses_offered: string[] | null
          fee_type: string | null
          id: string
          location: string
          min_mark: number | null
          name: string
        }
        Insert: {
          courses_offered?: string[] | null
          fee_type?: string | null
          id?: string
          location: string
          min_mark?: number | null
          name: string
        }
        Update: {
          courses_offered?: string[] | null
          fee_type?: string | null
          id?: string
          location?: string
          min_mark?: number | null
          name?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          description: string | null
          id: string
          name: string
          related_interests: string[] | null
          related_subjects: string[] | null
          stream: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          related_interests?: string[] | null
          related_subjects?: string[] | null
          stream: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          related_interests?: string[] | null
          related_subjects?: string[] | null
          stream?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          profile_type: string
          recommendation_data: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          profile_type: string
          recommendation_data: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          profile_type?: string
          recommendation_data?: Json
        }
        Relationships: []
      }
      school_profiles: {
        Row: {
          achievements: string[] | null
          average_mark: number
          board: string | null
          class_level: string
          created_at: string | null
          favorite_subjects: string[]
          id: string
          interests: string[]
          name: string
          preferred_location: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements?: string[] | null
          average_mark: number
          board?: string | null
          class_level: string
          created_at?: string | null
          favorite_subjects: string[]
          id?: string
          interests: string[]
          name: string
          preferred_location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements?: string[] | null
          average_mark?: number
          board?: string | null
          class_level?: string
          created_at?: string | null
          favorite_subjects?: string[]
          id?: string
          interests?: string[]
          name?: string
          preferred_location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
