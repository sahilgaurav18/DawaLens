import io
import os
import pytest
from PIL import Image
from fastapi import UploadFile, HTTPException
from backend.app.services.image_service import ImageService


@pytest.fixture
def image_service_instance(tmp_path):
    return ImageService(temp_dir=str(tmp_path))


def create_mock_upload(filename: str, width: int = 100, height: int = 100, format: str = "JPEG", size_bytes: int = None):
    buf = io.BytesIO()
    if size_bytes:
        buf.write(b"A" * size_bytes)
    else:
        img = Image.new("RGB", (width, height), color=(255, 0, 0))
        img.save(buf, format=format)
    buf.seek(0)
    return UploadFile(filename=filename, file=buf)


def test_valid_image_upload(image_service_instance):
    mock_file = create_mock_upload("blister.jpg", width=200, height=150, format="JPEG")
    path, meta = image_service_instance.validate_and_save_upload(mock_file)

    assert os.path.exists(path)
    assert meta["width"] == 200
    assert meta["height"] == 150
    assert meta["format"] == "JPEG"

    image_service_instance.cleanup_file(path)
    assert not os.path.exists(path)


def test_invalid_extension_rejected(image_service_instance):
    mock_file = create_mock_upload("malicious.exe", size_bytes=500)
    with pytest.raises(HTTPException) as exc:
        image_service_instance.validate_and_save_upload(mock_file)
    assert exc.value.status_code == 400
    assert "Invalid file extension" in exc.value.detail


def test_corrupted_image_rejected(image_service_instance):
    mock_file = create_mock_upload("fake.jpg", size_bytes=500)  # Random bytes, not a real JPEG
    with pytest.raises(HTTPException) as exc:
        image_service_instance.validate_and_save_upload(mock_file)
    assert exc.value.status_code == 400
    assert "Corrupted or invalid" in exc.value.detail


def test_oversized_image_rejected(image_service_instance):
    # Create upload file simulating 20MB (>15MB ceiling)
    twenty_mb = 20 * 1024 * 1024
    mock_file = create_mock_upload("giant.jpg", size_bytes=twenty_mb)
    with pytest.raises(HTTPException) as exc:
        image_service_instance.validate_and_save_upload(mock_file)
    assert exc.value.status_code == 413
