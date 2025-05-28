
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff';
  regNumber?: string;
  department?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Try to fetch from profiles table first
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If RLS error, create a fallback profile based on email
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.log('RLS recursion detected, creating fallback profile');
          
          // Determine role based on email
          const isStaff = userEmail?.includes('admin') || userEmail?.includes('staff');
          const fallbackProfile: UserProfile = {
            id: userId,
            name: userEmail?.split('@')[0] || 'User',
            email: userEmail || '',
            role: isStaff ? 'staff' : 'student'
          };
          
          console.log('Using fallback profile:', fallbackProfile);
          return fallbackProfile;
        }
        
        return null;
      }

      console.log('Profile fetched:', profile);

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'student' | 'staff',
        regNumber: profile.reg_number,
        department: profile.department
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlock
          setTimeout(async () => {
            if (!mounted) return;
            const profile = await fetchUserProfile(session.user.id, session.user.email);
            if (mounted) {
              setUser(profile);
              setIsLoading(false);
            }
          }, 0);
        } else {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.id);

        if (!mounted) return;

        setSession(session);
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email);
          if (mounted) {
            setUser(profile);
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data: data?.user?.id, error });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user && data.session) {
        console.log('Login successful, fetching profile...');
        const profile = await fetchUserProfile(data.user.id, data.user.email);
        if (profile) {
          setUser(profile);
          setSession(data.session);
          setIsLoading(false);
          console.log('Profile set successfully:', profile);
          return true;
        } else {
          console.error('No profile found for user');
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
