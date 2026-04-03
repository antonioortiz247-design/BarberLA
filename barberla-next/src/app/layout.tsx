import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Urban Bites Studio | UI Demo",
  description: "Landing demo con estética fast-casual, componentes reutilizables y design tokens en Next.js.",
};

export const viewport: Viewport = {
  themeColor: "#0c0d11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
