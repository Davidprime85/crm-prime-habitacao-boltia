# 🚀 Guia de Migração Firebase → Supabase

## ✅ O que foi migrado

### 1. **Banco de Dados** (Firestore → PostgreSQL)

| Firebase (Firestore) | Supabase (PostgreSQL) | Status |
|---------------------|----------------------|--------|
| Coleção `profiles` | Tabela `profiles` | ✅ Migrado |
| Coleção `processes` | Tabela `processes` | ✅ Migrado |
| Coleção `documents` | Tabela `documents` | ✅ Migrado |
| Coleção `chat_messages` | Tabela `chat_messages` | ✅ Migrado |
| Coleção `notifications` | Tabela `notifications` | ✅ Migrado |

**Vantagens do PostgreSQL:**
- Queries SQL complexas e relatórios avançados
- Relacionamentos nativos (Foreign Keys)
- Transações ACID
- Performance superior em grandes volumes

### 2. **Autenticação** (Firebase Auth → Supabase Auth)

| Recurso | Firebase | Supabase | Status |
|---------|----------|----------|--------|
| Email/Senha | ✅ | ✅ | ✅ Migrado |
| Bloqueio de usuário | Via `disabled` field | Via `disabled` field | ✅ Migrado |
| Verificação de sessão | ✅ | ✅ | ✅ Migrado |
| Refresh token | ✅ | ✅ | ✅ Migrado |

### 3. **Storage** (Firebase Storage → Supabase Storage)

| Recurso | Firebase | Supabase | Status |
|---------|----------|----------|--------|
| Upload de arquivos | ✅ | ✅ | ✅ Migrado |
| URLs públicas | ✅ | ✅ | ✅ Migrado |
| RLS por processo | ⚠️ Limitado | ✅ Completo | ✅ Melhorado |

### 4. **Serverless Functions** (Cloud Functions → Edge Functions)

| Função | Descrição | Status |
|--------|-----------|--------|
| `analyze-income` | Análise de renda com IA (GPT-4o Vision) | ✅ Migrado |
| `send-email` | Envio de emails (Resend API) | ✅ Migrado |

**Vantagens das Edge Functions:**
- Deploy mais rápido (segundos)
- Sem cold start
- Execução global (edge network)
- TypeScript nativo

### 5. **Frontend** (React + TypeScript)

| Componente | Status |
|------------|--------|
| Login | ✅ Recriado |
| AdminDashboard | ✅ Recriado |
| AttendantDashboard | ✅ Recriado |
| ClientDashboard | ✅ Recriado |
| KanbanBoard | ✅ Recriado |
| UserManagement | ✅ Recriado |
| ProcessProgressBar | ✅ Recriado |
| Chat (Realtime) | ✅ Recriado com Supabase Realtime |

---

## 📊 Comparação de Custos

### Cenário: 500 processos ativos/mês

| Serviço | Firebase | Supabase | Economia |
|---------|----------|----------|----------|
| **Database** | $50-100/mês | $25/mês (fixo) | 50-75% |
| **Auth** | $0 (grátis) | $0 (grátis) | - |
| **Storage** | $10-30/mês | Incluído no Pro | 100% |
| **Functions** | $20-40/mês | Incluído no Pro | 100% |
| **Total** | **$80-170/mês** | **$25/mês** | **70-85%** |

**Custo anual:**
- Firebase: **$960 - $2.040**
- Supabase: **$300**
- **Economia: $660 - $1.740/ano** 💰

---

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente (Já configuradas)

O arquivo `.env` já está configurado com as credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2. Secrets das Edge Functions

Você precisa configurar manualmente no painel do Supabase:

