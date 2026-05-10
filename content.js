// ─────────────────────────────────────────────
//  FLASHBANG BLOCKER — GOV EDITION
// ─────────────────────────────────────────────

// Dim overlay — covers the page while bar is visible
const overlay = document.createElement("div");
overlay.id = "page-dim-overlay";
document.documentElement.appendChild(overlay);

// Bottom warning bar
const blocker = document.createElement("div");
blocker.id = "flashbang-blocker";
blocker.innerHTML = `
  <div class="gov-terminal">
    <div class="gov-left">
      <span class="gov-icon flicker">⚠️</span>
      <div class="gov-text">
        <span class="gov-title">LIGHT THEME DETECTED</span>
        <span class="gov-sub">☀️ Blinding white background ahead &nbsp;·&nbsp; 👁️ Proceed with caution</span>
      </div>
    </div>
    <div class="gov-btn-row">
      <button id="gov-btn-dark">🌑 Make It Dark</button>
      <button id="gov-btn-enter">Enter Anyway</button>
    </div>
  </div>
`;
document.documentElement.appendChild(blocker);

// ─────────────────────────────────────────────
//  BRIGHTNESS ANALYSIS
// ─────────────────────────────────────────────

function getBrightness(rgb) {
  const v = rgb.match(/\d+/g);
  if (!v) return 255;
  const [r, g, b] = v.map(Number);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function dismiss() {
  blocker.remove();
  overlay.remove();
}

function analyzePage() {
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
  const brightness = Math.max(getBrightness(bodyBg), getBrightness(htmlBg));

  if (brightness < 180) {
    // Already dark — no warning needed
    blocker.remove();
    overlay.remove();
    injectColorToggle(false);
    return;
  }

  // Light site — wire up buttons
  document.getElementById("gov-btn-enter").onclick = () => {
    dismiss();
    injectColorToggle(false);
  };

  document.getElementById("gov-btn-dark").onclick = () => {
    applyDark();
    dismiss();
    injectColorToggle(true);
  };
}

// ─────────────────────────────────────────────
//  DARK MODE
// ─────────────────────────────────────────────

let darkActive = false;

function applyDark() {
  // invert + hue-rotate restores natural colors, brightness(0.85) reduces white intensity
  document.documentElement.style.filter = "invert(1) hue-rotate(180deg) brightness(0.85)";
  darkActive = true;
}

function removeDark() {
  document.documentElement.style.filter = "";
  darkActive = false;
}

// ─────────────────────────────────────────────
//  FLOATING TOGGLE — draggable + expandable
// ─────────────────────────────────────────────

function injectColorToggle(startActive) {
  const toggle = document.createElement("div");
  toggle.id = "color-toggle-btn";
  toggle.innerHTML = `
    <span class="ctb-icon">${startActive ? "🌑" : "🌗"}</span>
    <span class="ctb-label">${startActive ? "Dark On" : "Dark Mode"}</span>
  `;
  if (startActive) toggle.classList.add("active");
  document.documentElement.appendChild(toggle);

  // ── Drag logic ──────────────────────────────
  let isDragging = false;
  let hasDragged = false;
  let dragStartX, dragStartY, elemStartX, elemStartY;

  toggle.addEventListener("mousedown", (e) => {
    isDragging = true;
    hasDragged = false;
    const rect = toggle.getBoundingClientRect();
    elemStartX = rect.left;
    elemStartY = rect.top;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    // Switch to absolute left/top so we can drag freely
    toggle.style.right = "auto";
    toggle.style.left = elemStartX + "px";
    toggle.style.top = elemStartY + "px";
    toggle.style.transition = "opacity 0.2s, box-shadow 0.2s, background 0.25s, border-color 0.25s";
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged = true;
    const newLeft = Math.max(0, Math.min(window.innerWidth - 50, elemStartX + dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - 50, elemStartY + dy));
    toggle.style.left = newLeft + "px";
    toggle.style.top = newTop + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = "";
    toggle.style.transition = "";
  });

  // ── Click to toggle dark mode ──────────────
  toggle.addEventListener("click", () => {
    if (hasDragged) return;
    const icon = toggle.querySelector(".ctb-icon");
    const label = toggle.querySelector(".ctb-label");
    if (darkActive) {
      removeDark();
      icon.textContent = "🌗";
      label.textContent = "Dark Mode";
      toggle.classList.remove("active");
    } else {
      applyDark();
      icon.textContent = "🌑";
      label.textContent = "Dark On";
      toggle.classList.add("active");
    }
  });
}

// ─────────────────────────────────────────────
//  BOOT — run as early as possible
// ─────────────────────────────────────────────

// Don't wait for window.load (slow — waits for all images/scripts).
// Check immediately if body exists, otherwise fire at DOMContentLoaded.
if (document.body) {
  analyzePage();
} else {
  document.addEventListener("DOMContentLoaded", analyzePage);
}