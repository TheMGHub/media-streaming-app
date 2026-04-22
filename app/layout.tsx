import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Streaming App",
  description: "Stream public Google Drive videos with playlist controls.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
