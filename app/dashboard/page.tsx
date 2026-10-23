"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Share2,
  Camera,
  Database,
  Link2,
  ShieldCheck,
  LayoutGrid,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from "lucide-react";

/**
 * Clean 4-corner scan viewfinder icon matching the exact reference design
 */
function ScanCornerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}

/**
 * Clinical document report icon
 */
function ReportDocIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function DashboardExactPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* SECTION 1: HERO WELCOME BANNER (Real 3D Artwork + Exact CTAs) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 relative overflow-hidden shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Textual Column */}
          <div className="flex-1 max-w-lg">
            <span className="text-[11px] font-extrabold tracking-wider text-[#F97316] uppercase block mb-1.5">
              MEDICATION SAFETY CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B3558] leading-tight">
              Welcome to your
              <br />
              Medication Safety Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2.5 max-w-md">
              DawaLens helps you identify medicines from blister packaging, verify potential duplicates,
              check for interactions and review clinical reference rules.
            </p>
            {/* Subtle Orange Underline Accent */}
            <div className="w-10 h-1 bg-[#F97316] rounded-full mt-3.5" />
          </div>

          {/* Center Real 3D Medication Artwork (Blister pack, pill bottle, capsules, confetti) */}
          <div className="flex justify-center items-center shrink-0">
            <img
              src="/hero-3d-clean.png"
              alt="3D Medication Packaging, Bottle and Capsules"
              className="w-64 sm:w-72 md:w-80 h-auto object-contain select-none pointer-events-none drop-shadow-xs"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-64">
            {/* Primary Orange CTA */}
            <Link
              href="/dashboard/scan"
              className="w-full rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs hover:shadow-md hover:shadow-orange-500/20 active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ScanCornerIcon className="w-4 h-4 text-white shrink-0" />
                <span className="tracking-tight">Scan Medicines</span>
              </div>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>

            {/* Secondary White CTA */}
            <Link
              href="/dashboard/reports"
              className="w-full rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-800 px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ReportDocIcon className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="tracking-tight">View Safety Reports</span>
              </div>
              <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: STEP BY STEP PROCESS (5 Interactive Cards with Arrows) */}
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-slate-800" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Step by Step
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">
            Follow these steps to check your medicines safely.
          </span>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Step 1 */}
          <Link
            href="/dashboard/scan"
            className="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs relative hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-orange-50 group-hover:text-[#F97316] text-slate-800 text-xs font-bold transition-colors">
                  <span>1</span>
                  <Camera size={13} className="text-slate-600 group-hover:text-[#F97316] transition-colors" />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 hidden lg:block transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F97316] transition-colors">
                Scan Medicines
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Upload or capture a photo of your medicine strip or box.
              </p>
            </div>
          </Link>

          {/* Step 2 */}
          <Link
            href="/dashboard/medicines"
            className="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs relative hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-sky-50 group-hover:text-[#0284C7] text-slate-800 text-xs font-bold transition-colors">
                  <span>2</span>
                  <Database size={13} className="text-slate-600 group-hover:text-[#0284C7] transition-colors" />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 hidden lg:block transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                Identify Medicines
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                AI detects the medicines and matches with database.
              </p>
            </div>
          </Link>

          {/* Step 3 */}
          <Link
            href="/dashboard/scan"
            className="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs relative hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-orange-50 group-hover:text-[#F97316] text-slate-800 text-xs font-bold transition-colors">
                  <span>3</span>
                  <Link2 size={13} className="text-slate-600 group-hover:text-[#F97316] transition-colors" />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 hidden lg:block transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F97316] transition-colors">
                Check Interactions
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Finds potential duplicates, interactions and risks.
              </p>
            </div>
          </Link>

          {/* Step 4 */}
          <Link
            href="/dashboard/reports"
            className="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs relative hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-sky-50 group-hover:text-[#0284C7] text-slate-800 text-xs font-bold transition-colors">
                  <span>4</span>
                  <FileText size={13} className="text-slate-600 group-hover:text-[#0284C7] transition-colors" />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 hidden lg:block transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                View Reports
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Get clear results with simple explanations.
              </p>
            </div>
          </Link>

          {/* Step 5 */}
          <Link
            href="/dashboard/guide"
            className="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs relative hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-800 text-xs font-bold transition-colors">
                  <span>5</span>
                  <ShieldCheck size={13} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Take Action
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Follow safety guidelines or consult a doctor.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 3: BOTTOM SPLIT GRID (MAIN FEATURES & RECENT ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Main Features (approx 58% width = 7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-slate-800" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Main Features
            </h2>
          </div>

          {/* 2x2 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Feature 1: Scan a Medicine */}
            <Link
              href="/dashboard/scan"
              className="rounded-xl border border-slate-200/90 bg-white p-4.5 flex items-start gap-3.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 text-[#F97316] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Camera size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F97316] transition-colors truncate">
                    Scan a Medicine
                  </h3>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Upload or capture a photo of your medicine strip or box.
                </p>
              </div>
            </Link>

            {/* Feature 2: Check Multiple Medicines */}
            <Link
              href="/dashboard/scan"
              className="rounded-xl border border-slate-200/90 bg-white p-4.5 flex items-start gap-3.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Database size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">
                    Check Multiple Medicines
                  </h3>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Cross-check 2+ prescriptions for duplicate risks.
                </p>
              </div>
            </Link>

            {/* Feature 3: View Previous Reports */}
            <Link
              href="/dashboard/reports"
              className="rounded-xl border border-slate-200/90 bg-white p-4.5 flex items-start gap-3.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 text-[#F97316] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#F97316] transition-colors truncate">
                    View Previous Reports
                  </h3>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Revisit historical checks and clinical evidence.
                </p>
              </div>
            </Link>

            {/* Feature 4: Safety Guide */}
            <Link
              href="/dashboard/guide"
              className="rounded-xl border border-slate-200/90 bg-white p-4.5 flex items-start gap-3.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">
                    Safety Guide
                  </h3>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Learn active ingredients, dosages & interactions.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Activity (approx 42% width = 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-800" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Recent Activity
              </h2>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-[#0284C7] hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Activity List Container */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 space-y-3.5 shadow-2xs">
            {/* Item 1: Scan Completed */}
            <Link
              href="/dashboard/reports"
              className="flex items-center justify-between gap-3 text-xs -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">
                    Scan Completed
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Paracetamol 500mg (Blister Pack)</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-normal">2 hours ago</span>
            </Link>

            {/* Item 2: Potential Interaction Detected */}
            <Link
              href="/dashboard/reports"
              className="flex items-center justify-between gap-3 text-xs -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-7 w-7 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={15} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                    Potential Interaction Detected
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Ibuprofen + Aspirin</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-normal">5 hours ago</span>
            </Link>

            {/* Item 3: Medicine Identified */}
            <Link
              href="/dashboard/medicines"
              className="flex items-center justify-between gap-3 text-xs -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-7 w-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                  <Info size={15} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">
                    Medicine Identified
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Amoxicillin 500mg</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-normal">Yesterday</span>
            </Link>

            {/* Item 4: Needs Verification */}
            <Link
              href="/dashboard/scan"
              className="flex items-center justify-between gap-3 text-xs -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-7 w-7 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={15} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                    Needs Verification
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Unidentified medicine (Box)</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-normal">Yesterday</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
