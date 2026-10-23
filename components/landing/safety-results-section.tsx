"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ShieldAlert, CheckCircle2, HelpCircle, ArrowUpRight } from "lucide-react";

export function SafetyResultsSection() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
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

  const results = [
    {
      status: "01",
      badge: "Risk Detected",
      title: t("results.r1.title"),
      description: t("results.r1.desc"),
      icon: ShieldAlert,
      badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      cardBorder: "hover:border-rose-500/30",
      sampleCheck: "Duplicate Paracetamol found across 2 items (975mg dose)",
      actionAdvice: "Discuss with pharmacist before taking both medications.",
    },
    {
      status: "02",
      badge: "Verified Negative",
      title: t("results.r2.title"),
      description: t("results.r2.desc"),
      icon: CheckCircle2,
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      cardBorder: "hover:border-emerald-500/30",
      sampleCheck: "No interaction found in 14 standard pharmacopeia rules",
      actionAdvice: "Maintain prescribed dose; report unexpected reactions to physician.",
    },
    {
      status: "03",
      badge: "Incomplete Data",
      title: t("results.r3.title"),
      description: t("results.r3.desc"),
      icon: HelpCircle,
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      cardBorder: "hover:border-amber-500/30",
      sampleCheck: "Packaging faded; 1 active ingredient unverified",
      actionAdvice: "Retake photo with clear lighting or bring strip to your pharmacist.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 border-b border-foreground/10 bg-background relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 lg:mb-24 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t("results.eyebrow")}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight leading-[1.05] transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("results.heading")}
          </h2>
          <p className="text-base lg:text-xl text-muted-foreground mt-6 leading-relaxed">
            {language === "hi"
              ? "हर जांच स्पष्ट, बिना किसी अस्पष्टता के तीन परिणामों में से एक उत्पन्न करती है ताकि मरीज और देखभालकर्ता हमेशा समझ सकें कि क्या जांचा गया था।"
              : "Every check concludes with one of three transparent classifications so patients and caregivers are never left guessing what was verified."}
          </p>
        </div>

        {/* 3 Outcome Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {results.map((res, index) => {
            const Icon = res.icon;
            return (
              <div
                key={res.status}
                onClick={() => setActiveCard(index)}
                className={`p-8 border border-foreground/10 rounded-2xl bg-foreground/[0.01] transition-all duration-700 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${res.cardBorder} ${
                  activeCard === index ? "border-foreground/40 shadow-md bg-foreground/[0.03]" : ""
                } ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${res.badgeColor}`}>
                      {res.badge}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{res.status}</span>
                  </div>

                  <div className="w-12 h-12 rounded-xl border border-foreground/10 flex items-center justify-center mb-6">
                    <Icon className={`w-6 h-6 ${res.iconColor}`} />
                  </div>

                  <h3 className="font-display text-2xl lg:text-3xl mb-4 leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-6">
                    {res.description}
                  </p>
                </div>

                {/* Practical Outcome Box */}
                <div className="pt-6 border-t border-foreground/10 space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Evaluation Sample:</span>
                    <span className="text-foreground">{res.sampleCheck}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Recommended Action:</span>
                    <span className="text-foreground/80">{res.actionAdvice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
