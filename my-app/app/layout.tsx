import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_NAME } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${APP_NAME} - Find Skilled Workers Near You`,
  description: "Connect with skilled workers in your area. Find plumbers, electricians, carpenters, and more professionals for your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <Header />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" async></script>
      </body>
    </html>
  );
}
