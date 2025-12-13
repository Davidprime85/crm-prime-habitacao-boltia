# 📝 Comandos Úteis - CRM Prime Habitação

## 🚀 Desenvolvimento

### Iniciar servidor de desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:5173

### Build para produção
```bash
npm run build
```
Gera pasta `dist/` com arquivos otimizados

### Preview do build
```bash
npm run preview
```
Testa a versão de produção localmente

### Verificar tipos TypeScript
```bash
npm run typecheck
```

### Lint do código
```bash
npm run lint
```

---

## 🗄️ Banco de Dados (SQL)

### Ver todos os usuários
```sql
SELECT
  p.name,
  p.email,
  p.role,
  p.disabled,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC;
```

### Ver todos os processos com clientes
```sql
SELECT
  p.id,
  c.name as cliente,
  a.name as atendente,
  p.status,
  p.progress,
  p.property_value,
  p.created_at
FROM processes p
JOIN profiles c ON p.client_id = c.id
LEFT JOIN profiles a ON p.attendant_id = a.id
ORDER BY p.created_at DESC;
```

### Ver documentos pendentes de análise
```sql
SELECT
  d.name,
  d.file_type,
  d.status,
  d.created_at,
  p.name as uploaded_by
FROM documents d
JOIN profiles p ON d.uploaded_by = p.id
WHERE d.status = 'pending'
ORDER BY d.created_at ASC;
```

### Ver mensagens recentes do chat
```sql
SELECT
  cm.message,
  cm.created_at,
  p.name as sender,
  pr.id as process_id
FROM chat_messages cm
JOIN profiles p ON cm.sender_id = p.id
JOIN processes pr ON cm.process_id = pr.id
ORDER BY cm.created_at DESC
LIMIT 50;
```

### Contar processos por etapa
```sql
SELECT
  status,
  COUNT(*) as total,
  ROUND(AVG(progress)) as progress_medio
FROM processes
GROUP BY status
ORDER BY progress_medio;
```

---

## 👥 Gestão de Usuários (SQL)

### Criar novo admin manualmente
```sql
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    'novo-admin@email.com',
    crypt('senha-segura', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now()
  )
  RETURNING id INTO new_user_id;

  INSERT INTO profiles (id, email, name, role, disabled)
  VALUES (new_user_id, 'novo-admin@email.com', 'Novo Admin', 'admin', false);
END $$;
```

### Bloquear usuário
```sql
UPDATE profiles
SET disabled = true
WHERE email = 'usuario@email.com';
```

### Desbloquear usuário
```sql
UPDATE profiles
SET disabled = false
WHERE email = 'usuario@email.com';
```

### Trocar senha de usuário
```sql
UPDATE auth.users
SET encrypted_password = crypt('nova-senha', gen_salt('bf'))
WHERE email = 'usuario@email.com';
```

### Deletar usuário completamente
```sql
DELETE FROM profiles WHERE email = 'usuario@email.com';
DELETE FROM auth.users WHERE email = 'usuario@email.com';
```

### Promover usuário a admin
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'usuario@email.com';
```

---

## 📊 Relatórios e Análises

### Relatório de performance por atendente
```sql
SELECT
  a.name as atendente,
  COUNT(p.id) as total_processos,
  COUNT(CASE WHEN p.status = 'assinatura_registro' THEN 1 END) as concluidos,
  ROUND(AVG(p.progress)) as progresso_medio,
  SUM(p.property_value) as valor_total_imoveis
FROM profiles a
LEFT JOIN processes p ON p.attendant_id = a.id
WHERE a.role = 'attendant'
GROUP BY a.id, a.name
ORDER BY total_processos DESC;
```

### Tempo médio em cada etapa
```sql
SELECT
  status,
  COUNT(*) as processos,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400)::int as dias_media
FROM processes
GROUP BY status
ORDER BY progress;
```

### Taxa de aprovação de documentos
```sql
SELECT
  file_type,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as aprovados,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejeitados,
  ROUND(100.0 * COUNT(CASE WHEN status = 'approved' THEN 1 END) / COUNT(*), 2) as taxa_aprovacao
FROM documents
GROUP BY file_type
ORDER BY total DESC;
```

### Funil de conversão
```sql
SELECT
  status,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentual
FROM processes
GROUP BY status
ORDER BY
  CASE status
    WHEN 'simulacao' THEN 1
    WHEN 'analise_credito' THEN 2
    WHEN 'avaliacao' THEN 3
    WHEN 'analise_juridica' THEN 4
    WHEN 'itbi_emissao' THEN 5
    WHEN 'assinatura_registro' THEN 6
  END;
```

---

## 🧹 Limpeza e Manutenção

### Deletar processos abandonados (sem atividade há 6 meses)
```sql
DELETE FROM processes
WHERE updated_at < NOW() - INTERVAL '6 months'
AND status = 'simulacao';
```

### Deletar notificações antigas (lidas há mais de 30 dias)
```sql
DELETE FROM notifications
WHERE read = true
AND created_at < NOW() - INTERVAL '30 days';
```

### Limpar documentos órfãos (processo deletado)
```sql
DELETE FROM documents
WHERE process_id NOT IN (SELECT id FROM processes);
```

---

## 🔍 Debug e Monitoramento

### Ver logs das Edge Functions
```bash
# No Supabase Dashboard
# Edge Functions → [função] → Logs
```

### Testar Edge Function localmente
```bash
# analyze-income
curl -X POST https://[PROJECT].supabase.co/functions/v1/analyze-income \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"documentUrl": "https://...", "documentId": "..."}'

# send-email
curl -X POST https://[PROJECT].supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"to": "teste@email.com", "subject": "Teste", "html": "<p>Teste</p>"}'
```

### Ver conexões ativas do Realtime
```sql
SELECT * FROM pg_stat_activity
WHERE application_name LIKE '%realtime%';
```

### Verificar tamanho do banco de dados
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔐 Backup e Restore

### Backup do banco (via Supabase Dashboard)
1. Settings → Database → Backups
2. Schedule backups ou Download manual

### Exportar dados de uma tabela
```sql
COPY (SELECT * FROM processes) TO STDOUT WITH CSV HEADER;
```

### Importar dados de CSV
```sql
COPY processes FROM '/path/to/file.csv' WITH CSV HEADER;
```

---

## 📚 Links Úteis

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentação Supabase**: https://supabase.com/docs
- **SQL Editor**: https://supabase.com/dashboard/project/_/sql
- **Edge Functions**: https://supabase.com/dashboard/project/_/functions
- **Storage**: https://supabase.com/dashboard/project/_/storage/buckets

---

## 🆘 Comandos de Emergência

### Resetar senha de admin (se perdeu acesso)
```sql
UPDATE auth.users
SET encrypted_password = crypt('nova-senha-temporaria', gen_salt('bf'))
WHERE email = 'admin@primehabitacao.com';

UPDATE profiles
SET disabled = false
WHERE email = 'admin@primehabitacao.com';
```

### Criar backup de emergência antes de mudanças críticas
```sql
-- Backup de profiles
CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Backup de processes
CREATE TABLE processes_backup AS SELECT * FROM processes;

-- Restaurar se necessário
INSERT INTO profiles SELECT * FROM profiles_backup;
```

### Ver todas as policies de RLS (debug de permissões)
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

**💡 Dica**: Salve este arquivo e tenha sempre à mão!
