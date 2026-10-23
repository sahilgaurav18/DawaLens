"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SafetyReport,
  useDashboard,
  ReportStatus,
} from "@/lib/dashboard-store";
import { useLanguage } from "@/lib/language-context";

export default function SafetyReportsPage() {
  const { reports, deleteReport, speakText, stopSpeaking, isSpeaking } = useDashboard();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Filter and sort reports
  const filteredReports = reports
    .filter((rep) => {
      const matchesSearch =
        rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.medicineNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        rep.findings.some(
          (f) =>
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.explanation.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus = statusFilter === "all" ? true : rep.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  const handleShareReport = (rep: SafetyReport) => {
    const text = `DawaLens Safety Report [${rep.id}] (${rep.timestamp})\nStatus: ${rep.status}\nMedicines: ${rep.medicineNames.join(", ")}\nFindings: ${rep.findings.length > 0 ? rep.findings.map(f => f.title).join("; ") : "No known issue found in completed checks"}\nRule Version: ${rep.ruleVersion}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Clinical Context Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi" ? "सुरक्षा रिपोर्ट इतिहास (Safety Reports)" : "Safety Reports & History"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === "hi"
              ? "आपके द्वारा चलाए गए सभी सुरक्षा जांचों का ऐतिहासिक ऑडिट रिकॉर्ड। प्रत्येक रिपोर्ट में प्रयुक्त नियम संस्करण और क्लिनिकल संदर्भ सुरक्षित रहते हैं।"
              : "Verifiable archive of multi-medicine safety checks. Preserves clinical rule versions and reference sources for auditability."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/scan"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-900 transition-colors"
          >
            + {language === "hi" ? "नई जांच चलाएं" : "Run New Safety Check"}
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "रिपोर्ट आईडी, दवा का नाम या निष्कर्ष से खोजें..."
                : "Search by Report ID, medicine name or finding description..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex rounded border border-slate-300 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({reports.length})
            </button>
            <button
              onClick={() => setStatusFilter("risk_detected")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "risk_detected"
                  ? "bg-rose-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Risk Detected
            </button>
            <button
              onClick={() => setStatusFilter("no_known_issue")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "no_known_issue"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              No Known Issue
            </button>
            <button
              onClick={() => setStatusFilter("incomplete")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "incomplete"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Incomplete
            </button>
          </div>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-700"
          >
            <option value="newest">Sort: Most Recent</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-lg font-bold mb-3">
            0
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {language === "hi" ? "कोई सुरक्षा रिपोर्ट नहीं मिली" : "No Safety Reports Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? language === "hi"
                ? "आपके खोज मापदंड से मेल खाने वाली कोई रिपोर्ट नहीं है।"
                : "No archived reports match your search query or status filter."
              : language === "hi"
              ? "आपने अभी तक कोई मल्टी-दवा सुरक्षा जांच नहीं की है।"
              : "No safety evaluations have been logged yet. Scan two or more medicines to generate a report."}
          </p>
          <Link
            href="/dashboard/scan"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
          >
            {language === "hi" ? "नई जांच शुरू करें" : "Initiate Safety Check"}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const isRisk = report.status === "risk_detected";
            const isClear = report.status === "no_known_issue";
            const isIncomplete = report.status === "incomplete";

            return (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {report.id}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">|</span>
                      <span className="text-xs text-slate-500 font-mono">{report.timestamp}</span>
                      <span className="text-slate-400 text-xs font-mono">|</span>
                      <span className="text-xs text-slate-500 font-mono">
                        Rule: {report.ruleVersion}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-slate-500 font-medium">
                        {language === "hi" ? "मूल्यांकित दवाएं:" : "Evaluated Medicines:"}
                      </span>
                      {report.medicineNames.map((name, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {isRisk && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        Potential Risk Detected
                      </span>
                    )}
                    {isClear && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        No Known Issue in Checks
                      </span>
                    )}
                    {isIncomplete && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        Verification Incomplete
                      </span>
                    )}
                  </div>
                </div>

                {/* Findings Summary */}
                <div className="py-3">
                  {report.findings.length > 0 ? (
                    <div className="space-y-2">
                      {report.findings.map((f) => (
                        <div
                          key={f.id}
                          className="p-3 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{f.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${
                                f.severity === "high"
                                  ? "bg-rose-100 text-rose-800"
                                  : f.severity === "moderate"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-sky-100 text-sky-800"
                              }`}
                            >
                              Severity: {f.severity}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{f.explanation}</p>
                          <div className="text-[11px] text-slate-500 font-mono flex flex-wrap gap-x-4 gap-y-1 pt-1">
                            <span>Clinical Mechanism: {f.clinicalMechanism}</span>
                            <span>Source: {f.evidenceSource}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      {language === "hi"
                        ? "पूर्ण की गई जांचों में कोई डुप्लिकेट सॉल्ट या ज्ञात ड्रग-ड्रग इंटरेक्शन नहीं पाया गया।"
                        : "No matching duplicate ingredient or documented pharmacological interaction was detected across the 3 completed CDSCO checks."}
                    </div>
                  )}
                </div>

                {/* Checks Executed / Bottom Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                  <div className="text-slate-500 text-[11px] font-mono">
                    Completed checks: {report.checksCompleted.length} | Rule: {report.ruleVersion}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors"
                    >
                      {language === "hi" ? "पूर्ण रिपोर्ट देखें" : "View Full Report"}
                    </button>
                    <button
                      onClick={() => handleShareReport(report)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                      title="Copy summary to clipboard"
                    >
                      {isCopied ? "Copied!" : "Share / Copy"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete safety report ${report.id}? This cannot be undone.`)) {
                          deleteReport(report.id);
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Report Modal Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-2xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-mark.png"
                  alt="DawaLens Logo"
                  className="h-10 w-10 object-contain shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {selectedReport.id}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedReport.timestamp}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Clinical Safety Check Evaluation Report
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setSelectedReport(null);
                }}
                className="w-7 h-7 rounded text-slate-500 hover:text-slate-800 bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Overall Status Banner */}
            <div
              className={`p-4 rounded border text-xs space-y-1 ${
                selectedReport.status === "risk_detected"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : selectedReport.status === "no_known_issue"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold uppercase text-[11px]">
                  Overall Status: {selectedReport.status.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-[10px]">
                  Rule Base: {selectedReport.ruleVersion}
                </span>
              </div>
              <p className="font-semibold text-sm">
                {selectedReport.status === "risk_detected"
                  ? "Potential Adverse Pharmacological Risk or Duplicate Ingredient Identified."
                  : selectedReport.status === "no_known_issue"
                  ? "No Known Issues Identified in Supported Checks. Not a guarantee of absolute safety."
                  : "Verification Incomplete: Additional clinical confirmation required."}
              </p>
            </div>

            {/* Read Aloud Button */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="text-slate-700 font-medium">
                {language === "hi"
                  ? "सुरक्षा निष्कर्षों का मौखिक ऑडियो विवरण सुनें:"
                  : "Spoken accessibility explanation of clinical findings:"}
              </span>
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const text =
                      language === "hi"
                        ? `दवालेंस सुरक्षा रिपोर्ट। स्थिति: ${
                            selectedReport.status === "risk_detected"
                              ? "जोखिम पाया गया।"
                              : "पूर्ण की गई जांचों में कोई ज्ञात समस्या नहीं।"
                          } दवाएं: ${selectedReport.medicineNames.join(", ")}. ${
                            selectedReport.findings.length > 0
                              ? selectedReport.findings
                                  .map((f) => f.explanationHi || f.explanation)
                                  .join(" ")
                              : "सभी निर्धारित जांचें पूरी हुईं।"
                          }`
                        : `DawaLens Safety Report. Status: ${selectedReport.status.replace(
                            /_/g,
                            " "
                          )}. Medicines: ${selectedReport.medicineNames.join(
                            ", "
                          )}. ${selectedReport.findings
                            .map((f) => f.explanation + " Recommended: " + f.actionGuidance)
                            .join(" ")}`;
                    speakText(text, language);
                  }
                }}
                className="px-3 py-1.5 font-mono text-xs font-bold rounded bg-slate-800 text-white hover:bg-slate-700"
              >
                {isSpeaking ? "■ Stop Read-Aloud" : "▶ Read Aloud (आवाज में सुनें)"}
              </button>
            </div>

            {/* Medicines List */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase mb-2">
                Medications Cross-Referenced
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedReport.medicineNames.map((name, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block">{name}</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      Record ID: {selectedReport.medicineIds[i] || `med-${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings Detail */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase mb-2">
                Clinical Findings & Action Guidance
              </h4>
              {selectedReport.findings.length > 0 ? (
                <div className="space-y-3">
                  {selectedReport.findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{finding.title}</span>
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200 text-slate-800 uppercase">
                          Rule: {finding.ruleId}
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{finding.explanation}</p>
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900">
                        <span className="font-bold font-mono text-[10px] uppercase block mb-0.5">
                          Action Guidance for Patient
                        </span>
                        {finding.actionGuidance}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                        <div>Mechanism: {finding.clinicalMechanism}</div>
                        <div>Monograph Reference: {finding.evidenceSource}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                  No contraindications or duplicate salt toxicities detected across the reviewed
                  rules for these medicines.
                </div>
              )}
            </div>

            {/* Audit Checks Completed vs Incomplete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-slate-600 font-bold uppercase text-[10px] block mb-1">
                  Checks Successfully Completed ({selectedReport.checksCompleted.length})
                </span>
                <ul className="space-y-1 text-slate-700">
                  {selectedReport.checksCompleted.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-slate-600 font-bold uppercase text-[10px] block mb-1">
                  Checks Not Completed / Omitted ({selectedReport.checksNotCompleted.length})
                </span>
                <ul className="space-y-1 text-slate-600">
                  {selectedReport.checksNotCompleted.length > 0 ? (
                    selectedReport.checksNotCompleted.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">—</span>
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">None. All baseline checks performed.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Traceability & Sources */}
            <div className="p-3 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 space-y-1">
              <div className="font-bold text-slate-700">Traceable Clinical Reference Sources:</div>
              {selectedReport.evidenceSources.map((src, i) => (
                <div key={i}>• {src}</div>
              ))}
            </div>

            {/* Modal Actions: Print, Share, Close */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                onClick={handlePrintReport}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200"
              >
                Print Official Report
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareReport(selectedReport)}
                  className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-300 rounded hover:bg-sky-100"
                >
                  {isCopied ? "Copied!" : "Copy Report Text"}
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setSelectedReport(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 rounded hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
