"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";
import { useLanguage } from "@/lib/language-context";

interface CtaSectionProps {
  onOpenScan?: () => void;
}

export function CtaSection({ onOpenScan }: CtaSectionProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="py-14 lg:py-20 overflow-hidden bg-background">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground/15 rounded-3xl transition-all duration-700 overflow-hidden bg-gradient-to-br from-background via-teal-500/[0.03] to-sky-500/[0.03] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.15), transparent 50%)`
            }}
          />

          <div className="relative z-10 px-8 lg:px-14 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left content */}
              <div className="flex-1 max-w-xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 block mb-3">
                  Clinical Safety Check Engine
                </span>
                <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-4 leading-tight">
                  {t("cta.heading")}
                </h2>

                <p className="text-sm lg:text-base text-muted-foreground mb-8 leading-relaxed font-sans">
                  {t("cta.sub")}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="gradient-pill hover:opacity-95 shadow-lg shadow-teal-500/15 px-8 h-12 text-sm rounded-full cursor-pointer"
                  >
                    <Link href="/dashboard/scan">
                      <Camera className="w-4 h-4 mr-2" />
                      {t("cta.btn")}
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
                      Open Dashboard
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-6 font-mono border-l-2 border-teal-500/40 pl-3">
                  {t("cta.note")}
                </p>
              </div>

              {/* Right animation */}
              <div className="hidden lg:flex items-center justify-center w-[360px] h-[360px] -mr-6">
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
