import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Global Sports - Live sport on YouTube",
  description: "Watch international sport live and on demand with Open Global Sports.",
  icons: {
    icon: "/favicon-padded.png?v=3",
    shortcut: "/favicon-padded.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
