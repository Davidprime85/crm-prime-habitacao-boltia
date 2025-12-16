import { useState, useEffect, useRef } from 'react';
import { databaseService } from '../services/databaseService';
import { ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Send, MessageCircle } from 'lucide-react';

interface ChatProps {
  processId: string;
}

export function Chat({ processId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  useEffect(() => {
    loadMessages();

    const subscription = databaseService.subscribeToChatMessages(processId, (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [processId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await databaseService.getChatMessages(processId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    setSending(true);
    try {
      await databaseService.sendChatMessage(processId, profile.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border flex flex-col h-[600px]">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Chat do Processo</h3>
        </div>
        <p className="text-xs text-gray-600 mt-1">Mensagens em tempo real</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === profile?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!isOwnMessage && message.sender && (
                  <p className="text-xs font-semibold mb-1 opacity-90">
                    {message.sender.name}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma mensagem ainda</p>
            <p className="text-sm mt-2">Envie a primeira mensagem</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
