export type UserRole = 'admin' | 'attendant' | 'client';

export type ProcessStatus =
  | 'simulacao'
  | 'analise_credito'
  | 'avaliacao'
  | 'analise_juridica'
  | 'itbi_emissao'
  | 'assinatura_registro';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  disabled: boolean;
  phone?: string;
  cpf?: string;
  created_at: string;
  updated_at: string;
}

export interface Process {
  id: string;
  client_id: string;
  attendant_id?: string;
  status: ProcessStatus;
  progress: number;
  property_value?: number;
  property_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: Profile;
  attendant?: Profile;
}

export interface Document {
  id: string;
  process_id: string;
  name: string;
  file_url: string;
  file_type: string;
  status: DocumentStatus;
  rejection_reason?: string;
  uploaded_by: string;
  analyzed_data?: {
    name?: string;
    cpf?: string;
    net_income?: number;
    gross_income?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  process_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  process_id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
}

export const PROCESS_STATUS_CONFIG: Record<ProcessStatus, { label: string; progress: number; color: string }> = {
  simulacao: { label: 'Simulação', progress: 0, color: 'bg-gray-500' },
  analise_credito: { label: 'Análise de Crédito', progress: 20, color: 'bg-blue-500' },
  avaliacao: { label: 'Avaliação', progress: 40, color: 'bg-yellow-500' },
  analise_juridica: { label: 'Análise Jurídica', progress: 60, color: 'bg-purple-500' },
  itbi_emissao: { label: 'ITBI / Emissão', progress: 80, color: 'bg-orange-500' },
  assinatura_registro: { label: 'Assinatura / Registro', progress: 100, color: 'bg-green-500' }
};
