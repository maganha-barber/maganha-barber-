import { NextResponse } from "next/server";
import { setUser } from "@/lib/auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");
  
  // Decodificar state para obter redirectTo
  let redirectTo = "/meus-agendamentos";
  if (state) {
    try {
      // Decodificar base64url
      const decodedState = Buffer.from(state, 'base64url').toString('utf-8');
      const stateData = JSON.parse(decodedState);
      redirectTo = stateData.redirect || "/meus-agendamentos";
    } catch (e) {
      // Se não conseguir decodificar, tenta usar o state diretamente como redirect
      // (fallback para compatibilidade)
      if (state && !state.includes('{')) {
        redirectTo = decodeURIComponent(state);
      }
    }
  }

  // Se houver erro do Google
  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent("Código de autorização não fornecido")}`);
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent("Google OAuth não configurado")}`);
  }

  try {
    // Trocar código por token de acesso
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${requestUrl.origin}/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(errorData.error || "Erro ao obter token")}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Obter informações do usuário
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent("Erro ao obter dados do usuário")}`);
    }

    const userData = await userResponse.json();

    // Salvar usuário no localStorage via script
    // Verificar se é admin baseado no email
    const ADMIN_EMAILS = ['admin@magbarber.com', 'dono@magbarber.com'];
    const isUserAdmin = ADMIN_EMAILS.includes(userData.email.toLowerCase());
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecionando...</title>
          <script>
            // Salvar dados do usuário no localStorage com verificação de admin
            const userData = ${JSON.stringify({
              id: userData.id || userData.email,
              email: userData.email,
              name: userData.name || userData.email,
              picture: userData.picture,
              isAdmin: ${isUserAdmin}
            })};
            localStorage.setItem('magbarber_user', JSON.stringify(userData));
            // Disparar evento para atualizar componentes
            window.dispatchEvent(new Event('userUpdated'));
            // Redirecionar
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
  } catch (err: any) {
    console.error("Erro no callback:", err);
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(err.message || "Erro desconhecido")}`);
  }
}
