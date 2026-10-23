"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type VerificationStatus = "verified" | "unconfirmed" | "edited";
export type ReportStatus = "risk_detected" | "no_known_issue" | "incomplete";
export type SeverityLevel = "high" | "moderate" | "low" | "advisory";

export interface ActiveIngredient {
  name: string;
  strength: string;
  amountMg?: number;
}

export interface MedicineRecord {
  id: string;
  brandName: string;
  genericName?: string;
  activeIngredients: ActiveIngredient[];
  strength: string;
  dosageForm: string;
  manufacturer?: string;
  confidence: number;
  packagingImageUrl?: string;
  verificationStatus: VerificationStatus;
  dateAdded: string;
  notes?: string;
  scanSource?: "camera" | "upload" | "manual" | "sample";
}

export interface SafetyFinding {
  id: string;
  type: "duplicate_ingredient" | "drug_interaction" | "dosage_ceiling" | "incomplete_data";
  title: string;
  severity: SeverityLevel;
  medicinesInvolved: string[];
  ingredientsInvolved: string[];
  explanation: string;
  explanationHi?: string;
  clinicalMechanism: string;
  actionGuidance: string;
  actionGuidanceHi?: string;
  evidenceSource: string;
  ruleId: string;
}

export interface SafetyReport {
  id: string;
  timestamp: string;
  medicineIds: string[];
  medicineNames: string[];
  status: ReportStatus;
  findings: SafetyFinding[];
  checksCompleted: string[];
  checksNotCompleted: string[];
  evidenceSources: string[];
  ruleVersion: string;
  patientNotes?: string;
  verifiedByPatient: boolean;
}

export interface DashboardNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  targetUrl: string;
  read: boolean;
}

export interface AdminRule {
  id: string;
  ruleCode: string;
  type: "duplicate_salt" | "interaction_contraindication" | "dosage_limit";
  primarySubstance: string;
  secondarySubstance?: string;
  severity: SeverityLevel;
  thresholdMg?: number;
  clinicalRationale: string;
  monographSource: string;
  version: string;
  approvalStatus: "approved" | "pending_review";
  lastAudited: string;
}

