"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#0a0f1e] border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-14 overflow-x-auto scrollbar-hide">
          <Link
            href="/"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/review"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            Review
          </Link>
          <Link
            href="/product"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            Product
          </Link>
          <Link
            href="/user"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            User
          </Link>
          <Link
            href="/network"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            Network
          </Link>
          <Link
            href="/alerts"
            className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.07] px-4 py-2 rounded-md transition-all duration-200"
          >
            Alerts
          </Link>
        </div>
      </div>
    </nav>
  );
}