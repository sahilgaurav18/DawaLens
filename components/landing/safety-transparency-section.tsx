"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { CheckCircle2, Shield, Database, AlertCircle, FileSearch, HelpCircle } from "lucide-react";

export function SafetyTransparencySection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const bullets = [
    { text: t("safety.b1"), tag: "Human-in-the-Loop" },
    { text: t("safety.b2"), tag: "Deterministic Engine" },
    { text: t("safety.b3"), tag: "Peer-Reviewed Data" },
    { text: t("safety.b4"), tag: "Honest Limitations" },
  ];

  const citations = [
    "CDSCO Monographs",
    "WHO Essential Medicines",
    "FDA Drug Matrices",
    "National Formulary",
    "Deterministic Rules v2.4"
  ];

  return (
    <section id="safety" ref={sectionRef} className="relative py-24 lg:py-36 bg-foreground/[0.02] border-b border-foreground/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div
            className={`lg:col-span-7 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t("safety.eyebrow")}
            </span>

            <h2 className="text-4xl lg:text-6xl font-display tracking-tight leading-[1.05] mb-6">
              {t("safety.heading")}
            </h2>

            <div className="border-l-2 border-foreground pl-4 my-6">
              <p className="text-xl font-display italic text-foreground">
                &ldquo;{t("safety.callout")}&rdquo;
              </p>
            </div>

            <p className="text-base lg:text-xl text-muted-foreground leading-relaxed mb-10">
              {t("safety.desc")}
            </p>

            {/* 4 Core Principles Checklist */}
            <div className="space-y-4 mb-10">
              {bullets.map((bullet, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 border border-foreground/10 rounded-xl bg-background hover:border-foreground/25 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-base font-medium text-foreground">{bullet.text}</span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">{bullet.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Source Citations */}
            <div className="pt-6 border-t border-foreground/10">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-3">
                Transparent Reference Standards
              </span>
              <div className="flex flex-wrap gap-2">
                {citations.map((c, i) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 border border-foreground/15 rounded-md text-xs font-mono bg-background"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Diagram Card */}
          <div className="lg:col-span-5">
            <div className="border border-foreground/20 rounded-2xl p-6 lg:p-8 bg-background shadow-lg relative">
              <div className="flex items-center justify-between pb-4 border-b border-foreground/10 mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Verification Architecture
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  Deterministic
                </span>
              </div>

              {/* Step Flow */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                  <span className="text-[10px] font-mono text-muted-foreground block">LAYER 01 :: PERCEPTION</span>
                  <h4 className="font-display text-lg mt-0.5">AI Computer Vision</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Extracts raw packaging text, brand name, and dosage form. AI is strictly confined to transcription and never invents medical rules.
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="h-4 w-px bg-foreground/20" />
                </div>

                <div className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                  <span className="text-[10px] font-mono text-muted-foreground block">LAYER 02 :: HUMAN VALIDATION</span>
                  <h4 className="font-display text-lg mt-0.5">User Review & Correction</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    The user explicitly confirms or adjusts extracted ingredients before any safety check is initiated.
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="h-4 w-px bg-foreground/20" />
                </div>

                <div className="p-4 rounded-xl border border-foreground/20 bg-foreground text-background">
                  <span className="text-[10px] font-mono text-background/60 block">LAYER 03 :: SAFETY CORE</span>
                  <h4 className="font-display text-lg mt-0.5 text-background">Hard-Coded Rule Evaluation</h4>
                  <p className="text-xs text-background/80 mt-1">
                    Evaluates confirmed salts against verified pharmacopeial interaction matrices with zero generative hallucinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
