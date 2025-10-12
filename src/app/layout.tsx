import type { Metadata } from "next";
import { Instrument_Serif, Noto_Serif_Hebrew,Bebas_Neue, Liter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "../providers/ClientThemeProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"

const notoSerifHebrew = Noto_Serif_Hebrew({
  variable: "--font-noto-serif-hebrew",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: ["400"],
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight:["400"]
})

const liter = Liter({
  variable: "--font-liter",
  subsets:["latin"],
  weight: ["400"]
})


export const metadata: Metadata = {
  title: "Next Steps",
  description: "Next Steps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${notoSerifHebrew.variable} ${bebasNeue.variable} ${liter.variable} antialiased transition-colors duration-300 h-full`}
      >
        <ClientThemeProvider>
        <Navbar />
          {children}
        </ClientThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
