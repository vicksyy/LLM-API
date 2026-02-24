import "./globals.css";
import { Tangerine } from "next/font/google";
import type { Metadata } from "next";

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
});

export const metadata: Metadata = {
  title: "BillyLLM",
  description: "BillyLLM - Integracion OpenAI con Next.js",
  icons: {
    icon: "/billy-llm.avif",
    shortcut: "/billy-llm.avif",
    apple: "/billy-llm.avif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={tangerine.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
