import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import { getSession } from "@/lib/auth/session";
import { Navbar } from "@/components/Navbar";
import { SnowCanvas } from "@/components/SnowCanvas";
import { MusicPlayer } from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "The Santa Circle - Modern Gift Exchanges for Family & Teams",
  description:
    "The sleek, modern, and ad-free Secret Santa platform with smart exclusions, secret wishlists, and instant invitations.",
  keywords: [
    "Secret Santa",
    "gift exchange",
    "Santa Circle",
    "holiday gift exchange",
    "office Secret Santa",
    "family gift exchange",
    "online Secret Santa generator",
  ],
  metadataBase: new URL("https://thesantacircle.com"),
  openGraph: {
    title: "The Santa Circle - Modern Secret Santa",
    description: "The sleek, modern, and ad-free Secret Santa platform with smart exclusions and wishlists.",
    url: "https://thesantacircle.com",
    siteName: "The Santa Circle",
    images: [
      {
        url: "/images/santa-logo.png",
        width: 800,
        height: 800,
        alt: "The Santa Circle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The Santa Circle - Modern Secret Santa",
    description: "The sleek, modern, and ad-free Secret Santa platform.",
    images: ["/images/santa-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="en">
      <body className="bg-[#0b2b20] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-[#d4af37] selection:text-[#0b2b20]">
        <SnowCanvas />
        <Navbar user={user} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-20">
          {children}
        </main>
        <footer className="z-20 border-t border-[#1d5943] bg-[#071d15]/80 py-6 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center space-x-2.5 mb-1.5">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-sm bg-[#071d15]">
              <Image
                src="/images/santa-logo.png"
                alt="The Santa Circle"
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="font-festive text-sm text-[#fef9ee] font-bold">The Santa Circle</span>
            <span>&bull; Modern & Ad-Free Gift Exchanges</span>
          </div>
          <div className="text-[#f3c053]/70">
            Keep the magic alive &bull; theSantaCircle.com &bull; Assignments remain strictly secret
          </div>
        </footer>
        <MusicPlayer />
      </body>
    </html>
  );
}
