import { setupDownloader } from "./dom";

setupDownloader(); // ✅ Sets up your video downloader logic

const mainContainer = document.getElementById("main-container") as HTMLElement;

if (mainContainer) {
  mainContainer.style.display = "flex"; // Enable flexbox
  mainContainer.style.flexDirection = "column"; // Stack elements vertically
  mainContainer.style.justifyContent = "center"; // Center vertically
  mainContainer.style.alignItems = "center"; // Center horizontally
  mainContainer.style.minHeight = "100vh"; // Full viewport height
  mainContainer.style.textAlign = "center"; // Center text
}

const input = document.getElementById("video-url") as HTMLInputElement;

if (input) {
  input.style.width = "80%";
  input.style.maxWidth = "420px";
  input.style.padding = "5px 12px";
  input.style.fontSize = "-0.8rem";
  input.style.borderRadius = "8px";
  input.style.border = "2px solid #ccc";
}

const fetchBtn = document.getElementById("fetch-btn") as HTMLButtonElement;

if (fetchBtn) {
  fetchBtn.style.padding = "12px 24px";
  fetchBtn.style.fontSize = "1.1rem";
  fetchBtn.style.backgroundColor = "#007bff";
  fetchBtn.style.color = "white";
  fetchBtn.style.border = "none";
  fetchBtn.style.borderRadius = "8px";
  fetchBtn.style.cursor = "pointer";
  fetchBtn.style.marginTop = "12px";
  fetchBtn.style.transition = "background-color 0.3s ease, transform 0.2s ease";

  // Optional hover/active effects with event listeners
  fetchBtn.addEventListener("mouseenter", () => {
    fetchBtn.style.backgroundColor = "#0056b3";
    fetchBtn.style.transform = "scale(1.03)";
  });

  fetchBtn.addEventListener("mouseleave", () => {
    fetchBtn.style.backgroundColor = "#007bff";
    fetchBtn.style.transform = "scale(1)";
  });

  fetchBtn.addEventListener("mousedown", () => {
    fetchBtn.style.backgroundColor = "#004494";
    fetchBtn.style.transform = "scale(0.97)";
  });

  fetchBtn.addEventListener("mouseup", () => {
    fetchBtn.style.backgroundColor = "#0056b3";
    fetchBtn.style.transform = "scale(1.03)";
  });
}

// Style the Download button
const downloadBtn = document.getElementById(
  "download-btn"
) as HTMLButtonElement;

if (downloadBtn) {
  downloadBtn.style.padding = "12px 24px";
  downloadBtn.style.fontSize = "1.1rem";
  downloadBtn.style.backgroundColor = "#28a745"; // green
  downloadBtn.style.color = "white";
  downloadBtn.style.border = "none";
  downloadBtn.style.borderRadius = "8px";
  downloadBtn.style.cursor = "pointer";
  downloadBtn.style.marginTop = "12px";
  downloadBtn.style.transition =
    "background-color 0.3s ease, transform 0.2s ease";

  downloadBtn.addEventListener("mouseenter", () => {
    downloadBtn.style.backgroundColor = "#218838";
    downloadBtn.style.transform = "scale(1.03)";
  });

  downloadBtn.addEventListener("mouseleave", () => {
    downloadBtn.style.backgroundColor = "#28a745";
    downloadBtn.style.transform = "scale(1)";
  });

  downloadBtn.addEventListener("mousedown", () => {
    downloadBtn.style.backgroundColor = "#1e7e34";
    downloadBtn.style.transform = "scale(0.97)";
  });

  downloadBtn.addEventListener("mouseup", () => {
    downloadBtn.style.backgroundColor = "#218838";
    downloadBtn.style.transform = "scale(1.03)";
  });
}

// Style the quality select dropdown
const qualitySelect = document.getElementById(
  "quality-select"
) as HTMLSelectElement;

if (qualitySelect) {
  qualitySelect.style.width = "80%";
  qualitySelect.style.maxWidth = "400px";
  qualitySelect.style.padding = "10px 14px";
  qualitySelect.style.fontSize = "1.1rem";
  qualitySelect.style.border = "2px solid #ccc";
  qualitySelect.style.borderRadius = "8px";
  qualitySelect.style.marginTop = "12px";
  qualitySelect.style.boxSizing = "border-box";
}
