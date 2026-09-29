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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      dashboard_details: {
        Row: {
          ai_reason: string
          description: string
          target_key: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_reason?: string
          description?: string
          target_key: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_reason?: string
          description?: string
          target_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_activity_heat: {
        Row: {
          activity_date: string
          hour_slot: number
          id: string
          txn_count: number
          volume: number
        }
        Insert: {
          activity_date: string
          hour_slot: number
          id?: string
          txn_count: number
          volume: number
        }
        Update: {
          activity_date?: string
          hour_slot?: number
          id?: string
          txn_count?: number
          volume?: number
        }
        Relationships: []
      }
      finance_ai_api_usage: {
        Row: {
          billed_to: string
          cost: number
          created_at: string
          id: string
          provider: string
          requests: number
          service: string
          tokens: number
          usage_date: string
        }
        Insert: {
          billed_to: string
          cost: number
          created_at?: string
          id?: string
          provider: string
          requests: number
          service: string
          tokens?: number
          usage_date: string
        }
        Update: {
          billed_to?: string
          cost?: number
          created_at?: string
          id?: string
          provider?: string
          requests?: number
          service?: string
          tokens?: number
          usage_date?: string
        }
        Relationships: []
      }
      finance_ai_controls: {
        Row: {
          auto_stop_percent: number
          budget: number
          id: string
          provider: string
          service: string
          spike_threshold: number
          status: string
          updated_at: string
        }
        Insert: {
          auto_stop_percent?: number
          budget?: number
          id?: string
          provider: string
          service: string
          spike_threshold?: number
          status?: string
          updated_at?: string
        }
        Update: {
          auto_stop_percent?: number
          budget?: number
          id?: string
          provider?: string
          service?: string
          spike_threshold?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_alerts: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          severity: string
          status: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          severity: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      finance_approvals: {
        Row: {
          amount: number
          created_at: string
          decided_at: string | null
          id: string
          notes: string | null
          reference: string
          request_type: string
          requested_by: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          decided_at?: string | null
          id?: string
          notes?: string | null
          reference: string
          request_type: string
          requested_by: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          decided_at?: string | null
          id?: string
          notes?: string | null
          reference?: string
          request_type?: string
          requested_by?: string
          status?: string
        }
        Relationships: []
      }
      finance_audit_logs: {
        Row: {
          action: string
          actor: string
          actor_role: string
          created_at: string
          details: Json
          entity: string
          entity_ref: string | null
          id: string
          ip_address: string
          severity: string
          user_agent: string
        }
        Insert: {
          action: string
          actor: string
          actor_role: string
          created_at?: string
          details?: Json
          entity: string
          entity_ref?: string | null
          id?: string
          ip_address: string
          severity?: string
          user_agent: string
        }
        Update: {
          action?: string
          actor?: string
          actor_role?: string
          created_at?: string
          details?: Json
          entity?: string
          entity_ref?: string | null
          id?: string
          ip_address?: string
          severity?: string
          user_agent?: string
        }
        Relationships: []
      }
      finance_commissions: {
        Row: {
          base_amount: number
          commission_amount: number
          created_at: string
          id: string
          partner_name: string
          partner_type: string
          period: string
          rate_percent: number
          status: string
        }
        Insert: {
          base_amount: number
          commission_amount: number
          created_at?: string
          id?: string
          partner_name: string
          partner_type: string
          period: string
          rate_percent: number
          status: string
        }
        Update: {
          base_amount?: number
          commission_amount?: number
          created_at?: string
          id?: string
          partner_name?: string
          partner_type?: string
          period?: string
          rate_percent?: number
          status?: string
        }
        Relationships: []
      }
      finance_daily_metrics: {
        Row: {
          created_at: string
          expenses: number
          id: string
          inflow: number
          metric_date: string
          outflow: number
          profit: number
          revenue: number
          txn_count: number
        }
        Insert: {
          created_at?: string
          expenses: number
          id?: string
          inflow: number
          metric_date: string
          outflow: number
          profit: number
          revenue: number
          txn_count: number
        }
        Update: {
          created_at?: string
          expenses?: number
          id?: string
          inflow?: number
          metric_date?: string
          outflow?: number
          profit?: number
          revenue?: number
          txn_count?: number
        }
        Relationships: []
      }
      finance_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          expense_date: string
          id: string
          recurring: boolean
          status: string
          vendor: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          expense_date: string
          id?: string
          recurring?: boolean
          status?: string
          vendor: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          recurring?: boolean
          status?: string
          vendor?: string
        }
        Relationships: []
      }
      finance_fraud_alerts: {
        Row: {
          alert_code: string
          amount: number
          detected_at: string
          entity: string
          id: string
          reason: string
          resolved_at: string | null
          risk_score: number
          status: string
          txn_reference: string | null
        }
        Insert: {
          alert_code: string
          amount: number
          detected_at?: string
          entity: string
          id?: string
          reason: string
          resolved_at?: string | null
          risk_score: number
          status: string
          txn_reference?: string | null
        }
        Update: {
          alert_code?: string
          amount?: number
          detected_at?: string
          entity?: string
          id?: string
          reason?: string
          resolved_at?: string | null
          risk_score?: number
          status?: string
          txn_reference?: string | null
        }
        Relationships: []
      }
      finance_gateways: {
        Row: {
          code: string
          created_at: string
          fee_percent: number
          id: string
          last_sync_at: string
          monthly_txn_count: number
          monthly_volume: number
          name: string
          provider: string
          settlement_cycle: string
          status: string
          success_rate: number
          supported_currencies: string[]
        }
        Insert: {
          code: string
          created_at?: string
          fee_percent?: number
          id?: string
          last_sync_at?: string
          monthly_txn_count?: number
          monthly_volume?: number
          name: string
          provider: string
          settlement_cycle?: string
          status?: string
          success_rate?: number
          supported_currencies?: string[]
        }
        Update: {
          code?: string
          created_at?: string
          fee_percent?: number
          id?: string
          last_sync_at?: string
          monthly_txn_count?: number
          monthly_volume?: number
          name?: string
          provider?: string
          settlement_cycle?: string
          status?: string
          success_rate?: number
          supported_currencies?: string[]
        }
        Relationships: []
      }
      finance_invoices: {
        Row: {
          auto_generated: boolean
          client_name: string
          client_type: string
          created_at: string
          doc_type: string
          due_date: string
          gst_number: string | null
          id: string
          invoice_no: string
          issue_date: string
          line_items: Json
          paid_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
        }
        Insert: {
          auto_generated?: boolean
          client_name: string
          client_type: string
          created_at?: string
          doc_type?: string
          due_date: string
          gst_number?: string | null
          id?: string
          invoice_no: string
          issue_date: string
          line_items?: Json
          paid_at?: string | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
        }
        Update: {
          auto_generated?: boolean
          client_name?: string
          client_type?: string
          created_at?: string
          doc_type?: string
          due_date?: string
          gst_number?: string | null
          id?: string
          invoice_no?: string
          issue_date?: string
          line_items?: Json
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
        }
        Relationships: []
      }
      finance_payouts: {
        Row: {
          amount: number
          bank_reference: string | null
          id: string
          method: string
          payout_code: string
          processed_at: string | null
          recipient_name: string
          recipient_type: string
          requested_at: string
          reviewer_note: string | null
          status: string
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          id?: string
          method: string
          payout_code: string
          processed_at?: string | null
          recipient_name: string
          recipient_type: string
          requested_at?: string
          reviewer_note?: string | null
          status: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          id?: string
          method?: string
          payout_code?: string
          processed_at?: string | null
          recipient_name?: string
          recipient_type?: string
          requested_at?: string
          reviewer_note?: string | null
          status?: string
        }
        Relationships: []
      }
      finance_plans: {
        Row: {
          billing_cycle: string
          code: string
          created_at: string
          features: Json
          id: string
          name: string
          price: number
          status: string
        }
        Insert: {
          billing_cycle: string
          code: string
          created_at?: string
          features?: Json
          id?: string
          name: string
          price: number
          status?: string
        }
        Update: {
          billing_cycle?: string
          code?: string
          created_at?: string
          features?: Json
          id?: string
          name?: string
          price?: number
          status?: string
        }
        Relationships: []
      }
      finance_refunds: {
        Row: {
          amount: number
          customer_name: string
          id: string
          invoice_no: string | null
          mode: string
          processed_at: string | null
          reason: string
          refund_code: string
          requested_at: string
          reviewer_note: string | null
          status: string
        }
        Insert: {
          amount: number
          customer_name: string
          id?: string
          invoice_no?: string | null
          mode: string
          processed_at?: string | null
          reason: string
          refund_code: string
          requested_at?: string
          reviewer_note?: string | null
          status: string
        }
        Update: {
          amount?: number
          customer_name?: string
          id?: string
          invoice_no?: string | null
          mode?: string
          processed_at?: string | null
          reason?: string
          refund_code?: string
          requested_at?: string
          reviewer_note?: string | null
          status?: string
        }
        Relationships: []
      }
      finance_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean
          created_at: string
          customer_name: string
          customer_type: string
          expires_at: string
          id: string
          plan_id: string
          previous_plan: string | null
          started_at: string
          status: string
        }
        Insert: {
          amount: number
          auto_renew?: boolean
          created_at?: string
          customer_name: string
          customer_type: string
          expires_at: string
          id?: string
          plan_id: string
          previous_plan?: string | null
          started_at: string
          status: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean
          created_at?: string
          customer_name?: string
          customer_type?: string
          expires_at?: string
          id?: string
          plan_id?: string
          previous_plan?: string | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "finance_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_tax_records: {
        Row: {
          created_at: string
          due_date: string
          filed_at: string | null
          filing_status: string
          id: string
          period: string
          reference_no: string | null
          tax_amount: number
          tax_type: string
          taxable_amount: number
        }
        Insert: {
          created_at?: string
          due_date: string
          filed_at?: string | null
          filing_status: string
          id?: string
          period: string
          reference_no?: string | null
          tax_amount: number
          tax_type: string
          taxable_amount: number
        }
        Update: {
          created_at?: string
          due_date?: string
          filed_at?: string | null
          filing_status?: string
          id?: string
          period?: string
          reference_no?: string | null
          tax_amount?: number
          tax_type?: string
          taxable_amount?: number
        }
        Relationships: []
      }
      finance_transactions: {
        Row: {
          amount: number
          category: string
          counterparty: string
          counterparty_type: string
          direction: string
          gateway: string | null
          id: string
          method: string | null
          notes: string | null
          occurred_at: string
          region: string
          status: string
          txn_code: string
        }
        Insert: {
          amount: number
          category: string
          counterparty: string
          counterparty_type: string
          direction: string
          gateway?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          occurred_at?: string
          region?: string
          status: string
          txn_code: string
        }
        Update: {
          amount?: number
          category?: string
          counterparty?: string
          counterparty_type?: string
          direction?: string
          gateway?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          occurred_at?: string
          region?: string
          status?: string
          txn_code?: string
        }
        Relationships: []
      }
      finance_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          entry_type: string
          id: string
          note: string | null
          performed_by: string
          reference: string
          status: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          entry_type: string
          id?: string
          note?: string | null
          performed_by?: string
          reference: string
          status?: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          entry_type?: string
          id?: string
          note?: string | null
          performed_by?: string
          reference?: string
          status?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "finance_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          last_activity_at: string
          low_balance_threshold: number
          owner_code: string
          owner_name: string
          owner_type: string
          region: string
          status: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          last_activity_at?: string
          low_balance_threshold?: number
          owner_code: string
          owner_name: string
          owner_type: string
          region?: string
          status?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          last_activity_at?: string
          low_balance_threshold?: number
          owner_code?: string
          owner_name?: string
          owner_type?: string
          region?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          home_path: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_path?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_path?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      finance_adjust_wallet_atomic: {
        Args: {
          p_actor: string
          p_amount: number
          p_entry_type: string
          p_reason: string
          p_reference: string
          p_wallet_id: string
        }
        Returns: {
          balance: number
          created_at: string
          currency: string
          id: string
          last_activity_at: string
          low_balance_threshold: number
          owner_code: string
          owner_name: string
          owner_type: string
          region: string
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "finance_wallets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "control_panel"
        | "author"
        | "vendor"
        | "reseller"
        | "affiliate"
        | "influencer"
        | "franchise"
        | "seo"
        | "admin"
        | "developer"
        | "marketplace_manager"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "control_panel",
        "author",
        "vendor",
        "reseller",
        "affiliate",
        "influencer",
        "franchise",
        "seo",
        "admin",
        "developer",
        "marketplace_manager",
      ],
    },
  },
} as const
