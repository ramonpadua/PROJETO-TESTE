// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      ai_agents: {
        Row: {
          created_at: string | null
          description: string | null
          gemini_api_key: string
          id: string
          is_active: boolean | null
          name: string
          system_prompt: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gemini_api_key: string
          id?: string
          is_active?: boolean | null
          name: string
          system_prompt: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gemini_api_key?: string
          id?: string
          is_active?: boolean | null
          name?: string
          system_prompt?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      contact_identity: {
        Row: {
          canonical_phone: string | null
          created_at: string | null
          display_name: string | null
          id: string
          instance_id: string
          lid_jid: string | null
          phone_jid: string | null
          user_id: string
        }
        Insert: {
          canonical_phone?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          instance_id: string
          lid_jid?: string | null
          phone_jid?: string | null
          user_id: string
        }
        Update: {
          canonical_phone?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          instance_id?: string
          lid_jid?: string | null
          phone_jid?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contact_identity_instance_id_fkey'
            columns: ['instance_id']
            isOneToOne: false
            referencedRelation: 'user_integrations'
            referencedColumns: ['id']
          },
        ]
      }
      contatos: {
        Row: {
          canal: string
          created_at: string
          data: string
          hora: string
          id: string
          lead_id: string
          resultado: string | null
          resumo: string | null
          user_id: string
        }
        Insert: {
          canal: string
          created_at?: string
          data: string
          hora: string
          id?: string
          lead_id: string
          resultado?: string | null
          resumo?: string | null
          user_id: string
        }
        Update: {
          canal?: string
          created_at?: string
          data?: string
          hora?: string
          id?: string
          lead_id?: string
          resultado?: string | null
          resumo?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contatos_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      departamentos: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: 'departamentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string | null
          id: string
          processed_items: number | null
          status: string | null
          total_items: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_items?: number | null
          status?: string | null
          total_items?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_items?: number | null
          status?: string | null
          total_items?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          data_primeiro_contato: string | null
          data_ultimo_contato: string | null
          email: string | null
          estagio: string
          id: string
          nome: string
          telefone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_primeiro_contato?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          estagio?: string
          id?: string
          nome: string
          telefone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_primeiro_contato?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          estagio?: string
          id?: string
          nome?: string
          telefone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ligacoes: {
        Row: {
          aparelho: string | null
          cliente_id: string
          created_at: string
          data: string
          departamento_id: string
          duracao: string | null
          hora: string
          id: string
          pessoa_que_ligou: string | null
        }
        Insert: {
          aparelho?: string | null
          cliente_id: string
          created_at?: string
          data: string
          departamento_id: string
          duracao?: string | null
          hora: string
          id?: string
          pessoa_que_ligou?: string | null
        }
        Update: {
          aparelho?: string | null
          cliente_id?: string
          created_at?: string
          data?: string
          departamento_id?: string
          duracao?: string | null
          hora?: string
          id?: string
          pessoa_que_ligou?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ligacoes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ligacoes_departamento_id_fkey'
            columns: ['departamento_id']
            isOneToOne: false
            referencedRelation: 'departamentos'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          empresa: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          created_at: string | null
          evolution_api_key: string | null
          evolution_api_url: string | null
          id: string
          instance_name: string | null
          is_setup_completed: boolean
          is_webhook_enabled: boolean
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_setup_completed?: boolean
          is_webhook_enabled?: boolean
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          evolution_api_key?: string | null
          evolution_api_url?: string | null
          id?: string
          instance_name?: string | null
          is_setup_completed?: boolean
          is_webhook_enabled?: boolean
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          cargo: string | null
          cliente_id: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          permissoes: Json | null
          tipo: string | null
        }
        Insert: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          permissoes?: Json | null
          tipo?: string | null
        }
        Update: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          permissoes?: Json | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'usuarios_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_contacts: {
        Row: {
          ai_agent_id: string | null
          ai_analysis_summary: string | null
          classification: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          phone_number: string | null
          pipeline_stage: string | null
          profile_picture_url: string | null
          push_name: string | null
          remote_jid: string
          score: number | null
          user_id: string
        }
        Insert: {
          ai_agent_id?: string | null
          ai_analysis_summary?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          phone_number?: string | null
          pipeline_stage?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid: string
          score?: number | null
          user_id: string
        }
        Update: {
          ai_agent_id?: string | null
          ai_analysis_summary?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          phone_number?: string | null
          pipeline_stage?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_contacts_ai_agent_id_fkey'
            columns: ['ai_agent_id']
            isOneToOne: false
            referencedRelation: 'ai_agents'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          contact_id: string | null
          created_at: string | null
          from_me: boolean | null
          id: string
          message_id: string
          raw: Json | null
          text: string | null
          timestamp: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message_id: string
          raw?: Json | null
          text?: string | null
          timestamp?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message_id?: string
          raw?: Json | null
          text?: string | null
          timestamp?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_messages_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'whatsapp_contacts'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      merge_whatsapp_contacts: {
        Args: {
          p_primary_contact_id: string
          p_secondary_contact_ids: string[]
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ai_agents
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   system_prompt: text (not null)
//   gemini_api_key: text (not null)
//   is_active: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: contact_identity
//   id: uuid (not null, default: gen_random_uuid())
//   instance_id: uuid (not null)
//   user_id: uuid (not null)
//   canonical_phone: text (nullable)
//   phone_jid: text (nullable)
//   lid_jid: text (nullable)
//   display_name: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: contatos
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (not null)
//   data: date (not null)
//   hora: time without time zone (not null)
//   canal: text (not null)
//   resumo: text (nullable)
//   resultado: text (nullable)
//   user_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: departamentos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   cliente_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: import_jobs
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   type: text (not null)
//   status: text (nullable, default: 'running'::text)
//   total_items: integer (nullable, default: 0)
//   processed_items: integer (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   telefone: text (nullable)
//   email: text (nullable)
//   data_primeiro_contato: timestamp with time zone (nullable)
//   data_ultimo_contato: timestamp with time zone (nullable)
//   estagio: text (not null, default: 'todo'::text)
//   user_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: ligacoes
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (not null)
//   departamento_id: uuid (not null)
//   data: date (not null)
//   hora: time without time zone (not null)
//   pessoa_que_ligou: text (nullable)
//   aparelho: text (nullable)
//   duracao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   empresa: text (nullable)
//   role: text (not null, default: 'vendedor'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: user_integrations
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   evolution_api_url: text (nullable)
//   evolution_api_key: text (nullable)
//   instance_name: text (nullable)
//   status: text (nullable, default: 'DISCONNECTED'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   is_setup_completed: boolean (not null, default: false)
//   is_webhook_enabled: boolean (not null, default: false)
// Table: usuarios
//   id: uuid (not null)
//   nome: text (nullable)
//   email: text (nullable)
//   cargo: text (nullable)
//   permissoes: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   tipo: text (nullable, default: 'usuario'::text)
//   cliente_id: uuid (nullable)
// Table: whatsapp_contacts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   remote_jid: text (not null)
//   push_name: text (nullable)
//   profile_picture_url: text (nullable)
//   last_message_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   classification: text (nullable)
//   score: integer (nullable, default: 0)
//   ai_analysis_summary: text (nullable)
//   phone_number: text (nullable)
//   ai_agent_id: uuid (nullable)
//   pipeline_stage: text (nullable, default: 'Em Espera'::text)
// Table: whatsapp_messages
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   contact_id: uuid (nullable)
//   message_id: text (not null)
//   from_me: boolean (nullable, default: false)
//   text: text (nullable)
//   type: text (nullable)
//   timestamp: timestamp with time zone (nullable)
//   raw: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: ai_agents
//   PRIMARY KEY ai_agents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY ai_agents_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
// Table: contact_identity
//   FOREIGN KEY contact_identity_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES user_integrations(id) ON DELETE CASCADE
//   PRIMARY KEY contact_identity_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contact_identity_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: contatos
//   FOREIGN KEY contatos_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY contatos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contatos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: departamentos
//   FOREIGN KEY departamentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY departamentos_pkey: PRIMARY KEY (id)
// Table: import_jobs
//   PRIMARY KEY import_jobs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY import_jobs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: leads
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY leads_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: ligacoes
//   FOREIGN KEY ligacoes_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   FOREIGN KEY ligacoes_departamento_id_fkey: FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE
//   PRIMARY KEY ligacoes_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: user_integrations
//   PRIMARY KEY user_integrations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_integrations_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_integrations_user_id_key: UNIQUE (user_id)
// Table: usuarios
//   FOREIGN KEY usuarios_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
// Table: whatsapp_contacts
//   FOREIGN KEY whatsapp_contacts_ai_agent_id_fkey: FOREIGN KEY (ai_agent_id) REFERENCES ai_agents(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_contacts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_contacts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE whatsapp_contacts_user_id_remote_jid_key: UNIQUE (user_id, remote_jid)
// Table: whatsapp_messages
//   FOREIGN KEY whatsapp_messages_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE CASCADE
//   PRIMARY KEY whatsapp_messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_messages_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE whatsapp_messages_user_id_message_id_key: UNIQUE (user_id, message_id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_agents
//   Policy "Users can manage their own AI agents" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: clientes
//   Policy "admin_all_clientes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.tipo = 'admin'::text))))
//   Policy "user_own_cliente" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.cliente_id = clientes.id))))
// Table: contact_identity
//   Policy "Users can manage their own contact identities" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: contatos
//   Policy "authenticated_delete_contatos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_insert_contatos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "authenticated_select_contatos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_contatos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: departamentos
//   Policy "admin_all_departamentos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.tipo = 'admin'::text))))
//   Policy "user_own_departamento" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.cliente_id = departamentos.cliente_id))))
// Table: import_jobs
//   Policy "Users can manage their own import jobs" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: leads
//   Policy "authenticated_delete_leads" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_insert_leads" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "authenticated_select_leads" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_leads" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: ligacoes
//   Policy "admin_all_ligacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.tipo = 'admin'::text))))
//   Policy "user_own_ligacoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM usuarios   WHERE ((usuarios.id = auth.uid()) AND (usuarios.cliente_id = ligacoes.cliente_id))))
// Table: profiles
//   Policy "Users can insert own profile" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own profile" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can view own profile" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
// Table: user_integrations
//   Policy "Users can manage their own integrations" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: usuarios
//   Policy "authenticated_select_usuarios" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_usuarios" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: whatsapp_contacts
//   Policy "Users can manage their own contacts" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: whatsapp_messages
//   Policy "Users can manage their own messages" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, empresa, role)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       NEW.raw_user_meta_data->>'empresa',
//       COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor')
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_usuario()
//   CREATE OR REPLACE FUNCTION public.handle_new_usuario()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.usuarios (id, email, nome)
//     VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nome')
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION merge_whatsapp_contacts(uuid, uuid, uuid[])
//   CREATE OR REPLACE FUNCTION public.merge_whatsapp_contacts(p_user_id uuid, p_primary_contact_id uuid, p_secondary_contact_ids uuid[])
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       -- Re-assign messages to the primary contact
//       UPDATE public.whatsapp_messages
//       SET contact_id = p_primary_contact_id
//       WHERE user_id = p_user_id
//         AND contact_id = ANY(p_secondary_contact_ids);
//
//       -- Delete the secondary duplicate contacts
//       DELETE FROM public.whatsapp_contacts
//       WHERE user_id = p_user_id
//         AND id = ANY(p_secondary_contact_ids);
//   END;
//   $function$
//

// --- INDEXES ---
// Table: contact_identity
//   CREATE UNIQUE INDEX idx_contact_identity_instance_phone ON public.contact_identity USING btree (instance_id, canonical_phone)
//   CREATE INDEX idx_contact_identity_lid_jid ON public.contact_identity USING btree (lid_jid)
//   CREATE INDEX idx_contact_identity_phone_jid ON public.contact_identity USING btree (phone_jid)
// Table: user_integrations
//   CREATE UNIQUE INDEX user_integrations_user_id_key ON public.user_integrations USING btree (user_id)
// Table: whatsapp_contacts
//   CREATE INDEX whatsapp_contacts_phone_number_idx ON public.whatsapp_contacts USING btree (user_id, phone_number)
//   CREATE UNIQUE INDEX whatsapp_contacts_user_id_remote_jid_key ON public.whatsapp_contacts USING btree (user_id, remote_jid)
// Table: whatsapp_messages
//   CREATE UNIQUE INDEX whatsapp_messages_user_id_message_id_key ON public.whatsapp_messages USING btree (user_id, message_id)
