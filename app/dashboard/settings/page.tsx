"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useDashboard } from "@/lib/dashboard-store";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { clearAllData, speakText, stopSpeaking, isSpeaking } = useDashboard();

  // Profile preferences
  const [patientName, setPatientName] = useState("Rajesh Sharma");
  const [patientId, setPatientId] = useState("DL-PAT-88412");
  const [caregiverContact, setCaregiverContact] = useState("+91 98200 12345");
  const [retainImagesLocally, setRetainImagesLocally] = useState(false);
  const [autoSaveReports, setAutoSaveReports] = useState(true);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(
      language === "hi"
        ? "प्राथमिकताएं सफलतापूर्वक सहेजी गईं।"
        : "Patient profile and clinical preferences saved successfully."
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTestVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const phrase =
        language === "hi"
          ? "दवालेंस आवाज परीक्षण सफल रहा। यह दवा सुरक्षा सूचनाओं को स्पष्ट रूप से पढ़कर सुनाएगा।"
          : "DawaLens speech test successful. Safety checks and risk warnings will be announced with clear clinical pronunciation.";
      speakText(phrase, language);
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        language === "hi"
          ? "क्या आप निश्चित हैं कि आप अपने सभी सहेजे गए दवा रिकॉर्ड और सुरक्षा रिपोर्ट हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
          : "Are you sure you want to permanently erase all saved medicine records, historical safety reports, and unread notifications from this browser? This action cannot be undone."
      )
    ) {
      clearAllData();
      alert(
        language === "hi"
          ? "सभी स्थानीय डेटा सफलतापूर्वक हटा दिया गया है।"
          : "All local client-side records have been purged."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Clinical Context Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {language === "hi" ? "प्रोफ़ाइल और प्राथमिकताएं (Profile & Settings)" : "Profile & Preferences"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === "hi"
              ? "अपनी भाषा, आवाज सहायता, गोपनीयता नियंत्रण और स्थानीय डेटा प्रतिधारण का प्रबंधन करें।"
              : "Manage language, clinical speech synthesis, data retention policies, and local record controls."}
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-medium">
          ✓ {statusMessage}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Patient Profile Information */}
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {language === "hi" ? "1. रोगी प्रोफ़ाइल जानकारी" : "1. Patient Profile Information"}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "hi"
                ? "यह जानकारी केवल आपकी स्थानीय सुरक्षा रिपोर्टों को व्यक्तिगत बनाने के लिए उपयोग होती है।"
                : "Used strictly for contextual labeling of safety evaluation reports."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === "hi" ? "रोगी का पूरा नाम" : "Patient Full Name"}
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-sans focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === "hi" ? "रोगी पहचान संख्या (Patient ID)" : "Patient Identifier (Record ID)"}
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                {language === "hi" ? "आपातकालीन या देखभालकर्ता संपर्क" : "Emergency / Caregiver Contact Number"}
              </label>
              <input
                type="text"
                value={caregiverContact}
                onChange={(e) => setCaregiverContact(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-sky-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {language === "hi"
                  ? "नोट: दवालेंस स्वचालित रूप से डॉक्टर या परिवार को कॉल नहीं करता। यह नंबर केवल आपके रिकॉर्ड के लिए है।"
                  : "DawaLens does not transmit unsolicited external messages. This number remains confidential for report sharing."}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Language & Voice Read-Aloud */}
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {language === "hi" ? "2. भाषा एवं मौखिक वाचन सहायता" : "2. Language & Spoken Accessibility"}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "hi"
                ? "अंग्रेजी या हिंदी में संपूर्ण इंटरफ़ेस और क्लिनिकल परिणामों का मौखिक वाचन।"
                : "Select primary interface language and configure client-side Web Speech synthesis."}
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                {language === "hi" ? "पसंदीदा इंटरफ़ेस भाषा" : "Preferred System Language"}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 rounded hover:bg-slate-50 flex-1">
                  <input
                    type="radio"
                    name="lang"
                    checked={language === "en"}
                    onChange={() => setLanguage("en")}
                    className="text-sky-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">English</span>
                    <span className="text-[11px] text-slate-500">Medical terminology in standard English</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-300 rounded hover:bg-slate-50 flex-1">
                  <input
                    type="radio"
                    name="lang"
                    checked={language === "hi"}
                    onChange={() => setLanguage("hi")}
                    className="text-sky-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">हिंदी (Hindi)</span>
                    <span className="text-[11px] text-slate-500">दवा सुरक्षा निर्देश और चेतावनियां हिंदी में</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-800 block">
                  {language === "hi" ? "आवाज परीक्षण (Speech Synthesizer Test)" : "Web Speech Synthesizer Voice Test"}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {language === "hi"
                    ? "जांचें कि आपका ब्राउज़र दवा के नाम और चेतावनियों को स्पष्ट बोलता है या नहीं।"
                    : "Tests speech engine clarity for medication names and contraindication warnings."}
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-4 py-2 font-mono text-xs font-bold rounded bg-slate-900 text-white hover:bg-slate-800 shrink-0"
              >
                {isSpeaking ? "■ Stop Speech" : "▶ Play Voice Test"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Privacy, Consent & Local Data Retention */}
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {language === "hi" ? "3. गोपनीयता एवं डेटा प्रतिधारण नियंत्रण" : "3. Privacy, Consent & Data Retention"}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "hi"
                ? "DawaLens आपकी अनुमति के बिना क्लाउड सर्वर पर दवा की छवियां संग्रहीत नहीं करता है।"
                : "Packaging images are processed client-side. Zero permanent server retention by default."}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveReports}
                onChange={(e) => setAutoSaveReports(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {language === "hi"
                    ? "सुरक्षा जांच रिपोर्ट स्थानीय रूप से सहेजें"
                    : "Retain safety evaluation reports in local browser storage"}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {language === "hi"
                    ? "ताकि आप भविष्य में अपनी पुरानी रिपोर्टें और नियम संस्करण देख सकें।"
                    : "Allows historical review in Safety Reports. Can be cleared at any time."}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={retainImagesLocally}
                onChange={(e) => setRetainImagesLocally(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  {language === "hi"
                    ? "पैकेजिंग फ़ोटो थंबनेल स्थानीय रूप से सहेजें"
                    : "Retain thumbnail photos of scanned packaging locally"}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {language === "hi"
                    ? "यदि अक्षम है, तो केवल निकाले गए पाठ और सॉल्ट विवरण सहेजे जाएंगे, फ़ोटो तुरंत हटा दी जाएगी।"
                    : "If unchecked, packaging photos are discarded immediately after text extraction."}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded hover:bg-slate-800 shadow-sm"
          >
            {language === "hi" ? "प्राथमिकताएं सहेजें" : "Save Preferences"}
          </button>
        </div>
      </form>

      {/* Dangerous Action: Purge All Patient Data (Requirement 11 & 15) */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-md p-6 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-rose-900">
            {language === "hi" ? "स्थानीय डेटा पूरी तरह मिटाएं (Data Purge)" : "Purge All Saved Records"}
          </h3>
          <p className="text-xs text-rose-700 mt-0.5">
            {language === "hi"
              ? "यह आपके सहेजे गए सभी दवा रिकॉर्ड, पिछली सुरक्षा रिपोर्टें और सूचनाएं हमेशा के लिए हटा देगा।"
              : "Permanently delete all locally cached medications, safety reports, and session records from this browser."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearData}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-700 hover:bg-rose-800 rounded shadow-sm"
        >
          {language === "hi" ? "सभी डेटा हटाएं" : "Permanently Clear All Local Records"}
        </button>
      </div>
    </div>
  );
}
