# 🚀 Guia de Deploy no Vercel - Detalhado

Este guia vai te ensinar a publicar seu CRM na internet usando o Vercel (hospedagem GRATUITA).

---

## 📋 O que você precisa antes de começar

- ✅ Código do projeto (já tem!)
- ✅ Conta no GitHub (para fazer upload do código)
- ✅ Credenciais do Supabase (URL e API Key do `.env`)

**Tempo estimado: 15 minutos**

---

## PARTE 1: Subir o Código para o GitHub

### Passo 1: Criar Conta no GitHub
1. Acesse: https://github.com
2. Clique em **"Sign up"**
3. Crie sua conta (use um email válido)
4. Confirme o email

### Passo 2: Criar Novo Repositório
1. No GitHub, clique no botão **"+"** (canto superior direito)
2. Clique em **"New repository"**
3. Preencha:
   - **Repository name**: `crm-prime-habitacao`
   - **Description**: `Sistema de gestão de financiamento habitacional`
   - **Visibility**: Escolha **Private** (recomendado) ou Public
4. **NÃO** marque "Add a README file"
5. Clique em **"Create repository"**

### Passo 3: Fazer Upload do Código

#### Opção A: Via Interface do GitHub (Mais Fácil)
1. Na página do repositório criado, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos e pastas do projeto para a área de upload
3. **IMPORTANTE**: NÃO faça upload da pasta `node_modules` nem do `.env`
4. Escreva uma mensagem: "Initial commit"
5. Clique em **"Commit changes"**

#### Opção B: Via Git (Se souber usar terminal)
```bash
cd /caminho/do/seu/projeto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/crm-prime-habitacao.git
git push -u origin main
```

**✅ PRONTO! Seu código está no GitHub!**

---

## PARTE 2: Conectar Vercel ao GitHub

### Passo 1: Criar Conta no Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar sua conta GitHub
5. Confirme o email se solicitado

### Passo 2: Importar o Projeto
1. No painel do Vercel, clique em **"Add New..."** (canto superior direito)
2. Selecione **"Project"**
3. Você verá uma lista dos seus repositórios do GitHub
4. Encontre `crm-prime-habitacao` e clique em **"Import"**

**Se não aparecer o repositório:**
- Clique em **"Adjust GitHub App Permissions"**
- Autorize o Vercel a acessar seus repositórios privados
- Volte e tente novamente

### Passo 3: Configurar o Projeto

Na tela de configuração, você verá várias opções:

#### 3.1 - Configure Project
- **Project Name**: Deixe `crm-prime-habitacao` ou mude se quiser
- **Framework Preset**: O Vercel deve detectar automaticamente como **Vite**
  - Se não detectar, selecione **Vite** manualmente
- **Root Directory**: Deixe `./` (padrão)

#### 3.2 - Build and Output Settings
- **Build Command**: `npm run build` (já deve estar preenchido)
- **Output Directory**: `dist` (já deve estar preenchido)
- **Install Command**: `npm install` (já deve estar preenchido)

**NÃO mude essas configurações a menos que saiba o que está fazendo!**

#### 3.3 - Environment Variables (IMPORTANTE!)

Role a página até **"Environment Variables"** e adicione as 2 variáveis:

1. **Primeira variável:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Cole o Project URL do Supabase (exemplo: `https://abc123xyz.supabase.co`)
   - Clique em **"Add"**

2. **Segunda variável:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Cole a chave anon public do Supabase (exemplo: `eyJhbGc...`)
   - Clique em **"Add"**

**Onde pegar essas credenciais?**
- Abra o Supabase
- Vá em Settings → API
- Copie o **Project URL** e **anon public**

### Passo 4: Deploy!
1. Depois de adicionar as variáveis, clique em **"Deploy"**
2. O Vercel vai começar a buildar o projeto
3. Você verá um progresso em tempo real
4. **AGUARDE 2-3 minutos**

---

## PARTE 3: Acessar Seu Site

### Passo 1: Site Publicado
1. Quando o deploy terminar, você verá uma tela de sucesso com confetes 🎉
2. Clique no botão **"Visit"** ou no link do site
3. Seu site estará acessível em: `https://crm-prime-habitacao.vercel.app`

### Passo 2: Fazer o Primeiro Login
1. Acesse o site
2. Faça login com:
   - **Email**: david@creditoprime.com.br
   - **Senha**: Prime2024!
