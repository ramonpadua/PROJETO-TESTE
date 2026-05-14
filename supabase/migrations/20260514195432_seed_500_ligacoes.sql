DO $$
DECLARE
  v_admin_id UUID;
  v_cliente_ids UUID[] := ARRAY[]::UUID[];
  v_dept_ids UUID[] := ARRAY[]::UUID[];
  v_cliente_id UUID;
  v_dept_id UUID;
  i INT;
  j INT;
  k INT;
  v_nomes_clientes TEXT[] := ARRAY['Tech Corp', 'Global Solutions', 'Inova Sistemas', 'Mega Enterprise', 'Alpha Group', 'Beta Inc', 'Nexus TI', 'Delta Partners', 'Omega Tech', 'Zeta Consultoria'];
  v_nomes_deptos TEXT[] := ARRAY['Vendas', 'Suporte', 'Financeiro', 'RH', 'Diretoria'];
  v_pessoas TEXT[] := ARRAY['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Souza', 'Carlos Pereira', 'Lucas Costa', 'Fernanda Lima', 'Roberto Almeida', 'Camila Rodrigues', 'Marcos Carvalho'];
  v_aparelhos TEXT[] := ARRAY['iPhone 13', 'Samsung S21', 'Motorola A10', 'Ramal 101', 'Ramal 102', 'iPhone 14', 'Softphone'];
  v_ligacoes_count INT;
BEGIN
  -- 1. Create/Ensure admin user
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
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'ramon.padua@adapta.org',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Ramon Padua"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_admin_id FROM auth.users WHERE email = 'ramon.padua@adapta.org';
  END IF;

  -- Ensure in usuarios
  IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE id = v_admin_id) THEN
    INSERT INTO public.usuarios (id, email, nome, tipo)
    VALUES (v_admin_id, 'ramon.padua@adapta.org', 'Ramon Padua', 'admin');
  ELSE
    UPDATE public.usuarios SET tipo = 'admin' WHERE id = v_admin_id;
  END IF;

  -- Check if we already have ligacoes to avoid duplicating every time
  SELECT count(*) INTO v_ligacoes_count FROM public.ligacoes;
  
  IF v_ligacoes_count < 500 THEN
    -- Insert 10 clientes
    FOR i IN 1..10 LOOP
      v_cliente_id := gen_random_uuid();
      INSERT INTO public.clientes (id, nome) VALUES (v_cliente_id, v_nomes_clientes[i]);
      v_cliente_ids := array_append(v_cliente_ids, v_cliente_id);
      
      -- For each cliente, insert 5 departamentos
      FOR j IN 1..5 LOOP
        v_dept_id := gen_random_uuid();
        INSERT INTO public.departamentos (id, nome, cliente_id) VALUES (v_dept_id, v_nomes_deptos[j], v_cliente_id);
      END LOOP;
    END LOOP;

    -- Insert 500 ligacoes
    FOR k IN 1..500 LOOP
      v_cliente_id := v_cliente_ids[1 + floor(random() * 10)::int];
      
      -- find a dept for this client
      SELECT id INTO v_dept_id FROM public.departamentos WHERE cliente_id = v_cliente_id ORDER BY random() LIMIT 1;
      
      INSERT INTO public.ligacoes (
        id, 
        cliente_id, 
        departamento_id, 
        data, 
        hora, 
        pessoa_que_ligou, 
        aparelho, 
        duracao
      ) VALUES (
        gen_random_uuid(),
        v_cliente_id,
        v_dept_id,
        CURRENT_DATE - (floor(random() * 90)::int || ' days')::INTERVAL,
        time '08:00:00' + (floor(random() * 10 * 3600)::int || ' seconds')::INTERVAL,
        v_pessoas[1 + floor(random() * 10)::int],
        v_aparelhos[1 + floor(random() * 7)::int],
        lpad(floor(random() * 60)::text, 2, '0') || ':' || lpad(floor(random() * 60)::text, 2, '0')
      );
    END LOOP;
  END IF;

END $$;
