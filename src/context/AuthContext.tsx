import { Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

/**
 * KRITERIA MODUL 4: Global AuthContext & Real-time Session Subscription
 * Mengelola status autentikasi di seluruh aplikasi:
 * 1. Rehidrasi sesi saat startup (supabase.auth.getSession)
 * 2. Mendengarkan perubahan sesi langsung (supabase.auth.onAuthStateChange)
 * 3. Menyediakan state user, session, isLoading, dan fungsi signOut
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Rehidrasi sesi dari SecureStore saat startup
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.warn('[AuthContext] Error getting initial session:', error.message);
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] Unexpected auth initialization error:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Berlangganan perubahan sesi secara real-time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        console.log(`[Auth Event] ${_event} for user: ${currentSession?.user?.email ?? 'none'}`);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper Sign Out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthContext] Error during sign out:', error.message);
      }
    } catch (err) {
      console.error('[AuthContext] Unexpected sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
