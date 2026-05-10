import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Moodscape",
  description:
    "Moodscape es una aplicacion web para la expresion emocional mediante arte generativo basado en IA."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={inter.variable} lang="es">
      <body>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
