import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    return NextResponse.json(
      { error: "Google OAuth não configurado" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get("redirect") || "/meus-agendamentos";
  
  // URL de callback (sem query parameters - o Google compara exatamente)
  // IMPORTANTE: Esta URI deve corresponder EXATAMENTE ao que está no Google Cloud Console
  const redirectUri = `${request.nextUrl.origin}/auth/callback`;
  
  // Log para debug (remover em produção se necessário)
  console.log('Redirect URI sendo usado:', redirectUri);
  console.log('Origin:', request.nextUrl.origin);
  
  // Usar 'state' parameter para passar o redirectTo (padrão OAuth)
  const state = Buffer.from(JSON.stringify({ redirect: redirectTo })).toString('base64url');
  
  // Parâmetros do OAuth
  const scope = "openid email profile";
  const responseType = "code";
  const accessType = "offline";
  const prompt = "consent";
  
  // URL do Google OAuth
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=${accessType}&prompt=${prompt}&state=${encodeURIComponent(state)}`;

  // Redirecionar para Google OAuth
  return NextResponse.redirect(googleAuthUrl);
}
