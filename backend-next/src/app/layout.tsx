import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OptiPrompt Pro",
  description: "Unlock Unlimited Potential of Local LLMs",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
