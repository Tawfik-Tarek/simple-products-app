import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Products App",
  description: "A simple products management application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <nav className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="font-bold text-xl"
              >
                Products App
              </Link>
              <Link
                href="/product/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
              >
                Add Product
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-grow">{children}</main>

        <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} <span className="text-blue-600">Tawfik Tarek</span> Products
              App. Built with Next.js
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
