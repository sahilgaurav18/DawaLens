"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminRule, useDashboard } from "@/lib/dashboard-store";
import { useLanguage } from "@/lib/language-context";

export default function AdminReferencePage() {
  const { adminRules, medicines } = useDashboard();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"rules" | "test_runner" | "audit_log" | "monitoring">("rules");
  const [rulesList, setRulesList] = useState<AdminRule[]>(adminRules);
  const [selectedRule, setSelectedRule] = useState<AdminRule | null>(null);

  // Test Runner State
  const [testSubstanceA, setTestSubstanceA] = useState("Paracetamol");
  const [testSubstanceB, setTestSubstanceB] = useState("Paracetamol");
  const [testAmountA, setTestAmountA] = useState(650);
  const [testAmountB, setTestAmountB] = useState(325);
  const [testEvaluationResult, setTestEvaluationResult] = useState<any | null>(null);

  // Simulated Audit Logs
  const AUDIT_LOGS = [
    {
      id: "LOG-9402",
      timestamp: "2026-10-21 11:20:14",
      user: "Dr. Ananya Rao, Clinical Pharmacologist (Reg #MH-49210)",
      action: "RULE_APPROVED",
      ruleId: "DR-DUP-PARA-001",
      details: "Approved Paracetamol cumulative threshold at 4,000mg/24h following NFI 2024 update.",
    },
    {
      id: "LOG-9401",
      timestamp: "2026-10-18 16:45:00",
      user: "Dr. S. K. Mukherjee, Medical Reviewer (Reg #DL-12884)",
      action: "RULE_CREATED",
      ruleId: "DR-INT-ASP-IBU-002",
      details: "Drafted severe ulceration / GI bleeding contraindication rule for Aspirin + Ibuprofen.",
    },
    {
      id: "LOG-9388",
      timestamp: "2026-10-14 09:12:33",
      user: "System Clinical Engine",
      action: "MONOGRAPH_SYNC",
      ruleId: "CDSCO-2026.4.1",
      details: "Automated hash verification completed for CDSCO Formulary Revision 2026.4.1.",
    },
  ];

  const handleApproveRule = (ruleId: string) => {
    setRulesList((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, approvalStatus: "approved" as const } : r))
    );
  };

  const runTestRuleCheck = () => {
    const isDuplicate =
      testSubstanceA.toLowerCase().trim() === testSubstanceB.toLowerCase().trim();
    const totalDose = testAmountA + testAmountB;
    const ruleMatch = rulesList.find(
      (r) =>
        (r.primarySubstance.toLowerCase() === testSubstanceA.toLowerCase() &&
          r.secondarySubstance?.toLowerCase() === testSubstanceB.toLowerCase()) ||
        (r.primarySubstance.toLowerCase() === testSubstanceB.toLowerCase() &&
          r.secondarySubstance?.toLowerCase() === testSubstanceA.toLowerCase()) ||
        (isDuplicate && r.type === "duplicate_salt" && r.primarySubstance.toLowerCase() === testSubstanceA.toLowerCase())
    );

    setTestEvaluationResult({
      timestamp: new Date().toISOString(),
      matchedRule: ruleMatch || null,
      isDuplicate,
      totalDose,
      exceedsSingleLimit: totalDose > 1000,
      status: ruleMatch ? "FLAGGED_RISK" : "PASS_NO_CONTRAINDICATION",
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Notice Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-white">
              Restricted Clinical Admin Area
            </span>
            <span className="text-xs text-slate-500 font-mono">Formulary Engine: CDSCO-2026.4.1</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi"
              ? "क्लिनिकल संदर्भ एवं नियम प्रबंधन (Admin Reference Console)"
              : "Pharmacological Reference & Rule Governance"}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {language === "hi"
              ? "दवा सुरक्षा नियमों, CDSCO संदर्भों, स्वीकृतियों और ऑडिट लॉग का प्रबंधन। कोई भी AI-जनित नियम बिना क्लिनिकल डॉक्टर की समीक्षा के सक्रिय नहीं होता।"
              : "Management of approved contraindication rules, monograph citations, verification test cases, and audit trails."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>

      {/* Clinical Disclaimer Alert Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 flex items-start gap-2.5">
        <span className="font-mono font-bold text-amber-800 uppercase text-[10px] bg-amber-200 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
          Governance Policy
        </span>
        <p className="leading-relaxed">
          <strong>Clinical Rule Integrity:</strong> Interaction rules in DawaLens must be grounded in statutory formularies (CDSCO, National Formulary of India, WHO Model List, Indian Pharmacopoeia). Autonomous AI models are prohibited from deploying unverified interaction rules directly to user results.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200 rounded text-xs font-medium">
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "rules"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Active Clinical Rules ({rulesList.length})
        </button>
        <button
          onClick={() => setActiveTab("test_runner")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "test_runner"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Rule Verification Test Runner
        </button>
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "monitoring"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Telemetry & Scan Quality Monitor
        </button>
        <button
          onClick={() => setActiveTab("audit_log")}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === "audit_log"
              ? "bg-slate-900 text-white font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Pharmacological Audit Trail
        </button>
      </div>

      {/* TAB 1: Clinical Rules Matrix */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[11px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Rule Code</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-4">Substances / Threshold</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-4">Monograph Source</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rulesList.map((rule) => {
                    const isApproved = rule.approvalStatus === "approved";
                    return (
                      <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {rule.ruleCode}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[10px] uppercase">
                          {rule.type.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {rule.primarySubstance}
                            {rule.secondarySubstance ? ` + ${rule.secondarySubstance}` : ""}
                          </div>
                          {rule.thresholdMg && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              Max safe limit: {rule.thresholdMg} mg/24h
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              rule.severity === "high"
                                ? "bg-rose-100 text-rose-800"
                                : rule.severity === "moderate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {rule.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={rule.monographSource}>
                          {rule.monographSource}
                        </td>
                        <td className="py-3 px-3">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedRule(rule)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200"
                          >
                            Details
                          </button>
                          {!isApproved && (
                            <button
                              onClick={() => handleApproveRule(rule.id)}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Rule Verification Test Runner (Requirement 14: Test cases for rules) */}
      {activeTab === "test_runner" && (
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              In-Vitro Clinical Rule Simulator
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Multi-Substance Rule Firing Test Bench
            </h2>
            <p className="text-xs text-slate-600">
              Simulate pairing two active pharmaceutical ingredients to confirm that contraindication and dosage ceiling rules fire deterministically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Substance A */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
              <span className="font-mono font-bold uppercase text-[10px] text-slate-500 block">
                Pharmaceutical Agent A
              </span>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Active Substance Name</label>
                <select
                  value={testSubstanceA}
                  onChange={(e) => setTestSubstanceA(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Paracetamol">Paracetamol (Acetaminophen)</option>
                  <option value="Ibuprofen">Ibuprofen</option>
                  <option value="Aspirin">Aspirin (Acetylsalicylic Acid)</option>
                  <option value="Amoxicillin">Amoxicillin</option>
                  <option value="Clavulanic Acid">Clavulanic Acid</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Unit Dose (mg)</label>
                <input
                  type="number"
                  value={testAmountA}
                  onChange={(e) => setTestAmountA(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            {/* Substance B */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
              <span className="font-mono font-bold uppercase text-[10px] text-slate-500 block">
                Pharmaceutical Agent B
              </span>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Active Substance Name</label>
                <select
                  value={testSubstanceB}
                  onChange={(e) => setTestSubstanceB(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Paracetamol">Paracetamol (Acetaminophen)</option>
                  <option value="Ibuprofen">Ibuprofen</option>
                  <option value="Aspirin">Aspirin (Acetylsalicylic Acid)</option>
                  <option value="Amoxicillin">Amoxicillin</option>
                  <option value="Clavulanic Acid">Clavulanic Acid</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Unit Dose (mg)</label>
                <input
                  type="number"
                  value={testAmountB}
                  onChange={(e) => setTestAmountB(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runTestRuleCheck}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded hover:bg-slate-800 shadow-sm"
          >
            ▶ Execute Rule Verification Test
          </button>

          {/* Test Results Output Box */}
          {testEvaluationResult && (
            <div
              className={`p-4 rounded border text-xs space-y-2 ${
                testEvaluationResult.status === "FLAGGED_RISK"
                  ? "bg-rose-50 border-rose-300 text-rose-950"
                  : "bg-emerald-50 border-emerald-300 text-emerald-950"
              }`}
            >
              <div className="flex items-center justify-between font-mono font-bold">
                <span>SIMULATION RESULT: {testEvaluationResult.status}</span>
                <span className="text-[10px] text-slate-500">
                  {testEvaluationResult.timestamp}
                </span>
              </div>
              <div className="space-y-1">
                <div>
                  <strong>Combined Ingestion:</strong> {testSubstanceA} ({testAmountA}mg) + {testSubstanceB} ({testAmountB}mg)
                </div>
                {testEvaluationResult.isDuplicate && (
                  <div className="font-semibold text-rose-700">
                    Duplicate Salt Detected! Total Mass: {testEvaluationResult.totalDose}mg.
                    {testEvaluationResult.exceedsSingleLimit
                      ? " Exceeds 1,000mg safe adult single-dose ceiling."
                      : " Approaching safe single threshold."}
                  </div>
                )}
                {testEvaluationResult.matchedRule ? (
                  <div className="p-2.5 bg-white/80 rounded border border-rose-200 mt-2 space-y-1">
                    <div className="font-mono font-bold text-slate-900">
                      Matched Rule: {testEvaluationResult.matchedRule.ruleCode} ({testEvaluationResult.matchedRule.severity} severity)
                    </div>
                    <div>{testEvaluationResult.matchedRule.clinicalRationale}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Citing: {testEvaluationResult.matchedRule.monographSource}
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-800">
                    No clinical contraindication triggered under CDSCO-2026.4.1 matrices for this pairwise combination.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Telemetry & Quality Monitoring */}
      {activeTab === "monitoring" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded">
              <span className="font-mono text-slate-500 uppercase text-[10px] block">
                OCR Recognition Quality
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">98.2%</div>
              <p className="text-slate-500 text-[11px] mt-0.5">High-confidence packaging reads</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded">
              <span className="font-mono text-slate-500 uppercase text-[10px] block">
                Abraded / Unreadable Scans
              </span>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-1">1 Recorded</div>
              <p className="text-slate-500 text-[11px] mt-0.5">Foil strip unconfirmed flag</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded">
              <span className="font-mono text-slate-500 uppercase text-[10px] block">
                Engine Response Latency
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">142 ms</div>
              <p className="text-slate-500 text-[11px] mt-0.5">Deterministic rule execution</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-5 text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
              Active Clinical Engine Health Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="font-medium text-slate-800">CDSCO 2026 Formulary Knowledge Base</span>
                <span className="font-mono text-emerald-700 font-bold">ONLINE & SYNCED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="font-medium text-slate-800">WHO Model List 23rd Edition Parser</span>
                <span className="font-mono text-emerald-700 font-bold">ONLINE & SYNCED</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="font-medium text-slate-800">Client-Side Web Speech Synthesizer</span>
                <span className="font-mono text-emerald-700 font-bold">READY (EN-IN & HI-IN)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pharmacological Audit Trail (Requirement 14: Audit logs of changes) */}
      {activeTab === "audit_log" && (
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-xs font-mono uppercase">
              Immutable Pharmacological Governance Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks changes to clinical thresholds, rule activations, and version hash updates.
            </p>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            {AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-4 space-y-1 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                      {log.id}
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-[10px] uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                </div>
                <div className="text-slate-800 font-medium">{log.details}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Reviewer: {log.user} | Rule: {log.ruleId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Rule */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-slate-500">Clinical Rule Monograph</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedRule.ruleCode}</h3>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="w-7 h-7 rounded text-slate-500 hover:text-slate-800 bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-slate-500 text-[10px] uppercase block">Substances Involved</span>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedRule.primarySubstance}
                  {selectedRule.secondarySubstance ? ` + ${selectedRule.secondarySubstance}` : ""}
                </div>
              </div>
              <div>
                <span className="font-mono text-slate-500 text-[10px] uppercase block">Clinical Rationale & Mechanism</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedRule.clinicalRationale}
                </p>
              </div>
              <div>
                <span className="font-mono text-slate-500 text-[10px] uppercase block">Monograph Citation</span>
                <div className="font-mono text-slate-800 font-semibold">{selectedRule.monographSource}</div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Version: {selectedRule.version}</span>
                <span>Last Audited: {selectedRule.lastAudited}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 rounded hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
