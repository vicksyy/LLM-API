import "./globals.css";
import { Outfit, Tangerine } from "next/font/google";
import type { Metadata, Viewport } from "next";

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${tangerine.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
