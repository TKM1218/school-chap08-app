import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Blog",
  description: "記事一覧とお問い合わせフォームのあるブログアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <header className="bg-[#333333] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold hover:opacity-80">
              Blog
            </Link>

            <Link
              href="/contact"
              className="text-sm font-bold hover:opacity-80"
            >
              お問い合わせ
            </Link>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
