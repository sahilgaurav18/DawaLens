"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useDashboard, MedicineRecord, SafetyReport, ActiveIngredient } from "@/lib/dashboard-store";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Scan,
  Camera,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Volume2,
  VolumeX,
  FileText,
  RefreshCw,
  Edit2,
  Check,
  X,
  Eye,
  Info,
} from "lucide-react";

interface UploadedImageItem {
  id: string;
  name: string;
  previewUrl: string;
  file?: File;
  source: "camera" | "upload" | "sample";
  samplePresetKey?: string;
}

type ScanStage = "upload" | "verify" | "checking" | "results";

const SAMPLE_PRESETS: {
  key: string;
  name: string;
  desc: string;
  brand: string;
  salts: ActiveIngredient[];
  dosageForm: string;
  confidence: number;
}[] = [
    {
      key: "crocin",
      name: "Crocin 650 (Blister Strip)",
      desc: "Single-agent antipyretic blister strip",
      brand: "Crocin 650",
      salts: [{ name: "Paracetamol", strength: "650mg", amountMg: 650 }],
      dosageForm: "Tablet",
      confidence: 99.2,
    },
    {
      key: "combiflam",
      name: "Combiflam (Dual-Action Blister)",
      desc: "Combination pain & fever tablet",
      brand: "Combiflam",
      salts: [
        { name: "Ibuprofen", strength: "400mg", amountMg: 400 },
        { name: "Paracetamol", strength: "325mg", amountMg: 325 },
      ],
      dosageForm: "Tablet",
      confidence: 98.4,
    },
    {
      key: "amoxyclav",
      name: "Amoxyclav 625 (Capsule Box)",
      desc: "Antibacterial co-formulation",
      brand: "Amoxyclav 625",
      salts: [
        { name: "Amoxicillin", strength: "500mg", amountMg: 500 },
        { name: "Clavulanic Acid", strength: "125mg", amountMg: 125 },
      ],
      dosageForm: "Tablet",
      confidence: 97.5,
    },
    {
      key: "aspirin",
      name: "Ecosprin 75 (Cardio Strip)",
      desc: "Low-dose antiplatelet formulation",
      brand: "Ecosprin 75",
      salts: [{ name: "Aspirin", strength: "75mg", amountMg: 75 }],
      dosageForm: "Tablet",
      confidence: 96.8,
    },
    {
      key: "abraded",
      name: "Foil Strip (Surface Faded)",
      desc: "Simulate unreadable packaging error",
      brand: "Generic Analgesic",
      salts: [{ name: "Unverified Salt", strength: "Ambiguous", amountMg: 0 }],
      dosageForm: "Capsule",
      confidence: 54.0,
    },
  ];

