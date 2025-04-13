// thisis working
export function setupDownloader() {
  const input = document.getElementById("video-url") as HTMLInputElement;
  const fetchBtn = document.getElementById("fetch-btn") as HTMLButtonElement;
  const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
  const qualitySelect = document.getElementById("quality-select") as HTMLSelectElement;
  const status = document.getElementById("status") as HTMLParagraphElement;

  const API_BASE = import.meta.env.VITE_API_BASE;

  fetchBtn.addEventListener("click", async () => {
    const url = input.value.trim();
    if (!url) return alert("Please enter a URL");
    status.textContent = "Fetching formats...";

    try {
      const res = await fetch(`${API_BASE}/formats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: url }),
      });

      const data = await res.json();

      if (!res.ok || !data.formats.length) throw new Error("No formats found");

      qualitySelect.innerHTML = "";
      data.formats.forEach((fmt: any) => {
        const option = document.createElement("option");
        option.value = fmt.format_id;
        option.textContent = `${fmt.resolution || fmt.format_note} (${fmt.ext})`;
        qualitySelect.appendChild(option);
      });

      qualitySelect.style.display = "inline-block";
      downloadBtn.style.display = "inline-block";
      status.textContent = "Select quality and download";
    } catch (err) {
      status.textContent = "❌ Error fetching formats";
      console.error(err);
    }
  });

  downloadBtn.addEventListener("click", async () => {
    const url = input.value.trim();
    const format_id = qualitySelect.value;

    if (!url || !format_id) return alert("URL or format missing");
    status.textContent = "Downloading...";

    const formData = new FormData();
    formData.append("video_url", url);
    formData.append("format_id", format_id);

    try {
      const res = await fetch(`${API_BASE}/download`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "video.mp4";
      a.click();

      // Reset UI
      input.value = "";
      qualitySelect.innerHTML = "";
      qualitySelect.style.display = "none";
      downloadBtn.style.display = "none";
      status.textContent = "✅ Download complete!";
    } catch (err) {
      status.textContent = "❌ Error downloading";
      console.error(err);
    }
  });
}

// export function setupDownloader() {
//   const input = document.getElementById("video-url") as HTMLInputElement;
//   const fetchBtn = document.getElementById("fetch-btn") as HTMLButtonElement;
//   const thumbnail = document.getElementById("thumbnail") as HTMLImageElement;
//   const downloadBtn = document.getElementById(
//     "download-btn"
//   ) as HTMLButtonElement;
//   const qualitySelect = document.getElementById(
//     "quality-select"
//   ) as HTMLSelectElement;
//   const formatSelect = document.getElementById(
//     "image-format"
//   ) as HTMLSelectElement;
//   const spinner = document.getElementById("spinner") as HTMLDivElement;
//   const status = document.getElementById("status") as HTMLParagraphElement;

//   fetchBtn.addEventListener("click", async () => {
//     const url = input.value.trim();
//     if (!url) return alert("Please enter a URL");

//     status.textContent = "Fetching formats...";
//     spinner.style.display = "block";

//     try {
//       const res = await fetch("http://localhost:8000/formats", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ video_url: url }),
//       });

//       const data = await res.json();
//       spinner.style.display = "none";

//       // Thumbnail
//       if (data.thumbnail) {
//         thumbnail.src = data.thumbnail;
//         thumbnail.style.display = "block";
//       } else {
//         thumbnail.style.display = "none";
//       }

//       // 🖼️ If it's an image (Instagram, etc)
//       if (data.is_image) {
//         formatSelect.style.display = "inline-block";
//         downloadBtn.style.display = "inline-block";

//         downloadBtn.onclick = () => {
//           const selectedFormat = formatSelect.value;
//           const img = new Image();
//           img.crossOrigin = "anonymous";
//           img.src = data.image_url;

//           img.onload = () => {
//             const canvas = document.createElement("canvas");
//             canvas.width = img.naturalWidth;
//             canvas.height = img.naturalHeight;
//             const ctx = canvas.getContext("2d");
//             ctx?.drawImage(img, 0, 0);

//             canvas.toBlob((blob) => {
//               if (!blob) return;

//               const url = URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = url;
//               a.download = `image_${Date.now()}.${
//                 selectedFormat.includes("png") ? "png" : "jpg"
//               }`;
//               a.click();

//               // Reset
//               input.value = "";
//               formatSelect.style.display = "none";
//               downloadBtn.style.display = "none";
//               thumbnail.style.display = "none";
//               status.textContent = `✅ Image downloaded (${selectedFormat})`;
//             }, selectedFormat);
//           };
//         };

//         status.textContent = "Select image format and download";
//         return;
//       }

//       // 🎥 Video Handling
//       qualitySelect.innerHTML = "";

//       let bestFormatId = "";
//       let bestRes = 0;

//       // data.formats.forEach((fmt: any) => {
//       //   const res = parseInt(fmt.resolution) || 0;
//       //   if (res > bestRes) {
//       //     bestRes = res;
//       //     bestFormatId = fmt.format_id;
//       //   }

//       //   const sizeMB =
//       //     fmt.filesize && fmt.filesize > 0
//       //       ? (fmt.filesize / 1024 / 1024).toFixed(1) + " MB"
//       //       : "Unknown size";

//       //   const option = document.createElement("option");
//       //   option.value = fmt.format_id;
//       //   option.textContent = `${fmt.resolution || fmt.format_note} (${
//       //     fmt.ext
//       //   }) - ${sizeMB}`;
//       //   qualitySelect.appendChild(option);
//       // });

//       data.formats.forEach((fmt: any) => {
//         if (!fmt.filesize) return; // Skip unknown size

//         const res = parseInt(fmt.resolution) || 0;
//         if (res > bestRes) {
//           bestRes = res;
//           bestFormatId = fmt.format_id;
//         }

//         const option = document.createElement("option");
//         option.value = fmt.format_id;
//         const sizeMB = (fmt.filesize / 1024 / 1024).toFixed(1) + " MB";
//         option.textContent = `${fmt.resolution || fmt.format_note} (${
//           fmt.ext
//         }) - ${sizeMB}`;
//         qualitySelect.appendChild(option);
//       });

//       qualitySelect.value = bestFormatId;
//       qualitySelect.style.display = "inline-block";
//       downloadBtn.style.display = "inline-block";
//       formatSelect.style.display = "none";
//       status.textContent = "Select quality and download";
//     } catch (err) {
//       spinner.style.display = "none";
//       status.textContent = "❌ Error fetching formats";
//       console.error(err);
//     }
//   });

//   downloadBtn.addEventListener("click", async () => {
//     const url = input.value.trim();
//     const format_id = qualitySelect.value;
//     if (!url || !format_id) return alert("URL or format missing");

//     status.textContent = "Downloading...";
//     spinner.style.display = "block";

//     const formData = new FormData();
//     formData.append("video_url", url);
//     formData.append("format_id", format_id);

//     try {
//       const res = await fetch("http://localhost:8000/download", {
//         method: "POST",
//         body: formData,
//       });

//       spinner.style.display = "none";
//       if (!res.ok) throw new Error("Failed to download");

//       const blob = await res.blob();
//       const downloadUrl = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = `video_${Date.now()}.mp4`;
//       a.click();

//       input.value = "";
//       thumbnail.style.display = "none";
//       qualitySelect.innerHTML = "";
//       qualitySelect.style.display = "none";
//       downloadBtn.style.display = "none";
//       status.textContent = "✅ Download complete!";
//     } catch (err) {
//       spinner.style.display = "none";
//       status.textContent = "❌ Error downloading";
//       console.error(err);
//     }
//   });
// }
