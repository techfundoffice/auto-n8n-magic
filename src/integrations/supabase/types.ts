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
      n8n_credentials: {
        Row: {
          created_at: string
          credential_name: string
          credential_type: string
          id: string
          n8n_credential_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_name: string
          credential_type: string
          id?: string
          n8n_credential_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_name?: string
          credential_type?: string
          id?: string
          n8n_credential_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      n8n_workflow_deployments: {
        Row: {
          created_at: string
          deployment_status: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          local_workflow_id: string | null
          n8n_workflow_id: string
          n8n_workflow_name: string
          sync_error: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deployment_status?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          local_workflow_id?: string | null
          n8n_workflow_id: string
          n8n_workflow_name: string
          sync_error?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deployment_status?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          local_workflow_id?: string | null
          n8n_workflow_id?: string
          n8n_workflow_name?: string
          sync_error?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_workflow_deployments_local_workflow_id_fkey"
            columns: ["local_workflow_id"]
            isOneToOne: false
            referencedRelation: "user_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_workflow_executions: {
        Row: {
          created_at: string
          deployment_id: string | null
          error_message: string | null
          execution_time: number | null
          finished_at: string | null
          id: string
          mode: string
          n8n_execution_id: string
          n8n_workflow_id: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deployment_id?: string | null
          error_message?: string | null
          execution_time?: number | null
          finished_at?: string | null
          id?: string
          mode: string
          n8n_execution_id: string
          n8n_workflow_id: string
          started_at?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deployment_id?: string | null
          error_message?: string | null
          execution_time?: number | null
          finished_at?: string | null
          id?: string
          mode?: string
          n8n_execution_id?: string
          n8n_workflow_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_workflow_executions_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "n8n_workflow_deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          api_key: string
          api_url: string | null
          created_at: string
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          api_url?: string | null
          created_at?: string
          id?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          api_url?: string | null
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          credits: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
          workflow_json: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
          workflow_json: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          workflow_json?: Json
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
