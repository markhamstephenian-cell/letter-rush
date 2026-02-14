import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a1f2e",
};

export const metadata: Metadata = {
  title: "Letter Rush - Daily Word Game",
  description:
    "A daily word game. Get a letter, fill in the categories, beat the clock.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Letter Rush",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-navy text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