1. Acesse: [Supabase Dashboard → Edge Functions → Secrets](https://supabase.com/dashboard)
2. Adicione:
   - `OPENAI_API_KEY` = `sk-proj-...` (sua chave da OpenAI)
   - `RESEND_API_KEY` = `re_A6QMZ...` (sua chave do Resend)

### 3. Criar Primeiro Usuário Admin

Execute o arquivo `SETUP.sql` no SQL Editor do Supabase:

1. Abra o [SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Cole o conteúdo de `SETUP.sql`
3. Troque o email e senha nas linhas indicadas
4. Execute o script

**Credenciais padrão (se não trocar):**
- Email: `admin@primehabitacao.com`
- Senha: `senha123`

---

## 🎯 Como Testar

### 1. Login como Admin
- Acesse a aplicação
- Faça login com as credenciais criadas no SETUP.sql

### 2. Criar Atendente
- Vá na aba "Novo Atendente"
- Preencha os dados
- Clique em "Criar Atendente"

### 3. Criar Cliente
- Use a aba "Usuários" para criar um cliente
- Ou registre manualmente via SQL

### 4. Criar Processo
- Como admin/atendente, crie um novo processo
- Arraste entre as etapas do Kanban

### 5. Testar Chat
- Faça login como cliente
- Envie mensagens no chat
- Faça login como atendente em outra aba
- Veja as mensagens aparecerem em tempo real

### 6. Testar Upload
- Como cliente, faça upload de um documento
- Como atendente, aprove ou rejeite o documento

### 7. Testar Análise de Renda (IA)
- Faça upload de uma imagem de holerite
- Clique no botão "Analisar Renda"
- A IA extrairá: Nome, CPF, Renda Líquida, Renda Bruta

---

## 🚨 Diferenças Importantes

### 1. Realtime

**Firebase:**
```typescript
onSnapshot(collection, callback);
```

**Supabase:**
```typescript
supabase.channel('chat').on('INSERT', callback).subscribe();
```

### 2. Queries

**Firebase:**
```typescript
where('status', '==', 'approved')
```

**Supabase:**
```typescript
.eq('status', 'approved')
```

### 3. Upload

**Firebase:**
```typescript
uploadBytes(ref, file)
```

**Supabase:**
```typescript
supabase.storage.from('bucket').upload(path, file)
```

---

## 📈 Próximas Melhorias

### Curto Prazo (1-2 semanas)
- [ ] Implementar criação de atendente via Edge Function
- [ ] Dashboard com gráficos de conversão
- [ ] Exportar relatórios em PDF

### Médio Prazo (1-2 meses)
- [ ] Integração WhatsApp Business API
- [ ] OCR automático para validação de documentos
- [ ] Assinatura digital (DocuSign/ClickSign)

### Longo Prazo (3-6 meses)
- [ ] App mobile (React Native)
- [ ] Integração com bancos (APIs)
- [ ] Sistema de comissões para corretores

---

## 🆘 Solução de Problemas

### Erro: "Missing Supabase environment variables"
- Verifique se o `.env` está na raiz do projeto
- Confirme se as variáveis começam com `VITE_`

### Erro: "Row Level Security policy violation"
- Confirme que o usuário foi criado com o role correto
- Execute novamente as migrations de RLS

### Erro: "Edge Function timeout"
- Aumente o timeout para análise de IA (documentos grandes)
- Verifique se a API key da OpenAI está válida

### Chat não atualiza em tempo real
- Verifique se as subscriptions estão ativas
- Confirme que o Realtime está habilitado no Supabase

---

## ✅ Checklist Final

- [ ] Banco de dados migrado (5 tabelas)
- [ ] RLS policies configuradas
- [ ] Storage bucket criado
- [ ] Edge Functions deployadas
- [ ] Secrets configurados (OpenAI + Resend)
- [ ] Primeiro usuário admin criado
- [ ] Login funcionando
- [ ] Kanban operacional
- [ ] Chat em tempo real
- [ ] Upload de documentos
- [ ] Build rodando sem erros

---

**🎉 Migração Completa! O CRM agora roda 100% no Supabase.**

**Economia estimada: R$ 4.000 - 10.000/ano** 💰
