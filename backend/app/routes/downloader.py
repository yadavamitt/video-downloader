from fastapi import APIRouter, Form
from fastapi.responses import FileResponse
from app.services.yt_service import download_video

router = APIRouter()

@router.post("/download")
def download(video_url: str = Form(...), format: str = Form("mp4")):
    file_path = download_video(video_url, format)
    return FileResponse(file_path, filename=file_path.split("/")[-1])
