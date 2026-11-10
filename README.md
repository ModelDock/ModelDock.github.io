# ⚓ ModelDock Official Documentation Website

This directory contains the complete, self-contained documentation website for **ModelDock** (Universal Local AI Docking Station & Native Windows Platform).

Designed for zero-dependency hosting on **GitHub Pages** (`username.github.io` or `username.github.io/repo-name`).

---

## 🚀 How to Deploy as a Separate Repository on GitHub Pages

Follow these simple steps in your terminal to initialize and deploy this website to GitHub Pages:

### Step 1: Open Terminal in this Folder
```bash
cd ModelDockdoc
```

### Step 2: Initialize Git & Commit Files
```bash
git init
git add .
git commit -m "Initial commit: ModelDock documentation website"
git branch -M main
```

### Step 3: Link to your GitHub Repository
Create a new public repository on [GitHub](https://github.com/new) (e.g. named `modeldock-docs` or `ModelDockdoc`), then run:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** &rarr; **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` and folder `/ (root)`
   - Click **Save**.
4. In ~1-2 minutes, GitHub will publish your documentation live at:
   👉 **`https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`**

*(Alternatively, you can choose **GitHub Actions** under Build and deployment, and the included `.github/workflows/deploy.yml` workflow will automatically deploy on every push!)*

---

## 💻 Local Preview

To preview the documentation locally on your machine before pushing:
- Double-click **`preview.bat`** (or run `python -m http.server 8080`)
- Your browser will open **`http://localhost:8080`**

---

## 🗂️ Website Structure

```text
ModelDockdoc/
├── .github/workflows/deploy.yml  # Automated GitHub Actions deployment workflow
├── .nojekyll                     # Tells GitHub Pages not to run Jekyll parser
├── preview.bat                   # 1-Click local server for testing
├── index.html                    # Homepage, Hero, Advantages & Comparison Table
├── getting-started.html          # Windows 10/11 Installation, Launching Modes
├── features.html                 # ~35MB RAM, Standalone llama.cpp, Resumable Downloads
├── model-hub.html                # Hugging Face live search, Gated tokens, Ollama pulls
├── hardware-acceleration.html   # NVIDIA CUDA auto-offload & CPU multi-threading
├── api-reference.html            # OpenAI-compatible /v1 endpoints & tool setups
├── rest-endpoints.html           # Full REST API telemetry, model & download specs
├── architecture.html             # System design, WebView2, process lifecycle
├── faq.html                      # Troubleshooting, CUDA fixes, port conflicts, FAQ
├── css/
│   ├── main.css                  # Dark-first modern design system & layout
│   └── prism.css                 # Code syntax highlighting
├── js/
│   ├── main.js                   # Theme toggle, sidebar drawer, scroll-spy, copy buttons
│   └── search.js                 # Fast client-side fuzzy search (Ctrl+K / Cmd+K)
└── assets/images/
    ├── logo.svg                  # Vector brand icon
    └── logo.png                  # High-res raster icon
```

---

## 📄 License

The documentation is open-source and licensed under the [Apache 2.0 License](../LICENSE).
