import { supabase } from "@/lib/supabase";
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data && data.user) {
        set({
          user: { id: data.user.id, email: data.user.email || "" },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  signup: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error; 
      }
      if (data && data.user) {
        set({
          user: { id: data.user.id, email: data.user.email || "" },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  checkSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data && data.session) {
        const { user } = data.session;
        set({
          user: {
            id: user.id,
            email: user.email || "",
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false, user: null });
      }
    } catch (error: any) {
      set({ user: null, error: error.message, isLoading: false });
    }
  },
}));