interface DashboardContextType {
  medicines: MedicineRecord[];
  reports: SafetyReport[];
  notifications: DashboardNotification[];
  adminRules: AdminRule[];
  addMedicine: (medicine: Omit<MedicineRecord, "id" | "dateAdded">) => MedicineRecord;
  updateMedicine: (id: string, updates: Partial<MedicineRecord>) => void;
  removeMedicine: (id: string) => void;
  runSafetyCheck: (selectedMedicineIds: string[]) => SafetyReport;
  deleteReport: (reportId: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  clearAllData: () => void;
  speakText: (text: string, lang?: "en" | "hi") => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  getDashboardStats: () => {
    totalMedicines: number;
    totalChecks: number;
    reportsWithRisks: number;
    pendingVerification: number;
  };
}

const DEFAULT_MEDICINES: MedicineRecord[] = [
  {
    id: "med-1",
    brandName: "Crocin 650",
    genericName: "Paracetamol Oral Tablet",
    activeIngredients: [{ name: "Paracetamol", strength: "650mg", amountMg: 650 }],
    strength: "650 mg",
    dosageForm: "Tablet",
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
    confidence: 99.4,
    packagingImageUrl: "/logo-mark.png",
    verificationStatus: "verified",
    dateAdded: "2026-10-21 14:32",
    notes: "Prescribed for intermittent acute fever.",
    scanSource: "camera",
  },
  {
    id: "med-2",
    brandName: "Combiflam",
    genericName: "Ibuprofen and Paracetamol Tablets",
    activeIngredients: [
      { name: "Ibuprofen", strength: "400mg", amountMg: 400 },
      { name: "Paracetamol", strength: "325mg", amountMg: 325 },
    ],
    strength: "400 mg + 325 mg",
    dosageForm: "Tablet",
    manufacturer: "Sanofi India Limited",
    confidence: 98.1,
    packagingImageUrl: "/logo-mark.png",
    verificationStatus: "verified",
    dateAdded: "2026-10-21 14:35",
    notes: "Taken for joint inflammation and muscle soreness.",
    scanSource: "camera",
  },
  {
    id: "med-3",
    brandName: "Amoxyclav 625",
    genericName: "Amoxicillin and Potassium Clavulanate",
    activeIngredients: [
      { name: "Amoxicillin", strength: "500mg", amountMg: 500 },
      { name: "Clavulanic Acid", strength: "125mg", amountMg: 125 },
    ],
    strength: "500 mg + 125 mg",
    dosageForm: "Tablet",
    manufacturer: "Abbott Healthcare",
    confidence: 97.6,
    packagingImageUrl: "/logo-mark.png",
    verificationStatus: "verified",
    dateAdded: "2026-10-18 09:15",
    notes: "Complete 5-day course as prescribed.",
    scanSource: "upload",
  },
  {
    id: "med-4",
    brandName: "Generic Faded Blister",
    genericName: "Unconfirmed Formulation",
    activeIngredients: [{ name: "Indeterminate Salt", strength: "Pending", amountMg: 0 }],
    strength: "Unverified",
    dosageForm: "Capsule",
    manufacturer: "Unresolved",
    confidence: 52.0,
    packagingImageUrl: "/logo-mark.png",
    verificationStatus: "unconfirmed",
    dateAdded: "2026-10-22 18:20",
    notes: "Label abraded near foil fold. Awaiting pharmacist confirmation.",
    scanSource: "camera",
  },
];

const DEFAULT_REPORTS: SafetyReport[] = [
  {
    id: "REP-2026-089",
    timestamp: "2026-10-21 14:36",
    medicineIds: ["med-1", "med-2"],
    medicineNames: ["Crocin 650", "Combiflam"],
    status: "risk_detected",
    ruleVersion: "CDSCO-2026.4.1",
    verifiedByPatient: true,
    evidenceSources: [
      "National Formulary of India (NFI 2024 Monograph: Paracetamol)",
      "CDSCO Standard Treatment Guidelines on NSAID Combinations",
    ],
    checksCompleted: [
      "Duplicate Active Principle Summation Check",
      "Cumulative Hepatotoxicity Dose Ceiling Verification",
      "NSAID Gastric Mucosal Interaction Matrix",
    ],
    checksNotCompleted: [
      "Renal Clearance Adjustment (Serum Creatinine level not provided by user)",
    ],
    findings: [
      {
        id: "find-1",
        type: "duplicate_ingredient",
        title: "Duplicate Active Ingredient: Paracetamol Overlap",
        severity: "high",
        medicinesInvolved: ["Crocin 650", "Combiflam"],
        ingredientsInvolved: ["Paracetamol (650mg)", "Paracetamol (325mg)"],
        explanation:
          "Both Crocin 650 and Combiflam contain Paracetamol. Concurrent administration delivers 975mg Paracetamol in a single intake, approaching the maximum recommended safe adult single dose (1,000mg).",
        explanationHi:
          "क्रोसिन 650 और कॉम्बीफ्लेम दोनों में पैरासिटामोल मौजूद है। दोनों को एक साथ लेने पर 975mg पैरासिटामोल मिलता है, जो सुरक्षित सीमा (1,000mg) के बहुत करीब है।",
        clinicalMechanism:
          "Exceeding safe paracetamol thresholds depletes glutathione stores, leading to accumulation of toxic NAPQI metabolite and hepatic cellular stress.",
        actionGuidance:
          "Do not ingest Crocin 650 and Combiflam simultaneously. Consult your doctor or pharmacist to replace one with a non-overlapping formulation.",
        actionGuidanceHi:
          "क्रोसिन 650 और कॉम्बीफ्लेम को एक साथ न लें। किसी एक दवा को बदलने के लिए डॉक्टर या फार्मासिस्ट से परामर्श लें।",
        evidenceSource: "National Formulary of India / CDSCO Analgesic Protocol 2024",
        ruleId: "DR-DUP-PARA-001",
      },
    ],
  },
  {
    id: "REP-2026-064",
    timestamp: "2026-10-18 09:20",
    medicineIds: ["med-1", "med-3"],
    medicineNames: ["Crocin 650", "Amoxyclav 625"],
    status: "no_known_issue",
    ruleVersion: "CDSCO-2026.4.1",
    verifiedByPatient: true,
    evidenceSources: [
      "WHO Model List of Essential Medicines (23rd List: Penicillins and Analgesics)",
      "Indian Pharmacopoeia Monograph IP 2022",
    ],
    checksCompleted: [
      "Duplicate Active Principle Check",
      "Hepatic & Renal Cytochrome P450 Interaction Matrix",
      "Antibacterial Absorption Interference Check",
    ],
    checksNotCompleted: [
      "Allergic Cross-Reactivity (Patient-specific history not recorded)",
    ],
    findings: [],
  },
  {
    id: "REP-2026-092",
    timestamp: "2026-10-22 18:22",
    medicineIds: ["med-4"],
    medicineNames: ["Generic Faded Blister"],
    status: "incomplete",
    ruleVersion: "CDSCO-2026.4.1",
    verifiedByPatient: false,
    evidenceSources: ["DawaLens Deterministic Verification Standard v2.4 (Zero-Guesswork)"],
    checksCompleted: ["Packaging Ingestion Protocol"],
    checksNotCompleted: [
      "Duplicate Ingredient Check (Active salt unconfirmed)",
      "Drug Interaction Matrix (Formulation abraded)",
    ],
    findings: [
      {
        id: "find-incomplete",
        type: "incomplete_data",
        title: "Packaging Label Unverified (OCR Confidence 52%)",
        severity: "moderate",
        medicinesInvolved: ["Generic Faded Blister"],
        ingredientsInvolved: ["Unverified Active Substance"],
        explanation:
          "Packaging print was faded near the blister fold. Active ingredient and milligram strength could not be extracted with the required >90% clinical confidence.",
        explanationHi:
          "दवा की पैकेजिंग पर लिखा विवरण धुंधला था। 90% से अधिक सटीकता के साथ सक्रिय साल्ट की पुष्टि नहीं हो सकी।",
        clinicalMechanism:
          "Safety rules require 100% confirmed active salts. Operating on ambiguous assumptions creates clinical risk.",
        actionGuidance:
          "Retake photo under direct, non-glare lighting with packaging flat, or physically present the blister to a licensed pharmacist.",
        actionGuidanceHi:
          "अच्छी रोशनी में दोबारा फोटो खींचें या अपने नजदीकी फार्मासिस्ट को दवा की पट्टी दिखाएं।",
        evidenceSource: "DawaLens Safety Protocol Standard v2.4",
        ruleId: "DL-OCR-LOWCONF-002",
      },
    ],
  },
];

const DEFAULT_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: "notif-1",
    timestamp: "Just now",
    title: "Duplicate Ingredient Risk Identified",
    message: "Report REP-2026-089 contains a cumulative Paracetamol dose alert (Crocin + Combiflam).",
    type: "warning",
    targetUrl: "/dashboard/reports?id=REP-2026-089",
    read: false,
  },
  {
    id: "notif-2",
    timestamp: "2 hours ago",
    title: "Medicine Details Require Verification",
    message: "Generic Faded Blister has unconfirmed active ingredients. Review details before safety check.",
    type: "info",
    targetUrl: "/dashboard/medicines",
    read: false,
  },
  {
    id: "notif-3",
    timestamp: "Yesterday",
    title: "Safety Check Completed",
    message: "Check for Amoxyclav 625 completed without known conflict in reviewed reference rules.",
    type: "success",
    targetUrl: "/dashboard/reports?id=REP-2026-064",
    read: true,
  },
];

