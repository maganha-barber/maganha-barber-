"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { setUser } from "@/lib/auth";

export function AuthSync() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se Supabase estiver configurado, sincroniza a sessão
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient();
      
      // Verificar sessão atual
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            picture: session.user.user_metadata?.avatar_url,
          });
        }
      });

      // Ouvir mudanças na autenticação
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            picture: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return null;
}
