"use client";

import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  const inputClass =
    "w-full bg-[#2a2a2a] border border-[#333] rounded-lg px-4 py-3 text-[#f0ece4] placeholder-[#6b6358] focus:outline-none focus:border-[#d4a04a] transition-colors text-sm";

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#d4a04a] flex items-center justify-center text-[#0d0d0d] font-bold text-2xl mx-auto mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f0ece4]">
            Toms <span className="text-[#d4a04a]">Samling</span>
          </h1>
          <p className="text-[#6b6358] text-sm mt-2">
            Logg inn for å fortsette
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="text-[#a89f91] text-sm font-medium mb-1.5 block">
              Brukernavn
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              placeholder="Brukernavn"
              className={inputClass}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="text-[#a89f91] text-sm font-medium mb-1.5 block">
              Passord
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Passord"
                className={inputClass + " pr-12"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6358] hover:text-[#d4a04a] transition-colors"
                aria-label={showPassword ? "Skjul passord" : "Vis passord"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">
                Feil brukernavn eller passord. Prøv igjen.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a04a] hover:bg-[#e8b85c] text-[#0d0d0d] font-semibold py-3 rounded-full transition-all hover:scale-[1.02] text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    </div>
  );
}
