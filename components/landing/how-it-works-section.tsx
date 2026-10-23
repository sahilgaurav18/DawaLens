"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { AlertTriangle, Scan, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
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

  const steps = [
    {
      num: t("how.step1.num"),
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
      icon: Scan,
      badge: "Optical AI Capture",
    },
    {
      num: t("how.step2.num"),
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
      icon: CheckCircle2,
      badge: "User Verification",
    },
    {
      num: t("how.step3.num"),
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
      icon: ShieldAlert,
      badge: "Deterministic Report",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-16 lg:py-24 border-b border-foreground/10 bg-foreground/[0.01] relative overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        {/* Top: Problem Statement Compact Callout */}
        <div className="p-6 lg:p-8 rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-sm mb-16 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                <span className="w-5 h-px bg-foreground/30" />
                {t("problem.eyebrow")}
              </span>
              <h2 className="text-2xl lg:text-3xl font-display tracking-tight mb-3">
                {t("problem.heading")}
              </h2>
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                {t("problem.p1")} <span className="text-foreground font-medium">{t("problem.p2")}</span>
              </p>
            </div>

            {/* Quick Warning pill */}
            <div className="lg:col-span-5 p-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.04]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-mono uppercase font-semibold text-amber-900 dark:text-amber-200 block">
                    Common Duplicate Salt Danger
                  </span>
                  <p className="text-muted-foreground mt-0.5">
                    Taking Combiflam + Paracetamol simultaneously delivers <strong>975mg single dose</strong>, risking liver toxicity without patient awareness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Three Simple Steps (Section 5) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              <span className="w-6 h-px bg-teal-500/40" />
              {t("how.eyebrow")}
              <span className="w-6 h-px bg-teal-500/40" />
            </span>
            <h3 className="text-3xl lg:text-4xl font-display tracking-tight">
              {t("how.heading")}
            </h3>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className={`p-6 rounded-2xl border border-foreground/10 bg-background hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono text-muted-foreground font-semibold">
                        {st.num}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-teal-500/20 bg-teal-500/[0.05] text-teal-800 dark:text-teal-300">
                        {st.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/10 group-hover:text-teal-700 transition-colors">
                      <Icon className="w-5 h-5 text-foreground group-hover:text-teal-600 transition-colors" />
                    </div>

                    <h4 className="font-display text-xl mb-2 group-hover:translate-x-1 transition-transform">
                      {st.title}
                    </h4>

                    <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-foreground/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Phase 0{i + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
