/*
  # CRM Prime Habitação - Schema Completo
  
  1. Tabelas Criadas
    - `profiles` - Perfis de usuários (Admin, Atendente, Cliente)
      - `id` (uuid, FK para auth.users)
      - `email` (text)
      - `name` (text)
      - `role` (enum: admin, attendant, client)
      - `disabled` (boolean) - Bloqueio de acesso
      - `phone` (text, opcional)
      - `cpf` (text, opcional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `processes` - Processos de financiamento
      - `id` (uuid)
      - `client_id` (uuid, FK para profiles)
      - `attendant_id` (uuid, FK para profiles)
      - `status` (enum: simulacao, analise_credito, avaliacao, analise_juridica, itbi_emissao, assinatura_registro)
      - `progress` (int: 0, 20, 40, 60, 80, 100)
      - `property_value` (decimal)
      - `property_address` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `documents` - Documentos dos processos
      - `id` (uuid)
      - `process_id` (uuid, FK para processes)
      - `name` (text) - Nome do documento
      - `file_url` (text) - URL no Storage
      - `file_type` (text) - Tipo (RG, CPF, Holerite, etc)
      - `status` (enum: pending, approved, rejected)
      - `rejection_reason` (text, opcional)
      - `uploaded_by` (uuid, FK para profiles)
      - `analyzed_data` (jsonb) - Dados extraídos pela IA
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages` - Mensagens do chat
      - `id` (uuid)
      - `process_id` (uuid, FK para processes)
      - `sender_id` (uuid, FK para profiles)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `notifications` - Notificações do sistema
      - `id` (uuid)
      - `user_id` (uuid, FK para profiles)
      - `process_id` (uuid, FK para processes, opcional)
      - `title` (text)
      - `message` (text)
      - `type` (enum: info, success, warning, error)
      - `read` (boolean)
      - `created_at` (timestamp)
  
  2. Segurança (RLS)
    - Todas as tabelas têm RLS habilitado
    - Políticas específicas por role (admin, attendant, client)
    - Clientes só veem seus próprios dados
    - Atendentes veem processos atribuídos
    - Admins têm acesso total
*/

-- Criar tipos ENUM
CREATE TYPE user_role AS ENUM ('admin', 'attendant', 'client');
CREATE TYPE process_status AS ENUM ('simulacao', 'analise_credito', 'avaliacao', 'analise_juridica', 'itbi_emissao', 'assinatura_registro');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Tabela de Perfis
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  disabled boolean DEFAULT false,
  phone text,
  cpf text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Processos
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attendant_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status process_status NOT NULL DEFAULT 'simulacao',
  progress int NOT NULL DEFAULT 0 CHECK (progress IN (0, 20, 40, 60, 80, 100)),
  property_value decimal(15, 2),
  property_address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id uuid NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analyzed_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Mensagens do Chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id uuid NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  process_id uuid REFERENCES processes(id) ON DELETE SET NULL,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_processes_client ON processes(client_id);
CREATE INDEX IF NOT EXISTS idx_processes_attendant ON processes(attendant_id);
CREATE INDEX IF NOT EXISTS idx_processes_status ON processes(status);
CREATE INDEX IF NOT EXISTS idx_documents_process ON documents(process_id);
CREATE INDEX IF NOT EXISTS idx_chat_process ON chat_messages(process_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para PROFILES
CREATE POLICY "Usuários podem ver próprio perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Atendentes podem ver clientes e outros atendentes"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'attendant')
    )
  );

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins podem atualizar qualquer perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem criar perfis"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem deletar perfis"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas RLS para PROCESSES
CREATE POLICY "Clientes veem próprios processos"
  ON processes FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Atendentes veem processos atribuídos"
  ON processes FOR SELECT
  TO authenticated
  USING (
    attendant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins veem todos os processos"
  ON processes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Atendentes e admins podem criar processos"
  ON processes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'attendant')
    )
  );

CREATE POLICY "Atendentes podem atualizar processos atribuídos"
  ON processes FOR UPDATE
  TO authenticated
  USING (
    attendant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    attendant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem deletar processos"
  ON processes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas RLS para DOCUMENTS
CREATE POLICY "Usuários veem documentos de seus processos"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = documents.process_id
      AND (
        processes.client_id = auth.uid() OR
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Clientes e atendentes podem fazer upload"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = documents.process_id
      AND (
        processes.client_id = auth.uid() OR
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Atendentes e admins podem atualizar documentos"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = documents.process_id
      AND (
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = documents.process_id
      AND (
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Admins podem deletar documentos"
  ON documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas RLS para CHAT_MESSAGES
CREATE POLICY "Usuários veem mensagens de seus processos"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = chat_messages.process_id
      AND (
        processes.client_id = auth.uid() OR
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Usuários podem enviar mensagens em seus processos"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM processes
      WHERE processes.id = chat_messages.process_id
      AND (
        processes.client_id = auth.uid() OR
        processes.attendant_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

-- Políticas RLS para NOTIFICATIONS
CREATE POLICY "Usuários veem próprias notificações"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Sistema pode criar notificações"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem marcar notificações como lidas"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar próprias notificações"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON processes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();