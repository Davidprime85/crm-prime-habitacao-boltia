# 📖 Guia Completo de Configuração - Passo a Passo para Leigos

Este guia vai te ensinar a configurar TUDO do zero, mesmo sem conhecimento técnico.

---

## 🎯 Resumo: O que você vai fazer

1. ✅ Criar conta no Supabase (banco de dados) - **GRÁTIS**
2. ✅ Criar conta no Vercel (hospedagem do site) - **GRÁTIS**
3. ✅ Configurar OpenAI (análise de documentos com IA) - **PAGO** (~$10/mês)
4. ✅ Configurar Resend (envio de emails) - **GRÁTIS** até 100 emails/dia
5. ✅ Fazer deploy do sistema no ar

**Tempo total: 30-40 minutos**

---

## 📝 ETAPA 1: Criar Conta no Supabase (Banco de Dados)

O Supabase é onde todos os dados do sistema ficam salvos (clientes, processos, documentos, etc).

### Passo 1.1: Criar Conta
1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Escolha **"Sign in with GitHub"** (recomendado) ou use seu email
4. Confirme sua conta pelo email que receberá

### Passo 1.2: Criar Novo Projeto
1. Na tela inicial, clique em **"New project"**
2. Preencha:
   - **Name**: `CRM Prime Habitacao`
   - **Database Password**: Crie uma senha forte (anote em algum lugar seguro!)
   - **Region**: Escolha `South America (São Paulo)` (mais rápido para Brasil)
   - **Pricing Plan**: Deixe em **Free** (depois pode mudar para Pro se precisar)
3. Clique em **"Create new project"**
4. **AGUARDE 2-3 minutos** enquanto o projeto é criado

### Passo 1.3: Pegar as Credenciais (IMPORTANTE!)
1. Com o projeto aberto, clique em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **API**
3. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://abc123xyz.supabase.co`
   - **anon public**: Uma chave longa começando com `eyJ...`
4. **COPIE e COLE** essas duas informações no arquivo `.env` do projeto:

```env
VITE_SUPABASE_URL=cole_aqui_o_project_url
VITE_SUPABASE_ANON_KEY=cole_aqui_a_chave_anon_public
```

### Passo 1.4: Criar as Tabelas do Banco de Dados
1. No Supabase, clique em **SQL Editor** (ícone de raio no menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `CREATE_ADMIN.sql` (está na pasta do projeto)
4. **COPIE TODO O CONTEÚDO** do arquivo
5. **COLE** no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Se aparecer uma mensagem de sucesso, está pronto! ✅

**✅ PRONTO! Seu admin foi criado:**
- **Email**: david@creditoprime.com.br
- **Senha**: Prime2024!

---

## 🌐 ETAPA 2: Criar Conta no Vercel (Hospedagem)

O Vercel vai deixar seu site no ar, acessível pela internet.

### Passo 2.1: Criar Conta
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado)
4. Autorize o Vercel a acessar seu GitHub

### Passo 2.2: Fazer Upload do Projeto
1. No Vercel, clique em **"Add New..."** → **"Project"**
2. Clique em **"Import"** no repositório do seu projeto
   - Se não aparecer, clique em **"Adjust GitHub App Permissions"** e autorize
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Passo 2.3: Adicionar Variáveis de Ambiente
1. Antes de fazer deploy, role a página até **"Environment Variables"**
2. Adicione as 2 variáveis:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Cole o Project URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Cole a chave anon do Supabase |

3. Clique em **"Deploy"**
4. **AGUARDE 2-3 minutos** enquanto o site é publicado

### Passo 2.4: Acessar Seu Site
1. Quando terminar, você verá uma tela de sucesso
2. Clique no link do seu site (algo como `https://crm-prime.vercel.app`)
3. **PRONTO! Seu sistema está no ar!** 🎉

---

## 🤖 ETAPA 3: Configurar OpenAI (Análise de Documentos)

A OpenAI faz a análise automática de holerites e documentos usando IA.

