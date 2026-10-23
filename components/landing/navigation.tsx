"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Camera } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface NavigationProps {
  onOpenScan?: () => void;
  onOpenSignIn?: () => void;
}

export function Navigation({ onOpenScan, onOpenSignIn }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t("nav.home"), href: "#home" },
    { name: t("nav.howItWorks"), href: "#how-it-works" },
    { name: t("nav.safety"), href: "#safety" },
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.faq"), href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${isScrolled
          ? "top-4 left-4 right-4"
          : "top-0 left-0 right-0"
        }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen
            ? "bg-background/85 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1240px]"
            : "bg-transparent max-w-[1400px]"
          }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${isScrolled ? "h-14" : "h-20"
            }`}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <img
              src="/logo-mark.png"
              alt="DawaLens Logo"
              className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${isScrolled ? "h-8" : "h-10"
                }`}
            />
            <div className="flex items-baseline gap-1.5">
              <span className={`font-display tracking-tight transition-all duration-500 font-semibold ${isScrolled ? "text-xl" : "text-2xl"}`}>
                Dawa<span className="font-normal font-sans text-foreground/90">Lens</span>
              </span>
              <span className={`text-muted-foreground font-mono transition-all duration-500 px-1.5 py-0.5 rounded border border-foreground/15 ${isScrolled ? "text-[8px]" : "text-[9px]"}`}>
                AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/75 hover:text-foreground transition-colors duration-300 relative group font-sans"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Right Actions: Language + Sign In + Scan CTA */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center border border-foreground/15 rounded-full p-0.5 text-xs font-mono bg-foreground/[0.02]">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition-all ${language === "en"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-full transition-all ${language === "hi"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                title="हिंदी में बदलें"
              >
                हिंदी
              </button>
            </div>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`text-foreground/75 hover:text-foreground transition-all duration-300 font-sans cursor-pointer ${isScrolled ? "text-xs" : "text-sm"
                }`}
            >
              Dashboard
            </Link>

            {/* Scan a Medicine Button */}
            <Link
              href="/dashboard/scan"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 font-sans shadow-sm cursor-pointer inline-flex items-center justify-center ${isScrolled ? "px-4 h-8 text-xs" : "px-5 h-9 text-sm"
                }`}
            >
              <Camera className="w-3.5 h-3.5 mr-1.5 opacity-80" />
              {t("nav.scanMedicine")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Language Switcher in Mobile */}
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-foreground/10">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground mr-2">Language:</span>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full text-xs font-mono border ${language === "en" ? "border-foreground bg-foreground text-background" : "border-foreground/15 text-muted-foreground"
                }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-full text-xs font-mono border ${language === "hi" ? "border-foreground bg-foreground text-background" : "border-foreground/15 text-muted-foreground"
                }`}
            >
              हिंदी
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Link
              href="/dashboard"
              className="flex-1 rounded-full h-14 text-base border border-foreground/20 inline-flex items-center justify-center font-medium hover:bg-foreground/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/scan"
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base inline-flex items-center justify-center font-medium hover:bg-foreground/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.scanMedicine")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
