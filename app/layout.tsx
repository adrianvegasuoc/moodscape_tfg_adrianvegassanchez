import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

import "./globals.css";

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
    <html lang="es">
      <body>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
