import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('gadgethub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('gadgethub_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('mongodb-auth', {
        body: { email, password },
        headers: { 'Content-Type': 'application/json' },
      });

      // Add action as query param workaround
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-auth?action=login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      setUser(result.user);
      localStorage.setItem('gadgethub_user', JSON.stringify(result.user));
      localStorage.setItem('gadgethub_token', result.token);
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${result.user.name}`,
      });
      
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-auth?action=signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      setUser(result.user);
      localStorage.setItem('gadgethub_user', JSON.stringify(result.user));
      
      toast({
        title: 'Account created!',
        description: `Welcome to GadgetHub, ${result.user.name}!`,
      });
      
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      toast({
        title: 'Signup failed',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gadgethub_user');
    localStorage.removeItem('gadgethub_token');
    toast({
      title: 'Logged out',
      description: 'See you soon!',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
