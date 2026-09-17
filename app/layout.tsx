import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M.OURY Incident Hub",
  description: "Capitalisation, diagnostic et résolution des incidents monétiques",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
