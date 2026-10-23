"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, HelpCircle, Upload, Scan, ShieldAlert, ArrowRight, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ScanStatus = "idle" | "scanning" | "verified" | "report";

interface MedicineSample {
  id: string;
  name: string;
  type: string;
  dosage: string;
  ingredients: string[];
  manufacturer: string;
  riskCategory: "risk" | "safe" | "incomplete";
  issueTitle: string;
  issueDesc: string;
  evidence: string;
  nextStep: string;
}

const SAMPLE_MEDS: MedicineSample[] = [
  {
    id: "sample-1",
    name: "Combiflam + Crocin 650",
    type: "Pain & Fever Combination",
    dosage: "Tablet (Oral)",
    ingredients: ["Paracetamol (Acetaminophen) 325mg + 650mg", "Ibuprofen 400mg"],
    manufacturer: "Sanofi India / GSK",
    riskCategory: "risk",
    issueTitle: "Duplicate Paracetamol & Cumulative Dose Warning",
    issueDesc: "Both Combiflam and Crocin contain Paracetamol. Concurrent ingestion exceeds safe single-dose thresholds (975mg total) and risks hepatic toxicity.",
    evidence: "Standard Treatment Guidelines & WHO Essential Medicines Formulary - Maximum adult single dose: 1000mg; safe 24h ceiling: 4000mg.",
    nextStep: "Do not take both medications simultaneously. Consult your pharmacist or prescribing doctor for a non-overlapping regimen."
  },
  {
    id: "sample-2",
    name: "Amoxicillin 500mg Trihydrate",
    type: "Antibacterial Capsule",
    dosage: "500mg Capsule (Oral)",
    ingredients: ["Amoxicillin Trihydrate 500mg"],
    manufacturer: "Alkem Laboratories",
    riskCategory: "safe",
    issueTitle: "No Known Issue Found in Completed Checks",
    issueDesc: "Single agent identified. No duplicate active ingredient or known adverse contraindications detected within the reviewed anti-infective reference rules.",
    evidence: "National Formulary & CDSCO Monograph for Oral Penicillins.",
    nextStep: "Complete the full antibiotic course as prescribed by your physician even if symptoms improve."
  },
  {
    id: "sample-3",
    name: "Obscured Generic Foil Strip",
    type: "Unverified Formulation",
    dosage: "Indeterminate / Faded Print",
    ingredients: ["Unresolved Active Salt"],
    manufacturer: "Indeterminate",
    riskCategory: "incomplete",
    issueTitle: "Verification Incomplete",
    issueDesc: "Packaging text is partially faded or obscured by foil crease. The active salt concentration could not be confirmed with >95% confidence.",
    evidence: "Optical OCR Confidence Score: 52% (Below minimum 90% threshold for deterministic safety evaluation).",
    nextStep: "Position the packaging under bright lighting and retake the photo, or show the physical blister to a licensed pharmacist."
  }
];

