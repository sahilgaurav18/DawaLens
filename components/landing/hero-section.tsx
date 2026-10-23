"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, ShieldCheck, Database, Languages, Scan, FileSearch } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";
import { useLanguage } from "@/lib/language-context";

interface HeroSectionProps {
  onOpenScan?: () => void;
}

const rotatingWordsEn = ["Peace of Mind", "Confidence", "Safety", "Clarity"];
const rotatingWordsHi = ["मानसिक सुकून", "आत्मविश्वास", "पूर्ण सुरक्षा", "स्पष्ट समझ"];

export function HeroSection({ onOpenScan }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const rotatingWords = language === "hi" ? rotatingWordsHi : rotatingWordsEn;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const trustPillars = [
    { icon: Scan, title: t("trust.p1") },
    { icon: ShieldCheck, title: t("trust.p2") },
    { icon: Database, title: t("trust.p3") },
    { icon: Languages, title: t("trust.p4") },
  ];

  return (
    <section id="home" className="relative flex flex-col justify-center overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16 ambient-gradient-hero">
      {/* Animated ASCII sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] lg:w-[650px] lg:h-[650px] opacity-30 pointer-events-none">
        <AnimatedSphere />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${16.6 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 lg:px-12">
        {/* Eyebrow */}
        <div
          className={`mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <span className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-mono tracking-wide border border-teal-500/20 bg-teal-500/[0.05] text-teal-800 dark:text-teal-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            {t("hero.eyebrow")}
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-6 max-w-4xl">
          <h1
            className={`text-[clamp(2.5rem,6.2vw,5.8rem)] font-display leading-[0.96] tracking-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <span className="block">{t("hero.title1")}</span>
            <span className="block">{t("hero.title2")}</span>
            <span className="block">
              {language === "hi" ? "आपका " : "Your "}
              <span className="relative inline-block italic font-serif gradient-text">
                <span
                  key={`${language}-${wordIndex}`}
                  className="inline-flex"
                >
                  {rotatingWords[wordIndex % rotatingWords.length].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 30}ms`,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </span>
              {language === "hi" ? "" : "."}
            </span>
          </h1>
        </div>

        {/* Subtitle & CTAs */}
        <div className="max-w-2xl mb-10">
          <p
            className={`text-base lg:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-150 font-sans ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 mt-8 transition-all duration-700 delay-250 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <Button
              asChild
              size="lg"
              className="gradient-pill hover:opacity-95 shadow-md shadow-teal-500/15 px-7 h-12 text-sm rounded-full cursor-pointer"
            >
              <Link href="/dashboard/scan">
                <Camera className="w-4 h-4 mr-2" />
                {t("hero.btnScan")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-sm rounded-full border-foreground/15 hover:bg-foreground/[0.03] cursor-pointer"
            >
              <Link href="/dashboard">
                {language === "hi" ? "डैशबोर्ड खोलें" : "Open Dashboard"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Minimal Trust Pill Ribbon (Integrated Section 3) */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-foreground/10 transition-all duration-700 delay-350 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {trustPillars.map((tp, idx) => {
            const Icon = tp.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-foreground/10 bg-background/60 backdrop-blur-sm hover:border-teal-500/30 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-foreground/85 leading-snug">
                  {tp.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticker / Trust Tagline marquee */}
      <div
        className={`mt-10 py-3.5 border-y border-foreground/10 bg-foreground/[0.015] transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex gap-12 marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <div className="flex items-center gap-3 font-mono text-xs text-foreground/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("hero.ticker")}</span>
              </div>
              <span className="text-foreground/20 font-mono text-xs">/</span>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Verified Reference Rules</span>
              </div>
              <span className="text-foreground/20 font-mono text-xs">/</span>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <FileSearch className="w-3.5 h-3.5 text-cyan-600" />
                <span>Deterministic Safety Engine</span>
              </div>
              <span className="text-foreground/20 font-mono text-xs">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
