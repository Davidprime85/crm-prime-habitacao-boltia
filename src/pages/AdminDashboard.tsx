import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { UserManagement } from '../components/UserManagement';
import { Building2, LayoutDashboard, Users, Settings, UserPlus, LogOut } from 'lucide-react';

type Tab = 'kanban' | 'users' | 'new-attendant' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('kanban');
  const { profile, signOut } = useAuth();
  const [newAttendantEmail, setNewAttendantEmail] = useState('');
  const [newAttendantName, setNewAttendantName] = useState('');
  const [newAttendantPassword, setNewAttendantPassword] = useState('');

  const handleCreateAttendant = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de criação de atendente será implementada via Edge Function');
    setNewAttendantEmail('');
    setNewAttendantName('');
    setNewAttendantPassword('');
  };

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
                <p className="text-xs text-gray-600">Painel Administrativo</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                <p className="text-xs text-gray-600">Administrador</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('new-attendant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'new-attendant'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Novo Atendente
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
        </div>

        {activeTab === 'kanban' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pipeline de Processos</h2>
            <KanbanBoard />
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Usuários</h2>
            <UserManagement />
          </div>
        )}

        {activeTab === 'new-attendant' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar Novo Atendente</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
              <form onSubmit={handleCreateAttendant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={newAttendantName}
                    onChange={(e) => setNewAttendantName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAttendantEmail}
                    onChange={(e) => setNewAttendantEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Inicial
                  </label>
                  <input
                    type="password"
                    value={newAttendantPassword}
                    onChange={(e) => setNewAttendantPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">Mínimo 6 caracteres</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Criar Atendente
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Sistema</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Configurações avançadas em desenvolvimento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
