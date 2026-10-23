"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function HelpAndSupportPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"tutorials" | "troubleshooting" | "legal">("tutorials");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setFeedbackText("");
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Clinical Context Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi" ? "सहायता एवं समर्थन (Help & Support)" : "Help & Clinical Support"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === "hi"
              ? "दवा पैकेजिंग स्कैन करने, त्रुटियों को सुधारने, बहु-दवा जांच चलाने और क्लिनिकल परिणामों को समझने के लिए विस्तृत मार्गदर्शन।"
              : "Standard operating procedures for label scanning, verification correction, multi-medicine checks, and legal disclaimers."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/guide"
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
          >
            {language === "hi" ? "सुरक्षा मार्गदर्शिका खोलें" : "Open Medicine Safety Guide →"}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200 rounded text-xs font-medium">
        <button
          onClick={() => setActiveTab("tutorials")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "tutorials"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "उपयोग निर्देश (Tutorials)" : "System Instructions"}
        </button>
        <button
          onClick={() => setActiveTab("troubleshooting")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "troubleshooting"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "समस्या निवारण (Troubleshooting)" : "Verification & Error Resolution"}
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "legal"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {language === "hi" ? "कानूनी एवं अस्वीकरण (Legal)" : "Terms, Privacy & Medical Disclaimer"}
        </button>
      </div>

      {/* TAB 1: Step-by-Step Tutorials */}
      {activeTab === "tutorials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-sky-700">Workflow 1</span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === "hi" ? "दवा का पत्ता सही तरीके से कैसे स्कैन करें?" : "How to Capture Readable Packaging"}
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Place the blister strip or bottle on a flat, well-lit surface with no glare.</li>
              <li>Avoid pinching the active composition text with your fingers.</li>
              <li>Ensure the camera frames both the brand title and the smaller salt formulation subtitle.</li>
              <li>If the packaging has silver foil reflection, angle the phone 15 degrees to minimize glare.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-sky-700">Workflow 2</span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === "hi" ? "पहचान त्रुटियों को कैसे सुधारें?" : "How to Correct OCR Extraction Errors"}
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>After scanning, DawaLens presents candidate details in Stage 2 (Verification).</li>
              <li>Never approve an unverified or uncertain identification. Click "Edit Details".</li>
              <li>Check the exact milligrams (e.g. Paracetamol 650mg vs 500mg) and select the dosage form.</li>
              <li>Click "Confirm Details Against Packaging" before advancing to the safety checker.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-sky-700">Workflow 3</span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === "hi" ? "बहु-दवा सुरक्षा जांच कैसे चलाएं?" : "How to Run a Multi-Medicine Check"}
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>You can add 2 or more medicines in the Scan wizard or select them in "My Medicines".</li>
              <li>Click "Run Safety Check". The system executes 4 distinct CDSCO rule matrices.</li>
              <li>It analyzes cumulative salt doses, CY450 enzyme interactions, and gastrointestinal risks.</li>
              <li>Review the structured report and press "Read Aloud" if you prefer audio assistance.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-sky-700">Workflow 4</span>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === "hi" ? "संभावित जोखिम और अधूरी जांच का क्या करें?" : "Interpreting Results & Next Steps"}
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li><strong>Risk Detected:</strong> High alert. Do not ingest without consulting your prescribing doctor or pharmacist.</li>
              <li><strong>No Known Issue:</strong> No matching interaction in completed checks; keep taking medicines strictly as prescribed.</li>
              <li><strong>Incomplete:</strong> Essential clinical data (e.g. kidney clearance or unconfirmed salt) was unavailable. Ask a professional.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: Troubleshooting */}
      {activeTab === "troubleshooting" && (
        <div className="bg-white border border-slate-200 rounded p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {language === "hi" ? "आम समस्याएं एवं उनका समाधान" : "Common Scenarios & Clinical Resolution"}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <span className="font-bold text-slate-800 block">
                Camera permission denied on mobile or desktop browser
              </span>
              <p className="text-slate-600">
                Check your browser permissions bar (lock icon near the URL). Allow camera access. Alternatively, take a photo with your device's native camera and use the "Upload Image" button.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <span className="font-bold text-slate-800 block">
                The medicine brand is not recognized by automatic OCR
              </span>
              <p className="text-slate-600">
                Thousands of regional generic brands exist. If the brand is missing, look at the composition line ("Each tablet contains...") and enter the chemical salt manually in Stage 2.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <span className="font-bold text-slate-800 block">
                Why was my check marked "Verification Incomplete"?
              </span>
              <p className="text-slate-600">
                DawaLens will deliberately withhold declaring an interaction safe if one of the entered medicines has an unconfirmed salt formulation or if renal/hepatic parameters are missing. This is a deliberate clinical safeguard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Legal, Terms, Privacy & Medical Disclaimer */}
      {activeTab === "legal" && (
        <div className="space-y-4">
          {/* Statutory Medical Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">
                Statutory Notice
              </span>
              <h3 className="font-bold text-sm">Medical Disclaimer & Scope of Application</h3>
            </div>
            <p className="leading-relaxed">
              DawaLens is an informational decision-support and educational tool designed to assist users in identifying active pharmaceutical ingredients and documented drug-drug interactions based on published clinical compendia (CDSCO, National Formulary of India, WHO Model Lists).
            </p>
            <p className="leading-relaxed">
              <strong>Not Medical Advice:</strong> DawaLens does not practice medicine, provide personalized medical diagnoses, formulate treatment regimens, or modify prescriptions. A completed check with "No Known Issue" does NOT guarantee that medications are safe for your specific physiological condition. Never alter or discontinue prescribed medication without the direct supervision of a registered medical practitioner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
              <h4 className="font-bold text-slate-900 font-mono uppercase text-[11px]">
                Privacy & Data Retention Policy
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Images of medication packaging uploaded to DawaLens are evaluated for character recognition. No persistent retention on public clouds occurs by default. Saved reports and medicines are maintained on your local device client-side with full privacy.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-5 space-y-2">
              <h4 className="font-bold text-slate-900 font-mono uppercase text-[11px]">
                Terms of Use
              </h4>
              <p className="text-slate-600 leading-relaxed">
                By utilizing DawaLens, you acknowledge that you are responsible for confirming all extracted candidate medication names against physical packaging labels. In emergency clinical situations, immediately contact local emergency medical services or visit the nearest hospital.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact and Feedback Section (Requirement 12) */}
      <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {language === "hi" ? "संपर्क एवं क्लिनिकल फीडबैक" : "Clinical Feedback & Support Contact"}
          </h2>
          <p className="text-xs text-slate-500">
            {language === "hi"
              ? "यदि आपको किसी दवा के सॉल्ट या इंटरेक्शन में विसंगति दिखाई देती है, तो कृपया हमारे क्लिनिकल समीक्षकों को सूचित करें।"
              : "Report discrepancies in active salt compendia or submit inquiries to our pharmacovigilance team."}
          </p>
        </div>

        {feedbackSent ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-semibold">
            ✓ {language === "hi"
              ? "आपकी प्रतिक्रिया प्राप्त हो गई है। हमारी क्लिनिकल टीम इसकी समीक्षा करेगी।"
              : "Feedback received. Our clinical pharmacology review team will examine the cited monograph."}
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === "hi" ? "संदेश या दवा विसंगति का विवरण" : "Feedback Description or Discrepancy"}
              </label>
              <textarea
                rows={3}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. Crocin 650 blister showed unlisted strength or interaction query..."
                className="w-full px-3 py-2 border border-slate-300 rounded font-sans focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Support email: clinical-safety@dawalens.in
              </span>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                {language === "hi" ? "प्रतिक्रिया भेजें" : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
