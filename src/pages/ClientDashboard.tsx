import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databaseService } from '../services/databaseService';
import { ProcessProgressBar } from '../components/ProcessProgressBar';
import { Chat } from '../components/Chat';
import { Process, Document } from '../types';
import { Building2, LogOut, Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProcesses();
  }, [profile]);

  useEffect(() => {
    if (selectedProcess) {
      loadDocuments(selectedProcess.id);
    }
  }, [selectedProcess]);

  const loadProcesses = async () => {
    if (!profile) return;

    try {
      const data = await databaseService.getProcessesByClient(profile.id);
      setProcesses(data);
      if (data.length > 0 && !selectedProcess) {
        setSelectedProcess(data[0]);
      }
    } catch (error) {
      console.error('Error loading processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (processId: string) => {
    try {
      const data = await databaseService.getDocumentsByProcess(processId);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedProcess || !profile) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const filePath = `${selectedProcess.id}/${Date.now()}_${file.name}`;
      const fileUrl = await databaseService.uploadFile(file, filePath);

      await databaseService.createDocument(
        selectedProcess.id,
        file.name,
        fileUrl,
        file.type,
        profile.id
      );

      await loadDocuments(selectedProcess.id);
      alert('Documento enviado com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Aguardando Análise';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (processes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum processo encontrado</h2>
          <p className="text-gray-600">Entre em contato com nosso atendimento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CRM Prime Habitação</h1>
                <p className="text-xs text-gray-600">Portal do Cliente</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                <p className="text-xs text-gray-600">Cliente</p>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProcess && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Processo de Financiamento</h2>
              <p className="text-gray-600 mb-6">Acompanhe o status do seu processo em tempo real</p>
              <ProcessProgressBar status={selectedProcess.status} progress={selectedProcess.progress} />
            </div>

            {selectedProcess.property_address && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Informações do Imóvel</h3>
                <p className="text-gray-600">{selectedProcess.property_address}</p>
                {selectedProcess.property_value && (
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    R$ {selectedProcess.property_value.toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Documentos</h3>
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Enviando...' : 'Enviar'}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {getStatusIcon(doc.status)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(doc.status)}`}>
                          {getStatusLabel(doc.status)}
                        </span>
                      </div>
                      {doc.rejection_reason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-800">
                            <strong>Motivo:</strong> {doc.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum documento enviado</p>
                    </div>
                  )}
                </div>
              </div>

              <Chat processId={selectedProcess.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
