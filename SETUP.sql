-- ============================================
-- SETUP INICIAL - CRM PRIME HABITAÇÃO
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para criar o primeiro usuário administrador
-- ============================================

-- PASSO 1: Criar usuário no auth.users
-- Troque 'admin@primehabitacao.com' e 'senha123' pelos valores desejados

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Criar usuário de autenticação
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@primehabitacao.com', -- TROQUE AQUI
    crypt('senha123', gen_salt('bf')), -- TROQUE A SENHA AQUI
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Criar perfil do usuário
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    disabled
  )
  VALUES (
    new_user_id,
    'admin@primehabitacao.com', -- TROQUE AQUI (mesmo email acima)
    'Administrador Principal', -- TROQUE O NOME AQUI
    'admin',
    false
  );

  RAISE NOTICE 'Usuário admin criado com sucesso! ID: %', new_user_id;
END $$;

-- ============================================
-- VERIFICAÇÃO: Confirmar que o usuário foi criado
-- ============================================

SELECT
  u.email,
  p.name,
  p.role,
  p.disabled,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.role = 'admin';

-- ============================================
-- OPCIONAL: Criar dados de exemplo
-- ============================================

-- Descomentar as linhas abaixo se quiser dados de teste

/*
-- Criar um atendente de exemplo
DO $$
DECLARE
  attendant_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'atendente@primehabitacao.com',
    crypt('senha123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  )
  RETURNING id INTO attendant_id;

  INSERT INTO public.profiles (id, email, name, role, disabled)
  VALUES (attendant_id, 'atendente@primehabitacao.com', 'João Atendente', 'attendant', false);
END $$;

-- Criar um cliente de exemplo
DO $$
DECLARE
  client_id uuid;
  process_id uuid;
  attendant_id uuid;
BEGIN
  -- Buscar o ID do atendente criado acima
  SELECT id INTO attendant_id FROM public.profiles WHERE role = 'attendant' LIMIT 1;

  -- Criar cliente
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'cliente@exemplo.com',
    crypt('senha123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  )
  RETURNING id INTO client_id;

  INSERT INTO public.profiles (id, email, name, role, disabled)
  VALUES (client_id, 'cliente@exemplo.com', 'Maria Cliente', 'client', false);

  -- Criar processo de exemplo
  INSERT INTO public.processes (
    id,
    client_id,
    attendant_id,
    status,
    progress,
    property_value,
    property_address,
    notes
  )
  VALUES (
    gen_random_uuid(),
    client_id,
    attendant_id,
    'simulacao',
    0,
    450000.00,
    'Rua das Flores, 123 - Bairro Jardim',
    'Processo de exemplo criado automaticamente'
  )
  RETURNING id INTO process_id;

  RAISE NOTICE 'Dados de exemplo criados com sucesso!';
END $$;
*/

-- ============================================
-- FIM DO SETUP
-- ============================================
