"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/",        label: "Analyze"  },
  { href: "/history", label: "History"  },
  { href: "/alerts",  label: "Alerts"   },
  {href:"/dashboard", label: "Dashboard"}
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#080d1c]/90 border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.98 11.98 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">FakeGuard</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? "text-white bg-white/[0.1] shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}