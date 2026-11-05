"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, isLoggedIn } from "@/lib/auth";
import LoginScreen from "@/components/login-screen";

const navLinks = [
  { href: "/", label: "Hjem" },
  { href: "/vinyl", label: "🎵 Vinyl" },
  { href: "/filmer", label: "🎬 Filmer" },
  { href: "/registrer", label: "+ Registrer" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  // Check auth on mount
  useState(() => {
    setAuthed(isLoggedIn());
  });

  // Don't wrap Studio in auth/shell
  if (pathname.startsWith("/studio")) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  // Loading state
  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#d4a04a] flex items-center justify-center text-[#0d0d0d] font-bold text-lg animate-pulse">
          T
        </div>
      </div>
    );
  }

  // Not logged in
  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#d4a04a] flex items-center justify-center text-[#0d0d0d] font-bold text-lg group-hover:scale-110 transition-transform">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-[#f0ece4]">
              Toms <span className="text-[#d4a04a]">Samling</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[#d4a04a] ${
                  pathname === link.href ? "text-[#d4a04a]" : "text-[#a89f91]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-[#6b6358] hover:text-red-400 transition-colors text-sm font-medium tracking-wide"
            >
              Logg ut
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#a89f91] hover:text-[#d4a04a] transition-colors"
            aria-label="Meny"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-[#333] bg-[#0d0d0d]/98 backdrop-blur-md animate-fade-in">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#a89f91] hover:text-[#d4a04a] transition-colors text-sm font-medium tracking-wide py-2"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-[#6b6358] hover:text-red-400 transition-colors text-sm font-medium tracking-wide py-2 text-left"
              >
                Logg ut
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#333] bg-[#0d0d0d] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#6b6358] text-sm">
            © 2026 Toms Samling — laget med{" "}
            <span className="text-red-400">❤</span> av ACQ
          </p>
          <p className="text-[#6b6358]/60 text-xs mt-2">
            Vinyl & Film Kolleksjon
          </p>
        </div>
      </footer>
    </>
  );
}
