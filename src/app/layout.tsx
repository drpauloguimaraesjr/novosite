import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "DR. PAULO GUIMARÃES JR. | Instituto Médico",
  description: "Medicina integrada e exclusiva focada em otimizar sua saúde física e mental.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}
