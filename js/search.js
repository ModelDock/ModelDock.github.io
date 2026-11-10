/**
 * ModelDock Documentation - Client-Side Search Engine
 */

(function () {
  const searchIndex = [
    {
      title: "ModelDock Overview & Hero",
      url: "index.html",
      snippet: "Universal Local AI Docking Station & Native Windows Platform. Run models locally on CPU & GPU with ~35MB RAM footprint."
    },
    {
      title: "Why ModelDock?",
      url: "index.html#why-modeldock",
      snippet: "Compare ~35MB WebView2 footprint against heavy 600MB-1.5GB Electron runtimes. Standalone llama.cpp engine."
    },
    {
      title: "Getting Started & System Requirements",
      url: "getting-started.html",
      snippet: "Windows 10/11 x64 requirements, Python 3.10+, and standalone engine prerequisites."
    },
    {
      title: "1-Click Installation (Install.bat)",
      url: "getting-started.html#installation",
      snippet: "Register ModelDock to Windows Start Menu, Desktop shortcuts, and Windows Add/Remove Programs."
    },
    {
      title: "Desktop Application vs Web Interface",
      url: "getting-started.html#launching",
      snippet: "Run Launch-Desktop.bat for Edge WebView2 native app or run.bat for browser UI at localhost:7860."
    },
    {
      title: "Core Features: Ultra-Low RAM Footprint",
      url: "features.html#low-ram",
      snippet: "~35 MB RAM idle footprint leaves 95%+ of system memory free for large model context and weight offloading."
    },
    {
      title: "Core Features: Standalone Engine (Zero Daemon)",
      url: "features.html#zero-daemon",
      snippet: "Bundled standalone llama.cpp server binaries. No external background service or Docker required."
    },
    {
      title: "Core Features: Resumable Downloads",
      url: "features.html#resumable-downloads",
      snippet: "True pause and resume via HTTP Range headers for multi-gigabyte GGUF model files from Hugging Face."
    },
    {
      title: "Core Features: Multi-Modal & Attachments",
      url: "features.html#attachments",
      snippet: "Attach PDFs, text documents, and images directly into chat with visual synthesis and OCR extraction."
    },
    {
      title: "Model Hub: Hugging Face Hub Integration",
      url: "model-hub.html#huggingface",
      snippet: "Live search HF models, inspect quantization tiers (Q4_K_M, Q5_K_M, Q8_0), and stream downloads."
    },
    {
      title: "Model Hub: Gated Models & HF Tokens",
      url: "model-hub.html#gated-models",
      snippet: "Authenticate with Hugging Face access token to download Llama 3, Gemma 2, and Mistral gated models."
    },
    {
      title: "Model Hub: Ollama Registry & Local GGUF Import",
      url: "model-hub.html#ollama-gguf",
      snippet: "Pull from Ollama registry or 1-click dock existing local .gguf files into your ModelDock catalog."
    },
    {
      title: "Hardware Acceleration: NVIDIA CUDA & CPU Offload",
      url: "hardware-acceleration.html",
      snippet: "Auto-detect NVIDIA RTX GPUs, offload transformer layers to VRAM, and configure multi-core CPU threads."
    },
    {
      title: "OpenAI-Compatible Local API (/v1)",
      url: "api-reference.html",
      snippet: "Drop-in OpenAI API compatibility for Cursor, VS Code Continue, OpenWebUI, Cline, LangChain, and AutoGen."
    },
    {
      title: "OpenAI API: Streaming Chat Completions",
      url: "api-reference.html#chat-completions",
      snippet: "POST /v1/chat/completions with SSE token-by-token streaming response and performance telemetry."
    },
    {
      title: "Internal REST API Endpoints",
      url: "rest-endpoints.html",
      snippet: "Comprehensive API reference for /api/system/status, /api/models, /api/downloads, and /api/settings."
    },
    {
      title: "Architecture & Technical Deep Dive",
      url: "architecture.html",
      snippet: "FastAPI async core, WebView2 native shell, GGUF metadata parser, and memory layout breakdown."
    },
    {
      title: "Troubleshooting & FAQ",
      url: "faq.html",
      snippet: "Port 7860 conflicts, CUDA DLL missing fixes, Hugging Face 401 unauthorized errors, and FAQ."
    }
  ];

  function createSearchModal() {
    const backdrop = document.createElement('div');
    backdrop.id = 'search-modal-backdrop';
    backdrop.className = 'search-modal-backdrop';
    backdrop.innerHTML = `
      <div class="search-modal" role="dialog" aria-modal="true">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="modal-search-input" class="search-input" placeholder="Search documentation, API endpoints, guides..." autocomplete="off">
          <button id="modal-close-btn" class="icon-btn" style="width:28px;height:28px;border:none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="modal-search-results" class="search-results">
          <div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.875rem;">
            Type a keyword to search ModelDock documentation...
          </div>
        </div>
        <div class="search-footer">
          <span>Navigate with <kbd class="kbd-shortcut">↑</kbd> <kbd class="kbd-shortcut">↓</kbd></span>
          <span>Select <kbd class="kbd-shortcut">↵</kbd></span>
          <span>Close <kbd class="kbd-shortcut">ESC</kbd></span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const backdrop = createSearchModal();
    const searchInput = document.getElementById('modal-search-input');
    const resultsContainer = document.getElementById('modal-search-results');
    const closeBtn = document.getElementById('modal-close-btn');
    let selectedIndex = -1;

    function openModal() {
      backdrop.classList.add('open');
      searchInput.value = '';
      selectedIndex = -1;
      renderResults([]);
      setTimeout(() => searchInput.focus(), 50);
    }

    function closeModal() {
      backdrop.classList.remove('open');
    }

    // Trigger buttons
    document.querySelectorAll('.search-trigger').forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    // Global keyboard shortcut (Ctrl+K, Cmd+K, or '/')
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('open')) {
          closeModal();
        } else {
          openModal();
        }
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !backdrop.classList.contains('open')) {
        e.preventDefault();
        openModal();
      }
    });

    // Fuzzy search
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      selectedIndex = -1;
      if (!q) {
        resultsContainer.innerHTML = `
          <div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.875rem;">
            Type a keyword to search ModelDock documentation...
          </div>`;
        return;
      }

      const words = q.split(/\s+/);
      const matches = searchIndex.filter(item => {
        const text = (item.title + " " + item.snippet).toLowerCase();
        return words.every(word => text.includes(word));
      });

      renderResults(matches);
    });

    function renderResults(matches) {
      if (matches.length === 0 && searchInput.value.trim()) {
        resultsContainer.innerHTML = `
          <div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.875rem;">
            No documentation matching "<strong>${escapeHtml(searchInput.value)}</strong>" found.
          </div>`;
        return;
      }

      resultsContainer.innerHTML = matches.map((item, index) => `
        <a href="${item.url}" class="search-result-item" data-index="${index}">
          <div class="search-result-title">${escapeHtml(item.title)}</div>
          <div class="search-result-snippet">${escapeHtml(item.snippet)}</div>
        </a>
      `).join('');
    }

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      const items = resultsContainer.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else if (items.length > 0) {
          items[0].click();
        }
      }
    });

    function updateSelection(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }

    function escapeHtml(str) {
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }
  });
})();
