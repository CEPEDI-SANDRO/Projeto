import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronos Ponto",
  description:
    "Sistema de controle de ponto do Supermercado Sandro",
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
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        {children}

        <Toaster />
      </body>
    </html>
  );
}