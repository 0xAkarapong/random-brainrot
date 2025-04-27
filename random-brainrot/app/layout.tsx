import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
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
  title: "Itarian Brainrot Generator",
  description: "Generate random Italian animal prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Italian, animal, prompt, generator, random, Itarian Brainrot, brainrot, meme" />
        <meta property="og:title" content="Itarian Brainrot Generator" />
        <meta property="og:description" content="Generate random Italian animal prompts" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://random-brainrot.vercel.app/" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1200354900670165"
          crossOrigin="anonymous"
        ></script>
      </head>
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
