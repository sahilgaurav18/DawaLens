import io
from PIL import Image


def create_test_image_bytes():
    buf = io.BytesIO()
    img = Image.new("RGB", (150, 100), color=(0, 128, 255))
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.getvalue()


def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["database_status"] == "ONLINE"
    assert data["active_rules_count"] >= 2


def test_complete_scan_to_report_pipeline(client):
    img_bytes = create_test_image_bytes()

    # Step 1: Upload packaging image
    files = [("files", ("crocin_strip.jpg", img_bytes, "image/jpeg"))]
    scan_resp = client.post("/api/v1/scans", files=files)
    assert scan_resp.status_code == 200
    scan_data = scan_resp.json()
    scan_id = scan_data["scan_id"]
    assert scan_data["status"] == "pending_verification"
    assert len(scan_data["candidate_medicines"]) == 1
    cand = scan_data["candidate_medicines"][0]
    assert cand["verification_status"] == "unconfirmed"

    # Step 2: Fetch scan session details
    detail_resp = client.get(f"/api/v1/scans/{scan_id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["scan_id"] == scan_id

    # Step 3: Human Verification Gate (user confirms details)
    verify_payload = {
        "verified_medicines": [
            {
                "id": cand["id"],
                "brand_name": cand["brand_name"],
                "generic_name": cand["generic_name"],
                "active_ingredients": cand["active_ingredients"],
                "strength": cand["strength"],
                "dosage_form": cand["dosage_form"],
                "is_confirmed": True,
            }
        ],
        "patient_acknowledgement": True,
    }
    verify_resp = client.post(f"/api/v1/scans/{scan_id}/verify", json=verify_payload)
    assert verify_resp.status_code == 200
    assert verify_resp.json()["status"] == "SUCCESS"

    # Step 4: Submit multi-medicine check (Crocin + Combiflam)
    check_payload = {
        "scan_id": scan_id,
        "medicines": [
            {
                "id": "med-1",
                "brand_name": "Crocin 650",
                "active_ingredients": [{"name": "Paracetamol", "strength": "650mg", "amount_mg": 650.0}],
                "strength": "650 mg",
                "dosage_form": "Tablet",
                "is_confirmed": True,
            },
            {
                "id": "med-2",
                "brand_name": "Combiflam",
                "active_ingredients": [
                    {"name": "Ibuprofen", "strength": "400mg", "amount_mg": 400.0},
                    {"name": "Paracetamol", "strength": "325mg", "amount_mg": 325.0},
                ],
                "strength": "400 mg + 325 mg",
                "dosage_form": "Tablet",
                "is_confirmed": True,
            },
        ],
        "patient_notes": "Prescribed concurrently by two separate clinics.",
    }
    check_resp = client.post("/api/v1/safety-checks", json=check_payload)
    assert check_resp.status_code == 200
    report_data = check_resp.json()
    assert report_data["overall_status"] == "RISK_DETECTED"
    assert len(report_data["duplicate_ingredient_findings"]) == 1
    assert "Paracetamol" in report_data["duplicate_ingredient_findings"][0]["title"]
    report_id = report_data["report_id"]

    # Step 5: Fetch report by ID
    get_report_resp = client.get(f"/api/v1/reports/{report_id}")
    assert get_report_resp.status_code == 200
    assert get_report_resp.json()["report_id"] == report_id

    # Step 6: Query reports archive
    list_reports_resp = client.get("/api/v1/reports")
    assert list_reports_resp.status_code == 200
    assert len(list_reports_resp.json()) >= 1


def test_medicine_search_endpoint(client):
    resp = client.get("/api/v1/medicines/search?q=crocin")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_found"] >= 1
    assert data["medicines"][0]["brand_name"] == "Crocin 650"


def test_reference_sources_endpoint(client):
    resp = client.get("/api/v1/reference/sources")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["sources"]) >= 3
    assert any("National Formulary of India" in s["source_name"] for s in data["sources"])
