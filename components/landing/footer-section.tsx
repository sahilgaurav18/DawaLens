"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, AlertTriangle } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { useLanguage } from "@/lib/language-context";

interface FooterSectionProps {
  onOpenScan?: () => void;
}

interface FooterLink {
  name: string;
  href: string;
  badge?: string;
}

export function FooterSection({ onOpenScan }: FooterSectionProps) {
  const { t, language, setLanguage } = useLanguage();

  const footerLinks: Record<string, FooterLink[]> = {
    Dashboard: [
      { name: "Dashboard Home", href: "/dashboard" },
      { name: "Scan Medicines", href: "/dashboard/scan" },
      { name: "My Medicines", href: "/dashboard/medicines" },
      { name: "Safety Reports", href: "/dashboard/reports" },
      { name: "Medicine Safety Guide", href: "/dashboard/guide" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/dashboard/help" },
      { name: "Terms of Use", href: "/dashboard/help" },
      { name: "Medical Disclaimer", href: "/dashboard/help" },
      { name: "CDSCO Formularies", href: "/dashboard/admin" },
    ],
    Connect: [
      { name: "Clinical Support", href: "mailto:clinical@dawalens.in" },
      { name: "Help & FAQs", href: "/dashboard/help" },
      { name: "Pharmacist Registry", href: "/dashboard/admin" },
    ],
  };

  return (
    <footer className="relative border-t border-neutral-800 bg-black text-white overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-48 opacity-15 pointer-events-none overflow-hidden text-neutral-700">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 lg:px-12">
        {/* Main Footer Links */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <Link href="#home" className="inline-flex items-center gap-3 mb-3 group">
                <img
                  src="/logo-mark.png"
                  alt="DawaLens Logo"
                  className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
                />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-display font-semibold text-white">
                    Dawa<span className="font-normal font-sans text-neutral-300">Lens</span>
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono px-2 py-0.5 rounded border border-teal-500/30 bg-teal-500/10">
                    AI + Verified
                  </span>
                </div>
              </Link>

              <p className="text-xs lg:text-sm text-neutral-400 leading-relaxed mb-5 max-w-sm font-sans">
                {t("footer.tagline")}
              </p>

              {/* Language toggle in footer */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-mono text-neutral-400">Language:</span>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-0.5 text-xs font-mono rounded border transition-colors ${
                    language === "en"
                      ? "border-white bg-white text-black font-semibold"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-0.5 text-xs font-mono rounded border transition-colors ${
                    language === "hi"
                      ? "border-white bg-white text-black font-semibold"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Quick Scan Button */}
              <Link
                href="/dashboard/scan"
                className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/90 text-neutral-200 hover:border-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                Launch Medicine Scanner
              </Link>
            </div>

            {/* Link Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-semibold mb-4">
                    {title}
                  </h3>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                          {link.name}
                          {"badge" in link && link.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer Section Box */}
          <div id="disclaimer" className="mt-10 p-5 lg:p-6 rounded-2xl border border-neutral-800/90 bg-neutral-950/80">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  Mandatory Medical Notice
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {t("footer.disclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
          <p>{t("footer.rights")}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t("footer.status")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
