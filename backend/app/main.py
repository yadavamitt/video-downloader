
from datetime import datetime
import os
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp

TEMP_DIR = "temp"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://video-downloader-three-umber.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    video_url: str


@app.get("/")
def read_root():
    return {"message": "Backend is up and running 🚀"}

# @app.post("/formats")
# def get_formats(data: VideoURL):
#     ydl_opts = {
#         'quiet': True,
#         'skip_download': True,
#         'simulate': True,
#         'forcejson': True
#     }

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(data.video_url, download=False)
#         formats = [
#             {
#                 'format_id': f['format_id'],
#                 'format_note': f.get('format_note'),
#                 'resolution': f.get('resolution'),
#                 'ext': f.get('ext')
#             }
#             for f in info.get('formats', [])
#             if f.get('acodec') != 'none' and f.get('vcodec') != 'none'
#         ]
#     return { "formats": formats }

# @app.post("/download")
# async def download(request: Request):
#     form = await request.form()
#     url = form['video_url']
#     fmt = form.get('format_id')

#     ydl_opts = {
#         'format': fmt,
#         'outtmpl': 'video.%(ext)s'
#     }

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(url, download=True)
#         filename = ydl.prepare_filename(info)

#     return FileResponse(filename, filename="video.mp4", media_type="video/mp4")

@app.post("/formats")
def get_formats(data: VideoURL):
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'simulate': True,
        'forcejson': True,
        'nocheckcertificate': True,
        'geo_bypass': True,
        'geo_bypass_country': 'US',
        'force_ipv4': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(data.video_url, download=False)
            formats = [
                {
                    'format_id': f['format_id'],
                    'format_note': f.get('format_note'),
                    'resolution': f.get('resolution'),
                    'ext': f.get('ext')
                }
                for f in info.get('formats', [])
                if f.get('acodec') != 'none' and f.get('vcodec') != 'none'
            ]
        return {"formats": formats}
    except Exception as e:
        return {"error": str(e)}
    
    
@app.post("/download")
async def download(request: Request, background_tasks: BackgroundTasks):
    form = await request.form()
    url = form['video_url']
    fmt = form.get('format_id')

    # 🕒 Generate timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_template = os.path.join(TEMP_DIR, f"video_{timestamp}.%(ext)s")

    ydl_opts = {
        'format': fmt,
        'outtmpl': output_template,
        'nocheckcertificate': True,
        'geo_bypass': True,
        'geo_bypass_country': 'US',
        'force_ipv4': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filepath = ydl.prepare_filename(info)

        # 🧽 Cleanup after sending
        background_tasks.add_task(os.remove, filepath)

        return FileResponse(filepath, filename=os.path.basename(filepath), media_type="video/mp4")
    except Exception as e:
        return {"error": str(e)}


# @app.post("/download")
# async def download(request: Request, background_tasks: BackgroundTasks):
#     form = await request.form()
#     url = form['video_url']
#     fmt = form.get('format_id')

#     # 🕒 Generate timestamped filename
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     output_template = os.path.join(TEMP_DIR, f"video_{timestamp}.%(ext)s")

#     ydl_opts = {
#         'format': fmt,
#         'outtmpl': output_template
#     }

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(url, download=True)
#         filepath = ydl.prepare_filename(info)

#     # 🧽 Cleanup after sending
#     background_tasks.add_task(os.remove, filepath)

#     return FileResponse(filepath, filename=os.path.basename(filepath), media_type="video/mp4")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)


# from fastapi import FastAPI, Form, Request, BackgroundTasks
# from fastapi.responses import FileResponse, JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import yt_dlp
# import os
# from datetime import datetime

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# TEMP_DIR = "temp"
# os.makedirs(TEMP_DIR, exist_ok=True)

# class VideoURL(BaseModel):
#     video_url: str

# # @app.post("/formats")
# # def get_formats(data: VideoURL):
# #     ydl_opts = {
# #         'quiet': True,
# #         'skip_download': True,
# #         'simulate': True,
# #         'forcejson': True
# #     }

# #     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
# #         info = ydl.extract_info(data.video_url, download=False)
# #         formats = [
# #             {
# #                 'format_id': f['format_id'],
# #                 'format_note': f.get('format_note'),
# #                 'resolution': f.get('resolution'),
# #                 'ext': f.get('ext')
# #             }
# #             for f in info.get('formats', [])
# #             if f.get('acodec') != 'none' and f.get('vcodec') != 'none'
# #         ]
# #     return { "formats": formats }


# # # this was being used
# # @app.post("/formats")
# # def get_formats(data: VideoURL):
# #     ydl_opts = {
# #         'quiet': True,
# #         'skip_download': True,
# #         'simulate': True,
# #         'forcejson': True
# #     }

# #     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
# #         info = ydl.extract_info(data.video_url, download=False)
# #         formats = [
# #             {
# #                 'format_id': f['format_id'],
# #                 'format_note': f.get('format_note'),
# #                 'resolution': f.get('resolution'),
# #                 'ext': f.get('ext')
# #             }
# #             for f in info.get('formats', [])
# #             if f.get('acodec') != 'none' and f.get('vcodec') != 'none'
# #         ]

# #     return {
# #         "platform": info.get("extractor_key"),
# #         "title": info.get("title"),
# #         "formats": formats
# #     }

# @app.post("/formats")
# async def get_formats(video_url: str = Form(...)):
#     ydl_opts = {
#         "quiet": True,
#         "skip_download": True,
#         "force_generic_extractor": False,
#     }

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(video_url, download=False)

#     thumbnail = info.get("thumbnail")

#     # Handle image post
#     if not info.get("formats"):
#         return JSONResponse({
#             "is_image": True,
#             "image_url": info.get("url"),
#             "ext": info.get("ext") or "jpg",
#             "thumbnail": thumbnail,
#             "filesize": info.get("filesize") or 0,
#         })

#     # Handle video
#     formats = [
#         {
#             "format_id": f["format_id"],
#             "resolution": f.get("resolution") or f.get("format_note"),
#             "ext": f["ext"],
#             "filesize": f.get("filesize") or 0
#         }
#         for f in info["formats"]
#         if f.get("vcodec") != "none"  # Filter only video formats
#     ]

#     return {
#         "is_image": False,
#         "formats": formats,
#         "thumbnail": thumbnail,
#     }

# @app.post("/download")
# async def download(request: Request, background_tasks: BackgroundTasks):
#     form = await request.form()
#     url = form['video_url']
#     fmt = form.get('format_id')

#     # 🕒 Generate timestamped filename
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     output_template = os.path.join(TEMP_DIR, f"video_{timestamp}.%(ext)s")

#     ydl_opts = {
#         'format': fmt,
#         'outtmpl': output_template
#     }

#     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#         info = ydl.extract_info(url, download=True)
#         filepath = ydl.prepare_filename(info)

#     # 🧽 Cleanup after sending
#     background_tasks.add_task(os.remove, filepath)

#     return FileResponse(filepath, filename=os.path.basename(filepath), media_type="video/mp4")
