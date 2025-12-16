import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../types';

export const authService = {
  async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha no login');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) throw new Error('Perfil não encontrado');

    if (profile.disabled) {
      await supabase.auth.signOut();
      throw new Error('Acesso bloqueado. Entre em contato com o administrador.');
    }

    return { user: authData.user, profile };
  },

  async signUp(email: string, password: string, name: string, role: UserRole = 'client') {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Erro ao criar conta');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        disabled: false,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: authData.user, profile };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) return null;

    if (profile.disabled) {
      await supabase.auth.signOut();
      return null;
    }

    return { user, profile: profile as Profile };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },
};