export function ScannerModal({ isOpen, onClose }: ScannerModalProps) {
  const { language } = useLanguage();
  const [selectedSample, setSelectedSample] = useState<MedicineSample>(SAMPLE_MEDS[0]);
  const [scanStep, setScanStep] = useState<ScanStatus>("idle");

  const startScan = (sample: MedicineSample) => {
    setSelectedSample(sample);
    setScanStep("scanning");
    setTimeout(() => {
      setScanStep("verified");
    }, 1800);
  };

  const handleRunSafetyCheck = () => {
    setScanStep("report");
  };

  const reset = () => {
    setScanStep("idle");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); reset(); } }}>
      <DialogContent className="max-w-3xl bg-background border border-foreground/15 p-0 overflow-hidden sm:rounded-2xl">
        {/* Top Header */}
        <div className="p-6 border-b border-foreground/10 bg-foreground/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-mark.png" alt="DawaLens Logo" className="w-10 h-10 object-contain shrink-0" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {language === "hi" ? "एआई दवा पहचान और सुरक्षा जांच" : "AI Identification & Safety Verification Engine"}
                </span>
                <DialogTitle className="text-2xl font-display mt-0.5">
                  {language === "hi" ? "दवा पैकेजिंग स्कैनर" : "Medicine Packaging Scanner"}
                </DialogTitle>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-foreground/15 bg-background">
              v2.4
            </span>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {language === "hi"
              ? "दवा की फोटो अपलोड करें या डेमो के लिए नमूना चुनें।"
              : "Upload a packaging photo or select a test case to experience the identification flow."}
          </DialogDescription>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {scanStep === "idle" && (
            <div className="space-y-6">
              {/* Sample Selector */}
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase block mb-3">
                  {language === "hi" ? "नमूना दवा चुनें (त्वरित पूर्वावलोकन)" : "Select a Sample Test Case (Instant Preview)"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SAMPLE_MEDS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => startScan(sample)}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 hover:border-foreground/40 hover:-translate-y-0.5 ${selectedSample.id === sample.id
                          ? "border-foreground bg-foreground/[0.04]"
                          : "border-foreground/10 bg-background"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${sample.riskCategory === "risk"
                            ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                            : sample.riskCategory === "safe"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          }`}>
                          {sample.riskCategory === "risk" ? "Risk Flag" : sample.riskCategory === "safe" ? "Verified" : "Incomplete"}
                        </span>
                        <Scan className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm leading-snug line-clamp-1">{sample.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{sample.type}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone Simulation */}
              <div
                onClick={() => startScan(SAMPLE_MEDS[0])}
                className="border-2 border-dashed border-foreground/15 rounded-2xl p-8 text-center hover:border-foreground/40 transition-colors cursor-pointer bg-foreground/[0.01] hover:bg-foreground/[0.03] group"
              >
                <div className="w-12 h-12 rounded-full border border-foreground/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-sm font-medium">
                  {language === "hi" ? "दवा की फोटो खींचें या अपलोड करें" : "Capture or Drop Medicine Packaging Image"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Supports JPG, PNG, WEBP (Clear text recommended)
                </p>
                <Button size="sm" variant="outline" className="mt-4 rounded-full text-xs font-mono">
                  {language === "hi" ? "नमूना 1 के साथ स्कैन शुरू करें" : "Run Scan on Sample 1"}
                </Button>
              </div>
            </div>
          )}

          {scanStep === "scanning" && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-40 h-40 mx-auto rounded-2xl border border-foreground/20 overflow-hidden bg-foreground/[0.03] flex items-center justify-center">
                <Scan className="w-16 h-16 text-foreground/40" />
                {/* Laser scan line */}
                <div className="absolute inset-x-0 h-0.5 bg-foreground animate-bounce shadow-[0_0_12px_rgba(0,0,0,0.5)]" />
                <div className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground">OCR::RUNNING</div>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground">RES::1080p</div>
              </div>
              <div>
                <h3 className="font-display text-xl mb-1">
                  {language === "hi" ? "पैकेजिंग और साल्ट का विश्लेषण..." : "Extracting Packaging Text & Formulation..."}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  Evaluating: {selectedSample.name}
                </p>
              </div>
              <div className="max-w-xs mx-auto h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full bg-foreground w-3/4 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {scanStep === "verified" && (
            <div className="space-y-6">
              <div className="border border-foreground/10 rounded-xl p-5 bg-foreground/[0.02]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-foreground/10">
                  <span className="text-xs font-mono uppercase text-muted-foreground">
                    Step 02 — Extracted Packaging Parameters
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block font-mono">Product Name</span>
                    <span className="font-medium text-foreground">{selectedSample.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block font-mono">Dosage Form</span>
                    <span className="font-medium text-foreground">{selectedSample.dosage}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground block font-mono">Recognized Active Ingredients</span>
                    <ul className="mt-1 space-y-1">
                      {selectedSample.ingredients.map((ing, i) => (
                        <li key={i} className="inline-block mr-2 px-2.5 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-xs font-mono">
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={reset} className="text-xs font-mono">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" /> Rescan Different Item
                </Button>
                <Button
                  onClick={handleRunSafetyCheck}
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"
                >
                  Step 03 — Run Deterministic Safety Check
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {scanStep === "report" && (
            <div className="space-y-6">
              {/* Outcome Banner */}
              <div className={`p-5 rounded-2xl border ${selectedSample.riskCategory === "risk"
                  ? "bg-rose-500/[0.04] border-rose-500/20 text-rose-950 dark:text-rose-200"
                  : selectedSample.riskCategory === "safe"
                    ? "bg-emerald-500/[0.04] border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                    : "bg-amber-500/[0.04] border-amber-500/20 text-amber-950 dark:text-amber-200"
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl shrink-0 ${selectedSample.riskCategory === "risk"
                      ? "bg-rose-500/10 text-rose-600"
                      : selectedSample.riskCategory === "safe"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                    {selectedSample.riskCategory === "risk" ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : selectedSample.riskCategory === "safe" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <HelpCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider block opacity-75">
                      {selectedSample.riskCategory === "risk"
                        ? "Section 08 — Risk Detected"
                        : selectedSample.riskCategory === "safe"
                          ? "Section 08 — No Known Issue Found in Completed Checks"
                          : "Section 08 — Verification Incomplete"}
                    </span>
                    <h4 className="font-display text-xl mt-0.5">{selectedSample.issueTitle}</h4>
                    <p className="text-sm mt-2 leading-relaxed opacity-90">{selectedSample.issueDesc}</p>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence & Next Steps */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.01]">
                  <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">
                    Verified Evidence Reference
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                    {selectedSample.evidence}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.01]">
                  <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">
                    Appropriate Next Step
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {selectedSample.nextStep}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                <Button variant="outline" size="sm" onClick={reset} className="rounded-full text-xs font-mono">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" /> Test Another Medicine
                </Button>
                <Button onClick={onClose} className="rounded-full bg-foreground text-background text-xs font-mono px-6">
                  Close Safety Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
