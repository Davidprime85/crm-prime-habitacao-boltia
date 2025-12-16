import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { Profile, UserRole } from '../types';
import { Users, Shield, UserCheck, Ban, CheckCircle, Trash2 } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await databaseService.getAllProfiles();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await databaseService.updateUserRole(userId, newRole);
      await loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erro ao atualizar cargo');
    }
  };

  const handleToggleDisabled = async (userId: string, currentDisabled: boolean) => {
    try {
      await databaseService.toggleUserDisabled(userId, !currentDisabled);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling disabled:', error);
      alert('Erro ao alterar status');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await databaseService.deleteUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao excluir usuário');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'attendant':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'client':
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'attendant':
        return 'Atendente';
      case 'client':
        return 'Cliente';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Gestão de Usuários</h2>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie cargos, bloqueios e exclusões de usuários
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className={user.disabled ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="client">Cliente</option>
                    <option value="attendant">Atendente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {user.disabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      <Ban className="w-3 h-3" />
                      Bloqueado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      <CheckCircle className="w-3 h-3" />
                      Ativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleDisabled(user.id, user.disabled)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      user.disabled
                        ? 'bg-green-100 hover:bg-green-200 text-green-800'
                        : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {user.disabled ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Ban className="w-3 h-3" />
                        Bloquear
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
}
