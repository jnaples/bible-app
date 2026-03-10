import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  continueAsGuest: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsGuest(false); // clear guest mode on login
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = () => setIsGuest(true);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsGuest(false);
  };

  const deleteAccount = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { error: versesError } = await supabase
      .from("saved_verses")
      .delete()
      .eq("user_id", user.id);
    if (versesError) throw versesError;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const { error } = await supabase.functions.invoke("delete-user", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "sacredarmor://reset-password",
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isGuest,
        continueAsGuest,
        signUp,
        signIn,
        signOut,
        deleteAccount,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
