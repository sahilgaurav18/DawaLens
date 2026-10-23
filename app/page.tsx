"use client";

import { useState } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AudienceSection } from "@/components/landing/audience-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { ScannerModal } from "@/components/landing/scanner-modal";
import { SignInModal } from "@/components/landing/sign-in-modal";

export default function Home() {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <LanguageProvider>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay bg-background text-foreground selection:bg-teal-600 selection:text-white">
        {/* Navigation Bar */}
        <Navigation 
          onOpenScan={() => setIsScanOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
        />

        {/* Hero Section (With Integrated Trust Ribbon & Subtle Gradients) */}
        <HeroSection 
          onOpenScan={() => setIsScanOpen(true)}
        />

        {/* Problem Statement & Three Simple Steps (Integrated, Minimal) */}
        <HowItWorksSection />

        {/* Key Features Bento Grid + Safety & Transparency + Clear Results */}
        <FeaturesSection />

        {/* Who Can Use DawaLens? */}
        <AudienceSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Final Call to Action */}
        <CtaSection 
          onOpenScan={() => setIsScanOpen(true)}
        />

        {/* Footer with Medical Disclaimer */}
        <FooterSection 
          onOpenScan={() => setIsScanOpen(true)}
        />

        {/* Interactive Modals */}
        <ScannerModal 
          isOpen={isScanOpen}
          onClose={() => setIsScanOpen(false)}
        />
        <SignInModal 
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
        />
      </main>
    </LanguageProvider>
  );
}