export default function ScanMedicinesPage() {
  const { language } = useLanguage();
  const { medicines, addMedicine, runSafetyCheck, speakText, stopSpeaking, isSpeaking } = useDashboard();

  const [stage, setStage] = useState<ScanStage>("upload");
  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted Candidate Medicines for Verification
  const [candidateMedicines, setCandidateMedicines] = useState<MedicineRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backendScanId, setBackendScanId] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<{
    online: boolean;
    provider?: string;
    rulesCount?: number;
  }>({ online: false });

  // Probe FastAPI backend connection on mount
  useEffect(() => {
    apiClient.checkHealth().then((health) => {
      if (health && health.status === "HEALTHY") {
        setBackendHealth({
          online: true,
          provider: health.gemma_service_status,
        });
      }
    });
  }, []);

  // Load pre-selected medicines if arriving from My Medicines or Dashboard Home
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const medIdsParam = params.get("medIds");
    if (medIdsParam && medicines.length > 0) {
      const ids = medIdsParam.split(",").map((s) => s.trim());
      const matched = medicines.filter((m) => ids.includes(m.id));
      if (matched.length > 0) {
        setCandidateMedicines(matched);
        setStage("verify");
      }
    }
  }, [medicines]);

  // Safety Check In-Progress State
  const [checkProgress, setCheckProgress] = useState<{
    currentStep: string;
    stepIndex: number;
    stepsTotal: number;
    completed: string[];
  }>({
    currentStep: "",
    stepIndex: 0,
    stepsTotal: 4,
    completed: [],
  });

  // Final Safety Report Result
  const [currentReport, setCurrentReport] = useState<SafetyReport | null>(null);

  // Camera Live Streaming
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setErrorMessage("Camera access denied or unavailable. You can upload an image file or pick a sample preset below.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const newItem: UploadedImageItem = {
        id: `img-${Date.now()}`,
        name: `Camera_Capture_${Date.now()}.jpg`,
        previewUrl: dataUrl,
        source: "camera",
      };
      setUploadedImages((prev) => [...prev, newItem]);
      stopCamera();
    }
  };

  // Handle File Upload from Disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select valid image files (JPG, PNG, WEBP).");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const newItem: UploadedImageItem = {
        id: `img-${Date.now()}-${Math.random()}`,
        name: file.name,
        previewUrl,
        file,
        source: "upload",
      };
      setUploadedImages((prev) => [...prev, newItem]);
    });
    setErrorMessage(null);
  };

  // Add Sample Preset Image
  const addSamplePreset = (presetKey: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;

    const newItem: UploadedImageItem = {
      id: `img-preset-${preset.key}-${Date.now()}`,
      name: `${preset.name}.jpg`,
      previewUrl: "/logo-mark.png",
      source: "sample",
      samplePresetKey: preset.key,
    };
    setUploadedImages((prev) => [...prev, newItem]);
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Run OCR & Extract Candidate Details (Transition to Stage 2)
  const processImagesToCandidates = async () => {
    if (uploadedImages.length === 0) {
      setErrorMessage("Please capture or upload at least one medicine packaging image.");
      return;
    }

    setErrorMessage(null);
    setIsProcessingOcr(true);

    // Prepare files for real backend multipart upload
    const filesToUpload: File[] = [];
    for (let i = 0; i < uploadedImages.length; i++) {
      const img = uploadedImages[i];
      if (img.file) {
        filesToUpload.push(img.file);
      } else {
        // Construct Blob for sample preset
        const key = img.samplePresetKey || (i === 0 ? "crocin" : "combiflam");
        const blob = new Blob(["packaging sample data"], { type: "image/jpeg" });
        const sampleFile = new File([blob], `${key}_blister.jpg`, { type: "image/jpeg" });
        filesToUpload.push(sampleFile);
      }
    }

    try {
      // Execute real FastAPI backend packaging analysis
      const backendRes = await apiClient.uploadScanImages(filesToUpload);
      if (backendRes && backendRes.candidate_medicines && backendRes.candidate_medicines.length > 0) {
        const candidates: MedicineRecord[] = backendRes.candidate_medicines.map((c, idx) => ({
          id: c.id || `cand-${idx + 1}-${Date.now()}`,
          brandName: c.brand_name,
          genericName: c.generic_name || "",
          activeIngredients: c.active_ingredients.map((ing) => ({
            name: ing.name,
            strength: ing.strength,
            amountMg: ing.amount_mg || undefined,
          })),
          strength: c.strength,
          dosageForm: c.dosage_form,
          manufacturer: c.manufacturer || "",
          confidence: c.confidence,
          verificationStatus: "unconfirmed", // Human verification strictly required
          dateAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
          packagingImageUrl: uploadedImages[idx]?.previewUrl || "/logo-mark.png",
          scanSource: uploadedImages[idx]?.source || "upload",
          notes: c.ambiguity_reason ? `Notice: ${c.ambiguity_reason}` : undefined,
        }));

        setCandidateMedicines(candidates);
        setBackendScanId(backendRes.scan_id);
        setIsProcessingOcr(false);
        setStage("verify");
        return;
      }
    } catch (err: any) {
      console.warn("Scan upload failed:", err.message);

      // Only allow sample preset fallback if EVERY image in queue is an explicit sample preset
      const allArePresets = uploadedImages.every((img) => img.source === "sample" && img.samplePresetKey);
      if (allArePresets) {
        const candidates: MedicineRecord[] = uploadedImages.map((img, idx) => {
          const preset = SAMPLE_PRESETS.find((p) => p.key === img.samplePresetKey);
          return {
            id: `cand-${idx + 1}-${Date.now()}`,
            brandName: preset ? preset.brand : "Crocin 650",
            genericName: preset ? `${preset.brand} Formulation` : "Paracetamol",
            activeIngredients: preset ? preset.salts : [{ name: "Paracetamol", strength: "650mg", amountMg: 650 }],
            strength: preset ? preset.salts.map((s) => s.strength).join(" + ") : "650 mg",
            dosageForm: preset ? preset.dosageForm : "Tablet",
            confidence: preset ? preset.confidence : 99.0,
            verificationStatus: "unconfirmed",
            dateAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
            packagingImageUrl: img.previewUrl,
            scanSource: img.source,
          };
        });
        setCandidateMedicines(candidates);
        setIsProcessingOcr(false);
        setStage("verify");
        return;
      }

      // If user uploaded an image and analysis failed: SHOW CLEAR ERROR STATE, NEVER SILENT FALLBACK!
      setIsProcessingOcr(false);
      const msg =
        err?.message && err.message.includes("couldn't read this label")
          ? "We couldn't read this label. Try a clearer photo or try again."
          : err?.message || "We couldn't read this label. Try a clearer photo or try again.";
      setErrorMessage(msg);
      return;
    }

    // Backend returned empty response
    setIsProcessingOcr(false);
    setErrorMessage("We couldn't read this label. Try a clearer photo or try again.");
  };

  // Verification Updates (Candidate editing)
  const updateCandidate = (id: string, updates: Partial<MedicineRecord>) => {
    setCandidateMedicines((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, verificationStatus: "edited" } : c))
    );
  };

  const confirmCandidate = (id: string) => {
    setCandidateMedicines((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verificationStatus: "verified" } : c))
    );
    setEditingId(null);
  };

  const removeCandidate = (id: string) => {
    setCandidateMedicines((prev) => prev.filter((c) => c.id !== id));
  };

  // Run Multi-Medicine Safety Check (Transition to Stage 3 & 4)
  const executeSafetyCheck = () => {
    // Check if any candidate is unconfirmed
    const unconfirmed = candidateMedicines.filter((c) => c.verificationStatus === "unconfirmed");
    if (unconfirmed.length > 0) {
      setErrorMessage(
        "Important: Unconfirmed medicine details must not silently proceed as verified information. Please confirm or correct all extracted details before running safety checks."
      );
      return;
    }

    setErrorMessage(null);
    setStage("checking");

    // Save verified candidates into the global store
    const savedRecords = candidateMedicines.map((cand) =>
      addMedicine({
        brandName: cand.brandName,
        genericName: cand.genericName,
        activeIngredients: cand.activeIngredients,
        strength: cand.strength,
        dosageForm: cand.dosageForm,
        confidence: cand.confidence,
        verificationStatus: cand.verificationStatus,
        packagingImageUrl: cand.packagingImageUrl,
        notes: "Scanned and verified in multi-medicine safety session",
        scanSource: cand.scanSource,
      })
    );

    // Multi-stage progress animation
    const stepsSequence = [
      "1. Cross-referencing active chemical salts across all preparations...",
      "2. Evaluating cumulative Paracetamol / NSAID dosage limits...",
      "3. Scanning CDSCO & WHO interaction matrices...",
      "4. Finalizing clinical evidence citations...",
    ];

    stepsSequence.forEach((stepText, idx) => {
      setTimeout(async () => {
        setCheckProgress({
          currentStep: stepText,
          stepIndex: idx + 1,
          stepsTotal: stepsSequence.length,
          completed: stepsSequence.slice(0, idx),
        });

        if (idx === stepsSequence.length - 1) {
          try {
            // Call real FastAPI backend safety-checks endpoint
            const backendReport = await apiClient.runSafetyCheck(
              candidateMedicines,
              backendScanId || undefined
            );
            if (backendReport) {
              const mappedReport: SafetyReport = {
                id: backendReport.report_id,
                timestamp: backendReport.checked_at,
                medicineIds: savedRecords.map((r) => r.id),
                medicineNames: backendReport.medicines_checked,
                status: backendReport.overall_status.toLowerCase() as any,
                ruleVersion: backendReport.rule_versions[0] || "CDSCO-2026.4.1",
                verifiedByPatient: true,
                evidenceSources: backendReport.evidence_sources,
                checksCompleted: backendReport.checks_completed,
                checksNotCompleted: backendReport.checks_failed_or_unavailable,
                findings: backendReport.findings.map((f) => ({
                  id: f.id,
                  type: f.type,
                  title: f.title,
                  severity: f.severity,
                  medicinesInvolved: f.medicines_involved,
                  ingredientsInvolved: f.ingredients_involved,
                  explanation: f.explanation,
                  explanationHi: f.explanation_hi,
                  clinicalMechanism: f.clinical_mechanism,
                  actionGuidance: f.action_guidance,
                  actionGuidanceHi: f.action_guidance_hi,
                  evidenceSource: f.evidence_source,
                  ruleId: f.rule_id,
                })),
              };
              setCurrentReport(mappedReport);
              setStage("results");
              return;
            }
          } catch (err: any) {
            console.warn("Backend safety check failed, using local rule engine:", err.message);
          }

          // Fallback to local rule engine in dashboard-store
          const localReport = runSafetyCheck(savedRecords.map((r) => r.id));
          setCurrentReport(localReport);
          setStage("results");
        }
      }, (idx + 1) * 700);
    });
  };

  const resetAll = () => {
    setStage("upload");
    setUploadedImages([]);
    setCandidateMedicines([]);
    setCurrentReport(null);
    setErrorMessage(null);
    stopSpeaking();
  };

  return (
    <div className="space-y-8">
      {/* Stage Progress Wizard Breadcrumb */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between overflow-x-auto text-xs font-semibold">
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`px-3 py-1 rounded-full ${stage === "upload" ? "bg-slate-900 text-white font-bold" : "bg-slate-100 text-slate-600"
              }`}
          >
            1. Ingest Packaging
          </span>
          <span className="text-slate-300">/</span>
          <span
            className={`px-3 py-1 rounded-full ${stage === "verify" ? "bg-slate-900 text-white font-bold" : "bg-slate-100 text-slate-600"
              }`}
          >
            2. Verify Extracted Details
          </span>
          <span className="text-slate-300">/</span>
          <span
            className={`px-3 py-1 rounded-full ${stage === "checking" ? "bg-slate-900 text-white font-bold" : "bg-slate-100 text-slate-600"
              }`}
          >
            3. Deterministic Safety Check
          </span>
          <span className="text-slate-300">/</span>
          <span
            className={`px-3 py-1 rounded-full ${stage === "results" ? "bg-slate-900 text-white font-bold" : "bg-slate-100 text-slate-600"
              }`}
          >
            4. Structured Safety Report
          </span>
        </div>

        <div className="flex items-center gap-3">
          {backendHealth.online ? (
            <span
              title={`Provider: ${backendHealth.provider || 'Active'}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-teal-50 text-teal-800 border border-teal-200 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              FastAPI Engine: Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              FastAPI Engine: Standalone
            </span>
          )}

          {stage !== "upload" && (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 hover:text-rose-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE 1: INGEST PACKAGING (Requirement 2) */}
      {stage === "upload" && (
        <div className="space-y-6">
          <div className="p-6 lg:p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 className="text-2xl font-display font-semibold text-slate-900 mb-2">
              Scan & Upload Medicine Packaging
            </h2>
            <p className="text-sm text-slate-600 mb-6 font-sans">
              Take photos or upload clear packaging images. You can add multiple medicine images to perform a combined safety check.
            </p>

            {/* Ingestion Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Camera Trigger */}
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-cyan-600 text-center flex flex-col items-center justify-center bg-slate-50/50">
                <Camera className="w-8 h-8 text-cyan-700 mb-2" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">Use Device Camera</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs">
                  Position your camera flat over the blister pack text.
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold px-4 h-9 cursor-pointer"
                >
                  Launch Camera Stream
                </Button>
              </div>

              {/* Upload Trigger */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-cyan-600 text-center flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">Upload Packaging Photo</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs">
                  Select image files from your computer or phone.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <Button variant="outline" className="border-slate-300 rounded-lg text-xs font-semibold px-4 h-9 pointer-events-none">
                  Select Images
                </Button>
              </div>
            </div>

            {/* Real-Time Live Camera Modal/Stream */}
            {isCameraActive && (
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-950 text-white mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <span className="text-xs font-mono uppercase text-cyan-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Live Camera Stream (Position Label Flat)
                  </span>
                  <button onClick={stopCamera} className="text-slate-400 hover:text-white text-xs">
                    Close Camera
                  </button>
                </div>
                <div className="relative max-w-md mx-auto aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-8 border border-cyan-400/60 rounded pointer-events-none" />
                </div>
                <div className="text-center mt-4">
                  <Button
                    onClick={captureCameraFrame}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg px-6 h-10"
                  >
                    Capture Packaging Photo
                  </Button>
                </div>
              </div>
            )}

            {/* Sample Presets to Test Real Clinical Cases */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
                Or pick verified packaging test cases (Instant Testing)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {SAMPLE_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => addSamplePreset(p.key)}
                    className="text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                      <span>{p.name}</span>
                      <Plus className="w-3.5 h-3.5 text-cyan-700" />
                    </div>
                    <p className="text-[11px] text-slate-500">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Uploaded Photos Queue */}
          {uploadedImages.length > 0 && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="text-sm font-bold text-slate-900">
                  Ready for Ingestion ({uploadedImages.length} Image{uploadedImages.length === 1 ? "" : "s"})
                </span>
                <span className="text-xs text-slate-500">Review images before OCR text extraction</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <img src={img.previewUrl} alt={img.name} className="w-full h-32 object-contain p-2" />
                    <div className="p-2 border-t border-slate-200 bg-white">
                      <p className="text-[11px] font-semibold text-slate-800 truncate">{img.name}</p>
                      <span className="text-[10px] font-mono text-slate-400 capitalize">{img.source}</span>
                    </div>
                    <button
                      onClick={() => removeUploadedImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-600 border border-slate-200 hover:bg-rose-50"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadedImages([])}
                  className="text-xs text-slate-600 rounded-lg"
                >
                  Clear All
                </Button>
                <Button
                  onClick={processImagesToCandidates}
                  disabled={isProcessingOcr}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 text-xs font-semibold h-10 cursor-pointer shadow-xs"
                >
                  {isProcessingOcr ? "Extracting Details via OCR..." : "Extract Medicine Details"}
                </Button>
              </div>
            </div>
          )}

          {/* Label Readability Instructions (Requirement 2) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-700" /> Instructions for Reliable Label Capture
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Ensure the active pharmaceutical ingredients and milligram strengths are sharp and readable.</li>
              <li>Avoid high-glare reflections off shiny blister foils; tilt slightly away from direct harsh lighting.</li>
              <li>Include the full blister pack or bottle label so dosage form (tablet, syrup, capsule) can be identified.</li>
            </ul>
          </div>
        </div>
      )}

      {/* STAGE 2: MEDICINE IDENTIFICATION AND VERIFICATION (Requirement 3) */}
      {stage === "verify" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2 mb-6">
              <div>
                <span className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded uppercase tracking-wide inline-block mb-1">
                  Step 2 of 4: Mandatory Human Verification
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Verify & Confirm Extracted Packaging Details
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Unconfirmed items cannot proceed silently
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Review every candidate medicine extracted by the AI vision pipeline. If any active salt, milligram strength, or dosage form was incorrectly transcribed, edit it before confirming.
            </p>

            {/* Candidate List */}
            <div className="space-y-4 mb-6">
              {candidateMedicines.map((cand) => {
                const isEditing = editingId === cand.id;
                const isVerified = cand.verificationStatus === "verified";

                return (
                  <div
                    key={cand.id}
                    className={`p-5 rounded-xl border transition-all ${isVerified
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-amber-300 bg-amber-50/20"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base text-slate-900 font-display">
                          {cand.brandName}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${isVerified
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {isVerified ? "Confirmed by You" : "Needs Your Confirmation"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">
                          OCR Confidence: {cand.confidence}%
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingId(isEditing ? null : cand.id)}
                          className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{isEditing ? "Done" : "Edit Details"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCandidate(cand.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      /* Editing Form */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-xs text-slate-600">Brand Name</Label>
                          <Input
                            value={cand.brandName}
                            onChange={(e) => updateCandidate(cand.id, { brandName: e.target.value })}
                            className="text-xs h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600">Active Salt / Ingredients</Label>
                          <Input
                            value={cand.activeIngredients.map((i) => i.name).join(", ")}
                            onChange={(e) =>
                              updateCandidate(cand.id, {
                                activeIngredients: e.target.value.split(",").map((name) => ({
                                  name: name.trim(),
                                  strength: cand.strength,
                                  amountMg: parseInt(cand.strength) || 500,
                                })),
                              })
                            }
                            className="text-xs h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600">Strength & Dosage Form</Label>
                          <Input
                            value={cand.strength}
                            onChange={(e) => updateCandidate(cand.id, { strength: e.target.value })}
                            className="text-xs h-9"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Read-Only Summary */
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Brand Name</span>
                          <span className="font-semibold text-slate-800">{cand.brandName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Active Ingredients</span>
                          <span className="font-semibold text-cyan-900">
                            {cand.activeIngredients.map((i) => `${i.name} (${i.strength})`).join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Strength & Form</span>
                          <span className="font-semibold text-slate-800">
                            {cand.strength} • {cand.dosageForm}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Verification</span>
                          <span className="font-medium text-slate-600">
                            {isVerified ? "Matches Packaging" : "Pending Approval"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Confirmation Button */}
                    {!isVerified && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-amber-800">
                          Please verify the packaging print matches the text above.
                        </span>
                        <Button
                          size="sm"
                          onClick={() => confirmCandidate(cand.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded-lg px-4 h-8 font-semibold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Confirm Details as Verified
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setStage("upload")}
                className="text-xs rounded-lg"
              >
                + Add Another Medicine Image
              </Button>

              <Button
                onClick={executeSafetyCheck}
                className="bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg px-7 text-xs font-semibold h-10 shadow-xs cursor-pointer"
              >
                Proceed to Multi-Medicine Safety Check ({candidateMedicines.length} Medicines)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: MULTIPLE-MEDICINE SAFETY CHECK RUNNING (Requirement 4) */}
      {stage === "checking" && (
        <div className="p-8 lg:p-12 rounded-2xl border border-slate-200 bg-white text-center max-w-xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center mx-auto animate-pulse">
            <Scan className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-display font-semibold text-slate-900 mb-1">
              Evaluating Multiple-Medicine Safety Rules
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Running deterministic checks against CDSCO & WHO reference tables...
            </p>
          </div>

          <div className="space-y-2 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
            <div className="flex items-center justify-between text-slate-600 pb-2 border-b border-slate-200">
              <span>Checking: {candidateMedicines.map((c) => c.brandName).join(", ")}</span>
              <span>{checkProgress.stepIndex} / {checkProgress.stepsTotal}</span>
            </div>
            <p className="text-cyan-800 font-bold animate-pulse pt-1">{checkProgress.currentStep}</p>
            {checkProgress.completed.map((comp, idx) => (
              <p key={idx} className="text-emerald-700 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{comp}</span>
              </p>
            ))}
          </div>

          <p className="text-[11px] text-slate-400">
            Please wait while active principles, single-dose thresholds, and interaction matrices are computed.
          </p>
        </div>
      )}

      {/* STAGE 4: STRUCTURED SAFETY RESULTS (Requirement 5) */}
      {stage === "results" && currentReport && (
        <div className="space-y-6">
          {/* Status Header Banner */}
          <div
            className={`p-6 lg:p-8 rounded-2xl border ${currentReport.status === "risk_detected"
                ? "border-rose-300 bg-rose-50/70"
                : currentReport.status === "no_known_issue"
                  ? "border-emerald-300 bg-emerald-50/70"
                  : "border-amber-300 bg-amber-50/70"
              }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentReport.status === "risk_detected"
                      ? "bg-rose-200 text-rose-800"
                      : currentReport.status === "no_known_issue"
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-amber-200 text-amber-800"
                    }`}
                >
                  {currentReport.status === "risk_detected" ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : currentReport.status === "no_known_issue" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <HelpCircle className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Report ID: {currentReport.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${currentReport.status === "risk_detected"
                          ? "bg-rose-200 text-rose-900"
                          : currentReport.status === "no_known_issue"
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-amber-200 text-amber-900"
                        }`}
                    >
                      {currentReport.status === "risk_detected"
                        ? "Potential Risk Detected"
                        : currentReport.status === "no_known_issue"
                          ? "No Known Conflict Found"
                          : "Verification Incomplete"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-slate-900 mb-1">
                    {currentReport.status === "risk_detected"
                      ? "Potential Medication Concern Identified"
                      : currentReport.status === "no_known_issue"
                        ? "No Known Issues Found in Completed Checks"
                        : "Verification Incomplete: Missing Information"}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {currentReport.status === "risk_detected"
                      ? "A configured deterministic safety rule flagged a duplicate ingredient or interaction concern. Review the clinical explanation below."
                      : currentReport.status === "no_known_issue"
                        ? "No matching issue was found in the supported checks that were completed. This does not guarantee that the combination is completely safe."
                        : "Some required details could not be verified. DawaLens does not calculate safety rules on ambiguous or unconfirmed active ingredients."}
                  </p>
                </div>
              </div>

              {/* Read Aloud Button (Requirement 13) */}
              <div className="shrink-0 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const speechText =
                      currentReport.status === "risk_detected"
                        ? `Warning: Potential risk detected. ${currentReport.findings.map((f) => f.explanation).join(" ")} Recommended next step: ${currentReport.findings[0]?.actionGuidance || "Consult your doctor."}`
                        : `Safety check completed. No known issue found in completed checks between ${currentReport.medicineNames.join(" and ")}. Please note this does not guarantee complete medication safety.`;
                    speakText(speechText, language);
                  }}
                  className="rounded-lg text-xs font-semibold h-9 flex items-center gap-1.5 bg-white border-slate-300"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                  <span>{isSpeaking ? "Speaking..." : "Read Aloud (Voice)"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Medicines Included & Active Ingredients */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Medicines Evaluated in This Check
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentReport.medicineNames.map((name, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{name}</span>
                  <span className="text-[10px] font-mono text-slate-500">Specimen #{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Findings List */}
          {currentReport.findings.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Clinical Findings
              </h4>
              {currentReport.findings.map((f) => (
                <div key={f.id} className="p-6 rounded-2xl border border-rose-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-rose-950 font-display">{f.title}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      Severity: {f.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {language === "hi" && f.explanationHi ? f.explanationHi : f.explanation}
                  </p>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">
                      Clinical Mechanism
                    </span>
                    <p className="text-slate-800 leading-relaxed">{f.clinicalMechanism}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-cyan-50/60 border border-cyan-200 text-xs">
                    <span className="text-[10px] font-mono uppercase text-cyan-900 block mb-0.5 font-bold">
                      Recommended Next Step
                    </span>
                    <p className="text-cyan-950 leading-relaxed font-medium">
                      {language === "hi" && f.actionGuidanceHi ? f.actionGuidanceHi : f.actionGuidance}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Evidence Reference: {f.evidenceSource}</span>
                    <span>Rule ID: {f.ruleId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checks Completed vs Checks Not Completed (Requirement 5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
              <span className="font-bold text-slate-900 block mb-1">Checks Completed Successfully:</span>
              <ul className="space-y-1 text-slate-600">
                {currentReport.checksCompleted.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
              <span className="font-bold text-slate-900 block mb-1">Checks Not Completed:</span>
              <ul className="space-y-1 text-slate-600">
                {currentReport.checksNotCompleted.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-cyan-800 hover:underline"
            >
              Access in Report History &rarr;
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={resetAll}
                className="rounded-lg text-xs font-semibold"
              >
                Scan Another Medicine
              </Button>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Return to Dashboard Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
