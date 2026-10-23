"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Plus, Minus } from "lucide-react";

export function FaqSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const faqs = [
    { num: "01", q: t("faq.q1"), a: t("faq.a1") },
    { num: "02", q: t("faq.q2"), a: t("faq.a2") },
    { num: "03", q: t("faq.q3"), a: t("faq.a3") },
    { num: "04", q: t("faq.q4"), a: t("faq.a4") },
    { num: "05", q: t("faq.q5"), a: t("faq.a5") },
    { num: "06", q: t("faq.q6"), a: t("faq.a6") },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-14 lg:py-20 border-b border-foreground/10 bg-background">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                <span className="w-5 h-px bg-foreground/30" />
                {t("faq.eyebrow")}
              </span>
              <h2
                className={`text-3xl lg:text-4xl font-display tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
              >
                {t("faq.heading")}
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground mt-3 leading-relaxed">
                Key questions on identification, safety bounds, and doctor consultations.
              </p>
            </div>
          </div>

          {/* Right Column: Compact Accordion */}
          <div className="lg:col-span-8 divide-y divide-foreground/10 border-y border-foreground/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.num} className="py-4 lg:py-5 transition-colors">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-teal-600 dark:text-teal-400 font-semibold">{faq.num}</span>
                      <h3 className="font-display text-base lg:text-lg text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-foreground/15 flex items-center justify-center shrink-0 group-hover:border-teal-500/40 transition-colors">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-foreground" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-2 pl-7 pr-6 text-muted-foreground text-xs lg:text-sm leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
