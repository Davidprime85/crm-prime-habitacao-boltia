/*
  # Storage Bucket para Documentos
  
  1. Bucket Criado
    - `documents` - Armazena todos os documentos dos processos
      - Público para leitura (para visualização)
      - Autenticado para upload
  
  2. Segurança (RLS)
    - Usuários podem fazer upload em processos que têm acesso
    - Usuários podem visualizar documentos de seus processos
    - Admins têm acesso total
*/

-- Criar bucket de documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Usuários podem fazer upload de documentos em seus processos
CREATE POLICY "Usuários podem fazer upload em seus processos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (
      EXISTS (
        SELECT 1 FROM processes
        WHERE processes.id::text = (string_to_array(name, '/'))[1]
        AND (
          processes.client_id = auth.uid() OR
          processes.attendant_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
          )
        )
      )
    )
  );

-- Política: Usuários podem visualizar documentos de seus processos
CREATE POLICY "Usuários podem visualizar documentos de seus processos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (
      EXISTS (
        SELECT 1 FROM processes
        WHERE processes.id::text = (string_to_array(name, '/'))[1]
        AND (
          processes.client_id = auth.uid() OR
          processes.attendant_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
          )
        )
      )
    )
  );

-- Política: Admins podem deletar qualquer documento
CREATE POLICY "Admins podem deletar documentos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );