/**
 * DawaLens API Client
 * Connects Next.js frontend to Python FastAPI clinical backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CandidateMedicineDto {
  id: string;
  brand_name: string;
  generic_name?: string;
  active_ingredients: {
    name: string;
    strength: string;
    amount_mg?: number;
  }[];
  strength: string;
  dosage_form: string;
  manufacturer?: string;
  confidence: number;
  verification_status: "verified" | "unconfirmed" | "edited";
  is_ambiguous: boolean;
  ambiguity_reason?: string;
}

export interface ScanUploadResponseDto {
  scan_id: string;
  created_at: string;
  status: string;
  image_count: number;
  inference_provider: string;
  candidate_medicines: CandidateMedicineDto[];
  uncertainty_notes: string[];
  message: string;
}

export interface SafetyFindingDto {
  id: string;
  type: "duplicate_ingredient" | "drug_interaction" | "dosage_ceiling" | "incomplete_data";
  title: string;
  severity: "high" | "moderate" | "low" | "advisory";
  medicines_involved: string[];
  ingredients_involved: string[];
  explanation: string;
  explanation_hi?: string;
  clinical_mechanism: string;
  action_guidance: string;
  action_guidance_hi?: string;
  evidence_source: string;
  rule_id: string;
}

export interface SafetyReportDto {
  report_id: string;
  checked_at: string;
  medicines_checked: string[];
  verification_status: string;
  overall_status: "RISK_DETECTED" | "NO_KNOWN_ISSUE_FOUND_IN_COMPLETED_CHECKS" | "VERIFICATION_INCOMPLETE";
  findings: SafetyFindingDto[];
  duplicate_ingredient_findings: SafetyFindingDto[];
  interaction_findings: SafetyFindingDto[];
  evidence_sources: string[];
  rule_versions: string[];
  checks_completed: string[];
  checks_failed_or_unavailable: string[];
  limitations: string[];
  recommended_next_steps: string[];
  patient_notes?: string;
}

export class DawaLensApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<{ status: string; database_status: string; gemma_service_status: string } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/health`, { method: "GET" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async uploadScanImages(files: File[]): Promise<ScanUploadResponseDto> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch(`${this.baseUrl}/api/v1/scans`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || `Upload failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async verifyCandidates(scanId: string, verifiedMedicines: any[]): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/scans/${scanId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verified_medicines: verifiedMedicines,
        patient_acknowledgement: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Verification failed" }));
      throw new Error(err.detail || `Verification failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async runSafetyCheck(medicines: any[], scanId?: string, patientNotes?: string): Promise<SafetyReportDto> {
    const payload = {
      scan_id: scanId || null,
      medicines: medicines.map((m) => ({
        id: m.id,
        brand_name: m.brandName || m.brand_name,
        generic_name: m.genericName || m.generic_name || "",
        active_ingredients: (m.activeIngredients || m.active_ingredients || []).map((ing: any) => ({
          name: ing.name,
          strength: ing.strength,
          amount_mg: ing.amountMg ?? ing.amount_mg ?? null,
        })),
        strength: m.strength,
        dosage_form: m.dosageForm || m.dosage_form || "Tablet",
        is_confirmed: m.verificationStatus === "verified" || m.verification_status === "verified" || m.is_confirmed === true,
      })),
      patient_notes: patientNotes || null,
    };

    const res = await fetch(`${this.baseUrl}/api/v1/safety-checks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Safety check failed" }));
      throw new Error(err.detail || `Safety check failed with HTTP ${res.status}`);
    }

    return await res.json();
  }

  async getReports(status?: string, search?: string): Promise<SafetyReportDto[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const url = `${this.baseUrl}/api/v1/reports${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch reports");
    return await res.json();
  }

  async getReportById(reportId: string): Promise<SafetyReportDto> {
    const res = await fetch(`${this.baseUrl}/api/v1/reports/${reportId}`, { method: "GET" });
    if (!res.ok) throw new Error(`Report ${reportId} not found`);
    return await res.json();
  }

  async searchMedicines(query: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/medicines/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
  }

  async getReferenceSources(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/reference/sources`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch reference sources");
    return await res.json();
  }
}

export const apiClient = new DawaLensApiClient();
