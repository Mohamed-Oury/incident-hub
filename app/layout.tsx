import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BANKING CBS & MONETIQUE Hub",
  description: "Capitalisation, diagnostic et résolution des incidents monétiques",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
