import type { Metadata } from "next";
import { Instrument_Serif, Noto_Serif_Hebrew,Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./providers/ClientThemeProvider";

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
        className={`${instrumentSerif.variable} ${notoSerifHebrew.variable} ${bebasNeue.variable} antialiased`}
      >
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
