import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/meus-agendamentos";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`);
      }

      // O usuário será salvo no cliente quando a página carregar
      // via checkSession na página de destino
    } catch (err) {
      console.error("Erro no callback:", err);
    }
  }

  // Redirecionar com script para salvar usuário no localStorage
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecionando...</title>
        <script>
          // Aguardar um pouco para garantir que a sessão foi salva
          setTimeout(() => {
            window.location.href = "${requestUrl.origin}${redirectTo}";
          }, 100);
        </script>
      </head>
      <body>
        <p>Redirecionando...</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
