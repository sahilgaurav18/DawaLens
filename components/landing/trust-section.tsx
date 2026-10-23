"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ShieldCheck, Search, Database, Languages } from "lucide-react";

export function TrustSection() {
  const { t } = useLanguage();
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

  const trustPillars = [
    {
      num: "01",
      icon: Search,
      title: t("trust.p1"),
      desc: t("trust.p1.desc"),
      metric: "99.2% Accuracy",
      tag: "Optical AI Model"
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: t("trust.p2"),
      desc: t("trust.p2.desc"),
      metric: "Deterministic",
      tag: "Zero Guesswork"
    },
    {
      num: "03",
      icon: Database,
      title: t("trust.p3"),
      desc: t("trust.p3.desc"),
      metric: "100% Traceable",
      tag: "Pharmacopeia Cited"
    },
    {
      num: "04",
      icon: Languages,
      title: t("trust.p4"),
      desc: t("trust.p4.desc"),
      metric: "Bilingual UI",
      tag: "English & हिंदी"
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 border-b border-foreground/10 bg-foreground/[0.01]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-8 h-px bg-foreground/30" />
            {t("trust.eyebrow")}
          </span>
          <h2
            className={`text-3xl lg:text-5xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("trust.heading")}
          </h2>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className={`p-8 border border-foreground/10 bg-background transition-all duration-700 hover:border-foreground/30 hover:-translate-y-1 group relative overflow-hidden ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {/* Background corner line */}
                <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-foreground/10 group-hover:border-foreground/20 transition-colors" />

                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-muted-foreground tracking-widest">{pillar.num}</span>
                  <div className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-display text-2xl mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {pillar.desc}
                </p>

                <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-foreground font-medium">{pillar.metric}</span>
                  <span className="text-muted-foreground">{pillar.tag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
