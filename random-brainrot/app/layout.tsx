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
  title: "Italian Brainrot Generator",
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
        <meta name="keywords" content="Italian brainrot animals, AI animal generator, Random animal prompt, Surreal animal creator, Funny animal generator, Brainrot meme generator, AI image prompts animals, Weird animal art, Nonsensical animal generator, Italian meme animals, Generate bizarre animals, Create chaotic animals, Funny AI art generator, Online animal prompt generator, DIY brainrot animals, How to generate Italian brainrot animals, Random prompt generator for AI animal art, Create your own weird Italian animal meme, Funny online tool to generate animal images, AI website for creating surreal animal art prompts" />
        <meta property="og:title" content="Italian Brainrot Generator" />
        <meta property="og:description" content="Generate random Italian animal prompts" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://random-brainrot.vercel.app/" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1200354900670165"
          crossOrigin="anonymous"
        ></script>
        <link rel="icon" href="/favicon.ico" />
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
