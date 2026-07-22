import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronos Ponto",
  description: "Sistema de controle de ponto do Supermercado Sandro",
  authors: [{ name: "Chronos Ponto" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}