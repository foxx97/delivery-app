import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';

interface AuthContextType {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted.current) {
        setSession(session);
        if (!session) {
          router.replace('/(auth)/login');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted.current) {
        setSession(session);
        if (!session) {
          router.replace('/(auth)/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      isMounted.current = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}