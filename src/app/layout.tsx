import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Ravenkart", description: "Dijital kartvizit platformu" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="gradient-animate">
        {children}
      </body>
    </html>
  );
}
