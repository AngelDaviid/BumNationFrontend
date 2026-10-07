import type { Metadata } from "next";
import { Kanchenjunga } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";


const kanchenjunga = Kanchenjunga({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanchenjunga",
});

export const metadata: Metadata = {
  title: "Bum Nation",
  description: "Suplementación deportiva: proteínas, creatinas, pre-entrenos y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${kanchenjunga.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <Providers>
          <Toaster />
          <TooltipProvider>
                {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
