import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tazita - Rastreador de Café ☕",
  description: "Llevá el control de tus cafés de forma simple y divertida. Temática Pompompurin 🍮",
  keywords: ["café", "tracker", "pompompurin", "rastreador", "coffee"],
  authors: [{ name: "Tazita" }],
  openGraph: {
    title: "Tazita - Rastreador de Café",
    description: "Llevá el control de tus cafés de forma simple y divertida 🍮",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFE4A1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} font-sans antialiased coffee-pattern min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
