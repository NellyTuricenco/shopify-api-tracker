import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopify API Tracker",
  description: "Stay updated with Shopify API versioning timelines.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
