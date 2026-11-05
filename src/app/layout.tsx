import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