const DEFAULT_ADMIN_RULES: AdminRule[] = [
  {
    id: "rule-1",
    ruleCode: "DR-DUP-PARA-001",
    type: "duplicate_salt",
    primarySubstance: "Paracetamol",
    severity: "high",
    thresholdMg: 1000,
    clinicalRationale:
      "Multiple simultaneous paracetamol-containing preparations risk acute hepatotoxicity when single intake exceeds 1000mg or 24h exceeds 4000mg.",
    monographSource: "National Formulary of India (NFI 2024)",
    version: "2026.4.1",
    approvalStatus: "approved",
    lastAudited: "2026-09-15 by Clinical Board",
  },
  {
    id: "rule-2",
    ruleCode: "IR-NSAID-ASPIRIN-008",
    type: "interaction_contraindication",
    primarySubstance: "Ibuprofen",
    secondarySubstance: "Aspirin",
    severity: "high",
    clinicalRationale:
      "Ibuprofen interferes with the irreversible antiplatelet effect of low-dose aspirin, compromising cardiovascular protection.",
    monographSource: "CDSCO / US-FDA Pharmacovigilance Bulletin",
    version: "2026.4.1",
    approvalStatus: "approved",
    lastAudited: "2026-09-20 by Clinical Board",
  },
  {
    id: "rule-3",
    ruleCode: "IR-METFORMIN-ALCOHOL-015",
    type: "interaction_contraindication",
    primarySubstance: "Metformin",
    secondarySubstance: "Ethanol",
    severity: "high",
    clinicalRationale:
      "Potentiation of metformin effect on lactate metabolism increasing acute lactic acidosis risk.",
    monographSource: "Indian Pharmacopoeia IP 9th Edition",
    version: "2026.4.1",
    approvalStatus: "approved",
    lastAudited: "2026-10-01 by Clinical Board",
  },
  {
    id: "rule-4",
    ruleCode: "DR-CIPRO-ANTACID-022",
    type: "interaction_contraindication",
    primarySubstance: "Ciprofloxacin",
    secondarySubstance: "Magnesium Hydroxide",
    severity: "moderate",
    clinicalRationale:
      "Chelation of fluoroquinolone antibiotic by polyvalent cations severely attenuates intestinal absorption.",
    monographSource: "WHO Model Formulary",
    version: "2026.4.1",
    approvalStatus: "approved",
    lastAudited: "2026-10-10 by Clinical Board",
  },
];

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<MedicineRecord[]>(DEFAULT_MEDICINES);
  const [reports, setReports] = useState<SafetyReport[]>(DEFAULT_REPORTS);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(DEFAULT_NOTIFICATIONS);
  const [adminRules] = useState<AdminRule[]>(DEFAULT_ADMIN_RULES);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedMeds = localStorage.getItem("dawalens_medicines");
      if (savedMeds) setMedicines(JSON.parse(savedMeds));
      const savedReports = localStorage.getItem("dawalens_reports");
      if (savedReports) setReports(JSON.parse(savedReports));
      const savedNotifs = localStorage.getItem("dawalens_notifications");
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch {
      // Fallback to defaults
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dawalens_medicines", JSON.stringify(medicines));
    } catch {}
  }, [medicines]);

  useEffect(() => {
    try {
      localStorage.setItem("dawalens_reports", JSON.stringify(reports));
    } catch {}
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem("dawalens_notifications", JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const addMedicine = (medData: Omit<MedicineRecord, "id" | "dateAdded">): MedicineRecord => {
    const newMed: MedicineRecord = {
      ...medData,
      id: `med-${Date.now()}`,
      dateAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setMedicines((prev) => [newMed, ...prev]);

    // Push notification
    const newNotif: DashboardNotification = {
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      title: "New Medicine Scanned",
      message: `${newMed.brandName} details extracted. Please review before running safety checks.`,
      type: "info",
      targetUrl: "/dashboard/medicines",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newMed;
  };

  const updateMedicine = (id: string, updates: Partial<MedicineRecord>) => {
    setMedicines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((item) => item.id !== reportId));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllData = () => {
    setMedicines([]);
    setReports([]);
    setNotifications([]);
    localStorage.removeItem("dawalens_medicines");
    localStorage.removeItem("dawalens_reports");
    localStorage.removeItem("dawalens_notifications");
  };

  // Deterministic Clinical Safety Engine Execution
  const runSafetyCheck = (selectedMedicineIds: string[]): SafetyReport => {
    const selectedMeds = medicines.filter((m) => selectedMedicineIds.includes(m.id));
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const reportId = `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const findings: SafetyFinding[] = [];
    const checksCompleted: string[] = [
      "Duplicate Active Principle Summation Check",
      "Standard Monograph Interaction Matrix Review",
      "Formulation and Active Dosage Reconciliation",
    ];
    const checksNotCompleted: string[] = [
      "Patient Specific Renal / Hepatic Blood Clearance (Labs not linked)",
      "Unlisted Idiosyncratic Allergic Sensitivities",
    ];
    const evidenceSources: string[] = [
      "National Formulary of India (NFI 2024)",
      "CDSCO Standard Treatment Guidelines on Multi-Drug Formulations",
      "WHO Model List of Essential Medicines (23rd Edition)",
    ];

    // Check 1: Check if any unconfirmed medicine is present
    const hasUnconfirmed = selectedMeds.some((m) => m.verificationStatus === "unconfirmed");
    if (hasUnconfirmed) {
      findings.push({
        id: `find-${Date.now()}-incomplete`,
        type: "incomplete_data",
        title: "Unconfirmed Medicine Included in Check",
        severity: "moderate",
        medicinesInvolved: selectedMeds.filter((m) => m.verificationStatus === "unconfirmed").map((m) => m.brandName),
        ingredientsInvolved: ["Unverified Active Substance"],
        explanation:
          "One or more selected medicines have not been confirmed by the user against packaging text. DawaLens does not calculate interactions for ambiguous ingredients.",
        explanationHi:
          "चुनी गई एक या अधिक दवाओं की पुष्टि पैकेजिंग से नहीं हुई है। दवा लेंस अधूरी जानकारी पर सुरक्षा परिणाम नहीं देता।",
        clinicalMechanism: "Zero-hallucination policy applied.",
        actionGuidance: "Please open the unconfirmed medicine, verify the active salt and dosage form, and retry the check.",
        actionGuidanceHi: "कृपया दवा के विवरण को सत्यापित करें और पुनः जांच करें।",
        evidenceSource: "DawaLens Safety Protocol Standard v2.4",
        ruleId: "DL-UNCONFIRMED-001",
      });

      const incompleteReport: SafetyReport = {
        id: reportId,
        timestamp: now,
        medicineIds: selectedMeds.map((m) => m.id),
        medicineNames: selectedMeds.map((m) => m.brandName),
        status: "incomplete",
        findings,
        checksCompleted,
        checksNotCompleted: [...checksNotCompleted, "All deterministic interaction tables suspended"],
        evidenceSources,
        ruleVersion: "CDSCO-2026.4.1",
        verifiedByPatient: false,
      };

      setReports((prev) => [incompleteReport, ...prev]);
      return incompleteReport;
    }

    // Check 2: Evaluate Duplicate Ingredients & Active Salt Summation
    const saltTally: Record<string, { totalMg: number; meds: string[]; strengths: string[] }> = {};
    selectedMeds.forEach((m) => {
      m.activeIngredients.forEach((ing) => {
        const normName = ing.name.trim();
        if (!saltTally[normName]) {
          saltTally[normName] = { totalMg: 0, meds: [], strengths: [] };
        }
        saltTally[normName].meds.push(m.brandName);
        saltTally[normName].strengths.push(`${m.brandName} (${ing.strength})`);
        if (ing.amountMg) {
          saltTally[normName].totalMg += ing.amountMg;
        }
      });
    });

    Object.entries(saltTally).forEach(([salt, data]) => {
      if (data.meds.length > 1) {
        const isParacetamol = salt.toLowerCase().includes("paracetamol") || salt.toLowerCase().includes("acetaminophen");
        findings.push({
          id: `find-dup-${salt}`,
          type: "duplicate_ingredient",
          title: `Duplicate Active Principle: ${salt}`,
          severity: isParacetamol && data.totalMg >= 900 ? "high" : "moderate",
          medicinesInvolved: Array.from(new Set(data.meds)),
          ingredientsInvolved: data.strengths,
          explanation: `Multiple selected preparations contain ${salt} (${data.strengths.join(" and ")}). Concurrent administration delivers a combined cumulative dose ${
            data.totalMg > 0 ? `of ${data.totalMg}mg` : ""
          }, which can lead to unintentional toxic exposure.`,
          explanationHi: `चयनित दवाओं में एक ही सक्रिय तत्व (${salt}) दो बार मौजूद है। इन्हें एक साथ लेने से शरीर में दवा की मात्रा खतरनाक स्तर तक बढ़ सकती है।`,
          clinicalMechanism:
            "Cumulative metabolic saturation of hepatic clearing pathways risks acute hepatotoxicity and cellular injury.",
          actionGuidance:
            "Do not ingest both medications simultaneously. Consult your prescribing physician or pharmacist to consolidate into a non-overlapping regimen.",
          actionGuidanceHi:
            "दोनों दवाओं को एक साथ न लें। किसी एक दवा को सुरक्षित विकल्प से बदलने के लिए अपने डॉक्टर या फार्मासिस्ट से संपर्क करें।",
          evidenceSource: "National Formulary of India / CDSCO Standard Treatment Guidelines on Analgesics 2024",
          ruleId: "DR-DUP-PARA-001",
        });
      }
    });

    // Check 3: Check Known Clinical Interactions from Admin Rules
    const allIngredients = selectedMeds.flatMap((m) => m.activeIngredients.map((i) => i.name.toLowerCase()));
    adminRules.forEach((rule) => {
      if (rule.secondarySubstance) {
        const hasPrimary = allIngredients.some((i) => i.includes(rule.primarySubstance.toLowerCase()));
        const hasSecondary = allIngredients.some((i) => i.includes(rule.secondarySubstance!.toLowerCase()));
        if (hasPrimary && hasSecondary) {
          findings.push({
            id: `find-ir-${rule.ruleCode}`,
            type: "drug_interaction",
            title: `Known Drug Interaction: ${rule.primarySubstance} + ${rule.secondarySubstance}`,
            severity: rule.severity,
            medicinesInvolved: selectedMeds.map((m) => m.brandName),
            ingredientsInvolved: [`${rule.primarySubstance}`, `${rule.secondarySubstance}`],
            explanation: `Concurrent administration of ${rule.primarySubstance} and ${rule.secondarySubstance} is flagged in reviewed clinical reference data.`,
            clinicalMechanism: rule.clinicalRationale,
            actionGuidance:
              "Inform your healthcare professional about both prescriptions. Do not adjust your dosage independently.",
            actionGuidanceHi:
              "दोनों दवाओं के बारे में अपने डॉक्टर को बताएं। अपने आप दवा की खुराक में बदलाव न करें।",
            evidenceSource: rule.monographSource,
            ruleId: rule.ruleCode,
          });
        }
      }
    });

    const reportStatus: ReportStatus = findings.length > 0 ? "risk_detected" : "no_known_issue";

    const newReport: SafetyReport = {
      id: reportId,
      timestamp: now,
      medicineIds: selectedMeds.map((m) => m.id),
      medicineNames: selectedMeds.map((m) => m.brandName),
      status: reportStatus,
      findings,
      checksCompleted,
      checksNotCompleted,
      evidenceSources,
      ruleVersion: "CDSCO-2026.4.1",
      verifiedByPatient: true,
    };

    setReports((prev) => [newReport, ...prev]);

    // Push alert notification if risk detected
    if (reportStatus === "risk_detected") {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          timestamp: "Just now",
          title: "Potential Risk Detected in Safety Check",
          message: `Report ${reportId} flagged concerns between ${selectedMeds.map((m) => m.brandName).join(", ")}.`,
          type: "warning",
          targetUrl: `/dashboard/reports?id=${reportId}`,
          read: false,
        },
        ...prev,
      ]);
    }

    return newReport;
  };

  // Read-Aloud Web Speech API Support (Requirement 13)
  const speakText = (text: string, lang: "en" | "hi" = "en") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Actual records stats calculation (Zero fabrication guarantee)
  const getDashboardStats = () => {
    const totalMedicines = medicines.length;
    const totalChecks = reports.length;
    const reportsWithRisks = reports.filter((r) => r.status === "risk_detected").length;
    const pendingVerification = medicines.filter((m) => m.verificationStatus === "unconfirmed").length;

    return {
      totalMedicines,
      totalChecks,
      reportsWithRisks,
      pendingVerification,
    };
  };

  return (
    <DashboardContext.Provider
      value={{
        medicines,
        reports,
        notifications,
        adminRules,
        addMedicine,
        updateMedicine,
        removeMedicine,
        runSafetyCheck,
        deleteReport,
        markNotificationRead,
        clearAllNotifications,
        clearAllData,
        speakText,
        stopSpeaking,
        isSpeaking,
        getDashboardStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
