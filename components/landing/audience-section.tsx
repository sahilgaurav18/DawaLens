"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { User, HeartHandshake, Stethoscope } from "lucide-react";

export function AudienceSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const audiences = [
    {
      role: "01",
      icon: User,
      title: t("audience.a1.title"),
      description: t("audience.a1.desc"),
      benefit: "Self-Management",
    },
    {
      role: "02",
      icon: HeartHandshake,
      title: t("audience.a2.title"),
      description: t("audience.a2.desc"),
      benefit: "Caregiver Oversight",
    },
    {
      role: "03",
      icon: Stethoscope,
      title: t("audience.a3.title"),
      description: t("audience.a3.desc"),
      benefit: "Clinical Support",
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-14 lg:py-20 border-b border-foreground/10 bg-foreground/[0.01]">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
              <span className="w-5 h-px bg-foreground/30" />
              {t("audience.eyebrow")}
            </span>
            <h2 className="text-3xl lg:text-4xl font-display tracking-tight">
              {t("audience.heading")}
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">3 Core User Personas</span>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {audiences.map((aud, index) => {
            const Icon = aud.icon;
            return (
              <div
                key={aud.role}
                className={`p-6 border border-foreground/10 bg-background rounded-2xl transition-all duration-500 hover:border-teal-500/30 hover:-translate-y-1 group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-foreground/15 text-muted-foreground">
                    {aud.benefit}
                  </span>
                </div>

                <h3 className="font-display text-xl mb-2 group-hover:translate-x-1 transition-transform">
                  {aud.title}
                </h3>

                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                  {aud.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
