CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create clientes table
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create departamentos table
CREATE TABLE IF NOT EXISTS public.departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ligacoes table
CREATE TABLE IF NOT EXISTS public.ligacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    departamento_id UUID NOT NULL REFERENCES public.departamentos(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    pessoa_que_ligou TEXT,
    aparelho TEXT,
    duracao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns to usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'usuario',
ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligacoes ENABLE ROW LEVEL SECURITY;

-- Drop policies if exists for idempotency
DROP POLICY IF EXISTS "admin_all_clientes" ON public.clientes;
DROP POLICY IF EXISTS "user_own_cliente" ON public.clientes;
DROP POLICY IF EXISTS "admin_all_departamentos" ON public.departamentos;
DROP POLICY IF EXISTS "user_own_departamento" ON public.departamentos;
DROP POLICY IF EXISTS "admin_all_ligacoes" ON public.ligacoes;
DROP POLICY IF EXISTS "user_own_ligacoes" ON public.ligacoes;

-- Policies for clientes
CREATE POLICY "admin_all_clientes" ON public.clientes
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND tipo = 'admin'));

CREATE POLICY "user_own_cliente" ON public.clientes
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cliente_id = clientes.id));

-- Policies for departamentos
CREATE POLICY "admin_all_departamentos" ON public.departamentos
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND tipo = 'admin'));

CREATE POLICY "user_own_departamento" ON public.departamentos
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cliente_id = departamentos.cliente_id));

-- Policies for ligacoes
CREATE POLICY "admin_all_ligacoes" ON public.ligacoes
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND tipo = 'admin'));

CREATE POLICY "user_own_ligacoes" ON public.ligacoes
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND cliente_id = ligacoes.cliente_id));

-- Seed data
DO $$
DECLARE
  v_cliente_id UUID := gen_random_uuid();
  v_cliente2_id UUID := gen_random_uuid();
  v_depto_vendas UUID := gen_random_uuid();
  v_depto_suporte UUID := gen_random_uuid();
  v_depto_finan UUID := gen_random_uuid();
  v_admin_id UUID;
  v_user_id UUID;
BEGIN
  -- Insert Clientes
  INSERT INTO public.clientes (id, nome) VALUES 
    (v_cliente_id, 'Ana Silva'),
    (v_cliente2_id, 'Carlos Oliveira')
  ON CONFLICT DO NOTHING;

  -- Insert Departamentos
  INSERT INTO public.departamentos (id, nome, cliente_id) VALUES 
    (v_depto_vendas, 'Vendas', v_cliente_id),
    (v_depto_suporte, 'Suporte', v_cliente_id),
    (v_depto_finan, 'Financeiro', v_cliente2_id)
  ON CONFLICT DO NOTHING;

  -- Insert admin user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ramon.padua@adapta.org') THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'ramon.padua@adapta.org', crypt('Skip@Pass123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"nome": "Admin Ramon"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    UPDATE public.usuarios SET tipo = 'admin' WHERE id = v_admin_id;
  END IF;

  -- Insert regular user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'usuario@teste.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id, '00000000-0000-0000-0000-000000000000', 'usuario@teste.com', crypt('Skip@Pass123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"nome": "Usuario Ana"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    UPDATE public.usuarios SET tipo = 'usuario', cliente_id = v_cliente_id WHERE id = v_user_id;
  END IF;

  -- Insert Ligacoes
  INSERT INTO public.ligacoes (cliente_id, departamento_id, data, hora, pessoa_que_ligou, aparelho, duracao) VALUES
    (v_cliente_id, v_depto_vendas, CURRENT_DATE, '10:30', 'João', 'Ramal 101', '05:23'),
    (v_cliente_id, v_depto_suporte, CURRENT_DATE, '11:15', 'Maria', 'Ramal 102', '12:05'),
    (v_cliente2_id, v_depto_finan, CURRENT_DATE, '14:45', 'Pedro', 'Ramal 103', '03:45'),
    (v_cliente_id, v_depto_vendas, CURRENT_DATE - INTERVAL '1 day', '09:00', 'Lucas', 'Ramal 101', '01:10')
  ON CONFLICT DO NOTHING;

END $$;
