"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MedicineRecord,
  useDashboard,
  VerificationStatus,
} from "@/lib/dashboard-store";
import { useLanguage } from "@/lib/language-context";

export default function MyMedicinesPage() {
  const { medicines, removeMedicine, updateMedicine } = useDashboard();
  const { language } = useLanguage();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VerificationStatus>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingMed, setViewingMed] = useState<MedicineRecord | null>(null);
  const [editingMed, setEditingMed] = useState<MedicineRecord | null>(null);

  // Edit form state
  const [editBrand, setEditBrand] = useState("");
  const [editGeneric, setEditGeneric] = useState("");
  const [editStrength, setEditStrength] = useState("");
  const [editDosageForm, setEditDosageForm] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<VerificationStatus>("verified");

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.genericName && m.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.activeIngredients.some((ing) =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter = statusFilter === "all" ? true : m.verificationStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredMedicines.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedicines.map((m) => m.id));
    }
  };

  const handleStartCombinedCheck = () => {
    if (selectedIds.length < 2) return;
    const query = selectedIds.join(",");
    router.push(`/dashboard/scan?medIds=${encodeURIComponent(query)}`);
  };

  const openEditModal = (med: MedicineRecord) => {
    setEditingMed(med);
    setEditBrand(med.brandName);
    setEditGeneric(med.genericName || "");
    setEditStrength(med.strength);
    setEditDosageForm(med.dosageForm);
    setEditNotes(med.notes || "");
    setEditStatus(med.verificationStatus);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;
    updateMedicine(editingMed.id, {
      brandName: editBrand,
      genericName: editGeneric,
      strength: editStrength,
      dosageForm: editDosageForm,
      notes: editNotes,
      verificationStatus: editStatus === "unconfirmed" ? "edited" : editStatus,
    });
    setEditingMed(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Clinical Context Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi" ? "मेरी सहेजी गई दवाएं (My Medicines)" : "My Medicines"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === "hi"
              ? "आपके द्वारा स्कैन और सत्यापित की गई दवाओं का क्लिनिकल रिकॉर्ड। इस सूची का अर्थ यह नहीं है कि आप ये सभी दवाएं एक साथ ले रहे हैं।"
              : "Verified clinical records of scanned and entered medications. This repository does not automatically imply concurrent patient ingestion."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/scan"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-900 transition-colors"
          >
            + {language === "hi" ? "नई दवा स्कैन करें" : "Scan New Medicine"}
          </Link>
        </div>
      </div>

      {/* Primary Selection Multi-Checker Banner (Requirement 7 & 4) */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-sky-50 border border-sky-300 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-mono text-xs flex items-center justify-center font-bold">
              {selectedIds.length}
            </span>
            <div>
              <p className="text-sm font-semibold text-sky-950">
                {language === "hi"
                  ? `${selectedIds.length} दवाएं संयुक्त सुरक्षा जांच हेतु चयनित`
                  : `${selectedIds.length} Medicines Selected for Combined Safety Evaluation`}
              </p>
              <p className="text-xs text-sky-700">
                {selectedIds.length >= 2
                  ? language === "hi"
                    ? "डुप्लिकेट सॉल्ट और ड्रग-ड्रग इंटरेक्शन का विश्लेषण करने के लिए तैयार।"
                    : "Ready to cross-reference CDSCO & WHO duplicate salt and interaction matrices."
                  : language === "hi"
                  ? "जांच शुरू करने के लिए कम से कम 2 दवाएं चुनें।"
                  : "Select at least 2 medicines to execute multi-medicine interaction checking."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
            >
              {language === "hi" ? "चयन रद्द करें" : "Clear Selection"}
            </button>
            <button
              onClick={handleStartCombinedCheck}
              disabled={selectedIds.length < 2}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded text-white ${
                selectedIds.length >= 2
                  ? "bg-sky-700 hover:bg-sky-800 shadow-sm"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              {language === "hi" ? "संयुक्त जांच चलाएं" : "Run Combined Safety Check"}
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              language === "hi"
                ? "ब्रांड नाम, सक्रिय घटक या सॉल्ट से खोजें..."
                : "Search by brand name, active salt or generic formulation..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500 uppercase">Status:</label>
          <div className="inline-flex rounded border border-slate-300 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({medicines.length})
            </button>
            <button
              onClick={() => setStatusFilter("verified")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "verified"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setStatusFilter("unconfirmed")}
              className={`px-2.5 py-1 rounded font-medium ${
                statusFilter === "unconfirmed"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Needs Attention
            </button>
          </div>
        </div>
      </div>

      {/* Records Table / View */}
      {filteredMedicines.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-lg font-bold mb-3">
            0
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {language === "hi" ? "कोई दवा नहीं मिली" : "No Medicines Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? language === "hi"
                ? "आपके खोज मापदंड से मेल खाने वाला कोई रिकॉर्ड नहीं है।"
                : "No medication records matched your query. Try clearing the search filter."
              : language === "hi"
              ? "आपने अभी तक कोई दवा नहीं जोड़ी है। कैमरे या फोटो से शुरू करें।"
              : "You have not saved any medication records yet. Start by scanning medicine packaging."}
          </p>
          <Link
            href="/dashboard/scan"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
          >
            {language === "hi" ? "दवा स्कैन करें" : "Scan Medicine Packaging"}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-mono uppercase text-[11px]">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredMedicines.length &&
                        filteredMedicines.length > 0
                      }
                      onChange={selectAll}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      title="Select all"
                    />
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-slate-700">Brand & Formulation</th>
                  <th className="py-2.5 px-4 font-semibold text-slate-700">Active Salt / Ingredients</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700">Strength & Form</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700">Verification Status</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700">Date Logged</th>
                  <th className="py-2.5 px-4 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMedicines.map((med) => {
                  const isSelected = selectedIds.includes(med.id);
                  const isVerified = med.verificationStatus === "verified";
                  const isEdited = med.verificationStatus === "edited";
                  const isUnconfirmed = med.verificationStatus === "unconfirmed";

                  return (
                    <tr
                      key={med.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-sky-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(med.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                            {med.packagingImageUrl ? (
                              <img
                                src={med.packagingImageUrl}
                                alt={med.brandName}
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <span className="font-mono text-[9px] font-bold text-slate-400">Rx</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{med.brandName}</div>
                            {med.genericName && (
                              <div className="text-[11px] text-slate-500 font-mono">
                                {med.genericName}
                              </div>
                            )}
                            {med.manufacturer && (
                              <div className="text-[10px] text-slate-400">
                                Mfr: {med.manufacturer}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {med.activeIngredients.map((salt, idx) => (
                            <div key={idx} className="flex items-baseline gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              <span className="font-medium text-slate-800">{salt.name}</span>
                              <span className="font-mono text-slate-500 text-[10px]">
                                ({salt.strength})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-700 font-semibold">{med.strength}</div>
                        <div className="text-slate-500 text-[11px]">{med.dosageForm}</div>
                      </td>

                      <td className="py-3 px-3">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Verified
                          </span>
                        )}
                        {isEdited && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-100 text-sky-800 border border-sky-300">
                            User Edited
                          </span>
                        )}
                        {isUnconfirmed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                            Unconfirmed
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          OCR: {med.confidence.toFixed(1)}%
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {med.dateAdded}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setViewingMed(med)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(med)}
                          className="px-2 py-1 text-[11px] font-medium text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${med.brandName} from saved records?`)) {
                              removeMedicine(med.id);
                            }
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Showing {filteredMedicines.length} of {medicines.length} saved medicines
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Requirement 7: Medicine Repository & Verification Audit Trail
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Medicine Record Details
                </span>
                <h3 className="text-xl font-bold text-slate-900">{viewingMed.brandName}</h3>
                <p className="text-xs text-slate-500 font-mono">{viewingMed.genericName}</p>
              </div>
              <button
                onClick={() => setViewingMed(null)}
                className="w-7 h-7 rounded text-slate-500 hover:text-slate-800 bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-slate-500 text-[10px] uppercase block">
                  Strength & Formulation
                </span>
                <span className="font-bold text-slate-800 text-sm">{viewingMed.strength}</span>
                <p className="text-slate-600 mt-0.5">{viewingMed.dosageForm}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-slate-500 text-[10px] uppercase block">
                  Verification Status
                </span>
                <span
                  className={`inline-block font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded mt-1 border ${
                    viewingMed.verificationStatus === "verified"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}
                >
                  {viewingMed.verificationStatus}
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Confidence: {viewingMed.confidence}%
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase mb-2">
                Active Chemical Ingredients (Salts)
              </h4>
              <div className="border border-slate-200 rounded divide-y divide-slate-100 text-xs">
                {viewingMed.activeIngredients.map((salt, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{salt.name}</span>
                      {salt.amountMg ? (
                        <span className="text-[11px] text-slate-500 ml-2">
                          (Calculated Mass: {salt.amountMg} mg)
                        </span>
                      ) : null}
                    </div>
                    <span className="font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                      {salt.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {viewingMed.notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs">
                <span className="font-bold text-amber-900 font-mono text-[10px] uppercase block mb-1">
                  Patient Clinical Notes
                </span>
                <p className="text-amber-800">{viewingMed.notes}</p>
              </div>
            )}

            <div className="text-[11px] text-slate-500 font-mono border-t border-slate-200 pt-3 flex items-center justify-between">
              <span>Date Added: {viewingMed.dateAdded}</span>
              <span>Source: {viewingMed.scanSource || "Manual"}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const m = viewingMed;
                  setViewingMed(null);
                  openEditModal(m);
                }}
                className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-300 rounded hover:bg-sky-100"
              >
                Edit Details
              </button>
              <button
                onClick={() => setViewingMed(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 rounded hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editingMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={saveEdit}
            className="bg-white rounded-lg shadow-xl border border-slate-300 max-w-lg w-full p-6 space-y-4"
          >
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-mono uppercase text-slate-500">Edit Record</span>
              <h3 className="text-lg font-bold text-slate-900">
                Correct Details: {editingMed.brandName}
              </h3>
              <p className="text-xs text-slate-500">
                Important: Verify brand, dosage and salts directly against physical packaging.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Generic Formulation / Pharmacopoeial Name
                </label>
                <input
                  type="text"
                  value={editGeneric}
                  onChange={(e) => setEditGeneric(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    required
                    value={editStrength}
                    onChange={(e) => setEditStrength(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={editDosageForm}
                    onChange={(e) => setEditDosageForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-600"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Oral Suspension">Oral Suspension</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Topical Gel">Topical Gel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="verified"
                      checked={editStatus === "verified"}
                      onChange={() => setEditStatus("verified")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-800">Confirmed against package</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="unconfirmed"
                      checked={editStatus === "unconfirmed"}
                      onChange={() => setEditStatus("unconfirmed")}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-slate-800">Uncertain / Needs pharmacist</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Personal Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Prescribed for 5 days with food..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingMed(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
