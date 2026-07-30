import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConfiguracoesProvider } from "@/components/providers/ConfiguracoesProvider";

import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronos Ponto",
  description: "Sistema de controle de ponto do Supermercado Sandro",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConfiguracoesProvider>
              {children}
              <Toaster />
            </ConfiguracoesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
