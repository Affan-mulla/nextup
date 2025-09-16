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
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Comments: {
        Row: {
          content: string
          createdAt: string
          id: string
          ideaId: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          ideaId: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          ideaId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comments_ideaId_fkey"
            columns: ["ideaId"]
            isOneToOne: false
            referencedRelation: "Ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Companies: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          logoUrl: string | null
          name: string
          ownerId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          logoUrl?: string | null
          name: string
          ownerId: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          logoUrl?: string | null
          name?: string
          ownerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Companies_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Follows: {
        Row: {
          companyId: string
          createdAt: string
          id: string
          userId: string
        }
        Insert: {
          companyId: string
          createdAt?: string
          id: string
          userId: string
        }
        Update: {
          companyId?: string
          createdAt?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Follows_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "Companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Follows_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Ideas: {
        Row: {
          companyId: string
          createdAt: string
          description: Json
          id: string
          status: Database["public"]["Enums"]["IdeaStatus"]
          title: string
          userId: string
          votesCount: number
        }
        Insert: {
          companyId: string
          createdAt?: string
          description: Json
          id: string
          status?: Database["public"]["Enums"]["IdeaStatus"]
          title: string
          userId: string
          votesCount?: number
        }
        Update: {
          companyId?: string
          createdAt?: string
          description?: Json
          id?: string
          status?: Database["public"]["Enums"]["IdeaStatus"]
          title?: string
          userId?: string
          votesCount?: number
        }
        Relationships: [
          {
            foreignKeyName: "Ideas_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "Companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Ideas_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Payments: {
        Row: {
          amountCents: number
          createdAt: string
          currency: string
          id: string
          paymentDate: string | null
          status: Database["public"]["Enums"]["PaymentStatus"]
          stripePaymentId: string
          subscriptionId: string
        }
        Insert: {
          amountCents: number
          createdAt?: string
          currency?: string
          id: string
          paymentDate?: string | null
          status: Database["public"]["Enums"]["PaymentStatus"]
          stripePaymentId: string
          subscriptionId: string
        }
        Update: {
          amountCents?: number
          createdAt?: string
          currency?: string
          id?: string
          paymentDate?: string | null
          status?: Database["public"]["Enums"]["PaymentStatus"]
          stripePaymentId?: string
          subscriptionId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Payments_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "Subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      Plans: {
        Row: {
          createdAt: string
          features: Json | null
          id: string
          name: string
          priceCents: number
        }
        Insert: {
          createdAt?: string
          features?: Json | null
          id: string
          name: string
          priceCents: number
        }
        Update: {
          createdAt?: string
          features?: Json | null
          id?: string
          name?: string
          priceCents?: number
        }
        Relationships: []
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscriptions: {
        Row: {
          companyId: string
          createdAt: string
          currentPeriodEnd: string | null
          currentPeriodStart: string | null
          id: string
          planId: string
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          stripeSubscriptionId: string
        }
        Insert: {
          companyId: string
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id: string
          planId: string
          status?: Database["public"]["Enums"]["SubscriptionStatus"]
          stripeSubscriptionId: string
        }
        Update: {
          companyId?: string
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id?: string
          planId?: string
          status?: Database["public"]["Enums"]["SubscriptionStatus"]
          stripeSubscriptionId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscriptions_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "Companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Subscriptions_planId_fkey"
            columns: ["planId"]
            isOneToOne: false
            referencedRelation: "Plans"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          passwordHash: string | null
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["Role"]
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
      Votes: {
        Row: {
          createdAt: string
          id: string
          ideaId: string
          type: Database["public"]["Enums"]["VoteType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          ideaId: string
          type: Database["public"]["Enums"]["VoteType"]
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          ideaId?: string
          type?: Database["public"]["Enums"]["VoteType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Votes_ideaId_fkey"
            columns: ["ideaId"]
            isOneToOne: false
            referencedRelation: "Ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Votes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
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
      IdeaStatus: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
      PaymentStatus: "SUCCEEDED" | "PENDING" | "FAILED"
      Role: "USER" | "ADMIN"
      SubscriptionStatus: "ACTIVE" | "PAST_DUE" | "TRIALING" | "CANCELED"
      VoteType: "UP" | "DOWN"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      IdeaStatus: ["OPEN", "IN_PROGRESS", "COMPLETED", "ARCHIVED"],
      PaymentStatus: ["SUCCEEDED", "PENDING", "FAILED"],
      Role: ["USER", "ADMIN"],
      SubscriptionStatus: ["ACTIVE", "PAST_DUE", "TRIALING", "CANCELED"],
      VoteType: ["UP", "DOWN"],
    },
  },
} as const
