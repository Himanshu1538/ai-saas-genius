import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import ModalProvider from "@/components/modal-provider";
import ToasterProvider from "@/components/toaster-provider";
import CrispProvider from "@/components/crisp-provider";

// Configure the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

// Metadata for the application
export const metadata: Metadata = {
  title: "Genius",
  description: "AI SaaS Platform",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <CrispProvider />
        <body className={inter.className}>
          <ModalProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
