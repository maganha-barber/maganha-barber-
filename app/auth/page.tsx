"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setUser, getUser } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se Supabase estiver configurado, tenta usar autenticação real
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Salvar no localStorage também
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            picture: session.user.user_metadata?.avatar_url,
          });
          const redirect = searchParams.get("redirect") || "/meus-agendamentos";
          router.push(redirect);
          router.refresh();
        }
      } catch (err) {
        // Se der erro, continua com o modo mock
      }
    } else {
      // Modo mock: verifica se já está logado
      const user = getUser();
      if (user) {
        const redirect = searchParams.get("redirect") || "/meus-agendamentos";
        router.push(redirect);
      }
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const redirectTo = searchParams.get("redirect") || "/meus-agendamentos";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se Supabase estiver configurado, usa autenticação real
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          },
        });

        if (error) {
          setError("Erro ao fazer login: " + error.message);
          setLoading(false);
        }
      } catch (err: any) {
        setError("Erro ao conectar com Google: " + err.message);
        setLoading(false);
      }
    } else {
      // Modo mock: simula login do Google
      // Para testar como admin, use: admin@magbarber.com ou dono@magbarber.com
      setTimeout(() => {
        const mockUser = {
          id: crypto.randomUUID(),
          email: `usuario${Math.floor(Math.random() * 1000)}@gmail.com`,
          name: "Usuário Google",
          picture: undefined,
        };
        setUser(mockUser);
        router.push(redirectTo);
        router.refresh();
      }, 1000);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-soft py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gold-500/30 bg-white rounded-lg p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-full mb-6">
            <LogIn className="h-8 w-8 text-gold-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-4">
            Entrar com Google
          </h1>
          <p className="text-neutral-600 mb-8">
            Faça login com sua conta Google para agendar e gerenciar seus horários
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-gold-500 text-neutral-900 px-6 py-4 font-semibold hover:bg-gold-400 transition-all rounded-md shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </button>

          <p className="text-xs text-neutral-500 mt-6">
            Ao continuar, você concorda com nossos termos de uso e política de privacidade
          </p>
        </div>
      </div>
    </div>
  );
}
