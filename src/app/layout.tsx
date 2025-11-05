import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offr.io - Professional Quote Generator",
  description: "Create professional quotes in minutes with our smart quoting platform for craftsmen and contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
