"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { AlertTriangle, CheckCircle, Pill, Layers, EyeOff, ShieldCheck } from "lucide-react";

export function ProblemSection() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-b border-foreground/10 relative overflow-hidden">
      {/* Background accent lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Heading and Narrative */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t("problem.eyebrow")}
            </span>

            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight leading-[1.05] mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {t("problem.heading")}
            </h2>

            <div
              className={`space-y-6 text-lg lg:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <p>
                {t("problem.p1")}
              </p>
              <p className="text-foreground/90 font-medium">
                {t("problem.p2")}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-foreground/10">
              <div>
                <span className="text-3xl lg:text-4xl font-display text-foreground block">
                  {t("problem.stat1.val")}
                </span>
                <span className="text-xs font-mono text-muted-foreground mt-1 block">
                  {t("problem.stat1.lbl")}
                </span>
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-display text-foreground block">
                  {t("problem.stat2.val")}
                </span>
                <span className="text-xs font-mono text-muted-foreground mt-1 block">
                  {t("problem.stat2.lbl")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Case Study Card */}
          <div className="lg:col-span-5">
            <div
              className={`border border-foreground/15 rounded-2xl p-6 lg:p-8 bg-foreground/[0.02] shadow-sm transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-foreground/10 mb-6">
                <span className="text-xs font-mono uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Real-World Risk Scenario
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-foreground/15">
                  Case #412
                </span>
              </div>

              {/* Medicine A */}
              <div className="p-4 rounded-xl border border-foreground/10 bg-background mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-lg">Product 1: Cold & Flu Relief</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-foreground/5">Oral Cap</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Active Salt: <strong className="text-foreground font-semibold">Paracetamol (500mg)</strong> + Phenylephrine (10mg)
                </p>
              </div>

              {/* Conflict indicator */}
              <div className="flex items-center justify-center my-1">
                <div className="h-6 w-px bg-foreground/20" />
              </div>

              {/* Medicine B */}
              <div className="p-4 rounded-xl border border-foreground/10 bg-background mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-lg">Product 2: Fever & Pain Strip</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-foreground/5">Oral Tab</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Active Salt: <strong className="text-foreground font-semibold">Paracetamol (650mg)</strong>
                </p>
              </div>

              {/* DawaLens Detection result */}
              <div className="p-4 rounded-xl bg-foreground text-background">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-background/60 block">
                      DawaLens Deterministic Finding
                    </span>
                    <p className="text-xs font-sans font-medium text-background mt-1 leading-snug">
                      Duplicate Active Ingredient Detected: Cumulative Paracetamol dose reaches 1,150mg in a single administration (Exceeds maximum safe 1,000mg ceiling).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
