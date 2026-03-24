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
  title: "SixInSixty - The Quick Word Game",
  description:
    "A quick word game. Get a letter, fill in 6 categories in 60 seconds.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SixInSixty",
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
