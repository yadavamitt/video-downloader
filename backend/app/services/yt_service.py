import subprocess
import os
import time

def download_video(url: str, format: str = "mp4") -> str:
    timestamp = str(int(time.time()))
    output_path = f"temp/video_{timestamp}.{format}"
    command = ["yt-dlp", "-f", "best", "-o", output_path, url]

    subprocess.run(command, check=True)
    return output_path
