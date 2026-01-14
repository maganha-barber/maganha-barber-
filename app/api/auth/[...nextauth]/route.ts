import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Adiciona o ID do usuário ao objeto de sessão
      if (token?.sub) {
        session.user.id = token.sub;
      }
      // Adiciona isAdmin ao objeto de sessão
      if (token?.email) {
        const ADMIN_EMAILS = ['lpmragi@gmail.com'];
        session.user.isAdmin = ADMIN_EMAILS.includes(token.email.toLowerCase());
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // Persiste o ID do usuário no token JWT
      if (account) {
        token.id = account.providerAccountId;
      }
      // Persiste o email no token JWT
      if (profile?.email) {
        token.email = profile.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
