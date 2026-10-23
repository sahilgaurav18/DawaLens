"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useDashboard } from "@/lib/dashboard-store";
import {
  Scan,
  FileCheck2,
  Pill,
  BookOpen,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function DashboardHome() {
  const { language } = useLanguage();
  const { medicines, reports, getDashboardStats } = useDashboard();

  // Calculated strictly from actual records (Zero fabricated statistics)
  const stats = getDashboardStats();

  const recentMedicines = medicines.slice(0, 3);
  const recentReports = reports.slice(0, 3);
  const attentionReports = reports.filter((r) => r.status === "risk_detected");
  const incompleteItems = medicines.filter((m) => m.verificationStatus === "unconfirmed");

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-100/70 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block mb-3">
              {language === "hi" ? "दवा सुरक्षा पोर्टल" : "Medication Safety Center"}
            </span>
            <h2 className="text-2xl lg:text-3xl font-display font-semibold text-slate-900 mb-2">
              {language === "hi"
                ? "नमस्ते, आपकी दवा सुरक्षा केंद्र में स्वागत है"
                : "Welcome to your Medication Safety Portal"}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {language === "hi"
                ? "दवा पैकेजिंग स्कैन करें, सक्रिय साल्ट की पुष्टि करें और निर्धारित नैदानिक नियमों के आधार पर संभावित दोहराव और ड्रग इंटरैक्शन की जांच करें।"
                : "DawaLens assists you in identifying medicines from blister packaging, verifying extracted active ingredients, and checking potential duplicate ingredients and interactions against reviewed clinical reference rules."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/scan"
              className="px-5 py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>{language === "hi" ? "दवा स्कैन करें" : "Scan Medicines"}</span>
            </Link>
            <Link
              href="/dashboard/reports"
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === "hi" ? "सुरक्षा रिपोर्ट देखें" : "View Safety Reports"}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Summary (Actual Records - Zero Fabrication) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {language === "hi" ? "वास्तविक रिकॉर्ड सारांश" : "Actual Clinical Record Summary"}
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Live Database Count
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Medicines */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">
                {language === "hi" ? "समीक्षित दवाएं" : "Total Medicines"}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Pill className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{stats.totalMedicines}</p>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">Active repository count</span>
          </div>

          {/* Safety Checks Completed */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">
                {language === "hi" ? "पूरी की गई जांचें" : "Safety Checks Run"}
              </span>
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <FileCheck2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{stats.totalChecks}</p>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">Completed evaluations</span>
          </div>

          {/* Reports with Potential Risks */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/50 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-rose-900">
                {language === "hi" ? "जोखिम वाली रिपोर्टें" : "Reports with Risks"}
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-950 font-display">{stats.reportsWithRisks}</p>
            <span className="text-[11px] text-rose-700 font-mono mt-1 block">Requiring doctor review</span>
          </div>

          {/* Checks Requiring Additional Verification */}
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-amber-900">
                {language === "hi" ? "सत्यापन बाकी" : "Needs Verification"}
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-950 font-display">{stats.pendingVerification}</p>
            <span className="text-[11px] text-amber-700 font-mono mt-1 block">Unconfirmed scan details</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
          {language === "hi" ? "त्वरित कार्य" : "Clinical Quick Actions"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/scan"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-600 hover:shadow-xs transition-all group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-800">
                {language === "hi" ? "दवा स्कैन करें" : "Scan a Medicine"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Camera capture or upload packaging photo
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/scan"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-600 hover:shadow-xs transition-all group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                {language === "hi" ? "संयुक्त जांच चलाएं" : "Check Multiple Medicines"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Cross-check 2+ prescriptions for duplicate salts
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-600 hover:shadow-xs transition-all group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                {language === "hi" ? "पिछली रिपोर्टें देखें" : "View Previous Reports"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Revisit historical checks and cited evidence
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/guide"
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-600 hover:shadow-xs transition-all group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                {language === "hi" ? "दवा सुरक्षा गाइड" : "Safety Guide"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Learn active ingredients, dosage & interactions
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Scanned Medicines */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === "hi" ? "हाल ही में स्कैन की गई दवाएं" : "Recently Scanned Medicines"}
              </h3>
            </div>
            <Link
              href="/dashboard/medicines"
              className="text-xs font-semibold text-cyan-800 hover:underline flex items-center gap-1"
            >
              <span>View all ({medicines.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentMedicines.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No medicines recorded yet.</p>
            ) : (
              recentMedicines.map((med) => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 truncate">{med.brandName}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold ${
                          med.verificationStatus === "verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {med.verificationStatus === "verified" ? "Verified" : "Unconfirmed"}
                      </span>
                    </div>
                    <p className="text-slate-500 truncate text-[11px]">
                      {med.activeIngredients.map((a) => `${a.name} (${a.strength})`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">{med.dateAdded}</span>
                    <span className="text-[10px] font-mono text-cyan-800 font-semibold">{med.dosageForm}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attention & Recent Checks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === "hi" ? "हालिया सुरक्षा रिपोर्ट व अलर्ट" : "Recent Reports & Attention Flags"}
              </h3>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-cyan-800 hover:underline flex items-center gap-1"
            >
              <span>View all ({reports.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentReports.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No safety checks run yet.</p>
            ) : (
              recentReports.map((rep) => {
                const isRisk = rep.status === "risk_detected";
                const isSafe = rep.status === "no_known_issue";
                return (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      isRisk
                        ? "border-rose-200 bg-rose-50/50"
                        : isSafe
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-amber-200 bg-amber-50/50"
                    }`}
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-600">{rep.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                            isRisk
                              ? "bg-rose-200 text-rose-900"
                              : isSafe
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-amber-200 text-amber-900"
                          }`}
                        >
                          {isRisk ? "Risk Flagged" : isSafe ? "Verified Pass" : "Incomplete"}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 truncate">
                        {rep.medicineNames.join(" + ")}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/reports?id=${rep.id}`}
                      className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] shrink-0"
                    >
                      View Report
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 5. Incomplete Scans That Can Be Resumed */}
      {incompleteItems.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Unconfirmed Scan Requiring Attention
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {incompleteItems.length} scanned item ({incompleteItems.map((i) => i.brandName).join(", ")}) has ambiguous or unverified active salts. Review details before running safety checks.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/medicines"
            className="px-4 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shrink-0"
          >
            Review & Resume
          </Link>
        </div>
      )}

      {/* 6. Important Safety Notice (Requirement 1.5) */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xs leading-relaxed space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Important Safety & Clinical Disclaimer
            </h4>
            <p className="text-slate-600">
              DawaLens checks only configured, supported drug-drug interactions, duplicate active principles, and dosage ceilings from reviewed pharmacopeial reference databases (CDSCO, National Formulary of India, and WHO Essential Medicines).
            </p>
            <p className="text-slate-800 font-medium">
              A completed safety check with no detected issue does not guarantee that medicines are completely safe or suitable for your specific medical history. Never modify prescribed medication regimens based solely on software results. Always consult a licensed physician or pharmacist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
