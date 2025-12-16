import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { PROCESS_STATUS_CONFIG, Process, ProcessStatus } from '../types';
import { User, Home, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function KanbanBoard() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    loadProcesses();
  }, [profile]);

  const loadProcesses = async () => {
    try {
      if (!profile) return;

      let data: Process[];
      if (profile.role === 'admin') {
        data = await databaseService.getAllProcesses();
      } else if (profile.role === 'attendant') {
        data = await databaseService.getProcessesByAttendant(profile.id);
      } else {
        data = await databaseService.getProcessesByClient(profile.id);
      }

      setProcesses(data);
    } catch (error) {
      console.error('Error loading processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (processId: string, newStatus: ProcessStatus) => {
    try {
      const newProgress = PROCESS_STATUS_CONFIG[newStatus].progress;
      await databaseService.updateProcessStatus(processId, newStatus, newProgress);
      await loadProcesses();

      const process = processes.find((p) => p.id === processId);
      if (process?.client) {
        await databaseService.createNotification(
          process.client.id,
          'Processo Atualizado',
          `Seu processo avançou para: ${PROCESS_STATUS_CONFIG[newStatus].label}`,
          'success',
          processId
        );
      }
    } catch (error) {
      console.error('Error updating process:', error);
    }
  };

  const getProcessesByStatus = (status: ProcessStatus) => {
    return processes.filter((p) => p.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(PROCESS_STATUS_CONFIG).map(([status, config]) => {
        const statusProcesses = getProcessesByStatus(status as ProcessStatus);

        return (
          <div key={status} className="flex flex-col">
            <div className={`${config.color} text-white rounded-t-lg p-4`}>
              <h3 className="font-bold text-sm">{config.label}</h3>
              <p className="text-xs opacity-90 mt-1">{config.progress}% - {statusProcesses.length} processos</p>
            </div>

            <div className="bg-gray-50 rounded-b-lg p-3 min-h-[400px] space-y-3 border border-t-0">
              {statusProcesses.map((process) => (
                <div
                  key={process.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {process.client?.name || 'Cliente'}
                    </h4>
                    <span
                      className={`${config.color} text-white text-xs px-2 py-1 rounded font-medium`}
                    >
                      {config.progress}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    {process.property_address && (
                      <div className="flex items-start gap-2">
                        <Home className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{process.property_address}</span>
                      </div>
                    )}

                    {process.property_value && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          R$ {process.property_value.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {process.attendant && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span>{process.attendant.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(process.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {profile?.role !== 'client' && (
                    <div className="mt-4 pt-3 border-t">
                      <select
                        value={process.status}
                        onChange={(e) => handleStatusChange(process.id, e.target.value as ProcessStatus)}
                        className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.entries(PROCESS_STATUS_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>
                            {cfg.label} ({cfg.progress}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}

              {statusProcesses.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Nenhum processo
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