### Passo 3.1: Criar Conta na OpenAI
1. Acesse: https://platform.openai.com/signup
2. Crie sua conta com email
3. Confirme o email

### Passo 3.2: Adicionar Créditos
1. Acesse: https://platform.openai.com/account/billing
2. Clique em **"Add payment method"**
3. Adicione seu cartão de crédito
4. Adicione créditos (recomendado: $20 para começar)

### Passo 3.3: Gerar API Key
1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. Dê um nome: `CRM Prime`
4. **COPIE a chave** (começa com `sk-proj-...`)
5. **GUARDE EM LOCAL SEGURO** (você não conseguirá ver de novo!)

### Passo 3.4: Adicionar no Supabase
1. Volte ao Supabase
2. Clique em **Edge Functions** (no menu lateral)
3. Clique na aba **"Secrets"** (ou "Environment Variables")
4. Clique em **"Add new secret"**
5. Preencha:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Cole a chave que você copiou
6. Clique em **"Save"**

**✅ PRONTO! A análise de documentos com IA está configurada!**

---

## 📧 ETAPA 4: Configurar Resend (Envio de Emails)

O Resend envia emails automáticos para os clientes.

### Passo 4.1: Criar Conta
1. Acesse: https://resend.com/signup
2. Crie sua conta com email
3. Confirme o email

### Passo 4.2: Gerar API Key
1. No painel do Resend, clique em **"API Keys"** (menu lateral)
2. Clique em **"Create API Key"**
3. Dê um nome: `CRM Prime`
4. Escolha permissão: **"Sending access"**
5. Clique em **"Add"**
6. **COPIE a chave** (começa com `re_...`)

### Passo 4.3: Adicionar no Supabase
1. Volte ao Supabase
2. Clique em **Edge Functions** → **Secrets**
3. Clique em **"Add new secret"**
4. Preencha:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Cole a chave do Resend
5. Clique em **"Save"**

### Passo 4.4: Configurar Domínio (Opcional mas Recomendado)
1. No Resend, clique em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `creditoprime.com.br`
4. Siga as instruções para adicionar os registros DNS
   - Você precisará acessar o painel onde registrou o domínio
   - Adicionar os registros TXT, MX e CNAME que o Resend fornecer
5. Aguarde até 24h para validação

**✅ PRONTO! Envio de emails configurado!**

---

## 🧪 ETAPA 5: Testar o Sistema

### Passo 5.1: Fazer Login
1. Acesse seu site no Vercel (link que você anotou)
2. Faça login com:
   - **Email**: david@creditoprime.com.br
   - **Senha**: Prime2024!

### Passo 5.2: Criar um Atendente
1. Clique na aba **"Novo Atendente"**
2. Preencha os dados:
   - Nome: João Silva
   - Email: joao@creditoprime.com.br
   - Senha: Teste123
3. Clique em **"Criar Atendente"**

### Passo 5.3: Criar um Cliente (via SQL)
1. Volte ao Supabase
2. Abra o **SQL Editor**
3. Cole e execute este código:

```sql
DO $$
DECLARE
  client_id uuid;
  attendant_id uuid;
BEGIN
  -- Buscar o ID do atendente
  SELECT id INTO attendant_id FROM profiles WHERE role = 'attendant' LIMIT 1;

  -- Criar cliente
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'maria@exemplo.com',
    crypt('Cliente123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now()
  )
  RETURNING id INTO client_id;

  -- Criar perfil
  INSERT INTO profiles (id, email, name, role, disabled)
  VALUES (client_id, 'maria@exemplo.com', 'Maria Cliente', 'client', false);

  -- Criar processo
  INSERT INTO processes (
    client_id, attendant_id, status, progress,
    property_value, property_address
  )
  VALUES (
    client_id, attendant_id, 'simulacao', 0,
    350000.00, 'Rua das Flores, 123 - Jardim Paulista'
  );
END $$;
```

### Passo 5.4: Testar o Kanban
1. No painel admin, vá para a aba **"Kanban"**
2. Você verá o processo do cliente criado
3. Arraste o card entre as colunas para mudar o status
4. O progresso deve atualizar automaticamente

