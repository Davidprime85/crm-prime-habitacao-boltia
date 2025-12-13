-- ============================================
-- CRIAR ADMINISTRADOR - david@creditoprime.com.br
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

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
    'david@creditoprime.com.br',
    crypt('Prime2024!', gen_salt('bf')),
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
    'david@creditoprime.com.br',
    'David - Administrador Prime',
    'admin',
    false
  );

  RAISE NOTICE '✅ Administrador criado com sucesso!';
  RAISE NOTICE 'Email: david@creditoprime.com.br';
  RAISE NOTICE 'Senha: Prime2024!';
  RAISE NOTICE 'ID: %', new_user_id;
END $$;

-- Verificar se foi criado
SELECT
  u.email,
  p.name,
  p.role,
  p.disabled,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.email = 'david@creditoprime.com.br';