3. Se aparecer a dashboard de admin, **FUNCIONOU!** ✅

---

## PARTE 4: Configurações Adicionais

### Adicionar Domínio Personalizado (Opcional)

Se você tem um domínio próprio (exemplo: `crm.creditoprime.com.br`):

1. No Vercel, vá no seu projeto
2. Clique em **"Settings"**
3. Clique em **"Domains"**
4. Clique em **"Add"**
5. Digite seu domínio: `crm.creditoprime.com.br`
6. Clique em **"Add"**

O Vercel vai mostrar as configurações de DNS que você precisa adicionar:
- **Tipo A**: Aponta para um IP
- **Tipo CNAME**: Aponta para `cname.vercel-dns.com`

Você precisa adicionar esses registros no painel onde registrou seu domínio:
- GoDaddy
- Registro.br
- Hostgator
- Etc.

Procure por "DNS Management" ou "Gerenciar DNS" e adicione os registros conforme o Vercel instruir.

**Aguarde até 24h para propagação do DNS.**

---

## PARTE 5: Atualizações Futuras

### Como Atualizar o Sistema Depois

Sempre que você fizer mudanças no código:

#### Opção A: Via Interface do GitHub
1. Vá no seu repositório no GitHub
2. Navegue até o arquivo que quer editar
3. Clique no ícone de lápis (Edit)
4. Faça as mudanças
5. Clique em **"Commit changes"**
6. O Vercel detecta automaticamente e faz deploy da nova versão

#### Opção B: Via Git
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**O Vercel faz deploy automático a cada commit!**

---

## 🔍 Monitoramento e Logs

### Ver Logs de Deploy
1. No Vercel, vá no seu projeto
2. Clique na aba **"Deployments"**
3. Clique no deploy que quer ver
4. Clique em **"Building"** ou **"Function Logs"** para ver detalhes

### Ver Analytics (Estatísticas de Uso)
1. No Vercel, vá no seu projeto
2. Clique na aba **"Analytics"**
3. Você verá:
   - Número de visitantes
   - Páginas mais acessadas
   - Tempo de carregamento
   - Etc.

**No plano Free, analytics é limitado. Para mais recursos, upgrade para Pro ($20/mês).**

---

## 💰 Custos do Vercel

### Plano Free (Recomendado para Começar)
- ✅ 100 GB de tráfego/mês
- ✅ Deploys ilimitados
- ✅ SSL automático (HTTPS)
- ✅ Domínio personalizado
- ✅ Analytics básico
- **Custo: $0/mês**

### Plano Pro (Se Crescer Muito)
- ✅ 1 TB de tráfego/mês
- ✅ Tudo do Free +
- ✅ Analytics avançado
- ✅ Proteção DDoS
- ✅ Suporte prioritário
- **Custo: $20/mês por usuário**

**Para a maioria dos casos, o plano Free é suficiente!**

---

## 🆘 Problemas Comuns

### "Build Failed" - Erro no Deploy
**Possíveis causas:**
1. Variáveis de ambiente não configuradas
   - Solução: Vá em Settings → Environment Variables e adicione
2. Erro no código TypeScript
   - Solução: Veja os logs de build para identificar o erro
3. Dependências faltando
   - Solução: Certifique-se que o `package.json` tem todas as dependências

### Site Carrega mas Mostra Erro
**Possíveis causas:**
1. Variáveis de ambiente erradas
   - Solução: Verifique se copiou corretamente URL e API Key do Supabase
2. Supabase offline
   - Solução: Verifique se o projeto Supabase está ativo
3. Tabelas não criadas no banco
   - Solução: Execute o script `CREATE_ADMIN.sql` no Supabase

### "Too Many Requests" - Limite Atingido
Se você atingir o limite de 100 GB de tráfego:
1. Upgrade para Vercel Pro ($20/mês)
2. Ou aguarde o mês seguinte resetar

---

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] Conta Vercel criada e conectada ao GitHub
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
- [ ] Deploy realizado com sucesso
- [ ] Site acessível e carregando
- [ ] Login funcionando
- [ ] Domínio personalizado configurado (opcional)

**🎉 PARABÉNS! Seu CRM está no ar e acessível pela internet!**

---

## 📞 Links Úteis

- **Painel Vercel**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Suporte Vercel**: https://vercel.com/support
- **Status Vercel**: https://vercel-status.com

---

**Próximo passo**: Compartilhe o link do site com sua equipe e comece a usar! 🚀