### Passo 5.5: Testar o Chat
1. Faça logout
2. Faça login como cliente:
   - Email: maria@exemplo.com
   - Senha: Cliente123
3. Envie uma mensagem no chat
4. Abra outra aba e faça login como atendente
5. Veja a mensagem aparecer em tempo real

**✅ PARABÉNS! Seu sistema está 100% funcional!**

---

## 🔧 Configurações Adicionais (Opcional)

### Domínio Personalizado no Vercel
1. No Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio: `crm.creditoprime.com.br`
4. Siga as instruções para configurar o DNS
5. Aguarde propagação (até 24h)

### Backup Automático do Banco
1. No Supabase, vá em **Settings** → **Database**
2. Clique na aba **"Backups"**
3. Configure backups diários automáticos
4. Escolha quanto tempo manter os backups

### Monitoramento
1. No Vercel: **Analytics** → Ative para ver estatísticas de uso
2. No Supabase: **Logs** → Veja logs do banco de dados e Edge Functions

---

## 💰 Custos Mensais Estimados

### Cenário: 500 processos ativos/mês

| Serviço | Plano | Custo |
|---------|-------|-------|
| **Supabase** | Pro (recomendado após 50 processos) | $25/mês |
| **Vercel** | Free (até 100GB tráfego) | $0/mês |
| **OpenAI** | Pay-as-you-go | ~$10-20/mês |
| **Resend** | Free (100 emails/dia) | $0/mês |
| **TOTAL** | | **$35-45/mês** |

### Dicas para Economizar
- Comece com Supabase Free (suficiente para até 50 processos)
- Configure limite de gastos na OpenAI ($20/mês é seguro)
- Use Resend Free enquanto enviar menos de 100 emails/dia

---

## 🆘 Problemas Comuns e Soluções

### "Não consigo fazer login"
- ✅ Confirme que executou o script `CREATE_ADMIN.sql`
- ✅ Verifique se o email está correto: david@creditoprime.com.br
- ✅ Senha correta: Prime2024!

### "Site não carrega no Vercel"
- ✅ Verifique se adicionou as variáveis de ambiente
- ✅ Aguarde 2-3 minutos após o deploy
- ✅ Tente limpar o cache do navegador (Ctrl+Shift+R)

### "Erro ao fazer upload de documento"
- ✅ Verifique se o bucket `documents` foi criado no Supabase
- ✅ Vá em Storage → Policies e confirme que as políticas existem

### "Análise de IA não funciona"
- ✅ Confirme que adicionou OPENAI_API_KEY no Supabase
- ✅ Verifique se tem créditos na conta da OpenAI
- ✅ Veja os logs em Edge Functions → analyze-income → Logs

### "Emails não estão sendo enviados"
- ✅ Confirme que adicionou RESEND_API_KEY no Supabase
- ✅ Verifique se confirmou seu domínio no Resend
- ✅ Veja os logs em Edge Functions → send-email → Logs

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique os logs no Supabase (Edge Functions → Logs)
2. Verifique os logs no Vercel (Deployments → Logs)
3. Consulte a documentação:
   - Supabase: https://supabase.com/docs
   - Vercel: https://vercel.com/docs
   - OpenAI: https://platform.openai.com/docs
   - Resend: https://resend.com/docs

---

## ✅ Checklist Final

- [ ] Conta Supabase criada e projeto configurado
- [ ] Tabelas criadas no banco de dados
- [ ] Admin criado (david@creditoprime.com.br)
- [ ] Projeto deployado no Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] OpenAI API Key configurada no Supabase
- [ ] Resend API Key configurada no Supabase
- [ ] Login funcionando
- [ ] Kanban operacional
- [ ] Chat em tempo real funcionando
- [ ] Upload de documentos funcionando

**🎉 PARABÉNS! Seu CRM está 100% configurado e no ar!**

---

**Próximo passo**: Crie seus atendentes e comece a cadastrar clientes! 🚀
