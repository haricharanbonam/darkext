# 🌑 DarkExt — Light Theme Warning Extension

**DarkExt (PostPrint)** is a Chrome extension that detects bright/light-themed pages and warns you before you enter the full flashbang experience.  
It gives you a quick option to darken the page instantly or continue as-is.

---

## ✨ Features

- ⚠️ **Light Theme Detection** on page load
- 🛡️ **Warning Overlay + Bottom Alert Bar** before entering bright pages
- 🌑 **One-Click Dark Mode** using visual inversion + color correction
- 🎛️ **Floating Dark Toggle** after entry
- 🧲 **Draggable Toggle Button** so you can place it anywhere on screen
- ⚡ **Runs Early (`document_start`)** for immediate protection

---

## 📸 Preview

<img src="https://github.com/user-attachments/assets/477a193e-c14c-4700-b753-e6249e571d65" alt="DarkExt preview" />

---

## 🚀 Installation (Load Unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.

---

## 📂 Project Structure

```bash
darkext/
├── manifest.json   # Extension configuration (MV3)
├── content.js      # Detection + warning UI + dark mode logic
├── style.css       # Warning bar and floating toggle styles
└── public/
    └── image.png
```

---

Built with ❤️ by [Hari Charan](https://github.com/haricharanbonam)
