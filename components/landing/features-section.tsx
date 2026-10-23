"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Scan, GitCompare, CopyCheck, FileText, ShieldCheck, Languages, CheckCircle2, ShieldAlert, HelpCircle } from "lucide-react";

export function FeaturesSection() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      num: "01",
      icon: Scan,
      title: t("features.f1.title"),
      desc: t("features.f1.desc"),
      gradient: "hover:border-cyan-500/30",
    },
    {
      num: "02",
      icon: GitCompare,
      title: t("features.f2.title"),
      desc: t("features.f2.desc"),
      gradient: "hover:border-teal-500/30",
    },
    {
      num: "03",
      icon: CopyCheck,
      title: t("features.f3.title"),
      desc: t("features.f3.desc"),
      gradient: "hover:border-emerald-500/30",
    },
    {
      num: "04",
      icon: FileText,
      title: t("features.f4.title"),
      desc: t("features.f4.desc"),
      gradient: "hover:border-sky-500/30",
    },
    {
      num: "05",
      icon: ShieldCheck,
      title: t("features.f5.title"),
      desc: t("features.f5.desc"),
      gradient: "hover:border-teal-500/30",
    },
    {
      num: "06",
      icon: Languages,
      title: t("features.f6.title"),
      desc: t("features.f6.desc"),
      gradient: "hover:border-emerald-500/30",
    },
  ];

  const safetyOutcomes = [
    {
      id: "risk",
      badge: "Risk Detected",
      title: t("results.r1.title"),
      desc: t("results.r1.desc"),
      icon: ShieldAlert,
      color: "border-rose-500/20 bg-rose-500/[0.03] text-rose-700 dark:text-rose-400",
    },
    {
      id: "safe",
      badge: "No Issue in Completed Checks",
      title: t("results.r2.title"),
      desc: t("results.r2.desc"),
      icon: CheckCircle2,
      color: "border-emerald-500/20 bg-emerald-500/[0.03] text-emerald-700 dark:text-emerald-400",
    },
    {
      id: "incomplete",
      badge: "Verification Incomplete",
      title: t("results.r3.title"),
      desc: t("results.r3.desc"),
      icon: HelpCircle,
      color: "border-amber-500/20 bg-amber-500/[0.03] text-amber-700 dark:text-amber-400",
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-16 lg:py-24 border-b border-foreground/10 bg-background"
    >
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
            <span className="w-6 h-px bg-foreground/30" />
            {t("features.eyebrow")}
            <span className="w-6 h-px bg-foreground/30" />
          </span>
          <h2
            className={`text-3xl lg:text-5xl font-display tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            {t("features.heading")}
          </h2>
        </div>

        {/* 6 Features Compact Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.num}
                className={`p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.01] transition-all duration-500 hover:-translate-y-1 ${feat.gradient} hover:shadow-sm ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{feat.num}</span>
                </div>
                <h3 className="font-display text-xl mb-2">{feat.title}</h3>
                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Integrated Safety & Deterministic Outcomes (Sections 7 & 8) */}
        <div id="safety" className="p-8 lg:p-10 rounded-3xl border border-foreground/10 bg-foreground/[0.015] relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left: Safety Rules Callout */}
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 block mb-2">
                Section 07 — {t("safety.eyebrow")}
              </span>
              <h3 className="text-2xl lg:text-4xl font-display mb-3">
                {t("safety.heading")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                {t("safety.desc")}
              </p>

              {/* 4 Checklist Bullets */}
              <div className="space-y-2.5">
                {[t("safety.b1"), t("safety.b2"), t("safety.b3"), t("safety.b4")].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3 Clear Result Outcomes (Section 8) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                Section 08 — {t("results.heading")}
              </span>

              {safetyOutcomes.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selectedResult === index;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedResult(index)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${item.color} ${isSelected ? "ring-1 ring-foreground/20 shadow-sm" : "opacity-80 hover:opacity-100"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-base font-semibold">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-current">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
