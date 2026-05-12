import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const faktum = localFont({
  src: [
    {
      path: "../../public/fonts/Faktum-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Faktum-Regular.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-faktum",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KOHAM — Remote-Controlled Robotic Mower",
  description:
    "The KOHAM robotic mower does in 1 hour what 10 workers would take all day. No physical effort. No risk. No gas. Available across the United States.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${faktum.variable} ${inter.variable}`}>
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video-js.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
