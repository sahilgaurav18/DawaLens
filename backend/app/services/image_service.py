import io
import os
import shutil
from typing import List, Tuple
from PIL import Image, UnidentifiedImageError
from fastapi import UploadFile, HTTPException
from backend.app.core.config import settings
from backend.app.core.security import sanitize_filename, validate_file_extension


class ImageService:
    def __init__(self, temp_dir: str = settings.TEMP_UPLOAD_DIR):
        self.temp_dir = temp_dir
        os.makedirs(self.temp_dir, exist_ok=True)

    def validate_and_save_upload(self, file: UploadFile) -> Tuple[str, dict]:
        """
        Validates the upload file size, extension, MIME type, and Pillow binary integrity.
        Saves securely into temp_dir and returns the file path and image metadata.
        """
        # 1. Extension check
        if not validate_file_extension(file.filename or ""):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file extension. Allowed formats: {', '.join(settings.ALLOWED_IMAGE_TYPES)}",
            )

        # 2. Read bytes with size ceiling
        contents = file.file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds maximum allowable size of {settings.MAX_UPLOAD_SIZE_MB}MB.",
            )

        if len(contents) < 100:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty or corrupted (under minimum file size).",
            )

        # 3. Pillow Image Integrity Verification
        try:
            image = Image.open(io.BytesIO(contents))
            image_format = image.format
            image_width, image_height = image.size
            # Verify internal structure
            image.verify()
        except (UnidentifiedImageError, Exception) as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Corrupted or invalid image file: {str(exc)}",
            )

        allowed_formats = {"JPEG", "PNG", "WEBP", "MPO"}
        if image_format and image_format.upper() not in allowed_formats:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image encoding: {image_format}. Please upload JPEG, PNG, or WebP.",
            )

        # 4. Save securely to temporary storage with randomized sanitized name
        safe_name = sanitize_filename(file.filename or "packaging.jpg")
        target_path = os.path.join(self.temp_dir, safe_name)
        with open(target_path, "wb") as f:
            f.write(contents)

        metadata = {
            "original_filename": file.filename,
            "saved_filename": safe_name,
            "format": image_format,
            "width": image_width,
            "height": image_height,
            "size_bytes": len(contents),
        }
        return target_path, metadata

    def cleanup_file(self, file_path: str):
        """Safely removes temporary image file."""
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass

    def cleanup_files(self, file_paths: List[str]):
        """Safely removes a list of temporary files."""
        for path in file_paths:
            self.cleanup_file(path)


image_service = ImageService()
