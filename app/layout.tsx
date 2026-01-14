import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maganha Barbearia - Agendamentos Premium",
  description: "Agende seu horário na melhor barbearia da cidade",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth overflow-x-hidden">
      <body className={`${inter.variable} ${playfair.variable} antialiased overflow-x-hidden`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
