import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toms Samling | Vinyl & Film Kolleksjon",
  description:
    "Toms personlige samling av vinyl-plater og filmer. Registrer, organiser og utforsk hele kolleksjonen.",
  keywords: ["vinyl", "samling", "film", "DVD", "kolleksjon", "Tom"],
  openGraph: {
    title: "Toms Samling | Vinyl & Film Kolleksjon",
    description: "Toms personlige samling av vinyl-plater og filmer.",
    type: "website",
    locale: "nb_NO",
    siteName: "Toms Samling",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body
        className={`${inter.className} bg-[#0d0d0d] text-[#f0ece4] min-h-screen flex flex-col`}
      >
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#d4a04a] flex items-center justify-center text-[#0d0d0d] font-bold text-lg animate-pulse">
                T
              </div>
            </div>
          }
        >
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
