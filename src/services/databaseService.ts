import { supabase } from '../lib/supabase';
import type {
  Profile,
  Process,
  Document,
  ChatMessage,
  Notification,
  ProcessStatus,
  DocumentStatus,
  NotificationType,
  UserRole,
} from '../types';

export const databaseService = {
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Profile[];
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Profile | null;
  },

  async updateUserRole(userId: string, role: UserRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async toggleUserDisabled(userId: string, disabled: boolean) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ disabled })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  async getAllProcesses() {
    const { data, error } = await supabase
      .from('processes')
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Process[];
  },

  async getProcessesByClient(clientId: string) {
    const { data, error } = await supabase
      .from('processes')
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Process[];
  },

  async getProcessesByAttendant(attendantId: string) {
    const { data, error } = await supabase
      .from('processes')
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .eq('attendant_id', attendantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Process[];
  },

  async getProcess(processId: string) {
    const { data, error } = await supabase
      .from('processes')
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .eq('id', processId)
      .maybeSingle();

    if (error) throw error;
    return data as Process | null;
  },

  async createProcess(
    clientId: string,
    attendantId: string | null,
    propertyValue?: number,
    propertyAddress?: string
  ) {
    const { data, error } = await supabase
      .from('processes')
      .insert({
        client_id: clientId,
        attendant_id: attendantId,
        status: 'simulacao',
        progress: 0,
        property_value: propertyValue,
        property_address: propertyAddress,
      })
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as Process;
  },

  async updateProcess(processId: string, updates: Partial<Process>) {
    const { data, error } = await supabase
      .from('processes')
      .update(updates)
      .eq('id', processId)
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as Process;
  },

  async updateProcessStatus(processId: string, status: ProcessStatus, progress: number) {
    const { data, error } = await supabase
      .from('processes')
      .update({ status, progress })
      .eq('id', processId)
      .select(`
        *,
        client:profiles!processes_client_id_fkey(*),
        attendant:profiles!processes_attendant_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as Process;
  },

  async deleteProcess(processId: string) {
    const { error } = await supabase
      .from('processes')
      .delete()
      .eq('id', processId);

    if (error) throw error;
  },

  async getDocumentsByProcess(processId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Document[];
  },

  async createDocument(
    processId: string,
    name: string,
    fileUrl: string,
    fileType: string,
    uploadedBy: string
  ) {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        process_id: processId,
        name,
        file_url: fileUrl,
        file_type: fileType,
        status: 'pending',
        uploaded_by: uploadedBy,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Document;
  },

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    rejectionReason?: string
  ) {
    const { data, error } = await supabase
      .from('documents')
      .update({
        status,
        rejection_reason: rejectionReason || null,
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data as Document;
  },

  async updateDocumentAnalyzedData(documentId: string, analyzedData: any) {
    const { data, error } = await supabase
      .from('documents')
      .update({ analyzed_data: analyzedData })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data as Document;
  },

  async deleteDocument(documentId: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  },

  async uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async getChatMessages(processId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('process_id', processId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as ChatMessage[];
  },

  async sendChatMessage(processId: string, senderId: string, message: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        process_id: processId,
        sender_id: senderId,
        message,
      })
      .select(`
        *,
        sender:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data as ChatMessage;
  },

  subscribeToChatMessages(processId: string, callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`chat:${processId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `process_id=eq.${processId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              sender:profiles(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) callback(data as ChatMessage);
        }
      )
      .subscribe();

    return subscription;
  },

  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as Notification[];
  },

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'info',
    processId?: string
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        process_id: processId || null,
        title,
        message,
        type,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },
};
