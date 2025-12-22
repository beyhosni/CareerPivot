import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { UIConfigProvider } from "@/context/UIConfigContext";

export const metadata: Metadata = {
  title: "CareerPivot | Stratégie de Transition Professionnelle",
  description: "Accélérez votre transition de carrière avec l'IA et l'expertise humaine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UIConfigProvider>
          {children}
        </UIConfigProvider>
      </body>
    </html>
  );
}
