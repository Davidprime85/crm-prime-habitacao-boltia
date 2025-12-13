# 🏠 CRM Prime Habitação - Supabase Edition

Sistema completo de gestão de processos de financiamento habitacional, agora rodando em **Supabase** com custo fixo e previsível.

---

## 🎯 COMECE AQUI

**👉 Se é sua primeira vez, leia o arquivo [`START_HERE.md`](START_HERE.md)**

Este arquivo contém o passo a passo completo para configurar e colocar o sistema no ar em 1 hora.

---

## ✨ Características Principais

- **Autenticação Segura**: Supabase Auth com bloqueio automático de usuários
- **3 Perfis de Acesso**: Admin, Atendente e Cliente com permissões específicas
- **Kanban Interativo**: Pipeline visual de 6 etapas (0% a 100%)
- **Chat em Tempo Real**: Comunicação instantânea entre cliente e atendente
- **Upload de Documentos**: Sistema completo com aprovação/rejeição
- **Análise de Renda com IA**: GPT-4o Vision extrai dados automaticamente de holerites
- **Notificações por Email**: Envio automático via Resend API
- **RLS (Row Level Security)**: Máxima segurança no banco de dados

## 🚀 Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **IA**: OpenAI GPT-4o Vision
- **Email**: Resend API
- **Ícones**: Lucide React

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **profiles** - Perfis de usuários (Admin/Atendente/Cliente)
2. **processes** - Processos de financiamento (6 etapas)
3. **documents** - Documentos enviados pelos clientes
4. **chat_messages** - Mensagens em tempo real
5. **notifications** - Notificações do sistema

### Etapas do Processo

| Etapa | Porcentagem | Descrição |
|-------|-------------|-----------|
| Simulação | 0% | Cadastro inicial e triagem |
| Análise de Crédito | 20% | Aprovação bancária |
| Avaliação | 40% | Vistoria do imóvel |
| Análise Jurídica | 60% | Documentação legal |
| ITBI / Emissão | 80% | Impostos e contratos |
| Assinatura / Registro | 100% | Conclusão |

## 🔐 Segurança

- **RLS em todas as tabelas**: Clientes veem apenas seus dados
- **Verificação de bloqueio**: Usuários desativados não conseguem fazer login
- **Storage protegido**: Documentos acessíveis apenas aos envolvidos
- **Edge Functions autenticadas**: JWT obrigatório

## 🛠️ Como Usar

### 1. Criar Primeiro Usuário Admin

Como ainda não existe nenhum usuário, você precisa criar o primeiro admin manualmente via SQL:

```sql
-- Execute no SQL Editor do Supabase
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@primehabitacao.com',
  crypt('senha123', gen_salt('bf')),
  now(),
  now(),
  now()
)
RETURNING id;

-- Copie o ID retornado e use abaixo
INSERT INTO profiles (id, email, name, role, disabled)
VALUES (
  'COLE_O_ID_AQUI',
  'admin@primehabitacao.com',
  'Administrador',
  'admin',
  false
);
```

### 2. Fazer Login

Acesse a aplicação e faça login com:
- **Email**: admin@primehabitacao.com
- **Senha**: senha123

### 3. Criar Usuários

No painel administrativo:

- **Aba "Novo Atendente"**: Cria conta de atendente
- **Aba "Usuários"**: Gerencia todos os usuários (bloquear, promover, excluir)

## 📱 Funcionalidades por Perfil

### 👑 Administrador

- Dashboard completo com Kanban
- Gestão total de usuários (criar, editar, bloquear, excluir)
- Visualização de todos os processos
- Acesso ao chat de qualquer processo

### 🎧 Atendente

- Kanban dos processos atribuídos
- Movimentação de processos entre etapas
- Chat com clientes
- Aprovação/rejeição de documentos

### 👤 Cliente

- Visualização do status do processo
- Barra de progresso visual (0% a 100%)
- Upload de documentos
- Chat com atendente
- Notificações automáticas

## 🤖 Edge Functions

### 1. analyze-income

Analisa documentos de renda (holerites/IRPF) usando IA:

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-income`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    documentUrl: 'https://...',
    documentId: 'uuid',
  }),
});
```

### 2. send-email

Envia emails transacionais via Resend:

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'cliente@email.com',
    subject: 'Processo Atualizado',
    html: '<p>Seu processo avançou para análise de crédito</p>',
  }),
});
```

## 💰 Custos Estimados

### Supabase

- **Free Tier**: Até 100 processos ativos - **$0/mês**
- **Pro Plan**: Até 1000 processos ativos - **$25/mês** (fixo)

### APIs Externas

- **OpenAI**: ~$0.01 por análise de documento
- **Resend**: 100 emails/dia grátis, depois $1 por 1000 emails

**Total estimado para 500 processos/mês: ~$30-40/mês**

## 🎯 Próximos Passos (Roadmap)

- [ ] Dashboard financeiro com gráficos
- [ ] Integração WhatsApp oficial
- [ ] OCR automático de validação de documentos
- [ ] Assinatura digital integrada
- [ ] App mobile (React Native)
- [ ] Relatórios em PDF

## 📝 Notas Importantes

1. **Variáveis de Ambiente**: Já configuradas automaticamente no Supabase
2. **Edge Functions**: Secrets (OPENAI_API_KEY, RESEND_API_KEY) devem ser configurados no painel Supabase
3. **Storage**: Bucket "documents" é público para leitura mas protegido por RLS

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs das Edge Functions no Supabase
2. Confira as políticas RLS no SQL Editor
3. Teste as queries manualmente para debug

---

**Desenvolvido com ❤️ para Prime Habitação**
