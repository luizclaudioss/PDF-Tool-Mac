const { PDFDocument, degrees } = PDFLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";

        const SVG_ICONS = {
          merge: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="13" height="16" rx="2"/><path d="M4 6v14a2 2 0 0 0 2 2h12"/><path d="M12 8v4"/><path d="M10 10h4"/></svg>`,
          split: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
          rotate: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          remove: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
          pdf2jpg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
          jpg2pdf: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1.5"/><path d="m14 17-2-2-4 4h10z"/></svg>`,
          compress: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6m0 0v6m0-6L3 21"/><path d="M20 10h-6m0 0V4m0 6 7-7"/></svg>`,
          protect: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          watermark: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7.12 12.88 6 11.5 6S9 7.12 9 8.5V13"/></svg>`,
          file: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
          image: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
          lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          unlock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
          eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
          eyeOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
          rotateCw: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          rotateCcw: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
          trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
          restore: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
          chevronLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
          chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
          close: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
          check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
          sign: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`,
          zoomIn: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
          redact: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>`,
          ocr: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><line x1="9" x2="15" y1="9" y2="9"/><line x1="12" x2="12" y1="9" y2="15"/><line x1="9" x2="15" y1="15" y2="15"/></svg>`,
          annotate: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4-14 14H4v-4L18 2z"/><path d="m14.5 5.5 4 4"/><circle cx="8" cy="18" r="2"/></svg>`,
          forms: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/><path d="M9 7h6"/><path d="M9 17h6"/></svg>`
        };

        const TOOLS = [
          {
            id: "merge",
            category: "organize",
            icon: SVG_ICONS.merge,
            title: "Combinar PDF",
            desc: "Combine vários PDFs em um único arquivo, na ordem que quiser.",
          },
          {
            id: "split",
            category: "organize",
            icon: SVG_ICONS.split,
            title: "Extrair páginas",
            desc: "Selecione páginas específicas e extraia-as em um novo PDF.",
          },
          {
            id: "rotate",
            category: "organize",
            icon: SVG_ICONS.rotate,
            title: "Girar PDF",
            desc: "Gire páginas do seu PDF 90°, 180° ou 270°.",
          },
          {
            id: "remove",
            category: "organize",
            icon: SVG_ICONS.remove,
            title: "Remover páginas",
            desc: "Escolha quais páginas remover do PDF.",
          },
          {
            id: "compress",
            category: "convert",
            icon: SVG_ICONS.compress,
            title: "Comprimir PDF",
            desc: "Reduza o tamanho do seu arquivo PDF mantendo boa qualidade visual.",
          },
          {
            id: "protect",
            category: "security",
            icon: SVG_ICONS.protect,
            title: "Proteger / Desproteger",
            desc: "Adicione senha de abertura ao PDF ou remova a proteção existente.",
          },
          {
            id: "redact",
            category: "security",
            icon: SVG_ICONS.redact,
            title: "Tarjar Dados Sensíveis",
            desc: "Oculte permanentemente dados confidenciais (CPF, nomes, valores) do PDF.",
          },
          {
            id: "watermark",
            category: "security",
            icon: SVG_ICONS.watermark,
            title: "Marca d'Água e Numeração",
            desc: "Adicione carimbo com texto personalizado ou numere as páginas do seu PDF.",
          },
          {
            id: "sign",
            category: "security",
            icon: SVG_ICONS.sign,
            title: "Assinar PDF",
            desc: "Desenhe sua assinatura ou importe imagem e posicione no documento.",
          },
          {
            id: "ocr",
            category: "content",
            icon: SVG_ICONS.ocr,
            title: "OCR & Extrair Texto",
            desc: "Reconheça e extraia textos de PDFs escaneados com motor Apple Vision.",
          },
          {
            id: "annotate",
            category: "content",
            icon: SVG_ICONS.annotate,
            title: "Carimbos & Textos",
            desc: "Aplique carimbos oficiais (Aprovado, Pago, Confidencial) e textos livres.",
          },
          {
            id: "forms",
            category: "content",
            icon: SVG_ICONS.forms,
            title: "Preencher Formulário",
            desc: "Preencha formulários interativos (AcroForms) e congele as respostas.",
          },
          {
            id: "pdf2jpg",
            category: "convert",
            icon: SVG_ICONS.pdf2jpg,
            title: "PDF para JPG",
            desc: "Converta cada página do PDF em uma imagem JPG.",
          },
          {
            id: "jpg2pdf",
            category: "convert",
            icon: SVG_ICONS.jpg2pdf,
            title: "JPG para PDF",
            desc: "Converta uma ou mais imagens em um único PDF.",
          },
        ];

        let currentCategory = "all";
        let currentToolId = null;

        function renderHome() {
          document.body.classList.add("on-home");
          const grid = document.getElementById("tool-grid");
          if (!grid) return;
          const filtered = currentCategory === "all" ? TOOLS : TOOLS.filter((t) => t.category === currentCategory);

          grid.innerHTML = filtered.map(
            (t) => `
    <div class="tool-card" id="card-${t.id}" data-id="${t.id}" onclick="openTool('${t.id}')">
      <div class="icon">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
    </div>
  `,
          ).join("");

          // Suporte completo a Drag & Drop direto nos cards
          grid.querySelectorAll(".tool-card").forEach((card) => {
            const toolId = card.dataset.id;
            card.addEventListener("dragenter", (e) => {
              e.preventDefault();
              card.classList.add("drag-active");
            });
            card.addEventListener("dragover", (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
              card.classList.add("drag-active");
            });
            card.addEventListener("dragleave", (e) => {
              e.preventDefault();
              if (!card.contains(e.relatedTarget)) {
                card.classList.remove("drag-active");
              }
            });
            card.addEventListener("drop", (e) => {
              e.preventDefault();
              card.classList.remove("drag-active");
              if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                openTool(toolId);
                setTimeout(() => {
                  if (window.currentDropzoneHandler) {
                    window.currentDropzoneHandler([file]);
                  }
                }, 100);
              }
            });
          });
        }
        renderHome();

        // Configuração das abas/pills de categorias
        function setupCategoryPills() {
          const bar = document.getElementById("category-filter-bar");
          if (!bar) return;
          bar.querySelectorAll(".category-pill").forEach((btn) => {
            btn.addEventListener("click", () => {
              bar.querySelectorAll(".category-pill").forEach((b) => b.classList.remove("active"));
              btn.classList.add("active");
              currentCategory = btn.dataset.category || "all";
              renderHome();
            });
          });
        }
        setupCategoryPills();

        function goHome() {
          if (currentPasswordPrompt) currentPasswordPrompt.cancel();
          const overlay = document.getElementById("save-toast-overlay");
          if (overlay) overlay.classList.add("hidden");
          currentActiveStatusEl = null;
          currentSaveBtn = null;
          currentToolId = null;
          window.currentDropzoneHandler = null;
          document.body.classList.add("on-home");
          document.getElementById("home-screen").style.display = "block";
          document.getElementById("workspace").classList.remove("active");
          document.getElementById("workspace-content").innerHTML = "";
        }

        function openTool(id) {
          currentToolId = id;
          document.body.classList.remove("on-home");
          document.getElementById("home-screen").style.display = "none";
          const ws = document.getElementById("workspace");
          ws.classList.add("active");

          const toolObj = TOOLS.find((t) => t.id === id);
          const labelEl = document.getElementById("current-tool-label");
          if (labelEl && toolObj) {
            labelEl.textContent = toolObj.title;
          }

          const content = document.getElementById("workspace-content");
          content.innerHTML = "";
          if (RENDERERS[id]) {
            RENDERERS[id](content);
          }
        }

        window.toggleToolSwitcher = function (event) {
          if (event) event.stopPropagation();
          const menu = document.getElementById("tool-switcher-menu");
          if (!menu) return;
          if (menu.classList.contains("hidden")) {
            menu.innerHTML = TOOLS.map(
              (t) => `
              <button type="button" class="tool-switcher-item ${t.id === currentToolId ? "active" : ""}" onclick="switchTool('${t.id}')">
                <span style="display:inline-flex;align-items:center;width:16px;height:16px;">${t.icon}</span>
                <span>${t.title}</span>
              </button>
            `,
            ).join("");
            menu.classList.remove("hidden");
          } else {
            menu.classList.add("hidden");
          }
        };

        window.switchTool = function (id) {
          const menu = document.getElementById("tool-switcher-menu");
          if (menu) menu.classList.add("hidden");
          if (id === currentToolId) return;
          openTool(id);
        };

        document.addEventListener("click", (e) => {
          const menu = document.getElementById("tool-switcher-menu");
          if (menu && !menu.classList.contains("hidden")) {
            if (!e.target.closest("#tool-switcher-dropdown")) {
              menu.classList.add("hidden");
            }
          }
        });

        function hexToRgb(hex) {
          let c = (hex || "#dc2626").replace("#", "").trim();
          if (c.length === 3) {
            c = c.split("").map((x) => x + x).join("");
          }
          const num = parseInt(c, 16);
          if (isNaN(num)) return { r: 220, g: 38, b: 38 };
          return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255,
          };
        }

        function getBaseFilename(filename, fallback = "documento") {
          if (!filename) return fallback;
          const dot = filename.lastIndexOf(".");
          if (dot <= 0) return filename;
          return filename.substring(0, dot);
        }

        function makeDropzone(
          container,
          { multiple, accept, label },
          onFiles,
        ) {
          window.currentDropzoneHandler = onFiles;
          const dz = document.createElement("div");
          dz.className = "dropzone";

          const labelText = document.createElement("div");
          labelText.className = "dropzone-label";
          labelText.innerHTML = `<strong>Clique para selecionar</strong> ou arraste ${label || "o arquivo"} aqui`;
          dz.appendChild(labelText);

          const input = document.createElement("input");
          input.type = "file";
          input.className = "dropzone-input";
          input.multiple = !!multiple;
          input.accept = accept || "application/pdf";
          dz.appendChild(input);

          input.addEventListener("change", () => {
            if (input.files && input.files.length > 0) {
              const selected = Array.from(input.files);
              input.value = "";
              onFiles(selected);
            }
          });

          dz.addEventListener("click", () => {
            input.value = "";
            input.click();
          });

          dz.addEventListener("dragover", (e) => {
            e.preventDefault();
            dz.classList.add("dragover");
          });
          dz.addEventListener("dragleave", () =>
            dz.classList.remove("dragover"),
          );
          dz.addEventListener("drop", (e) => {
            e.preventDefault();
            dz.classList.remove("dragover");
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              input.value = "";
              onFiles(Array.from(e.dataTransfer.files));
            }
          });
          container.appendChild(dz);
          return dz;
        }

        function statusEl(container) {
          const s = document.createElement("div");
          s.className = "status";
          container.appendChild(s);
          return s;
        }

        function setStatus(el, msg, type) {
          el.textContent = msg;
          el.className = "status" + (type ? " " + type : "");
        }

        function blobToBase64(blob) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result || "";
              const base64 = dataUrl.split(",")[1] || "";
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }

        // ---------- Descriptografia e Desbloqueio Nativo de PDFs com Senha ----------
        const decryptCallbacks = {};
        let decryptCallbackIdCounter = 0;

        function nativeDecryptPdf(buffer, password) {
          return new Promise(async (resolve, reject) => {
            if (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.nativeDecryptPdf) {
              reject(new Error("Descriptografia nativa não disponível nesta plataforma."));
              return;
            }
            const callbackId = "dec_" + (++decryptCallbackIdCounter);
            decryptCallbacks[callbackId] = { resolve, reject };

            try {
              const base64 = await blobToBase64(new Blob([buffer], { type: "application/pdf" }));
              window.webkit.messageHandlers.nativeDecryptPdf.postMessage({
                data: base64,
                password: password,
                callbackId: callbackId
              });
            } catch (e) {
              delete decryptCallbacks[callbackId];
              reject(e);
            }
          });
        }

        window.onNativeDecryptResult = function(callbackId, success, dataBase64, error) {
          const cb = decryptCallbacks[callbackId];
          if (!cb) return;
          delete decryptCallbacks[callbackId];

          if (success && dataBase64) {
            try {
              const binary = atob(dataBase64);
              const len = binary.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              cb.resolve(bytes.buffer);
            } catch (e) {
              cb.reject(new Error("Falha ao decodificar documento desbloqueado."));
            }
          } else {
            cb.reject(new Error(error || "Senha incorreta."));
          }
        };

        // ---------- OCR e Reconhecimento de Texto com Apple Vision e Fallback ----------
        const ocrCallbacks = {};
        let ocrCallbackIdCounter = 0;

        function nativeOcrPdf(buffer) {
          return new Promise(async (resolve, reject) => {
            if (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.nativeOcr) {
              try {
                const textResult = await extractPdfTextFallback(buffer);
                resolve(textResult);
              } catch (err) {
                reject(new Error("OCR nativo indisponível nesta plataforma: " + err.message));
              }
              return;
            }
            const callbackId = "ocr_" + (++ocrCallbackIdCounter);
            ocrCallbacks[callbackId] = { resolve, reject, buffer };

            try {
              const base64 = await blobToBase64(new Blob([buffer], { type: "application/pdf" }));
              window.webkit.messageHandlers.nativeOcr.postMessage({
                data: base64,
                callbackId: callbackId
              });
            } catch (e) {
              delete ocrCallbacks[callbackId];
              reject(e);
            }
          });
        }

        window.onNativeOcrResult = function(callbackId, success, dataBase64, error) {
          const cb = ocrCallbacks[callbackId];
          if (!cb) return;
          delete ocrCallbacks[callbackId];

          if (success && dataBase64) {
            try {
              const binary = atob(dataBase64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              const jsonStr = new TextDecoder().decode(bytes);
              const parsed = JSON.parse(jsonStr);
              cb.resolve(parsed);
            } catch (e) {
              cb.reject(new Error("Falha ao decodificar resultado do OCR."));
            }
          } else {
            // Em caso de erro, tenta fallback
            if (cb.buffer) {
              extractPdfTextFallback(cb.buffer).then(cb.resolve).catch(cb.reject);
            } else {
              cb.reject(new Error(error || "Erro no processo de OCR."));
            }
          }
        };

        async function extractPdfTextFallback(buffer) {
          const doc = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
          const results = [];
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const lines = content.items.map(item => item.str).filter(Boolean);
            results.push({
              page: i,
              text: lines.join(" ")
            });
          }
          return results;
        }

        let currentPasswordPrompt = null;

        function requestPdfPasswordModal(fileName, buffer) {
          return new Promise((resolve) => {
            const overlay = document.getElementById("password-modal-overlay");
            const filenameEl = document.getElementById("password-modal-filename");
            const input = document.getElementById("password-modal-input");
            const eyeBtn = document.getElementById("password-modal-toggle-eye");
            const errorEl = document.getElementById("password-modal-error");
            const cancelBtn = document.getElementById("password-modal-cancel");
            const submitBtn = document.getElementById("password-modal-submit");
            const form = document.getElementById("password-modal-form");

            filenameEl.textContent = `O arquivo "${fileName}" está protegido por senha. Digite a senha para continuar:`;
            input.value = "";
            input.type = "password";
            eyeBtn.innerHTML = SVG_ICONS.eye;
            input.classList.remove("input-error");
            errorEl.textContent = "";
            errorEl.classList.add("hidden");
            submitBtn.disabled = false;
            submitBtn.textContent = "Desbloquear";

            overlay.classList.remove("hidden");
            setTimeout(() => input.focus(), 80);

            let resolved = false;

            function cleanup() {
              overlay.classList.add("hidden");
              eyeBtn.onclick = null;
              cancelBtn.onclick = null;
              form.onsubmit = null;
              currentPasswordPrompt = null;
            }

            eyeBtn.onclick = (e) => {
              e.preventDefault();
              input.type = input.type === "password" ? "text" : "password";
              eyeBtn.innerHTML = input.type === "password" ? SVG_ICONS.eye : SVG_ICONS.eyeOff;
            };

            cancelBtn.onclick = () => {
              if (resolved) return;
              resolved = true;
              cleanup();
              resolve(null);
            };

            form.onsubmit = async (e) => {
              e.preventDefault();
              const pwd = input.value;
              if (!pwd) {
                errorEl.textContent = "Por favor, digite a senha do arquivo.";
                errorEl.classList.remove("hidden");
                input.classList.add("input-error");
                input.focus();
                return;
              }

              submitBtn.disabled = true;
              submitBtn.textContent = "Desbloqueando...";
              errorEl.classList.add("hidden");
              input.classList.remove("input-error");

              try {
                const decryptedBuffer = await nativeDecryptPdf(buffer, pwd);
                resolved = true;
                cleanup();
                resolve(decryptedBuffer);
              } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Desbloquear";
                errorEl.textContent = err.message || "Senha incorreta. Verifique e tente novamente.";
                errorEl.classList.remove("hidden");
                input.classList.add("input-error");
                input.select();
                input.focus();
              }
            };

            currentPasswordPrompt = {
              cancel: () => {
                if (!resolved) {
                  resolved = true;
                  cleanup();
                  resolve(null);
                }
              }
            };
          });
        }

        // Cache de arquivos desbloqueados nesta sessão (evita pedir senha novamente caso o usuário importe o mesmo arquivo em outra ferramenta)
        const unlockedFilesCache = new Map();

        function getFileCacheKey(file) {
          return `${file.name}_${file.size}_${file.lastModified}`;
        }

        async function ensurePdfFileUnlocked(file, statusEl) {
          const cacheKey = getFileCacheKey(file);
          if (unlockedFilesCache.has(cacheKey)) {
            const cached = unlockedFilesCache.get(cacheKey);
            if (statusEl) setStatus(statusEl, "");
            return { file: cached.file, buffer: cached.buffer.slice(0) };
          }

          let buf = await readAsArrayBuffer(file);
          try {
            const testTask = pdfjsLib.getDocument({ data: buf.slice(0) });
            await testTask.promise;
            return { file, buffer: buf };
          } catch (err) {
            const isEncrypted = err.name === "PasswordException" ||
              (err.message && err.message.toLowerCase().includes("password"));
            if (!isEncrypted) {
              throw err;
            }

            if (statusEl) {
              setStatus(statusEl, "Aguardando senha para desbloqueio...", "");
            }
            const decryptedBuffer = await requestPdfPasswordModal(file.name, buf);
            if (!decryptedBuffer) {
              if (statusEl) {
                setStatus(statusEl, "Desbloqueio cancelado. Selecione ou arraste um arquivo para tentar novamente.", "");
              }
              return null;
            }

            if (statusEl) {
              setStatus(statusEl, "");
            }

            const cleanFile = new File([decryptedBuffer], file.name, { type: "application/pdf" });
            const result = { file: cleanFile, buffer: decryptedBuffer };
            unlockedFilesCache.set(cacheKey, result);
            return { file: cleanFile, buffer: decryptedBuffer.slice(0) };
          }
        }

        // Estado e controle de salvamento nativo macOS
        let currentActiveStatusEl = null;
        let currentSaveBtn = null;

        function prepareSaveAction(statusEl, btn) {
          currentActiveStatusEl = statusEl;
          currentSaveBtn = btn;
        }

        function openNativeFile(path) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeOpenFile) {
            window.webkit.messageHandlers.nativeOpenFile.postMessage({ path: path });
          }
        }

        function revealNativeFile(path) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeRevealFile) {
            window.webkit.messageHandlers.nativeRevealFile.postMessage({ path: path });
          }
        }

        function closeToastAndGoHome() {
          const overlay = document.getElementById("save-toast-overlay");
          if (overlay) overlay.classList.add("hidden");
          const toast = document.getElementById("save-toast");
          if (toast && toast.hideTimeout) clearTimeout(toast.hideTimeout);
          goHome();
        }

        function renderSavedFileSuccess({ filename, fullPath, isFolder, count, container }) {
          // Limpa qualquer mensagem de status inline anterior
          const targetContainer = container || currentActiveStatusEl;
          if (targetContainer) {
            targetContainer.innerHTML = "";
            targetContainer.className = "status";
          }

          // Modal Toast na frente com Overlay
          const overlay = document.getElementById("save-toast-overlay");
          const toast = document.getElementById("save-toast");
          if (toast && overlay) {
            toast.innerHTML = "";

            const meta = document.createElement("div");
            meta.className = "saved-file-meta";

            const badge = document.createElement("div");
            badge.className = "saved-file-badge";
            badge.innerHTML = SVG_ICONS.check;
            meta.appendChild(badge);

            const textWrap = document.createElement("div");
            textWrap.className = "saved-file-text";

            const statusTitle = document.createElement("div");
            statusTitle.className = "saved-file-status";
            statusTitle.textContent = isFolder ? "Salvo com sucesso!" : "Arquivo salvo!";
            textWrap.appendChild(statusTitle);

            const pathLabel = document.createElement("div");
            pathLabel.className = "saved-file-path";
            pathLabel.textContent = filename || (fullPath ? fullPath.split("/").pop() : "");
            pathLabel.title = fullPath || filename;
            textWrap.appendChild(pathLabel);
            meta.appendChild(textWrap);
            toast.appendChild(meta);

            const btns = document.createElement("div");
            btns.className = "saved-file-buttons";

            if (!isFolder && fullPath) {
              const openBtn = document.createElement("button");
              openBtn.className = "btn-open-file";
              openBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> <span>Abrir</span>`;
              openBtn.onclick = () => {
                openNativeFile(fullPath);
                closeToastAndGoHome();
              };
              btns.appendChild(openBtn);
            }

            if (fullPath) {
              const revealBtn = document.createElement("button");
              revealBtn.className = "btn-reveal-file";
              revealBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> <span>${isFolder ? "Pasta" : "Finder"}</span>`;
              revealBtn.onclick = () => {
                revealNativeFile(fullPath);
                closeToastAndGoHome();
              };
              btns.appendChild(revealBtn);
            }

            const closeBtn = document.createElement("button");
            closeBtn.className = "toast-close-btn";
            closeBtn.innerHTML = SVG_ICONS.close;
            closeBtn.title = "Fechar e voltar ao início";
            closeBtn.onclick = () => closeToastAndGoHome();
            btns.appendChild(closeBtn);

            toast.appendChild(btns);
            overlay.classList.remove("hidden");
          }
        }

        async function triggerDownload(blob, filename) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeSave) {
            try {
              const base64 = await blobToBase64(blob);
              window.webkit.messageHandlers.nativeSave.postMessage({
                filename: filename,
                data: base64
              });
              return;
            } catch (err) {
              console.warn("Erro no salvamento nativo macOS:", err);
            }
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 3000);
          if (currentActiveStatusEl) {
            renderSavedFileSuccess({ filename, fullPath: null, isFolder: false });
          }
        }

        async function triggerEncryptedDownload(blob, filename, password) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeSaveEncrypted) {
            try {
              const base64 = await blobToBase64(blob);
              window.webkit.messageHandlers.nativeSaveEncrypted.postMessage({
                filename: filename,
                data: base64,
                password: password
              });
              return;
            } catch (err) {
              console.warn("Erro no salvamento com senha nativo macOS:", err);
            }
          }
          await triggerDownload(blob, filename);
        }

        async function triggerBatchDownload(files) {
          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeSaveBatch) {
            try {
              const payload = [];
              for (const item of files) {
                const base64 = await blobToBase64(item.blob);
                payload.push({ filename: item.filename, data: base64 });
              }
              window.webkit.messageHandlers.nativeSaveBatch.postMessage({ files: payload });
              return;
            } catch (err) {
              console.warn("Erro no salvamento em lote macOS:", err);
            }
          }
          for (let i = 0; i < files.length; i++) {
            await triggerDownload(files[i].blob, files[i].filename);
            if (i < files.length - 1) await new Promise((r) => setTimeout(r, 250));
          }
        }

        async function readAsArrayBuffer(file) {
          return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsArrayBuffer(file);
          });
        }

        const RENDERERS = {};

        // ---------- Sistema de arraste manual (mouse/touch), mais confiável que o drag nativo do navegador ----------
        const DRAG = { id: null, list: null, render: null };

        document.addEventListener("pointermove", (e) => {
          if (DRAG.id === null) return;
          const elem = document.elementFromPoint(
            e.clientX,
            e.clientY,
          );
          const targetThumb = elem && elem.closest(".thumb");
          if (!targetThumb) return;
          const toId = targetThumb.dataset.id;
          if (toId === undefined || String(toId) === String(DRAG.id))
            return;
          const arr = DRAG.list;
          const fromIdx = arr.findIndex(
            (x) => String(x.id) === String(DRAG.id),
          );
          const toIdx = arr.findIndex(
            (x) => String(x.id) === String(toId),
          );
          if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx)
            return;
          const [moved] = arr.splice(fromIdx, 1);
          arr.splice(toIdx, 0, moved);
          DRAG.render();
        });
        document.addEventListener("pointerup", () => {
          if (DRAG.id !== null) {
            DRAG.id = null;
            document.body.classList.remove("dragging-cursor");
            if (DRAG.render) DRAG.render();
          }
        });
        document.addEventListener("pointercancel", () => {
          DRAG.id = null;
          document.body.classList.remove("dragging-cursor");
        });

        function makeThumbDraggable(thumb, entry, list, renderFn) {
          thumb.classList.add("drag-handle");
          thumb.addEventListener("pointerdown", (e) => {
            if (e.target.closest("button")) return;
            e.preventDefault();
            DRAG.id = entry.id;
            DRAG.list = list;
            DRAG.render = renderFn;
            document.body.classList.add("dragging-cursor");
          });
          if (String(DRAG.id) === String(entry.id)) {
            thumb.classList.add("dragging-active");
          }
        }

        // ---------- JUNTAR PDF ----------
        RENDERERS.merge = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.merge}</span> Combinar PDF</h2><p class="hint">Adicione dois ou mais PDFs. Arraste os cartões (ou use as setas) para definir a ordem final antes de unir.</p>`;
          let files = []; // { file, id, pageCount, thumbUrl }
          let uid = 0;

          const thumbsEl = document.createElement("div");
          thumbsEl.className = "thumbs file-cards";

          async function makeCoverThumb(file, initialBuffer) {
            try {
              const buf = initialBuffer ? initialBuffer.slice(0) : await readAsArrayBuffer(file);
              const pdf = await pdfjsLib.getDocument({ data: buf })
                .promise;
              const page = await pdf.getPage(1);
              const viewport = page.getViewport({ scale: 0.4 });
              const canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              await page.render({
                canvasContext: canvas.getContext("2d"),
                viewport,
              }).promise;
              return {
                url: canvas.toDataURL("image/png"),
                pageCount: pdf.numPages,
              };
            } catch (e) {
              console.warn("Erro ao gerar miniatura do arquivo:", e);
              return { url: null, pageCount: "?" };
            }
          }

          function renderList() {
            thumbsEl.innerHTML = "";
            files.forEach((entry, i) => {
              const thumb = document.createElement("div");
              thumb.className = "thumb";
              thumb.dataset.id = entry.id;

              if (entry.thumbUrl) {
                const img = document.createElement("img");
                img.src = entry.thumbUrl;
                img.draggable = false;
                thumb.appendChild(img);
              } else {
                const ph = document.createElement("div");
                ph.style.display = "flex";
                ph.style.alignItems = "center";
                ph.style.justifyContent = "center";
                ph.style.height = "120px";
                ph.style.color = "var(--ink-secondary)";
                ph.innerHTML = SVG_ICONS.file;
                thumb.appendChild(ph);
              }

              const num = document.createElement("div");
              num.className = "page-num";
              num.textContent = `${i + 1}. ${entry.file.name} (${entry.pageCount} pág.)`;
              thumb.appendChild(num);

              const moveWrap = document.createElement("div");
              moveWrap.style.display = "flex";
              moveWrap.style.justifyContent = "center";
              moveWrap.style.gap = "4px";
              moveWrap.style.paddingBottom = "8px";
              const leftBtn = document.createElement("button");
              leftBtn.className = "order-btn";
              leftBtn.innerHTML = SVG_ICONS.chevronLeft;
              leftBtn.title = "Mover para a esquerda";
              leftBtn.disabled = i === 0;
              leftBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === 0) return;
                [files[i - 1], files[i]] = [files[i], files[i - 1]];
                renderList();
              });
              const rightBtn = document.createElement("button");
              rightBtn.className = "order-btn";
              rightBtn.innerHTML = SVG_ICONS.chevronRight;
              rightBtn.title = "Mover para a direita";
              rightBtn.disabled = i === files.length - 1;
              rightBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === files.length - 1) return;
                [files[i + 1], files[i]] = [files[i], files[i + 1]];
                renderList();
              });
              // Rotate button per file (rotates ALL pages of this file when merging)
              const rotBtn = document.createElement("button");
              rotBtn.className = "card-rot-btn";
              rotBtn.innerHTML = SVG_ICONS.rotateCw;
              rotBtn.title =
                "Girar 90° (todas as páginas deste arquivo)";
              rotBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                entry.rotation = ((entry.rotation || 0) + 90) % 360;
                const imgEl = thumb.querySelector("img");
                if (imgEl)
                  imgEl.style.transform = `rotate(${entry.rotation}deg)`;
              });
              moveWrap.appendChild(leftBtn);
              moveWrap.appendChild(rotBtn);
              moveWrap.appendChild(rightBtn);
              thumb.appendChild(moveWrap);

              const rm = document.createElement("button");
              rm.className = "thumb-rm-btn";
              rm.innerHTML = SVG_ICONS.close;
              rm.title = "Remover";
              rm.addEventListener("click", (e) => {
                e.stopPropagation();
                files = files.filter((f) => f.id !== entry.id);
                renderList();
                if (files.length === 0) {
                  setStatus(status, "");
                } else if (files.length === 1) {
                  setStatus(status, "Adicione mais um PDF para poder combinar.", "");
                } else {
                  setStatus(status, `${files.length} PDFs prontos para combinar.`, "");
                }
              });
              thumb.appendChild(rm);

              makeThumbDraggable(thumb, entry, files, renderList);

              thumbsEl.appendChild(thumb);
            });
            btn.disabled = files.length < 2;
          }

          makeDropzone(
            container,
            { multiple: true, label: "os PDFs" },
            async (newFiles) => {
              const pdfFiles = newFiles.filter(
                (f) =>
                  f.type === "application/pdf" ||
                  f.name.endsWith(".pdf"),
              );
              for (const rawFile of pdfFiles) {
                const unlocked = await ensurePdfFileUnlocked(rawFile, status);
                if (!unlocked) continue;
                const f = unlocked.file;
                const entry = {
                  file: f,
                  buffer: unlocked.buffer,
                  id: uid++,
                  pageCount: "...",
                  thumbUrl: null,
                };
                files.push(entry);
                renderList();
                const { url, pageCount } = await makeCoverThumb(f, unlocked.buffer);
                entry.thumbUrl = url;
                entry.pageCount = pageCount;
                renderList();
              }
              if (files.length > 0) {
                setStatus(
                  status,
                  files.length < 2
                    ? "Adicione mais um PDF para poder combinar."
                    : `${files.length} PDFs prontos para combinar.`,
                  "",
                );
              }
            },
          );

          container.appendChild(thumbsEl);

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Combinar e Baixar PDF";
          btn.disabled = true;
          container.appendChild(btn);

          const status = statusEl(container);

          btn.addEventListener("click", async () => {
            btn.disabled = true;
            setStatus(status, "Combinando e baixando...", "");
            try {
              const merged = await PDFDocument.create();
              for (const entry of files) {
                const bytes = entry.buffer
                  ? entry.buffer.slice(0)
                  : await readAsArrayBuffer(entry.file);
                const doc = await PDFDocument.load(bytes, {
                  ignoreEncryption: true,
                });
                if (doc.isEncrypted) {
                  throw new Error(`O arquivo "${entry.file.name}" está protegido por senha. Remova a proteção antes de combiná-lo.`);
                }
                const pages = await merged.copyPages(
                  doc,
                  doc.getPageIndices(),
                );
                pages.forEach((p) => {
                  if (entry.rotation) {
                    const current = p.getRotation().angle;
                    p.setRotation(
                      degrees(current + (entry.rotation || 0)),
                    );
                  }
                  merged.addPage(p);
                });
              }
              const outBytes = await merged.save();
              const blob = new Blob([outBytes], {
                type: "application/pdf",
              });
              prepareSaveAction(status, btn);
              const outName = files.length > 0 ? `${getBaseFilename(files[0].file.name)}_combinado.pdf` : "documentos_combinados.pdf";
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro: " + err.message, "error");
              btn.disabled = false;
            }
          });
        };

        // ---------- helper: render page thumbnails with selection + rotation ----------
        async function renderThumbs(
          container,
          arrayBuffer,
          { selectable, onProgress } = {},
        ) {
          const thumbsEl = document.createElement("div");
          thumbsEl.className = "thumbs";
          container.appendChild(thumbsEl);

          let pdf;
          try {
            const loadingTask = pdfjsLib.getDocument({
              data: arrayBuffer.slice(0),
            });
            pdf = await loadingTask.promise;
          } catch (err) {
            if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
              throw new Error("Este PDF está protegido por senha. Remova a proteção antes de carregá-lo.");
            }
            throw err;
          }

          const state = {
            numPages: pdf.numPages,
            selected: new Set(),
            rotations: {},
          };

          for (let i = 1; i <= pdf.numPages; i++) {
            if (onProgress) {
              onProgress(i, pdf.numPages);
            }
            state.rotations[i] = 0;
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.35 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport })
              .promise;

            const thumb = document.createElement("div");
            thumb.className = "thumb";
            thumb.dataset.page = i;
            thumb.appendChild(canvas);
            const num = document.createElement("div");
            num.className = "page-num";
            num.textContent = "Página " + i;
            thumb.appendChild(num);

            // Rotate button on every thumb
            const rb = document.createElement("button");
            rb.className = "rotate-btn";
            rb.innerHTML = SVG_ICONS.rotateCw;
            rb.title = "Girar 90°";
            rb.addEventListener("click", (e) => {
              e.stopPropagation();
              const p = parseInt(thumb.dataset.page);
              state.rotations[p] = (state.rotations[p] + 90) % 360;
              canvas.style.transform = `rotate(${state.rotations[p]}deg)`;
            });
            thumb.appendChild(rb);

            // Quick Look button on every thumb
            const ql = document.createElement("button");
            ql.type = "button";
            ql.className = "thumb-quicklook-btn";
            ql.innerHTML = SVG_ICONS.zoomIn;
            ql.title = "Visualização Rápida";
            ql.addEventListener("click", (e) => {
              e.stopPropagation();
              window.openQuickLook(pdf, i);
            });
            thumb.appendChild(ql);

            thumb.addEventListener("dblclick", (e) => {
              e.stopPropagation();
              window.openQuickLook(pdf, i);
            });

            if (selectable) {
              const check = document.createElement("div");
              check.className = "check";
              thumb.appendChild(check);
              thumb.addEventListener("click", () => {
                if (state.selected.has(i)) {
                  state.selected.delete(i);
                  thumb.classList.remove("selected");
                } else {
                  state.selected.add(i);
                  thumb.classList.add("selected");
                }
              });
            }
            thumbsEl.appendChild(thumb);
          }
          state.container = thumbsEl;
          return state;
        }

        // ---------- EXTRAIR PÁGINAS ----------
        RENDERERS.split = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.split}</span> Extrair páginas</h2><p class="hint">Selecione as páginas que você quer extrair para um novo PDF.</p>`;
          let fileBuffer = null;
          let currentFileName = "";

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const thumbArea = document.createElement("div");

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Extrair e Baixar PDF";
          btn.disabled = true;

          const status = statusEl(container);

          function clearActiveFile() {
            fileBuffer = null;
            currentFileName = "";
            fileBarWrap.innerHTML = "";
            thumbArea.innerHTML = "";
            btn.disabled = true;
            btn.onclick = null;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) {
              clearBtn.addEventListener("click", () => clearActiveFile());
            }
          }

          makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFileName = unlocked.file.name;
              fileBuffer = unlocked.buffer;
              thumbArea.innerHTML = "";
              setStatus(status, "Carregando páginas...", "");
              let state;
              try {
                state = await renderThumbs(
                  thumbArea,
                  fileBuffer,
                  {
                    selectable: true,
                    onProgress: (cur, tot) => setStatus(status, `Carregando miniaturas (${cur} de ${tot})...`, "")
                  },
                );
                renderLoadedBar(currentFileName, state.numPages);
              } catch (err) {
                setStatus(status, err.message, "error");
                return;
              }
              setStatus(
                status,
                "Clique nas páginas que deseja extrair.",
                "",
              );
              btn.disabled = false;
              btn.onclick = async () => {
                if (state.selected.size === 0) {
                  setStatus(
                    status,
                    "Selecione ao menos uma página.",
                    "error",
                  );
                  return;
                }
                btn.disabled = true;
                setStatus(status, "Extraindo e baixando PDF...", "");
                try {
                  const src = await PDFDocument.load(fileBuffer, {
                    ignoreEncryption: true,
                  });
                  if (src.isEncrypted) {
                    throw new Error("Este PDF está protegido por senha. Remova a proteção antes de manipulá-lo.");
                  }
                  const out = await PDFDocument.create();
                  const sortedPages = Array.from(state.selected)
                    .sort((a, b) => a - b)
                    .map((p) => p - 1);
                  const copied = await out.copyPages(
                    src,
                    sortedPages,
                  );
                  copied.forEach((p, idx) => {
                    const origPageNum = sortedPages[idx] + 1;
                    const rot = state.rotations[origPageNum] || 0;
                    if (rot) {
                      const current = p.getRotation().angle;
                      p.setRotation(degrees(current + rot));
                    }
                    out.addPage(p);
                  });
                  const bytes = await out.save();
                  const blob = new Blob([bytes], {
                    type: "application/pdf",
                  });
                  prepareSaveAction(status, btn);
                  const outName = `${getBaseFilename(currentFileName, "extraido")}_extraido.pdf`;
                  await triggerDownload(blob, outName);
                } catch (err) {
                  setStatus(status, "Erro: " + err.message, "error");
                  btn.disabled = false;
                }
              };
            },
          );

          container.appendChild(fileBarWrap);
          container.appendChild(thumbArea);
          container.appendChild(btn);
          container.appendChild(status);
        };

        // ---------- REMOVER PÁGINAS ----------
        RENDERERS.remove = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.remove}</span> Remover páginas</h2><p class="hint">Clique no botão de exclusão para marcar a página em vermelho. Se precisar, clique em Restaurar a qualquer momento.</p>`;
          let fileBuffer = null;
          let currentFileName = "";
          let pages = [];

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const thumbsArea = document.createElement("div");
          thumbsArea.className = "thumbs";

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Remover e Baixar PDF";
          btn.disabled = true;

          const status = statusEl(container);

          function clearActiveFile() {
            fileBuffer = null;
            currentFileName = "";
            pages = [];
            fileBarWrap.innerHTML = "";
            thumbsArea.innerHTML = "";
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) {
              clearBtn.addEventListener("click", () => clearActiveFile());
            }
          }

          makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFileName = unlocked.file.name;
              fileBuffer = unlocked.buffer;
              thumbsArea.innerHTML = "";
              pages = [];
              setStatus(status, "Carregando páginas...", "");

              try {
                const loadingTask = pdfjsLib.getDocument({
                  data: fileBuffer.slice(0),
                });
                const pdf = await loadingTask.promise;

                for (let i = 1; i <= pdf.numPages; i++) {
                  setStatus(status, `Carregando miniaturas (${i} de ${pdf.numPages})...`, "");
                  const page = await pdf.getPage(i);
                  const viewport = page.getViewport({ scale: 0.35 });
                  const canvas = document.createElement("canvas");
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  const ctx = canvas.getContext("2d");
                  await page.render({ canvasContext: ctx, viewport })
                    .promise;

                  pages.push({
                    num: i,
                    canvas: canvas,
                    rotation: 0,
                    removed: false,
                  });
                }

                renderLoadedBar(currentFileName, pdf.numPages);
                renderPages();
                btn.disabled = false;
              } catch (err) {
                setStatus(
                  status,
                  "Erro ao carregar PDF: " + err.message,
                  "error",
                );
              }
            },
          );

          container.appendChild(fileBarWrap);
          container.appendChild(thumbsArea);
          container.appendChild(btn);
          container.appendChild(status);

          function renderPages() {
            thumbsArea.innerHTML = "";
            let removedCount = 0;

            pages.forEach((p) => {
              const thumb = document.createElement("div");
              thumb.className =
                "thumb" + (p.removed ? " removed-thumb" : "");
              thumb.dataset.page = p.num;

              const canvasWrap = document.createElement("div");
              canvasWrap.appendChild(p.canvas);
              p.canvas.style.transform = `rotate(${p.rotation}deg)`;
              thumb.appendChild(canvasWrap);

              const num = document.createElement("div");
              num.className = "page-num";
              num.textContent =
                "Página " + p.num + (p.removed ? " (Excluída)" : "");
              thumb.appendChild(num);

              // Botão Girar
              const rb = document.createElement("button");
              rb.className = "rotate-btn";
              rb.innerHTML = SVG_ICONS.rotateCw;
              rb.title = "Girar 90°";
              rb.addEventListener("click", (e) => {
                e.stopPropagation();
                p.rotation = (p.rotation + 90) % 360;
                p.canvas.style.transform = `rotate(${p.rotation}deg)`;
              });
              thumb.appendChild(rb);

              if (!p.removed) {
                // Botão Lixeira na página ativa
                const tb = document.createElement("button");
                tb.className = "trash-btn";
                tb.innerHTML = SVG_ICONS.trash;
                tb.title = "Marcar para excluir";
                tb.addEventListener("click", (e) => {
                  e.stopPropagation();
                  p.removed = true;
                  renderPages();
                });
                thumb.appendChild(tb);
              } else {
                // Botão Restaurar na página marcada
                removedCount++;
                const restoreBtn = document.createElement("button");
                restoreBtn.className = "restore-btn";
                restoreBtn.innerHTML = `${SVG_ICONS.restore} <span>Restaurar</span>`;
                restoreBtn.title = "Restaurar esta página";
                restoreBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  p.removed = false;
                  renderPages();
                });
                thumb.appendChild(restoreBtn);
              }

              thumbsArea.appendChild(thumb);
            });

            const activeCount = pages.length - removedCount;

            if (pages.length > 0) {
              if (activeCount === 0) {
                btn.disabled = true;
                setStatus(
                  status,
                  "Todas as páginas foram marcadas para exclusão. Restaure ao menos uma página.",
                  "error",
                );
              } else {
                btn.disabled = false;
                if (removedCount > 0) {
                  setStatus(
                    status,
                    `${removedCount} página(s) marcada(s) para exclusão em vermelho. Clique em 'Remover e Baixar PDF' para finalizar.`,
                    "",
                  );
                } else {
                  setStatus(
                    status,
                    "Clique no botão de exclusão da página para sinalizar as que deseja remover.",
                    "",
                  );
                }
              }
            }
          }

          btn.onclick = async () => {
            const activePages = pages.filter((p) => !p.removed);
            const removedPages = pages.filter((p) => p.removed);

            if (activePages.length === 0) {
              setStatus(
                status,
                "Não é possível remover todas as páginas. Restaure ao menos uma página.",
                "error",
              );
              return;
            }

            btn.disabled = true;
            setStatus(status, "Gerando e baixando PDF...", "");

            try {
              const src = await PDFDocument.load(fileBuffer, {
                ignoreEncryption: true,
              });
              if (src.isEncrypted) {
                throw new Error("Este PDF está protegido por senha. Remova a proteção antes de manipulá-lo.");
              }
              const out = await PDFDocument.create();
              const keepIndices = activePages.map((p) => p.num - 1);
              const copied = await out.copyPages(src, keepIndices);

              copied.forEach((copiedPage, idx) => {
                const pageInfo = activePages[idx];
                if (pageInfo.rotation) {
                  const current = copiedPage.getRotation().angle;
                  copiedPage.setRotation(
                    degrees(current + pageInfo.rotation),
                  );
                }
                out.addPage(copiedPage);
              });

              const bytes = await out.save();
              const blob = new Blob([bytes], {
                type: "application/pdf",
              });
              prepareSaveAction(status, btn);
              const outName = `${getBaseFilename(currentFileName, "documento")}_editado.pdf`;
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro: " + err.message, "error");
              btn.disabled = false;
            }
          };
        };

        // ---------- RODAR PDF ----------
        RENDERERS.rotate = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.rotate}</span> Girar PDF</h2><p class="hint">Clique no botão de rotação em cada página para girá-la individualmente, ou use os botões abaixo para girar todas.</p>`;
          let fileBuffer = null;
          let currentFileName = "";
          let currentState = null;

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const thumbArea = document.createElement("div");

          const btnBar = document.createElement("div");
          btnBar.style.display = "flex";
          btnBar.style.gap = "10px";
          btnBar.style.flexWrap = "wrap";
          btnBar.style.alignItems = "center";
          btnBar.style.marginTop = "14px";

          const btnRotateAllRight = document.createElement("button");
          btnRotateAllRight.className = "action-btn";
          btnRotateAllRight.style.background = "#ffffff";
          btnRotateAllRight.style.color = "#1e293b";
          btnRotateAllRight.style.border = "1px solid var(--border)";
          btnRotateAllRight.style.marginTop = "0";
          btnRotateAllRight.style.display = "inline-flex";
          btnRotateAllRight.style.alignItems = "center";
          btnRotateAllRight.style.gap = "6px";
          btnRotateAllRight.innerHTML = `${SVG_ICONS.rotateCw} Girar Todas 90°`;
          btnRotateAllRight.disabled = true;
          btnRotateAllRight.onclick = () => {
            if (!currentState) return;
            for (let i = 1; i <= currentState.numPages; i++) {
              currentState.rotations[i] =
                ((currentState.rotations[i] || 0) + 90) % 360;
              const thumb = thumbArea.querySelector(
                `[data-page="${i}"]`,
              );
              if (thumb) {
                const canvas = thumb.querySelector("canvas");
                if (canvas)
                  canvas.style.transform = `rotate(${currentState.rotations[i]}deg)`;
              }
            }
          };

          const btnRotateAllLeft = document.createElement("button");
          btnRotateAllLeft.className = "action-btn";
          btnRotateAllLeft.style.background = "#ffffff";
          btnRotateAllLeft.style.color = "#1e293b";
          btnRotateAllLeft.style.border = "1px solid var(--border)";
          btnRotateAllLeft.style.marginTop = "0";
          btnRotateAllLeft.style.display = "inline-flex";
          btnRotateAllLeft.style.alignItems = "center";
          btnRotateAllLeft.style.gap = "6px";
          btnRotateAllLeft.innerHTML = `${SVG_ICONS.rotateCcw} Girar Todas -90°`;
          btnRotateAllLeft.disabled = true;
          btnRotateAllLeft.onclick = () => {
            if (!currentState) return;
            for (let i = 1; i <= currentState.numPages; i++) {
              currentState.rotations[i] =
                ((currentState.rotations[i] || 0) + 270) % 360;
              const thumb = thumbArea.querySelector(
                `[data-page="${i}"]`,
              );
              if (thumb) {
                const canvas = thumb.querySelector("canvas");
                if (canvas)
                  canvas.style.transform = `rotate(${currentState.rotations[i]}deg)`;
              }
            }
          };

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.style.marginTop = "0";
          btn.textContent = "Girar e Baixar PDF";
          btn.disabled = true;
          btn.onclick = async () => {
            if (!currentState) return;
            btn.disabled = true;
            btnRotateAllRight.disabled = true;
            btnRotateAllLeft.disabled = true;
            setStatus(
              status,
              "Aplicando rotação e baixando...",
              "",
            );
            try {
              const src = await PDFDocument.load(fileBuffer, {
                ignoreEncryption: true,
              });
              if (src.isEncrypted) {
                throw new Error("Este PDF está protegido por senha. Remova a proteção antes de manipulá-lo.");
              }
              const pages = src.getPages();
              pages.forEach((page, idx) => {
                const rot = currentState.rotations[idx + 1] || 0;
                if (rot) {
                  const current = page.getRotation().angle;
                  page.setRotation(degrees(current + rot));
                }
              });
              const bytes = await src.save();
              const blob = new Blob([bytes], {
                type: "application/pdf",
              });
              prepareSaveAction(status, btn);
              const outName = `${getBaseFilename(currentFileName, "documento")}_rotacionado.pdf`;
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro: " + err.message, "error");
              btn.disabled = false;
              btnRotateAllRight.disabled = false;
              btnRotateAllLeft.disabled = false;
            }
          };

          btnBar.appendChild(btnRotateAllRight);
          btnBar.appendChild(btnRotateAllLeft);
          btnBar.appendChild(btn);

          const status = statusEl(container);

          function clearActiveFile() {
            fileBuffer = null;
            currentFileName = "";
            currentState = null;
            fileBarWrap.innerHTML = "";
            thumbArea.innerHTML = "";
            btnRotateAllRight.disabled = true;
            btnRotateAllLeft.disabled = true;
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) {
              clearBtn.addEventListener("click", () => clearActiveFile());
            }
          }

          makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFileName = unlocked.file.name;
              fileBuffer = unlocked.buffer;
              thumbArea.innerHTML = "";
              setStatus(status, "Carregando páginas...", "");
              try {
                currentState = await renderThumbs(
                  thumbArea,
                  fileBuffer,
                  {
                    selectable: false,
                    onProgress: (cur, tot) => setStatus(status, `Carregando miniaturas (${cur} de ${tot})...`, "")
                  },
                );
                renderLoadedBar(currentFileName, currentState.numPages);
              } catch (err) {
                setStatus(status, err.message, "error");
                return;
              }
              setStatus(
                status,
                "Clique no botão de girar em cada página ou use os botões abaixo para girar todas.",
                "",
              );
              btnRotateAllRight.disabled = false;
              btnRotateAllLeft.disabled = false;
              btn.disabled = false;
            },
          );

          container.appendChild(fileBarWrap);
          container.appendChild(thumbArea);
          container.appendChild(btnBar);
          container.appendChild(status);
        };

        // ---------- PDF PARA JPG ----------
        RENDERERS.pdf2jpg = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.pdf2jpg}</span> PDF para JPG</h2><p class="hint">Selecione as páginas que deseja converter. Use o botão de girar antes de baixar se necessário.</p>`;

          const selectionStyle = document.createElement("style");
          selectionStyle.textContent = `
                      .pdf2jpg-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:14px 0 10px}
                      .pdf2jpg-toolbar button{padding:7px 11px;border:1px solid #d0d5dd;background:#fff;color:#344054;border-radius:7px;cursor:pointer;font-weight:600}
                      .pdf2jpg-count{font-size:12px;color:#475467;font-weight:700;margin-left:4px}
                      .pdf2jpg-thumb{position:relative;cursor:pointer;transition:.16s ease;border:2px solid transparent!important}
                      .pdf2jpg-thumb.selected{border-color:var(--green)!important;box-shadow:0 0 0 3px var(--green-glow)}
                      .pdf2jpg-check{position:absolute;top:7px;right:7px;width:23px;height:23px;border-radius:50%;border:2px solid #98a2b3;background:#fff;color:transparent;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;z-index:3}
                      .pdf2jpg-thumb.selected .pdf2jpg-check{background:var(--green);border-color:var(--green);color:#fff}
                    `;
          container.appendChild(selectionStyle);

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const resultArea = document.createElement("div");
          const status = statusEl(container);

          function clearActiveFile() {
            fileBarWrap.innerHTML = "";
            resultArea.innerHTML = "";
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) {
              clearBtn.addEventListener("click", () => clearActiveFile());
            }
          }

          makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              const { file, buffer } = unlocked;
              resultArea.innerHTML = "";
              setStatus(status, "Carregando páginas...", "");
              try {
                const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
                renderLoadedBar(file.name, pdf.numPages);

                const toolbar = document.createElement("div");
                toolbar.className = "pdf2jpg-toolbar";
                const selectAllBtn = document.createElement("button");
                selectAllBtn.type = "button";
                selectAllBtn.textContent = "Selecionar todas";
                const clearBtn = document.createElement("button");
                clearBtn.type = "button";
                clearBtn.textContent = "Limpar seleção";
                const count = document.createElement("span");
                count.className = "pdf2jpg-count";
                toolbar.append(selectAllBtn, clearBtn, count);
                resultArea.appendChild(toolbar);

                const thumbsWrap = document.createElement("div");
                thumbsWrap.className = "thumbs";
                resultArea.appendChild(thumbsWrap);

                const pageRotations = {};
                const pageCanvases = {};
                const selectedPages = new Set();
                const thumbByPage = {};
                const updateSelection = () => {
                  Object.entries(thumbByPage).forEach(([page, thumb]) => {
                    const selected = selectedPages.has(Number(page));
                    thumb.classList.toggle("selected", selected);
                    thumb.setAttribute("aria-pressed", String(selected));
                  });
                  count.textContent = `${selectedPages.size} de ${pdf.numPages} página(s) selecionada(s)`;
                };

                for (let i = 1; i <= pdf.numPages; i++) {
                  setStatus(status, `Carregando miniaturas (${i} de ${pdf.numPages})...`, "");
                  pageRotations[i] = 0;
                  selectedPages.add(i);
                  const page = await pdf.getPage(i);
                  const viewport = page.getViewport({ scale: 2 });
                  const canvas = document.createElement("canvas");
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
                  pageCanvases[i] = canvas;

                  const thumb = document.createElement("div");
                  thumb.className = "thumb pdf2jpg-thumb selected";
                  thumb.setAttribute("role", "button");
                  thumb.setAttribute("tabindex", "0");
                  thumb.setAttribute("aria-label", `Selecionar página ${i}`);
                  thumbByPage[i] = thumb;

                  const previewVp = page.getViewport({ scale: 0.35 });
                  const previewCanvas = document.createElement("canvas");
                  previewCanvas.width = previewVp.width;
                  previewCanvas.height = previewVp.height;
                  await page.render({ canvasContext: previewCanvas.getContext("2d"), viewport: previewVp }).promise;

                  const check = document.createElement("span");
                  check.className = "pdf2jpg-check";
                  check.innerHTML = SVG_ICONS.check;
                  const rotBtn = document.createElement("button");
                  rotBtn.type = "button";
                  rotBtn.className = "rotate-btn";
                  rotBtn.innerHTML = SVG_ICONS.rotateCw;
                  rotBtn.title = "Girar página";
                  rotBtn.onclick = (e) => {
                    e.stopPropagation();
                    pageRotations[i] = (pageRotations[i] + 90) % 360;
                    previewCanvas.style.transform = `rotate(${pageRotations[i]}deg)`;
                  };
                  const label = document.createElement("div");
                  label.textContent = `Página ${i}`;
                  thumb.append(check, rotBtn, previewCanvas, label);
                  const toggle = () => {
                    selectedPages.has(i) ? selectedPages.delete(i) : selectedPages.add(i);
                    updateSelection();
                  };
                  thumb.onclick = toggle;
                  thumb.onkeydown = (e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
                  };
                  thumbsWrap.appendChild(thumb);
                }

                selectAllBtn.onclick = () => {
                  for (let i = 1; i <= pdf.numPages; i++) selectedPages.add(i);
                  updateSelection();
                };
                clearBtn.onclick = () => { selectedPages.clear(); updateSelection(); };
                updateSelection();

                const dlBtn = document.createElement("button");
                dlBtn.type = "button";
                dlBtn.className = "action-btn";
                dlBtn.textContent = "Converter e Baixar JPG";
                resultArea.appendChild(dlBtn);
                setStatus(status, "Selecione as páginas que deseja converter.", "");

                dlBtn.addEventListener("click", async () => {
                  const pages = [...selectedPages].sort((a, b) => a - b);
                  if (!pages.length) {
                    setStatus(status, "Selecione pelo menos uma página.", "error");
                    return;
                  }
                  dlBtn.disabled = true;
                  setStatus(status, `Convertendo ${pages.length} página(s)...`, "");
                  try {
                    const exportFiles = [];
                    for (let p = 0; p < pages.length; p++) {
                      const i = pages[p];
                      const srcCanvas = pageCanvases[i];
                      const rot = pageRotations[i] || 0;
                      let finalCanvas = srcCanvas;
                      if (rot) {
                        const rad = (rot * Math.PI) / 180;
                        const sw = srcCanvas.width,
                          sh = srcCanvas.height;
                        const newW = rot === 90 || rot === 270 ? sh : sw;
                        const newH = rot === 90 || rot === 270 ? sw : sh;
                        finalCanvas = document.createElement("canvas");
                        finalCanvas.width = newW;
                        finalCanvas.height = newH;
                        const fctx = finalCanvas.getContext("2d");
                        fctx.translate(newW / 2, newH / 2);
                        fctx.rotate(rad);
                        fctx.drawImage(srcCanvas, -sw / 2, -sh / 2);
                      }
                      const blob = await new Promise((res) =>
                        finalCanvas.toBlob(res, "image/jpeg", 0.92),
                      );
                      const baseName = getBaseFilename(file.name, "documento");
                      exportFiles.push({ blob, filename: `${baseName}_pagina_${i}.jpg` });
                    }
                    prepareSaveAction(status, dlBtn);
                    if (exportFiles.length === 1) {
                      await triggerDownload(exportFiles[0].blob, exportFiles[0].filename);
                    } else {
                      await triggerBatchDownload(exportFiles);
                    }
                  } catch (err) {
                    setStatus(status, "Erro: " + err.message, "error");
                    dlBtn.disabled = false;
                  }
                });
              } catch (err) {
                setStatus(status, "Erro: " + err.message, "error");
              }
            },
          );
          container.appendChild(fileBarWrap);
          container.appendChild(resultArea);
          container.appendChild(status);
        };

        // ---------- JPG PARA PDF ----------
        RENDERERS.jpg2pdf = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.jpg2pdf}</span> JPG para PDF</h2><p class="hint">Selecione uma ou mais imagens (JPG/PNG). Arraste os cartões pelo mouse (ou use as setas) para reordenar — essa será a ordem das páginas no PDF final.</p>`;
          let files = []; // { file, url, id }
          let uid = 0;
          let orientation = "vertical"; // 'vertical' | 'horizontal'

          const orientRow = document.createElement("div");
          orientRow.className = "option-row";
          orientRow.innerHTML =
            "<label>Orientação das páginas:</label>";
          const seg = document.createElement("div");
          seg.className = "segmented";
          const btnV = document.createElement("button");
          btnV.style.display = "inline-flex";
          btnV.style.alignItems = "center";
          btnV.style.gap = "6px";
          btnV.innerHTML = `${SVG_ICONS.file} Vertical`;
          const btnH = document.createElement("button");
          btnH.style.display = "inline-flex";
          btnH.style.alignItems = "center";
          btnH.style.gap = "6px";
          btnH.innerHTML = `${SVG_ICONS.image} Horizontal`;
          function updateSegUI() {
            btnV.classList.toggle(
              "active",
              orientation === "vertical",
            );
            btnH.classList.toggle(
              "active",
              orientation === "horizontal",
            );
          }
          btnV.addEventListener("click", () => {
            orientation = "vertical";
            updateSegUI();
          });
          btnH.addEventListener("click", () => {
            orientation = "horizontal";
            updateSegUI();
          });
          updateSegUI();
          seg.appendChild(btnV);
          seg.appendChild(btnH);
          orientRow.appendChild(seg);
          container.appendChild(orientRow);

          const thumbsEl = document.createElement("div");
          thumbsEl.className = "thumbs file-cards";

          function renderThumbsList() {
            thumbsEl.innerHTML = "";
            files.forEach((entry, i) => {
              const thumb = document.createElement("div");
              thumb.className = "thumb";
              thumb.dataset.id = entry.id;

              const img = document.createElement("img");
              img.src = entry.url;
              img.draggable = false;
              if (entry.rotation)
                img.style.transform = `rotate(${entry.rotation}deg)`;
              thumb.appendChild(img);

              const num = document.createElement("div");
              num.className = "page-num";
              num.textContent = `Pág. ${i + 1} · ${entry.file.name}`;
              thumb.appendChild(num);

              const moveWrap = document.createElement("div");
              moveWrap.style.display = "flex";
              moveWrap.style.justifyContent = "center";
              moveWrap.style.gap = "4px";
              moveWrap.style.paddingBottom = "8px";
              const leftBtn = document.createElement("button");
              leftBtn.className = "order-btn";
              leftBtn.innerHTML = SVG_ICONS.chevronLeft;
              leftBtn.title = "Mover para a esquerda";
              leftBtn.disabled = i === 0;
              leftBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === 0) return;
                [files[i - 1], files[i]] = [files[i], files[i - 1]];
                renderThumbsList();
              });
              const rightBtn = document.createElement("button");
              rightBtn.className = "order-btn";
              rightBtn.innerHTML = SVG_ICONS.chevronRight;
              rightBtn.title = "Mover para a direita";
              rightBtn.disabled = i === files.length - 1;
              rightBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === files.length - 1) return;
                [files[i + 1], files[i]] = [files[i], files[i + 1]];
                renderThumbsList();
              });
              // Rotate button per image
              const rotBtn = document.createElement("button");
              rotBtn.className = "card-rot-btn";
              rotBtn.innerHTML = SVG_ICONS.rotateCw;
              rotBtn.title = "Girar 90°";
              rotBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                entry.rotation = ((entry.rotation || 0) + 90) % 360;
                img.style.transform = `rotate(${entry.rotation}deg)`;
              });
              moveWrap.appendChild(leftBtn);
              moveWrap.appendChild(rotBtn);
              moveWrap.appendChild(rightBtn);
              thumb.appendChild(moveWrap);

              const rm = document.createElement("button");
              rm.className = "thumb-rm-btn";
              rm.innerHTML = SVG_ICONS.close;
              rm.title = "Remover";
              rm.addEventListener("click", (e) => {
                e.stopPropagation();
                files = files.filter((f) => f.id !== entry.id);
                renderThumbsList();
              });
              thumb.appendChild(rm);

              makeThumbDraggable(
                thumb,
                entry,
                files,
                renderThumbsList,
              );

              thumbsEl.appendChild(thumb);
            });
            btn.disabled = files.length === 0;
          }

          makeDropzone(
            container,
            {
              multiple: true,
              accept: "image/jpeg,image/png",
              label: "as imagens",
            },
            (newFiles) => {
              newFiles
                .filter((f) => f.type.startsWith("image/"))
                .forEach((f) => {
                  files.push({
                    file: f,
                    url: URL.createObjectURL(f),
                    id: uid++,
                  });
                });
              renderThumbsList();
            },
          );

          container.appendChild(thumbsEl);

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Converter e Baixar PDF";
          btn.disabled = true;
          container.appendChild(btn);

          const status = statusEl(container);

          function getImageSize(dataUrlImg) {
            // dataUrlImg is a pdf-lib embedded image object with .width/.height
            return { w: dataUrlImg.width, h: dataUrlImg.height };
          }

          btn.addEventListener("click", async () => {
            btn.disabled = true;
            setStatus(status, "Processando e baixando...", "");
            try {
              const doc = await PDFDocument.create();
              for (const entry of files) {
                const f = entry.file;
                const rot = entry.rotation || 0;
                // Draw on an offscreen canvas applying rotation, then embed as PNG
                const srcBytes = await readAsArrayBuffer(f);
                const isPng = f.type === "image/png";
                let embedBytes = srcBytes;
                let embedIsPng = isPng;

                if (rot) {
                  // Render image to canvas, apply rotation, export as PNG
                  const bitmapBlob = new Blob([srcBytes], {
                    type: f.type,
                  });
                  const bitmapUrl = URL.createObjectURL(bitmapBlob);
                  const bmpImg = new Image();
                  await new Promise((res, rej) => {
                    bmpImg.onload = res;
                    bmpImg.onerror = rej;
                    bmpImg.src = bitmapUrl;
                  });
                  URL.revokeObjectURL(bitmapUrl);
                  const rad = (rot * Math.PI) / 180;
                  const sw = bmpImg.naturalWidth,
                    sh = bmpImg.naturalHeight;
                  const newW = rot === 90 || rot === 270 ? sh : sw;
                  const newH = rot === 90 || rot === 270 ? sw : sh;
                  const offscreen = document.createElement("canvas");
                  offscreen.width = newW;
                  offscreen.height = newH;
                  const octx = offscreen.getContext("2d");
                  octx.translate(newW / 2, newH / 2);
                  octx.rotate(rad);
                  octx.drawImage(bmpImg, -sw / 2, -sh / 2);
                  const rotBlob = await new Promise((res) =>
                    offscreen.toBlob(res, "image/png"),
                  );
                  embedBytes = await readAsArrayBuffer(rotBlob);
                  embedIsPng = true;
                }

                const img = embedIsPng
                  ? await doc.embedPng(embedBytes)
                  : await doc.embedJpg(embedBytes);
                const { w, h } = getImageSize(img);

                let pageW, pageH;
                if (orientation === "vertical") {
                  pageW = Math.min(w, h);
                  pageH = Math.max(w, h);
                } else {
                  pageW = Math.max(w, h);
                  pageH = Math.min(w, h);
                }

                const scale = Math.min(pageW / w, pageH / h);
                const drawW = w * scale;
                const drawH = h * scale;
                const x = (pageW - drawW) / 2;
                const y = (pageH - drawH) / 2;

                const page = doc.addPage([pageW, pageH]);
                page.drawRectangle({
                  x: 0,
                  y: 0,
                  width: pageW,
                  height: pageH,
                  color: PDFLib.rgb(1, 1, 1),
                });
                page.drawImage(img, {
                  x,
                  y,
                  width: drawW,
                  height: drawH,
                });
              }
              const outBytes = await doc.save();
              const blob = new Blob([outBytes], {
                type: "application/pdf",
              });

              // Download automático e imediato
              prepareSaveAction(status, btn);
              const outName = files.length > 0 ? `${getBaseFilename(files[0].file.name)}_convertido.pdf` : "imagens_convertidas.pdf";
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro: " + err.message, "error");
              btn.disabled = false;
            }
          });
        };

        function formatFileSize(bytes) {
          if (!bytes || bytes === 0) return "0 Bytes";
          const k = 1024;
          const sizes = ["Bytes", "KB", "MB", "GB"];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
        }

        // ---------- COMPRIMIR PDF ----------
        RENDERERS.compress = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.compress}</span> Comprimir PDF</h2><p class="hint">Escolha o nível de compressão para reduzir o tamanho do arquivo mantendo boa nitidez.</p>`;

          let fileBuffer = null;
          let currentFile = null;
          let selectedPreset = "medium";

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const optionsBox = document.createElement("div");
          optionsBox.className = "tool-section-box";
          optionsBox.style.display = "none";
          optionsBox.innerHTML = `
            <div>
              <div class="tool-section-title">Nível de Compressão</div>
              <p class="tool-section-desc">Selecione o equilíbrio desejado entre qualidade de imagem e redução do tamanho do arquivo:</p>
            </div>
            <div class="compression-cards-grid">
              <div class="compression-card" data-preset="high">
                <div class="compression-card-header">
                  <span class="compression-card-title">Alta Compressão</span>
                  <span class="compression-card-badge">~70% menor</span>
                </div>
                <p class="compression-card-desc">Redução máxima. Ideal para portais com limites rígidos (ex: e-mails, concursos, tribunais).</p>
              </div>
              <div class="compression-card selected" data-preset="medium">
                <div class="compression-card-header">
                  <span class="compression-card-title">Recomendada</span>
                  <span class="compression-card-badge">~50% menor</span>
                </div>
                <p class="compression-card-desc">Equilíbrio perfeito entre ótima legibilidade de leitura e redução eficiente de tamanho.</p>
              </div>
              <div class="compression-card" data-preset="low">
                <div class="compression-card-header">
                  <span class="compression-card-title">Leve</span>
                  <span class="compression-card-badge">~30% menor</span>
                </div>
                <p class="compression-card-desc">Menor redução, preservando a máxima nitidez e fidelidade visual em imagens e fotos.</p>
              </div>
            </div>
          `;

          const cards = optionsBox.querySelectorAll(".compression-card");
          cards.forEach((card) => {
            card.addEventListener("click", () => {
              cards.forEach((c) => c.classList.remove("selected"));
              card.classList.add("selected");
              selectedPreset = card.dataset.preset;
            });
          });

          const resultWrap = document.createElement("div");

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Comprimir e Baixar PDF";
          btn.disabled = true;

          const status = statusEl(container);
          let dropzoneEl = null;

          function clearActiveFile() {
            fileBuffer = null;
            currentFile = null;
            fileBarWrap.innerHTML = "";
            optionsBox.style.display = "none";
            resultWrap.innerHTML = "";
            if (dropzoneEl) dropzoneEl.style.display = "flex";
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages, bytes) {
            const sizeStr = formatFileSize(bytes);
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág. • ${sizeStr})</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) clearBtn.addEventListener("click", () => clearActiveFile());
          }

          dropzoneEl = makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFile = unlocked.file;
              fileBuffer = unlocked.buffer;
              resultWrap.innerHTML = "";
              setStatus(status, "Analisando páginas...", "");
              try {
                const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
                if (dropzoneEl) dropzoneEl.style.display = "none";
                renderLoadedBar(currentFile.name, pdf.numPages, fileBuffer.byteLength);
                optionsBox.style.display = "flex";
                btn.disabled = false;
                setStatus(status, "Escolha o nível de compressão e clique em 'Comprimir e Baixar PDF'.", "");
              } catch (err) {
                setStatus(status, "Erro ao carregar PDF: " + err.message, "error");
              }
            }
          );

          btn.addEventListener("click", async () => {
            if (!fileBuffer || !currentFile) return;
            btn.disabled = true;
            resultWrap.innerHTML = "";
            setStatus(status, "Iniciando compressão...", "");

            let scale = 1.15;
            let quality = 0.65;
            if (selectedPreset === "high") {
              scale = 0.85;
              quality = 0.40;
            } else if (selectedPreset === "low") {
              scale = 1.5;
              quality = 0.80;
            }

            try {
              const loadingTask = pdfjsLib.getDocument({ data: fileBuffer.slice(0) });
              const pdf = await loadingTask.promise;
              const doc = await PDFDocument.create();

              for (let i = 1; i <= pdf.numPages; i++) {
                setStatus(status, `Comprimindo página ${i} de ${pdf.numPages}...`, "");
                const page = await pdf.getPage(i);
                const unscaledVp = page.getViewport({ scale: 1.0 });
                const renderVp = page.getViewport({ scale: scale });

                const canvas = document.createElement("canvas");
                canvas.width = renderVp.width;
                canvas.height = renderVp.height;
                const ctx = canvas.getContext("2d");
                await page.render({ canvasContext: ctx, viewport: renderVp }).promise;

                const jpegBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
                const jpegBytes = await readAsArrayBuffer(jpegBlob);
                const embeddedJpg = await doc.embedJpg(jpegBytes);

                const newPage = doc.addPage([unscaledVp.width, unscaledVp.height]);
                newPage.drawImage(embeddedJpg, {
                  x: 0,
                  y: 0,
                  width: unscaledVp.width,
                  height: unscaledVp.height,
                });
              }

              setStatus(status, "Finalizando e gerando PDF comprimido...", "");
              const outBytes = await doc.save();
              const outBlob = new Blob([outBytes], { type: "application/pdf" });

              const origSize = fileBuffer.byteLength;
              const newSize = outBytes.byteLength;
              const diffPercent = Math.max(0, Math.round(((origSize - newSize) / origSize) * 100));

              resultWrap.innerHTML = `
                <div class="compress-result-banner">
                  <div class="compress-result-icon">${SVG_ICONS.check}</div>
                  <div>
                    <strong>Compressão concluída com sucesso!</strong><br />
                    Tamanho reduzido de <strong>${formatFileSize(origSize)}</strong> para <strong>${formatFileSize(newSize)}</strong> (${diffPercent}% de economia de espaço).
                  </div>
                </div>
              `;

              prepareSaveAction(status, btn);
              const outName = `${getBaseFilename(currentFile.name)}_comprimido.pdf`;
              await triggerDownload(outBlob, outName);
            } catch (err) {
              setStatus(status, "Erro na compressão: " + err.message, "error");
              btn.disabled = false;
            }
          });

          container.appendChild(fileBarWrap);
          container.appendChild(optionsBox);
          container.appendChild(resultWrap);
          container.appendChild(btn);
          container.appendChild(status);
        };

        // ---------- PROTEGER E DESPROTEGER PDF ----------
        RENDERERS.protect = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.protect}</span> Proteger / Desproteger PDF</h2><p class="hint">Adicione uma senha forte ao seu documento ou remova a proteção de um PDF desbloqueado.</p>`;

          let fileBuffer = null;
          let currentFile = null;
          let wasOriginallyEncrypted = false;
          let activeMode = "encrypt";

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const optionsBox = document.createElement("div");
          optionsBox.className = "tool-section-box";
          optionsBox.style.display = "none";

          const status = statusEl(container);
          let dropzoneEl = null;

          function clearActiveFile() {
            fileBuffer = null;
            currentFile = null;
            wasOriginallyEncrypted = false;
            fileBarWrap.innerHTML = "";
            optionsBox.style.display = "none";
            if (dropzoneEl) dropzoneEl.style.display = "flex";
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) clearBtn.addEventListener("click", () => clearActiveFile());
          }

          function renderModeUI() {
            optionsBox.innerHTML = "";

            const tabs = document.createElement("div");
            tabs.className = "protect-tabs";
            const btnEncrypt = document.createElement("button");
            btnEncrypt.type = "button";
            btnEncrypt.className = "protect-tab-btn" + (activeMode === "encrypt" ? " active" : "");
            btnEncrypt.innerHTML = `${SVG_ICONS.lock} Adicionar Senha`;

            const btnDecrypt = document.createElement("button");
            btnDecrypt.type = "button";
            btnDecrypt.className = "protect-tab-btn" + (activeMode === "decrypt" ? " active" : "");
            btnDecrypt.innerHTML = `${SVG_ICONS.unlock} Remover Senha`;

            btnEncrypt.onclick = () => {
              activeMode = "encrypt";
              renderModeUI();
            };
            btnDecrypt.onclick = () => {
              activeMode = "decrypt";
              renderModeUI();
            };
            tabs.append(btnEncrypt, btnDecrypt);
            optionsBox.appendChild(tabs);

            if (activeMode === "encrypt") {
              const formWrap = document.createElement("div");
              formWrap.innerHTML = `
                <div class="tool-section-title">Definir Senha de Abertura</div>
                <p class="tool-section-desc">O PDF será criptografado com a proteção padrão do macOS. Ninguém conseguirá abrir o arquivo sem esta senha.</p>
                <div style="margin-top: 14px; max-width: 360px;">
                  <div class="form-field-group">
                    <label class="form-field-label">Digite a Senha:</label>
                    <div class="input-with-eye">
                      <input type="password" id="protect-pwd" placeholder="Senha do documento" autocomplete="off" />
                      <button type="button" class="eye-toggle" id="toggle-pwd-1">${SVG_ICONS.eye}</button>
                    </div>
                  </div>
                  <div class="form-field-group">
                    <label class="form-field-label">Confirme a Senha:</label>
                    <div class="input-with-eye">
                      <input type="password" id="protect-pwd-confirm" placeholder="Repita a senha" autocomplete="off" />
                      <button type="button" class="eye-toggle" id="toggle-pwd-2">${SVG_ICONS.eye}</button>
                    </div>
                  </div>
                </div>
              `;
              optionsBox.appendChild(formWrap);

              const p1 = formWrap.querySelector("#protect-pwd");
              const t1 = formWrap.querySelector("#toggle-pwd-1");
              const p2 = formWrap.querySelector("#protect-pwd-confirm");
              const t2 = formWrap.querySelector("#toggle-pwd-2");

              t1.onclick = () => {
                p1.type = p1.type === "password" ? "text" : "password";
                t1.innerHTML = p1.type === "password" ? SVG_ICONS.eye : SVG_ICONS.eyeOff;
              };
              t2.onclick = () => {
                p2.type = p2.type === "password" ? "text" : "password";
                t2.innerHTML = p2.type === "password" ? SVG_ICONS.eye : SVG_ICONS.eyeOff;
              };
              btn.textContent = "Proteger e Salvar PDF";
            } else {
              const decryptInfo = document.createElement("div");
              decryptInfo.innerHTML = `
                <div class="tool-section-title">Remover Proteção Definitivamente</div>
                <p class="tool-section-desc" style="line-height: 1.5;">
                  ${wasOriginallyEncrypted 
                    ? "Este documento foi desbloqueado com sucesso usando a senha fornecida. Ao clicar abaixo, o app criará uma nova cópia 100% desprotegida (livre de senha), pronta para abrir sem pedir autenticação." 
                    : "Ao salvar esta cópia, o documento será reexportado em formato padrão desprotegido, sem exigir senha para abertura."}
                </p>
              `;
              optionsBox.appendChild(decryptInfo);
              btn.textContent = "Salvar PDF Sem Senha";
            }
          }

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Proteger e Salvar PDF";
          btn.disabled = true;

          dropzoneEl = makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const originalFile = newFiles[0];
              const testBuf = await readAsArrayBuffer(originalFile);
              let isEncrypted = false;
              try {
                const test = pdfjsLib.getDocument({ data: testBuf.slice(0) });
                await test.promise;
              } catch (e) {
                if (e.name === "PasswordException" || (e.message && e.message.toLowerCase().includes("password"))) {
                  isEncrypted = true;
                }
              }

              const unlocked = await ensurePdfFileUnlocked(originalFile, status);
              if (!unlocked) return;
              currentFile = unlocked.file;
              fileBuffer = unlocked.buffer;
              wasOriginallyEncrypted = isEncrypted;
              activeMode = wasOriginallyEncrypted ? "decrypt" : "encrypt";

              try {
                const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
                if (dropzoneEl) dropzoneEl.style.display = "none";
                renderLoadedBar(currentFile.name, pdf.numPages);
                renderModeUI();
                optionsBox.style.display = "flex";
                btn.disabled = false;
                setStatus(status, "");
              } catch (err) {
                setStatus(status, "Erro: " + err.message, "error");
              }
            }
          );

          btn.addEventListener("click", async () => {
            if (!fileBuffer || !currentFile) return;

            if (activeMode === "encrypt") {
              const p1 = optionsBox.querySelector("#protect-pwd");
              const p2 = optionsBox.querySelector("#protect-pwd-confirm");
              const pwd = (p1 ? p1.value : "").trim();
              const confirm = (p2 ? p2.value : "").trim();

              if (!pwd) {
                setStatus(status, "Digite uma senha para proteger o documento.", "error");
                p1?.focus();
                return;
              }
              if (pwd !== confirm) {
                setStatus(status, "As senhas digitadas não coincidem. Verifique e tente novamente.", "error");
                p2?.focus();
                return;
              }

              btn.disabled = true;
              setStatus(status, "Aplicando criptografia e preparando salvamento...", "");
              try {
                const cleanBlob = new Blob([fileBuffer], { type: "application/pdf" });
                prepareSaveAction(status, btn);
                const outName = `${getBaseFilename(currentFile.name)}_protegido.pdf`;
                await triggerEncryptedDownload(cleanBlob, outName, pwd);
              } catch (err) {
                setStatus(status, "Erro ao proteger PDF: " + err.message, "error");
                btn.disabled = false;
              }
            } else {
              btn.disabled = true;
              setStatus(status, "Gerando versão desprotegida...", "");
              try {
                const cleanBlob = new Blob([fileBuffer], { type: "application/pdf" });
                prepareSaveAction(status, btn);
                const outName = `${getBaseFilename(currentFile.name)}_desprotegido.pdf`;
                await triggerDownload(cleanBlob, outName);
              } catch (err) {
                setStatus(status, "Erro ao desproteger PDF: " + err.message, "error");
                btn.disabled = false;
              }
            }
          });

          container.appendChild(fileBarWrap);
          container.appendChild(optionsBox);
          container.appendChild(btn);
          container.appendChild(status);
        };

        // ---------- MARCA D'ÁGUA E NUMERAÇÃO ----------
        RENDERERS.watermark = function (container) {
          container.innerHTML =
            `<h2><span class="workspace-title-icon">${SVG_ICONS.watermark}</span> Marca d'Água e Numeração</h2><p class="hint">Adicione carimbos de texto e/ou numere as páginas do seu documento com visualização em tempo real.</p>`;

          let fileBuffer = null;
          let currentFile = null;
          let pageCount = 0;
          let firstPageCanvas = null;
          let selectedColor = "#dc2626";
          let dropzoneEl = null;

          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const mainLayout = document.createElement("div");
          mainLayout.className = "watermark-layout";
          mainLayout.style.display = "none";

          const controlsWrap = document.createElement("div");
          controlsWrap.className = "watermark-controls";

          const wmSection = document.createElement("div");
          wmSection.className = "tool-section-box";
          wmSection.style.margin = "0";
          wmSection.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div class="tool-section-title">
                <input type="checkbox" id="wm-enable" checked style="width:16px;height:16px;cursor:pointer;accent-color:var(--green);" />
                <label for="wm-enable" style="cursor:pointer;">Carimbo / Marca d'Água</label>
              </div>
            </div>
            <div id="wm-options">
              <div class="form-field-group">
                <label class="form-field-label">Texto da Marca d'Água:</label>
                <input type="text" id="wm-text" value="CONFIDENCIAL" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--ink);font-size:13.5px;" />
                <div class="chips-row">
                  <button type="button" class="chip-btn" data-text="CONFIDENCIAL">CONFIDENCIAL</button>
                  <button type="button" class="chip-btn" data-text="RASCUNHO">RASCUNHO</button>
                  <button type="button" class="chip-btn" data-text="CÓPIA">CÓPIA</button>
                  <button type="button" class="chip-btn" data-text="APROVADO">APROVADO</button>
                  <button type="button" class="chip-btn" data-text="URGENTE">URGENTE</button>
                  <button type="button" class="chip-btn" data-text="ORIGINAL">ORIGINAL</button>
                </div>
              </div>
              <div class="form-field-group" style="margin-top:10px;">
                <label class="form-field-label" style="display:block;margin-bottom:6px;">Cor da Marca d'Água:</label>
                <div class="wm-color-swatches" id="wm-color-swatches">
                  <button type="button" class="wm-color-btn selected" data-color="#dc2626" title="Vermelho" style="--swatch-color:#dc2626;">
                    <span class="swatch-circle"></span> Vermelho
                  </button>
                  <button type="button" class="wm-color-btn" data-color="#64748b" title="Cinza" style="--swatch-color:#64748b;">
                    <span class="swatch-circle"></span> Cinza
                  </button>
                  <button type="button" class="wm-color-btn" data-color="#2563eb" title="Azul" style="--swatch-color:#2563eb;">
                    <span class="swatch-circle"></span> Azul
                  </button>
                  <button type="button" class="wm-color-btn" data-color="#16a34a" title="Verde" style="--swatch-color:#16a34a;">
                    <span class="swatch-circle"></span> Verde
                  </button>
                  <button type="button" class="wm-color-btn" data-color="#d97706" title="Laranja" style="--swatch-color:#d97706;">
                    <span class="swatch-circle"></span> Laranja
                  </button>
                  <button type="button" class="wm-color-btn" data-color="#0f172a" title="Preto" style="--swatch-color:#0f172a;">
                    <span class="swatch-circle"></span> Preto
                  </button>
                  <label class="wm-color-custom-btn" title="Personalizar cor">
                    <input type="color" id="wm-custom-color" value="#dc2626" />
                    <span class="wm-color-custom-preview" style="--custom-color:#dc2626;"></span>
                    <span>Outra</span>
                  </label>
                </div>
              </div>
              <div class="options-row-group" style="margin-top:10px;">
                <div>
                  <label class="form-field-label" style="display:block;margin-bottom:4px;">Orientação:</label>
                  <select id="wm-orient" class="select-native">
                    <option value="diagonal">Diagonal (45°)</option>
                    <option value="horizontal">Horizontal (0°)</option>
                  </select>
                </div>
                <div>
                  <label class="form-field-label" style="display:block;margin-bottom:4px;">Opacidade:</label>
                  <select id="wm-opacity" class="select-native">
                    <option value="0.15">15% (Discreta)</option>
                    <option value="0.30" selected>30% (Recomendada)</option>
                    <option value="0.50">50% (Destacada)</option>
                  </select>
                </div>
              </div>
            </div>
          `;

          const numSection = document.createElement("div");
          numSection.className = "tool-section-box";
          numSection.style.margin = "0";
          numSection.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div class="tool-section-title">
                <input type="checkbox" id="num-enable" style="width:16px;height:16px;cursor:pointer;accent-color:var(--green);" />
                <label for="num-enable" style="cursor:pointer;">Numeração de Páginas</label>
              </div>
            </div>
            <div id="num-options" style="opacity:0.6;pointer-events:none;">
              <div class="options-row-group">
                <div>
                  <label class="form-field-label" style="display:block;margin-bottom:4px;">Posição:</label>
                  <select id="num-pos" class="select-native">
                    <option value="bottom-center" selected>Rodapé (Centro)</option>
                    <option value="bottom-right">Rodapé (Direita)</option>
                    <option value="top-center">Cabeçalho (Centro)</option>
                    <option value="top-right">Cabeçalho (Direita)</option>
                  </select>
                </div>
                <div>
                  <label class="form-field-label" style="display:block;margin-bottom:4px;">Formato:</label>
                  <select id="num-format" class="select-native">
                    <option value="page-of" selected>Página {n} de {total}</option>
                    <option value="slash">{n} / {total}</option>
                    <option value="simple-page">Pág. {n}</option>
                    <option value="only-num">{n}</option>
                  </select>
                </div>
              </div>
            </div>
          `;

          controlsWrap.append(wmSection, numSection);

          const previewPane = document.createElement("div");
          previewPane.className = "watermark-preview-pane";
          previewPane.innerHTML = `
            <div class="watermark-preview-label">Pré-visualização (Pág. 1)</div>
            <div class="watermark-canvas-wrap">
              <canvas id="wm-preview-canvas"></canvas>
            </div>
          `;

          mainLayout.append(controlsWrap, previewPane);

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Aplicar e Baixar PDF";
          btn.disabled = true;

          const status = statusEl(container);

          function updateControlsState() {
            const wmEnable = wmSection.querySelector("#wm-enable").checked;
            const wmOpt = wmSection.querySelector("#wm-options");
            wmOpt.style.opacity = wmEnable ? "1" : "0.5";
            wmOpt.style.pointerEvents = wmEnable ? "all" : "none";

            const numEnable = numSection.querySelector("#num-enable").checked;
            const numOpt = numSection.querySelector("#num-options");
            numOpt.style.opacity = numEnable ? "1" : "0.5";
            numOpt.style.pointerEvents = numEnable ? "all" : "none";

            btn.disabled = !wmEnable && !numEnable;
            renderPreview();
          }

          function renderPreview() {
            if (!firstPageCanvas) return;
            const canvas = previewPane.querySelector("#wm-preview-canvas");
            if (!canvas) return;
            canvas.width = firstPageCanvas.width;
            canvas.height = firstPageCanvas.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(firstPageCanvas, 0, 0);

            const wmEnable = wmSection.querySelector("#wm-enable").checked;
            const wmText = (wmSection.querySelector("#wm-text").value || "CONFIDENCIAL").trim();
            const wmOrient = wmSection.querySelector("#wm-orient").value;
            const wmOpacity = parseFloat(wmSection.querySelector("#wm-opacity").value || "0.3");

            if (wmEnable && wmText) {
              ctx.save();
              ctx.translate(canvas.width / 2, canvas.height / 2);
              if (wmOrient === "diagonal") {
                ctx.rotate(-Math.PI / 4);
              }
              const fontSize = Math.max(16, Math.round(canvas.width / 8));
              ctx.font = `bold ${fontSize}px sans-serif`;
              const rgb = hexToRgb(selectedColor);
              ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wmOpacity})`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(wmText, 0, 0);
              ctx.restore();
            }

            const numEnable = numSection.querySelector("#num-enable").checked;
            if (numEnable) {
              const pos = numSection.querySelector("#num-pos").value;
              const fmt = numSection.querySelector("#num-format").value;
              let label = `Página 1 de ${pageCount}`;
              if (fmt === "slash") label = `1 / ${pageCount}`;
              else if (fmt === "simple-page") label = "Pág. 1";
              else if (fmt === "only-num") label = "1";

              ctx.save();
              const numFontSize = Math.max(9, Math.round(canvas.width / 32));
              ctx.font = `${numFontSize}px sans-serif`;
              ctx.fillStyle = "rgba(71, 85, 105, 0.85)";
              let x = canvas.width / 2;
              let y = canvas.height - 12;
              ctx.textAlign = "center";

              if (pos === "bottom-right") {
                x = canvas.width - 14;
                ctx.textAlign = "right";
              } else if (pos === "top-center") {
                y = 16;
              } else if (pos === "top-right") {
                x = canvas.width - 14;
                y = 16;
                ctx.textAlign = "right";
              }

              ctx.fillText(label, x, y);
              ctx.restore();
            }
          }

          wmSection.querySelectorAll(".wm-color-btn").forEach((cBtn) => {
            cBtn.addEventListener("click", () => {
              wmSection.querySelectorAll(".wm-color-btn, .wm-color-custom-btn").forEach((b) => b.classList.remove("selected"));
              cBtn.classList.add("selected");
              selectedColor = cBtn.dataset.color;
              renderPreview();
            });
          });

          const customColorInput = wmSection.querySelector("#wm-custom-color");
          const customColorBtn = wmSection.querySelector(".wm-color-custom-btn");
          const customColorPreview = wmSection.querySelector(".wm-color-custom-preview");

          if (customColorInput) {
            customColorInput.addEventListener("input", (e) => {
              wmSection.querySelectorAll(".wm-color-btn").forEach((b) => b.classList.remove("selected"));
              if (customColorBtn) customColorBtn.classList.add("selected");
              selectedColor = e.target.value;
              if (customColorPreview) customColorPreview.style.setProperty("--custom-color", selectedColor);
              renderPreview();
            });
          }

          wmSection.querySelectorAll(".chip-btn").forEach((chip) => {
            chip.addEventListener("click", () => {
              const text = chip.dataset.text;
              wmSection.querySelector("#wm-text").value = text;
              let targetColor = null;
              if (text === "CONFIDENCIAL" || text === "URGENTE") targetColor = "#dc2626";
              else if (text === "APROVADO") targetColor = "#16a34a";
              else if (text === "RASCUNHO" || text === "CÓPIA") targetColor = "#64748b";
              else if (text === "ORIGINAL") targetColor = "#2563eb";

              if (targetColor) {
                selectedColor = targetColor;
                wmSection.querySelectorAll(".wm-color-btn").forEach((b) => {
                  b.classList.toggle("selected", b.dataset.color === targetColor);
                });
                if (customColorBtn) customColorBtn.classList.remove("selected");
              }
              renderPreview();
            });
          });

          wmSection.querySelector("#wm-enable").addEventListener("change", updateControlsState);
          wmSection.querySelector("#wm-text").addEventListener("input", renderPreview);
          wmSection.querySelector("#wm-orient").addEventListener("change", renderPreview);
          wmSection.querySelector("#wm-opacity").addEventListener("change", renderPreview);
          numSection.querySelector("#num-enable").addEventListener("change", updateControlsState);
          numSection.querySelector("#num-pos").addEventListener("change", renderPreview);
          numSection.querySelector("#num-format").addEventListener("change", renderPreview);

          function clearActiveFile() {
            fileBuffer = null;
            currentFile = null;
            firstPageCanvas = null;
            fileBarWrap.innerHTML = "";
            mainLayout.style.display = "none";
            if (dropzoneEl) dropzoneEl.style.display = "flex";
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, totalPages) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) clearBtn.addEventListener("click", () => clearActiveFile());
          }

          dropzoneEl = makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFile = unlocked.file;
              fileBuffer = unlocked.buffer;
              setStatus(status, "Carregando visualização...", "");

              try {
                const pdf = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
                pageCount = pdf.numPages;
                const page1 = await pdf.getPage(1);
                const vp = page1.getViewport({ scale: 0.6 });
                firstPageCanvas = document.createElement("canvas");
                firstPageCanvas.width = vp.width;
                firstPageCanvas.height = vp.height;
                await page1.render({ canvasContext: firstPageCanvas.getContext("2d"), viewport: vp }).promise;

                if (dropzoneEl) dropzoneEl.style.display = "none";
                renderLoadedBar(currentFile.name, pageCount);
                mainLayout.style.display = "grid";
                updateControlsState();
                setStatus(status, "");
              } catch (err) {
                setStatus(status, "Erro: " + err.message, "error");
              }
            }
          );

          btn.addEventListener("click", async () => {
            if (!fileBuffer || !currentFile) return;
            const wmEnable = wmSection.querySelector("#wm-enable").checked;
            const wmText = (wmSection.querySelector("#wm-text").value || "CONFIDENCIAL").trim();
            const wmOrient = wmSection.querySelector("#wm-orient").value;
            const wmOpacity = parseFloat(wmSection.querySelector("#wm-opacity").value || "0.3");

            const numEnable = numSection.querySelector("#num-enable").checked;
            const pos = numSection.querySelector("#num-pos").value;
            const fmt = numSection.querySelector("#num-format").value;

            btn.disabled = true;
            setStatus(status, "Aplicando alterações nas páginas...", "");

            try {
              const doc = await PDFDocument.load(fileBuffer.slice(0), { ignoreEncryption: true });
              const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
              const fontBold = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
              const pages = doc.getPages();
              const total = pages.length;

              pages.forEach((page, idx) => {
                const { width, height } = page.getSize();
                const curPageNum = idx + 1;

                if (wmEnable && wmText) {
                  const fontSize = Math.max(28, Math.round(width / 11));
                  const textWidth = fontBold.widthOfTextAtSize(wmText, fontSize);
                  const isDiag = wmOrient === "diagonal";
                  const rgb = hexToRgb(selectedColor);
                  const pdfColor = PDFLib.rgb(rgb.r / 255, rgb.g / 255, rgb.b / 255);

                  if (isDiag) {
                    const angleRad = Math.PI / 4;
                    const x = width / 2 - (textWidth / 2) * Math.cos(angleRad);
                    const y = height / 2 - (textWidth / 2) * Math.sin(angleRad);
                    page.drawText(wmText, {
                      x,
                      y,
                      size: fontSize,
                      font: fontBold,
                      color: pdfColor,
                      opacity: wmOpacity,
                      rotate: degrees(45),
                    });
                  } else {
                    const x = (width - textWidth) / 2;
                    const y = height / 2 - fontSize / 2;
                    page.drawText(wmText, {
                      x,
                      y,
                      size: fontSize,
                      font: fontBold,
                      color: pdfColor,
                      opacity: wmOpacity,
                    });
                  }
                }

                if (numEnable) {
                  let label = `Página ${curPageNum} de ${total}`;
                  if (fmt === "slash") label = `${curPageNum} / ${total}`;
                  else if (fmt === "simple-page") label = `Pág. ${curPageNum}`;
                  else if (fmt === "only-num") label = `${curPageNum}`;

                  const numSize = 10;
                  const numWidth = font.widthOfTextAtSize(label, numSize);
                  let x = (width - numWidth) / 2;
                  let y = 24;

                  if (pos === "bottom-right") {
                    x = width - numWidth - 36;
                    y = 24;
                  } else if (pos === "top-center") {
                    y = height - 32;
                  } else if (pos === "top-right") {
                    x = width - numWidth - 36;
                    y = height - 32;
                  }

                  page.drawText(label, {
                    x,
                    y,
                    size: numSize,
                    font: font,
                    color: PDFLib.rgb(0.3, 0.3, 0.3),
                  });
                }
              });

              const outBytes = await doc.save();
              const blob = new Blob([outBytes], { type: "application/pdf" });
              prepareSaveAction(status, btn);
              const outName = `${getBaseFilename(currentFile.name)}_personalizado.pdf`;
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro: " + err.message, "error");
              btn.disabled = false;
            }
          });

          container.appendChild(fileBarWrap);
          container.appendChild(mainLayout);
          container.appendChild(btn);
          container.appendChild(status);
        };

        // ---------- ASSINAR PDF ----------
        RENDERERS.sign = function (container) {
          container.innerHTML = `
            <h2><span class="workspace-title-icon">${SVG_ICONS.sign}</span> Assinar PDF</h2>
            <p class="hint">Desenhe sua assinatura ou importe uma imagem e posicione-a interativamente na página do documento.</p>
          `;

          let fileBuffer = null;
          let currentFile = null;
          let pdfJsDoc = null;
          let currentPageNum = 1;
          let totalPages = 1;
          let signatureDataUrl = null;

          // Posição e proporção relativa na página (0.0 até 1.0)
          let sigRelX = 0.55;
          let sigRelY = 0.80;
          let sigRelWidth = 0.32;
          let sigRelHeight = 0.12;

          let dropzoneEl = null;
          const fileBarWrap = document.createElement("div");
          fileBarWrap.className = "loaded-file-bar-wrap";

          const mainLayout = document.createElement("div");
          mainLayout.className = "sign-layout";
          mainLayout.style.display = "none";

          const controlsPanel = document.createElement("div");
          controlsPanel.className = "sign-controls";
          controlsPanel.innerHTML = `
            <div class="tool-section-box" style="margin:0;">
              <div class="sign-tabs-nav">
                <button type="button" class="sign-tab-btn active" id="tab-draw">Desenhar Assinatura</button>
                <button type="button" class="sign-tab-btn" id="tab-upload">Carregar Imagem</button>
              </div>

              <!-- Painel 1: Desenho -->
              <div id="draw-panel">
                <div class="sign-canvas-box">
                  <canvas id="sig-pad-canvas" width="310" height="140"></canvas>
                </div>
                <div class="sign-toolbar">
                  <div class="sign-color-picker">
                    <span style="font-size:11.5px;color:var(--muted);font-weight:600;">Caneta:</span>
                    <button type="button" class="sign-color-dot selected" data-color="#000000" style="background:#000000;" title="Preto"></button>
                    <button type="button" class="sign-color-dot" data-color="#1e3a8a" style="background:#1e3a8a;" title="Azul Caneta"></button>
                  </div>
                  <button type="button" class="sign-btn-clear" id="btn-clear-sig">Limpar</button>
                </div>
              </div>

              <!-- Painel 2: Upload -->
              <div id="upload-panel" style="display:none;">
                <label style="display:block;border:2px dashed var(--border);border-radius:var(--radius-sm);padding:22px 14px;text-align:center;cursor:pointer;background:var(--bg);">
                  <input type="file" id="sig-file-input" accept="image/png, image/jpeg, image/webp" style="display:none;" />
                  <span style="font-size:12px;font-weight:600;color:var(--ink);display:block;">Clique para escolher imagem</span>
                  <span style="font-size:11px;color:var(--muted);margin-top:4px;display:block;">PNG transparente ou foto de assinatura</span>
                </label>
                <div style="margin-top:10px;display:flex;align-items:center;gap:6px;">
                  <input type="checkbox" id="sig-remove-white" checked style="accent-color:var(--green);cursor:pointer;" />
                  <label for="sig-remove-white" style="font-size:12px;color:var(--ink-secondary);cursor:pointer;">Remover fundo branco da folha</label>
                </div>
              </div>
            </div>

            <div class="tool-section-box" style="margin:0;">
              <div class="tool-section-title" style="margin-bottom:8px;">Página & Ajustes</div>
              <div class="form-field-group">
                <label class="form-field-label">Página de Destino:</label>
                <select id="sig-target-page" class="select-native" style="width:100%;"></select>
              </div>
              <div class="form-field-group" style="margin-top:8px;">
                <label class="form-field-label">Tamanho da Assinatura:</label>
                <input type="range" id="sig-scale-slider" min="50" max="220" value="100" style="width:100%;accent-color:var(--green);cursor:pointer;" />
              </div>
              <div style="display:flex;gap:6px;margin-top:8px;">
                <button type="button" class="chip-btn" id="btn-pos-bottom-right" style="flex:1;">Rodapé Direito</button>
                <button type="button" class="chip-btn" id="btn-pos-bottom-center" style="flex:1;">Rodapé Centro</button>
              </div>
            </div>
          `;

          const previewPanel = document.createElement("div");
          previewPanel.className = "sign-preview-panel";
          previewPanel.innerHTML = `
            <div class="sign-page-nav">
              <button type="button" class="order-btn" id="sig-prev-page" title="Página Anterior">←</button>
              <span id="sig-page-indicator">Página 1 de 1</span>
              <button type="button" class="order-btn" id="sig-next-page" title="Próxima Página">→</button>
            </div>
            <div class="sign-page-container" id="sig-page-container">
              <canvas id="sign-doc-canvas" class="sign-page-canvas"></canvas>
              <div class="sig-overlay-badge" id="sig-overlay-badge" style="display:none;">
                <img id="sig-overlay-img" src="" alt="Assinatura" />
                <div class="sig-overlay-handle" id="sig-overlay-handle" title="Arraste para redimensionar"></div>
              </div>
            </div>
            <p style="font-size:11px;color:var(--muted);margin:4px 0 0;text-align:center;">
              Arraste a caixa verde para posicionar a assinatura no local desejado.
            </p>
          `;

          mainLayout.append(controlsPanel, previewPanel);

          const btn = document.createElement("button");
          btn.className = "action-btn";
          btn.textContent = "Assinar e Baixar PDF";
          btn.disabled = true;

          const status = statusEl(container);

          // Setup Canvas Desenho
          const padCanvas = controlsPanel.querySelector("#sig-pad-canvas");
          const padCtx = padCanvas.getContext("2d");
          let isDrawing = false;
          let penColor = "#000000";
          let penWidth = 2.5;
          let hasDrawn = false;

          function clearPad() {
            padCtx.clearRect(0, 0, padCanvas.width, padCanvas.height);
            hasDrawn = false;
            updateSigFromPad();
          }

          function getPadPos(e) {
            const rect = padCanvas.getBoundingClientRect();
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0]?.clientX);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0]?.clientY);
            return {
              x: (clientX - rect.left) * (padCanvas.width / rect.width),
              y: (clientY - rect.top) * (padCanvas.height / rect.height),
            };
          }

          function startDrawing(e) {
            e.preventDefault();
            isDrawing = true;
            const pos = getPadPos(e);
            padCtx.beginPath();
            padCtx.moveTo(pos.x, pos.y);
            padCtx.strokeStyle = penColor;
            padCtx.lineWidth = penWidth;
            padCtx.lineCap = "round";
            padCtx.lineJoin = "round";
          }

          function drawStroke(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPadPos(e);
            padCtx.lineTo(pos.x, pos.y);
            padCtx.stroke();
            hasDrawn = true;
          }

          function stopDrawing() {
            if (!isDrawing) return;
            isDrawing = false;
            padCtx.closePath();
            if (hasDrawn) {
              updateSigFromPad();
            }
          }

          padCanvas.addEventListener("mousedown", startDrawing);
          padCanvas.addEventListener("mousemove", drawStroke);
          window.addEventListener("mouseup", stopDrawing);
          padCanvas.addEventListener("touchstart", startDrawing, { passive: false });
          padCanvas.addEventListener("touchmove", drawStroke, { passive: false });
          padCanvas.addEventListener("touchend", stopDrawing);

          function updateSigFromPad() {
            if (!hasDrawn) {
              signatureDataUrl = null;
              overlayBadge.style.display = "none";
              btn.disabled = true;
              return;
            }
            signatureDataUrl = padCanvas.toDataURL("image/png");
            overlayImg.src = signatureDataUrl;
            overlayBadge.style.display = "flex";
            btn.disabled = false;
          }

          controlsPanel.querySelector("#btn-clear-sig").onclick = clearPad;

          controlsPanel.querySelectorAll(".sign-color-dot").forEach((dot) => {
            dot.onclick = () => {
              controlsPanel.querySelectorAll(".sign-color-dot").forEach((d) => d.classList.remove("selected"));
              dot.classList.add("selected");
              penColor = dot.dataset.color;
            };
          });

          // Tabs
          const tabDraw = controlsPanel.querySelector("#tab-draw");
          const tabUpload = controlsPanel.querySelector("#tab-upload");
          const drawPanel = controlsPanel.querySelector("#draw-panel");
          const uploadPanel = controlsPanel.querySelector("#upload-panel");

          tabDraw.onclick = () => {
            tabDraw.classList.add("active");
            tabUpload.classList.remove("active");
            drawPanel.style.display = "block";
            uploadPanel.style.display = "none";
            if (hasDrawn) updateSigFromPad();
          };

          tabUpload.onclick = () => {
            tabUpload.classList.add("active");
            tabDraw.classList.remove("active");
            uploadPanel.style.display = "block";
            drawPanel.style.display = "none";
          };

          // Upload de imagem
          const fileInput = controlsPanel.querySelector("#sig-file-input");
          const removeWhiteCheck = controlsPanel.querySelector("#sig-remove-white");

          fileInput.onchange = () => {
            if (!fileInput.files || !fileInput.files[0]) return;
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const tCtx = tempCanvas.getContext("2d");
                tCtx.drawImage(img, 0, 0);

                if (removeWhiteCheck.checked) {
                  const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                  const d = imgData.data;
                  for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i + 1], b = d[i + 2];
                    if (r > 220 && g > 220 && b > 220) {
                      d[i + 3] = 0;
                    }
                  }
                  tCtx.putImageData(imgData, 0, 0);
                }

                signatureDataUrl = tempCanvas.toDataURL("image/png");
                overlayImg.src = signatureDataUrl;
                overlayBadge.style.display = "flex";
                btn.disabled = false;
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          };

          // Overlay badge e movimentação
          const overlayBadge = previewPanel.querySelector("#sig-overlay-badge");
          const overlayImg = previewPanel.querySelector("#sig-overlay-img");
          const overlayHandle = previewPanel.querySelector("#sig-overlay-handle");
          const docCanvas = previewPanel.querySelector("#sign-doc-canvas");

          let isDragging = false;
          let isResizing = false;
          let dragStartX = 0;
          let dragStartY = 0;
          let initialBadgeLeft = 0;
          let initialBadgeTop = 0;
          let initialBadgeWidth = 0;
          let initialBadgeHeight = 0;

          function positionBadge() {
            if (!docCanvas.width) return;
            const cWidth = docCanvas.clientWidth || 400;
            const cHeight = docCanvas.clientHeight || 550;
            const bWidth = sigRelWidth * cWidth;
            const bHeight = sigRelHeight * cHeight;
            const bLeft = sigRelX * cWidth;
            const bTop = sigRelY * cHeight;

            overlayBadge.style.width = `${bWidth}px`;
            overlayBadge.style.height = `${bHeight}px`;
            overlayBadge.style.left = `${bLeft}px`;
            overlayBadge.style.top = `${bTop}px`;
          }

          overlayBadge.addEventListener("mousedown", (e) => {
            if (e.target === overlayHandle) return;
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialBadgeLeft = parseFloat(overlayBadge.style.left) || 0;
            initialBadgeTop = parseFloat(overlayBadge.style.top) || 0;
            e.preventDefault();
          });

          overlayHandle.addEventListener("mousedown", (e) => {
            isResizing = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialBadgeWidth = overlayBadge.clientWidth;
            initialBadgeHeight = overlayBadge.clientHeight;
            e.preventDefault();
            e.stopPropagation();
          });

          window.addEventListener("mousemove", (e) => {
            const cWidth = docCanvas.clientWidth || 400;
            const cHeight = docCanvas.clientHeight || 550;
            if (isDragging) {
              const dx = e.clientX - dragStartX;
              const dy = e.clientY - dragStartY;
              let newLeft = Math.max(0, Math.min(cWidth - overlayBadge.clientWidth, initialBadgeLeft + dx));
              let newTop = Math.max(0, Math.min(cHeight - overlayBadge.clientHeight, initialBadgeTop + dy));
              overlayBadge.style.left = `${newLeft}px`;
              overlayBadge.style.top = `${newTop}px`;
              sigRelX = newLeft / cWidth;
              sigRelY = newTop / cHeight;
            } else if (isResizing) {
              const dx = e.clientX - dragStartX;
              const newW = Math.max(50, Math.min(cWidth - parseFloat(overlayBadge.style.left), initialBadgeWidth + dx));
              const aspect = initialBadgeHeight / initialBadgeWidth || 0.4;
              const newH = newW * aspect;
              overlayBadge.style.width = `${newW}px`;
              overlayBadge.style.height = `${newH}px`;
              sigRelWidth = newW / cWidth;
              sigRelHeight = newH / cHeight;
            }
          });

          window.addEventListener("mouseup", () => {
            isDragging = false;
            isResizing = false;
          });

          // Slider de escala
          const scaleSlider = controlsPanel.querySelector("#sig-scale-slider");
          scaleSlider.addEventListener("input", () => {
            const scale = parseFloat(scaleSlider.value) / 100;
            sigRelWidth = 0.32 * scale;
            sigRelHeight = 0.12 * scale;
            positionBadge();
          });

          // Presets de posição
          controlsPanel.querySelector("#btn-pos-bottom-right").onclick = () => {
            sigRelX = 0.58;
            sigRelY = 0.82;
            positionBadge();
          };

          controlsPanel.querySelector("#btn-pos-bottom-center").onclick = () => {
            sigRelX = 0.34;
            sigRelY = 0.82;
            positionBadge();
          };

          async function renderCurrentDocumentPage() {
            if (!pdfJsDoc) return;
            const page = await pdfJsDoc.getPage(currentPageNum);
            const vp = page.getViewport({ scale: 0.8 });
            docCanvas.width = vp.width;
            docCanvas.height = vp.height;
            const ctx = docCanvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
            previewPanel.querySelector("#sig-page-indicator").textContent = `Página ${currentPageNum} de ${totalPages}`;
            previewPanel.querySelector("#sig-prev-page").disabled = currentPageNum <= 1;
            previewPanel.querySelector("#sig-next-page").disabled = currentPageNum >= totalPages;
            controlsPanel.querySelector("#sig-target-page").value = currentPageNum;
            positionBadge();
          }

          previewPanel.querySelector("#sig-prev-page").onclick = () => {
            if (currentPageNum > 1) {
              currentPageNum--;
              renderCurrentDocumentPage();
            }
          };

          previewPanel.querySelector("#sig-next-page").onclick = () => {
            if (currentPageNum < totalPages) {
              currentPageNum++;
              renderCurrentDocumentPage();
            }
          };

          const targetPageSelect = controlsPanel.querySelector("#sig-target-page");
          targetPageSelect.onchange = () => {
            currentPageNum = parseInt(targetPageSelect.value);
            renderCurrentDocumentPage();
          };

          function clearActiveFile() {
            fileBuffer = null;
            currentFile = null;
            pdfJsDoc = null;
            fileBarWrap.innerHTML = "";
            mainLayout.style.display = "none";
            if (dropzoneEl) dropzoneEl.style.display = "flex";
            btn.disabled = true;
            setStatus(status, "Arquivo fechado. Selecione ou arraste um novo PDF.", "");
          }

          function renderLoadedBar(name, total) {
            fileBarWrap.innerHTML = `
              <div class="loaded-file-bar">
                <div class="loaded-file-info">
                  <span class="loaded-file-icon">${SVG_ICONS.file}</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${total} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ${SVG_ICONS.close} Fechar arquivo
                </button>
              </div>
            `;
            const clearBtn = fileBarWrap.querySelector(".btn-clear-file");
            if (clearBtn) clearBtn.addEventListener("click", () => clearActiveFile());
          }

          dropzoneEl = makeDropzone(
            container,
            { label: "o PDF" },
            async (newFiles) => {
              if (!newFiles[0]) return;
              const unlocked = await ensurePdfFileUnlocked(newFiles[0], status);
              if (!unlocked) return;
              currentFile = unlocked.file;
              fileBuffer = unlocked.buffer;
              setStatus(status, "Carregando páginas...", "");

              try {
                pdfJsDoc = await pdfjsLib.getDocument({ data: fileBuffer.slice(0) }).promise;
                totalPages = pdfJsDoc.numPages;
                currentPageNum = 1;

                targetPageSelect.innerHTML = "";
                for (let i = 1; i <= totalPages; i++) {
                  const opt = document.createElement("option");
                  opt.value = i;
                  opt.textContent = `Página ${i} de ${totalPages}`;
                  targetPageSelect.appendChild(opt);
                }

                if (dropzoneEl) dropzoneEl.style.display = "none";
                renderLoadedBar(currentFile.name, totalPages);
                mainLayout.style.display = "grid";
                await renderCurrentDocumentPage();
                setStatus(status, "");
              } catch (err) {
                setStatus(status, "Erro: " + err.message, "error");
              }
            }
          );

          btn.addEventListener("click", async () => {
            if (!fileBuffer || !currentFile || !signatureDataUrl) return;
            btn.disabled = true;
            setStatus(status, "Incorporando assinatura no documento...", "");

            try {
              const doc = await PDFDocument.load(fileBuffer.slice(0), { ignoreEncryption: true });
              const sigImageBytes = await fetch(signatureDataUrl).then((r) => r.arrayBuffer());
              const embeddedSig = await doc.embedPng(sigImageBytes);

              const targetPageIdx = currentPageNum - 1;
              const page = doc.getPage(targetPageIdx);
              const { width, height } = page.getSize();

              const pdfWidth = sigRelWidth * width;
              const pdfHeight = sigRelHeight * height;
              const pdfX = sigRelX * width;
              // No sistema de coordenadas do PDF, Y = 0 fica na borda inferior
              const pdfY = height - (sigRelY * height) - pdfHeight;

              page.drawImage(embeddedSig, {
                x: pdfX,
                y: pdfY,
                width: pdfWidth,
                height: pdfHeight,
              });

              const outBytes = await doc.save();
              const blob = new Blob([outBytes], { type: "application/pdf" });
              prepareSaveAction(status, btn);
              const outName = `${getBaseFilename(currentFile.name)}_assinado.pdf`;
              await triggerDownload(blob, outName);
            } catch (err) {
              setStatus(status, "Erro ao assinar documento: " + err.message, "error");
              btn.disabled = false;
            }
          });

          container.appendChild(fileBarWrap);
          container.appendChild(mainLayout);
          container.appendChild(btn);
          container.appendChild(status);
        };

        // =====================================================================
        // v2.0 RENDERERS: OCR, REDACT, ANNOTATE, FORMS
        // =====================================================================

        // ---------- 1. OCR & Extrair Texto ----------
        RENDERERS.ocr = function (container) {
          const top = document.createElement("div");
          top.className = "workspace-tool-header";
          top.innerHTML = `
            <h2>${SVG_ICONS.ocr} OCR & Extrair Texto</h2>
            <p class="subtitle">Reconheça e extraia textos de páginas escaneadas usando o motor nativo Apple Vision.</p>
          `;
          container.appendChild(top);

          let currentFile = null;
          let ocrPagesData = [];
          let selectedPageIndex = 0;

          const dropWrap = document.createElement("div");
          container.appendChild(dropWrap);

          const mainWrap = document.createElement("div");
          mainWrap.className = "hidden";
          container.appendChild(mainWrap);

          const status = document.createElement("div");
          status.className = "status";
          container.appendChild(status);

          makeDropzone(dropWrap, { label: "um PDF para extrair texto" }, async (files) => {
            if (!files || !files.length) return;
            const file = files[0];
            setStatus(status, "Carregando documento...", "");
            const unlocked = await ensurePdfFileUnlocked(file, status);
            if (!unlocked) return;

            currentFile = unlocked.file;
            dropWrap.classList.add("hidden");
            mainWrap.classList.remove("hidden");
            setStatus(status, "Executando OCR com Apple Vision Neural Engine...", "");

            try {
              const results = await nativeOcrPdf(unlocked.buffer);
              ocrPagesData = results || [];
              setStatus(status, "");
              renderOcrUI();
            } catch (err) {
              console.error(err);
              setStatus(status, "Erro no OCR: " + err.message, "error");
            }
          });

          function renderOcrUI() {
            mainWrap.innerHTML = "";
            const layout = document.createElement("div");
            layout.className = "ocr-layout";

            const leftCol = document.createElement("div");
            leftCol.className = "ocr-left-col";

            const leftTitle = document.createElement("div");
            leftTitle.style.cssText = "font-size:12px;font-weight:600;color:var(--ink);display:flex;justify-content:space-between;align-items:center;";
            leftTitle.innerHTML = `<span>Páginas (${ocrPagesData.length})</span>`;
            leftCol.appendChild(leftTitle);

            const pagesList = document.createElement("div");
            pagesList.className = "ocr-pages-list";

            ocrPagesData.forEach((pg, idx) => {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = `ocr-page-btn ${idx === selectedPageIndex ? "active" : ""}`;
              const wordCount = (pg.text || "").trim().split(/\s+/).filter(Boolean).length;
              btn.innerHTML = `<span>Página ${pg.page}</span><span style="font-size:10px;opacity:0.7;">${wordCount} palavras</span>`;
              btn.onclick = () => {
                selectedPageIndex = idx;
                renderOcrUI();
              };
              pagesList.appendChild(btn);
            });
            leftCol.appendChild(pagesList);

            const allPagesBtn = document.createElement("button");
            allPagesBtn.type = "button";
            allPagesBtn.className = `ocr-page-btn ${selectedPageIndex === -1 ? "active" : ""}`;
            allPagesBtn.innerHTML = `<span>📄 Todas as Páginas</span><span style="font-size:10px;opacity:0.7;">Completo</span>`;
            allPagesBtn.onclick = () => {
              selectedPageIndex = -1;
              renderOcrUI();
            };
            leftCol.appendChild(allPagesBtn);

            layout.appendChild(leftCol);

            const rightCol = document.createElement("div");
            rightCol.className = "ocr-right-col";

            const currentText = selectedPageIndex === -1 
              ? ocrPagesData.map(p => `--- Página ${p.page} ---\n${p.text}`).join("\n\n")
              : (ocrPagesData[selectedPageIndex]?.text || "");

            const toolbar = document.createElement("div");
            toolbar.className = "ocr-toolbar";

            const statsSpan = document.createElement("span");
            statsSpan.style.cssText = "font-size:12px;color:var(--muted);";
            const words = currentText.trim().split(/\s+/).filter(Boolean).length;
            statsSpan.textContent = `${words} palavras • ${currentText.length} caracteres`;
            toolbar.appendChild(statsSpan);

            const actions = document.createElement("div");
            actions.className = "ocr-toolbar-actions";

            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "btn-secondary";
            copyBtn.innerHTML = `<span>Copiar Texto</span>`;
            copyBtn.onclick = async () => {
              await navigator.clipboard.writeText(textArea.value);
              copyBtn.innerHTML = `<span>✓ Copiado!</span>`;
              setTimeout(() => copyBtn.innerHTML = `<span>Copiar Texto</span>`, 1800);
            };
            actions.appendChild(copyBtn);

            const downloadTxtBtn = document.createElement("button");
            downloadTxtBtn.type = "button";
            downloadTxtBtn.className = "action-btn";
            downloadTxtBtn.innerHTML = `<span>Salvar .TXT</span>`;
            downloadTxtBtn.onclick = () => {
              prepareSaveAction(status, downloadTxtBtn);
              const blob = new Blob([textArea.value], { type: "text/plain;charset=utf-8" });
              const baseName = getBaseFilename(currentFile ? currentFile.name : "ocr_texto");
              triggerDownload(blob, `${baseName}_ocr.txt`);
            };
            actions.appendChild(downloadTxtBtn);

            toolbar.appendChild(actions);
            rightCol.appendChild(toolbar);

            const textArea = document.createElement("textarea");
            textArea.className = "ocr-text-area";
            textArea.value = currentText;
            rightCol.appendChild(textArea);

            layout.appendChild(rightCol);
            mainWrap.appendChild(layout);
          }
        };

        // ---------- 2. Tarjar Dados Sensíveis (Redact) ----------
        RENDERERS.redact = function (container) {
          const top = document.createElement("div");
          top.className = "workspace-tool-header";
          top.innerHTML = `
            <h2>${SVG_ICONS.redact} Tarjar Dados Sensíveis</h2>
            <p class="subtitle">Selecione áreas na página para aplicar tarjas pretas permanentes antes de compartilhar o documento.</p>
          `;
          container.appendChild(top);

          let currentFile = null;
          let pdfBuffer = null;
          let pdfDoc = null;
          let totalPages = 1;
          let currentPage = 1;
          const redactBoxesPerPage = {};

          const dropWrap = document.createElement("div");
          container.appendChild(dropWrap);

          const mainWrap = document.createElement("div");
          mainWrap.className = "hidden redact-container";
          container.appendChild(mainWrap);

          const status = document.createElement("div");
          status.className = "status";
          container.appendChild(status);

          makeDropzone(dropWrap, { label: "um PDF para tarjar informações" }, async (files) => {
            if (!files || !files.length) return;
            const file = files[0];
            setStatus(status, "Carregando PDF...", "");
            const unlocked = await ensurePdfFileUnlocked(file, status);
            if (!unlocked) return;

            currentFile = unlocked.file;
            pdfBuffer = unlocked.buffer;
            const doc = await pdfjsLib.getDocument({ data: pdfBuffer.slice(0) }).promise;
            pdfDoc = doc;
            totalPages = doc.numPages;
            currentPage = 1;

            dropWrap.classList.add("hidden");
            mainWrap.classList.remove("hidden");
            setStatus(status, "");
            renderPageUI();
          });

          async function renderPageUI() {
            mainWrap.innerHTML = "";

            const toolbar = document.createElement("div");
            toolbar.className = "redact-toolbar";

            const navWrap = document.createElement("div");
            navWrap.style.cssText = "display:flex;align-items:center;gap:8px;";
            navWrap.innerHTML = `
              <button type="button" class="btn-secondary" id="redact-prev" ${currentPage <= 1 ? "disabled" : ""}>← Anterior</button>
              <span style="font-size:12px;font-weight:600;color:var(--ink);">Página ${currentPage} de ${totalPages}</span>
              <button type="button" class="btn-secondary" id="redact-next" ${currentPage >= totalPages ? "disabled" : ""}>Próxima →</button>
            `;
            toolbar.appendChild(navWrap);

            const countBoxes = (redactBoxesPerPage[currentPage] || []).length;
            const totalAllBoxes = Object.values(redactBoxesPerPage).reduce((acc, arr) => acc + arr.length, 0);

            const infoSpan = document.createElement("span");
            infoSpan.style.cssText = "font-size:12px;color:var(--muted);";
            infoSpan.textContent = `Arraste o mouse sobre a página para desenhar tarjas (${countBoxes} nesta página, ${totalAllBoxes} no total)`;
            toolbar.appendChild(infoSpan);

            const actionBtns = document.createElement("div");
            actionBtns.style.cssText = "display:flex;gap:8px;align-items:center;";

            if (countBoxes > 0) {
              const clearBtn = document.createElement("button");
              clearBtn.type = "button";
              clearBtn.className = "btn-secondary";
              clearBtn.textContent = "Limpar página";
              clearBtn.onclick = () => {
                redactBoxesPerPage[currentPage] = [];
                renderPageUI();
              };
              actionBtns.appendChild(clearBtn);
            }

            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.className = "action-btn";
            saveBtn.textContent = "Aplicar Tarjas e Salvar";
            saveBtn.onclick = saveRedactedPdf;
            actionBtns.appendChild(saveBtn);

            toolbar.appendChild(actionBtns);
            mainWrap.appendChild(toolbar);

            navWrap.querySelector("#redact-prev").onclick = () => {
              if (currentPage > 1) { currentPage--; renderPageUI(); }
            };
            navWrap.querySelector("#redact-next").onclick = () => {
              if (currentPage < totalPages) { currentPage++; renderPageUI(); }
            };

            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale: 1.2 });

            const canvasWrapper = document.createElement("div");
            canvasWrapper.className = "redact-canvas-wrapper";
            canvasWrapper.style.width = viewport.width + "px";
            canvasWrapper.style.height = viewport.height + "px";

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            canvasWrapper.appendChild(canvas);

            const overlay = document.createElement("div");
            overlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;cursor:crosshair;";
            canvasWrapper.appendChild(overlay);

            const currentBoxes = redactBoxesPerPage[currentPage] || [];
            currentBoxes.forEach((box, bIdx) => {
              const bEl = document.createElement("div");
              bEl.className = "redact-box-overlay";
              bEl.style.left = (box.xPct * 100) + "%";
              bEl.style.top = (box.yPct * 100) + "%";
              bEl.style.width = (box.wPct * 100) + "%";
              bEl.style.height = (box.hPct * 100) + "%";
              bEl.textContent = "CONFIDENCIAL";

              const delBtn = document.createElement("button");
              delBtn.type = "button";
              delBtn.className = "redact-box-delete";
              delBtn.innerHTML = SVG_ICONS.close;
              delBtn.onclick = (e) => {
                e.stopPropagation();
                currentBoxes.splice(bIdx, 1);
                renderPageUI();
              };
              bEl.appendChild(delBtn);
              canvasWrapper.appendChild(bEl);
            });

            let isDrawing = false;
            let startX = 0, startY = 0;
            let tempBox = null;

            overlay.onmousedown = (e) => {
              const rect = canvasWrapper.getBoundingClientRect();
              startX = e.clientX - rect.left;
              startY = e.clientY - rect.top;
              isDrawing = true;

              tempBox = document.createElement("div");
              tempBox.className = "redact-box-overlay";
              tempBox.style.left = startX + "px";
              tempBox.style.top = startY + "px";
              tempBox.style.width = "0px";
              tempBox.style.height = "0px";
              canvasWrapper.appendChild(tempBox);
            };

            window.onmousemove = (e) => {
              if (!isDrawing || !tempBox) return;
              const rect = canvasWrapper.getBoundingClientRect();
              const curX = Math.max(0, Math.min(e.clientX - rect.left, viewport.width));
              const curY = Math.max(0, Math.min(e.clientY - rect.top, viewport.height));

              const left = Math.min(startX, curX);
              const top = Math.min(startY, curY);
              const w = Math.abs(curX - startX);
              const h = Math.abs(curY - startY);

              tempBox.style.left = left + "px";
              tempBox.style.top = top + "px";
              tempBox.style.width = w + "px";
              tempBox.style.height = h + "px";
            };

            window.onmouseup = (e) => {
              if (!isDrawing) return;
              isDrawing = false;
              if (!tempBox) return;

              const rect = canvasWrapper.getBoundingClientRect();
              const curX = Math.max(0, Math.min(e.clientX - rect.left, viewport.width));
              const curY = Math.max(0, Math.min(e.clientY - rect.top, viewport.height));

              const left = Math.min(startX, curX);
              const top = Math.min(startY, curY);
              const w = Math.abs(curX - startX);
              const h = Math.abs(curY - startY);

              if (tempBox.parentNode) tempBox.parentNode.removeChild(tempBox);
              tempBox = null;

              if (w > 10 && h > 10) {
                if (!redactBoxesPerPage[currentPage]) redactBoxesPerPage[currentPage] = [];
                redactBoxesPerPage[currentPage].push({
                  xPct: left / viewport.width,
                  yPct: top / viewport.height,
                  wPct: w / viewport.width,
                  hPct: h / viewport.height
                });
                renderPageUI();
              }
            };

            mainWrap.appendChild(canvasWrapper);
          }

          async function saveRedactedPdf() {
            setStatus(status, "Gerando PDF com tarjas definitivas...", "");
            try {
              const { PDFDocument, rgb } = PDFLib;
              const pdf = await PDFDocument.load(pdfBuffer.slice(0));
              const pages = pdf.getPages();

              for (let pIdx = 0; pIdx < pages.length; pIdx++) {
                const pageNum = pIdx + 1;
                const boxes = redactBoxesPerPage[pageNum];
                if (!boxes || !boxes.length) continue;

                const p = pages[pIdx];
                const { width, height } = p.getSize();

                for (const b of boxes) {
                  const pdfX = b.xPct * width;
                  const pdfW = b.wPct * width;
                  const pdfH = b.hPct * height;
                  const pdfY = height - (b.yPct * height) - pdfH;

                  p.drawRectangle({
                    x: pdfX,
                    y: pdfY,
                    width: pdfW,
                    height: pdfH,
                    color: rgb(0, 0, 0)
                  });
                }
              }

              const outBytes = await pdf.save();
              const baseName = getBaseFilename(currentFile ? currentFile.name : "documento");
              prepareSaveAction(status, null);
              const blob = new Blob([outBytes], { type: "application/pdf" });
              triggerDownload(blob, `${baseName}_tarjado.pdf`);
              setStatus(status, "");
            } catch (err) {
              console.error(err);
              setStatus(status, "Erro ao gerar PDF tarjado: " + err.message, "error");
            }
          }
        };

        // ---------- 3. Carimbos & Textos (Annotate) ----------
        RENDERERS.annotate = function (container) {
          const top = document.createElement("div");
          top.className = "workspace-tool-header";
          top.innerHTML = `
            <h2>${SVG_ICONS.annotate} Carimbos & Textos</h2>
            <p class="subtitle">Aplique carimbos oficiais rápidos e caixas de texto com caligrafia clara e precisa no documento.</p>
          `;
          container.appendChild(top);

          let currentFile = null;
          let pdfBuffer = null;
          let pdfDoc = null;
          let totalPages = 1;
          let currentPage = 1;
          // Items por página: { id, type: 'stamp'|'text', text, colorHex, xPct, yPct, size }
          const annotationsPerPage = {};

          const dropWrap = document.createElement("div");
          container.appendChild(dropWrap);

          const mainWrap = document.createElement("div");
          mainWrap.className = "hidden annotate-container";
          container.appendChild(mainWrap);

          const status = document.createElement("div");
          status.className = "status";
          container.appendChild(status);

          makeDropzone(dropWrap, { label: "um PDF para carimbar ou anotar" }, async (files) => {
            if (!files || !files.length) return;
            const file = files[0];
            setStatus(status, "Carregando PDF...", "");
            const unlocked = await ensurePdfFileUnlocked(file, status);
            if (!unlocked) return;

            currentFile = unlocked.file;
            pdfBuffer = unlocked.buffer;
            const doc = await pdfjsLib.getDocument({ data: pdfBuffer.slice(0) }).promise;
            pdfDoc = doc;
            totalPages = doc.numPages;
            currentPage = 1;

            dropWrap.classList.add("hidden");
            mainWrap.classList.remove("hidden");
            setStatus(status, "");
            renderAnnotateUI();
          });

          async function renderAnnotateUI() {
            mainWrap.innerHTML = "";

            // Paleta de Carimbos
            const palette = document.createElement("div");
            palette.className = "stamp-palette";
            palette.innerHTML = `<span style="font-size:12px;font-weight:600;color:var(--ink);">Carimbos Rápidos:</span>`;

            const STAMPS = [
              { label: "APROVADO", cls: "approved", hex: "#22c55e" },
              { label: "REJEITADO", cls: "rejected", hex: "#ef4444" },
              { label: "CONFIDENCIAL", cls: "confidential", hex: "#8b5cf6" },
              { label: "PAGO", cls: "paid", hex: "#f97316", suffixDate: true },
              { label: "CÓPIA", cls: "copy", hex: "#3b82f6" },
            ];

            STAMPS.forEach((st) => {
              const sBtn = document.createElement("button");
              sBtn.type = "button";
              sBtn.className = `stamp-badge-btn ${st.cls}`;
              sBtn.textContent = st.label;
              sBtn.onclick = () => {
                let txt = st.label;
                if (st.suffixDate) {
                  const today = new Date().toLocaleDateString("pt-BR");
                  txt += ` (${today})`;
                }
                addAnnotation({
                  type: "stamp",
                  text: txt,
                  colorHex: st.hex,
                  xPct: 0.35,
                  yPct: 0.4
                });
              };
              palette.appendChild(sBtn);
            });
            mainWrap.appendChild(palette);

            // Barra de Inserir Texto Livre
            const textBar = document.createElement("div");
            textBar.className = "text-add-bar";
            textBar.innerHTML = `
              <input type="text" id="ann-text-input" placeholder="Digite seu texto..." style="flex:1;min-width:200px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:6px 10px;font-size:12px;color:var(--ink);" />
              <select id="ann-color-select" style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:6px 8px;font-size:12px;color:var(--ink);">
                <option value="#0f172a">Preto</option>
                <option value="#2563eb">Azul</option>
                <option value="#dc2626">Vermelho</option>
                <option value="#16a34a">Verde</option>
              </select>
              <button type="button" class="btn-secondary" id="ann-add-btn">+ Inserir Texto</button>
            `;
            mainWrap.appendChild(textBar);

            textBar.querySelector("#ann-add-btn").onclick = () => {
              const input = textBar.querySelector("#ann-text-input");
              const textVal = input.value.trim();
              if (!textVal) return;
              const col = textBar.querySelector("#ann-color-select").value;
              addAnnotation({
                type: "text",
                text: textVal,
                colorHex: col,
                xPct: 0.3,
                yPct: 0.3
              });
              input.value = "";
            };

            // Navegação e Ações
            const navBar = document.createElement("div");
            navBar.className = "redact-toolbar";

            const navWrap = document.createElement("div");
            navWrap.style.cssText = "display:flex;align-items:center;gap:8px;";
            navWrap.innerHTML = `
              <button type="button" class="btn-secondary" id="ann-prev" ${currentPage <= 1 ? "disabled" : ""}>← Anterior</button>
              <span style="font-size:12px;font-weight:600;color:var(--ink);">Página ${currentPage} de ${totalPages}</span>
              <button type="button" class="btn-secondary" id="ann-next" ${currentPage >= totalPages ? "disabled" : ""}>Próxima →</button>
            `;
            navBar.appendChild(navWrap);

            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.className = "action-btn";
            saveBtn.textContent = "Aplicar e Salvar PDF";
            saveBtn.onclick = saveAnnotatedPdf;
            navBar.appendChild(saveBtn);
            mainWrap.appendChild(navBar);

            navWrap.querySelector("#ann-prev").onclick = () => {
              if (currentPage > 1) { currentPage--; renderAnnotateUI(); }
            };
            navWrap.querySelector("#ann-next").onclick = () => {
              if (currentPage < totalPages) { currentPage++; renderAnnotateUI(); }
            };

            // Canvas de Renderização
            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale: 1.2 });

            const canvasWrapper = document.createElement("div");
            canvasWrapper.className = "redact-canvas-wrapper";
            canvasWrapper.style.width = viewport.width + "px";
            canvasWrapper.style.height = viewport.height + "px";

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            canvasWrapper.appendChild(canvas);

            // Renderizar itens desta página
            const items = annotationsPerPage[currentPage] || [];
            items.forEach((item, itIdx) => {
              const el = document.createElement("div");
              el.style.cssText = `
                position: absolute;
                left: ${item.xPct * 100}%;
                top: ${item.yPct * 100}%;
                cursor: move;
                user-select: none;
                z-index: 10;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: ${item.type === "stamp" ? "6px 14px" : "4px 8px"};
                border-radius: ${item.type === "stamp" ? "6px" : "4px"};
                font-size: ${item.type === "stamp" ? "14px" : "13px"};
                font-weight: 700;
                letter-spacing: ${item.type === "stamp" ? "0.06em" : "normal"};
                color: ${item.colorHex};
                border: ${item.type === "stamp" ? `2.5px dashed ${item.colorHex}` : `1px dashed ${item.colorHex}`};
                background: rgba(255, 255, 255, 0.88);
                box-shadow: 0 2px 6px rgba(0,0,0,0.12);
              `;
              el.textContent = item.text;

              const delBtn = document.createElement("button");
              delBtn.type = "button";
              delBtn.className = "redact-box-delete";
              delBtn.innerHTML = SVG_ICONS.close;
              delBtn.onclick = (e) => {
                e.stopPropagation();
                items.splice(itIdx, 1);
                renderAnnotateUI();
              };
              el.appendChild(delBtn);

              // Arrastar elemento
              let isDraggingEl = false;
              let dragOffsetX = 0, dragOffsetY = 0;

              el.onmousedown = (e) => {
                if (e.target.closest("button")) return;
                e.stopPropagation();
                isDraggingEl = true;
                const rect = el.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
              };

              window.addEventListener("mousemove", (e) => {
                if (!isDraggingEl) return;
                const cRect = canvasWrapper.getBoundingClientRect();
                const newLeft = e.clientX - cRect.left - dragOffsetX;
                const newTop = e.clientY - cRect.top - dragOffsetY;

                const clampedX = Math.max(0, Math.min(newLeft, viewport.width - el.offsetWidth));
                const clampedY = Math.max(0, Math.min(newTop, viewport.height - el.offsetHeight));

                item.xPct = clampedX / viewport.width;
                item.yPct = clampedY / viewport.height;
                el.style.left = (item.xPct * 100) + "%";
                el.style.top = (item.yPct * 100) + "%";
              });

              window.addEventListener("mouseup", () => {
                isDraggingEl = false;
              });

              canvasWrapper.appendChild(el);
            });

            mainWrap.appendChild(canvasWrapper);
          }

          function addAnnotation(ann) {
            if (!annotationsPerPage[currentPage]) annotationsPerPage[currentPage] = [];
            annotationsPerPage[currentPage].push(ann);
            renderAnnotateUI();
          }

          async function saveAnnotatedPdf() {
            setStatus(status, "Gravando anotações e carimbos no PDF...", "");
            try {
              const { PDFDocument, rgb, StandardFonts } = PDFLib;
              const pdf = await PDFDocument.load(pdfBuffer.slice(0));
              const font = await pdf.embedFont(StandardFonts.HelveticaBold);
              const pages = pdf.getPages();

              for (let pIdx = 0; pIdx < pages.length; pIdx++) {
                const pageNum = pIdx + 1;
                const items = annotationsPerPage[pageNum];
                if (!items || !items.length) continue;

                const p = pages[pIdx];
                const { width, height } = p.getSize();

                for (const it of items) {
                  const fontSize = it.type === "stamp" ? 16 : 13;
                  const textWidth = font.widthOfTextAtSize(it.text, fontSize);
                  const textHeight = font.heightAtSize(fontSize);

                  const pdfX = it.xPct * width;
                  const pdfY = height - (it.yPct * height) - textHeight;
                  const rgbCol = hexToRgb(it.colorHex);

                  if (it.type === "stamp") {
                    p.drawRectangle({
                      x: pdfX - 8,
                      y: pdfY - 5,
                      width: textWidth + 16,
                      height: textHeight + 10,
                      borderColor: rgb(rgbCol.r / 255, rgbCol.g / 255, rgbCol.b / 255),
                      borderWidth: 2,
                      color: rgb(1, 1, 1),
                      opacity: 0.85
                    });
                  }

                  p.drawText(it.text, {
                    x: pdfX,
                    y: pdfY,
                    size: fontSize,
                    font: font,
                    color: rgb(rgbCol.r / 255, rgbCol.g / 255, rgbCol.b / 255)
                  });
                }
              }

              const outBytes = await pdf.save();
              const baseName = getBaseFilename(currentFile ? currentFile.name : "documento");
              prepareSaveAction(status, null);
              const blob = new Blob([outBytes], { type: "application/pdf" });
              triggerDownload(blob, `${baseName}_anotado.pdf`);
              setStatus(status, "");
            } catch (err) {
              console.error(err);
              setStatus(status, "Erro ao gravar anotações: " + err.message, "error");
            }
          }
        };

        // ---------- 4. Preencher Formulário (Forms) ----------
        RENDERERS.forms = function (container) {
          const top = document.createElement("div");
          top.className = "workspace-tool-header";
          top.innerHTML = `
            <h2>${SVG_ICONS.forms} Preencher Formulário</h2>
            <p class="subtitle">Identifique e preencha campos interativos de formulários oficiais (AcroForms) e congele as respostas.</p>
          `;
          container.appendChild(top);

          let currentFile = null;
          let pdfBuffer = null;
          let detectedFields = [];

          const dropWrap = document.createElement("div");
          container.appendChild(dropWrap);

          const mainWrap = document.createElement("div");
          mainWrap.className = "hidden";
          container.appendChild(mainWrap);

          const status = document.createElement("div");
          status.className = "status";
          container.appendChild(status);

          makeDropzone(dropWrap, { label: "um PDF com formulário para preencher" }, async (files) => {
            if (!files || !files.length) return;
            const file = files[0];
            setStatus(status, "Inspecionando campos do formulário...", "");
            const unlocked = await ensurePdfFileUnlocked(file, status);
            if (!unlocked) return;

            currentFile = unlocked.file;
            pdfBuffer = unlocked.buffer;

            try {
              const { PDFDocument } = PDFLib;
              const pdf = await PDFDocument.load(pdfBuffer.slice(0));
              const form = pdf.getForm();
              const fields = form.getFields();

              detectedFields = fields.map(f => {
                const name = f.getName();
                const type = f.constructor ? f.constructor.name : "Field";
                let val = "";
                try {
                  if (typeof f.getText === "function") val = f.getText() || "";
                  else if (typeof f.isChecked === "function") val = f.isChecked();
                } catch(e) {}
                return { name, type, value: val, fieldRef: f };
              });

              dropWrap.classList.add("hidden");
              mainWrap.classList.remove("hidden");
              setStatus(status, "");
              renderFormUI();
            } catch (err) {
              console.error(err);
              setStatus(status, "Erro ao inspecionar formulário: " + err.message, "error");
            }
          });

          function renderFormUI() {
            mainWrap.innerHTML = "";

            if (!detectedFields || detectedFields.length === 0) {
              const emptyCard = document.createElement("div");
              emptyCard.style.cssText = "background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:32px;text-align:center;max-width:540px;margin:20px auto;";
              emptyCard.innerHTML = `
                <div style="font-size:32px;margin-bottom:12px;">📑</div>
                <h3 style="margin:0 0 8px;font-size:15px;color:var(--ink);">Nenhum campo interativo encontrado</h3>
                <p style="margin:0 0 20px;font-size:12px;color:var(--muted);line-height:1.5;">
                  Este PDF não possui campos de formulário pré-configurados (AcroForms).<br />
                  Você pode usar a ferramenta <strong>Carimbos & Textos</strong> ou <strong>Assinar PDF</strong> para adicionar texto e assinaturas livremente sobre as páginas.
                </p>
                <button type="button" class="action-btn" onclick="openTool('annotate')">Ir para Carimbos & Textos</button>
              `;
              mainWrap.appendChild(emptyCard);
              return;
            }

            const headerBar = document.createElement("div");
            headerBar.className = "redact-toolbar";

            const info = document.createElement("div");
            info.innerHTML = `<strong>${detectedFields.length} campos detectados</strong> <span style="color:var(--muted);font-size:12px;">• Preencha abaixo</span>`;
            headerBar.appendChild(info);

            const optionsWrap = document.createElement("div");
            optionsWrap.style.cssText = "display:flex;align-items:center;gap:14px;";
            optionsWrap.innerHTML = `
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink);cursor:pointer;">
                <input type="checkbox" id="flatten-form-toggle" checked />
                <span>Achatar formulário (congelar respostas)</span>
              </label>
              <button type="button" class="action-btn" id="save-form-btn">Salvar Formulário Preenchido</button>
            `;
            headerBar.appendChild(optionsWrap);
            mainWrap.appendChild(headerBar);

            optionsWrap.querySelector("#save-form-btn").onclick = saveFilledForm;

            const grid = document.createElement("div");
            grid.className = "forms-fields-list";

            detectedFields.forEach((f, idx) => {
              const card = document.createElement("div");
              card.className = "form-field-card";

              const label = document.createElement("div");
              label.className = "form-field-label";
              label.innerHTML = `<span>${f.name || `Campo ${idx + 1}`}</span><span class="form-field-type">${f.type.replace("PDF", "")}</span>`;
              card.appendChild(label);

              if (f.type.includes("CheckBox")) {
                const cbWrap = document.createElement("label");
                cbWrap.style.cssText = "display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink);cursor:pointer;margin-top:4px;";
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = !!f.value;
                cb.onchange = () => { f.value = cb.checked; };
                cbWrap.appendChild(cb);
                cbWrap.appendChild(document.createTextNode("Marcado / Selecionado"));
                card.appendChild(cbWrap);
              } else {
                const inp = document.createElement("input");
                inp.type = "text";
                inp.value = f.value || "";
                inp.style.cssText = "background:var(--card);border:1px solid var(--border);border-radius:6px;padding:7px 10px;font-size:12px;color:var(--ink);outline:none;";
                inp.oninput = () => { f.value = inp.value; };
                card.appendChild(inp);
              }

              grid.appendChild(card);
            });

            mainWrap.appendChild(grid);
          }

          async function saveFilledForm() {
            setStatus(status, "Aplicando respostas e gerando PDF...", "");
            try {
              const { PDFDocument } = PDFLib;
              const pdf = await PDFDocument.load(pdfBuffer.slice(0));
              const form = pdf.getForm();

              detectedFields.forEach(f => {
                try {
                  const field = form.getField(f.name);
                  if (f.type.includes("CheckBox")) {
                    if (f.value) field.check();
                    else field.uncheck();
                  } else if (typeof field.setText === "function") {
                    field.setText(f.value || "");
                  }
                } catch(e) {
                  console.warn("Erro ao definir campo:", f.name, e);
                }
              });

              const shouldFlatten = document.getElementById("flatten-form-toggle")?.checked;
              if (shouldFlatten) {
                form.flatten();
              }

              const outBytes = await pdf.save();
              const baseName = getBaseFilename(currentFile ? currentFile.name : "formulario");
              prepareSaveAction(status, null);
              const blob = new Blob([outBytes], { type: "application/pdf" });
              triggerDownload(blob, `${baseName}_preenchido.pdf`);
              setStatus(status, "");
            } catch (err) {
              console.error(err);
              setStatus(status, "Erro ao salvar formulário: " + err.message, "error");
            }
          }
        };

        // ---------- GERENCIADOR DE TEMA (CLARO / ESCURO / AUTO) ----------
        function initThemeSwitcher() {
          const saved = localStorage.getItem("pdf_tool_theme") || "auto";
          setTheme(saved);
          document.querySelectorAll(".theme-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
              setTheme(btn.dataset.themeMode);
            });
          });
        }

        function setTheme(mode) {
          localStorage.setItem("pdf_tool_theme", mode);
          if (mode === "auto") {
            document.documentElement.removeAttribute("data-theme");
          } else {
            document.documentElement.setAttribute("data-theme", mode);
          }
          document.querySelectorAll(".theme-btn").forEach((b) => {
            b.classList.toggle("active", b.dataset.themeMode === mode);
          });
        }

        // ---------- QUICK LOOK MODAL (ZOOM AMPLIADO) ----------
        let quickLookDoc = null;
        let quickLookCurrentPage = 1;
        let quickLookTotalPages = 1;

        window.openQuickLook = async function(pdfDocOrBuffer, startPage = 1) {
          try {
            let pdf = null;
            if (pdfDocOrBuffer && typeof pdfDocOrBuffer.getPage === "function") {
              pdf = pdfDocOrBuffer;
            } else if (pdfDocOrBuffer) {
              pdf = await pdfjsLib.getDocument({ data: pdfDocOrBuffer.slice(0) }).promise;
            }
            if (!pdf) return;
            quickLookDoc = pdf;
            quickLookTotalPages = pdf.numPages;
            quickLookCurrentPage = Math.max(1, Math.min(startPage, quickLookTotalPages));
            const overlay = document.getElementById("quick-look-overlay");
            if (overlay) overlay.classList.remove("hidden");
            await renderQuickLookPage(quickLookCurrentPage);
          } catch (err) {
            console.warn("Erro ao abrir Quick Look:", err);
          }
        };

        async function renderQuickLookPage(pageNum) {
          if (!quickLookDoc) return;
          quickLookCurrentPage = pageNum;
          const title = document.getElementById("quick-look-title");
          const prevBtn = document.getElementById("quick-look-prev");
          const nextBtn = document.getElementById("quick-look-next");
          const canvas = document.getElementById("quick-look-canvas");

          if (title) title.textContent = `Página ${pageNum} de ${quickLookTotalPages}`;
          if (prevBtn) prevBtn.disabled = pageNum <= 1;
          if (nextBtn) nextBtn.disabled = pageNum >= quickLookTotalPages;

          try {
            const page = await quickLookDoc.getPage(pageNum);
            const vp = page.getViewport({ scale: 1.6 });
            canvas.width = vp.width;
            canvas.height = vp.height;
            const ctx = canvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
          } catch (err) {
            console.warn("Erro renderizando página no Quick Look:", err);
          }
        }

        function closeQuickLook() {
          const overlay = document.getElementById("quick-look-overlay");
          if (overlay) overlay.classList.add("hidden");
          quickLookDoc = null;
        }

        function initQuickLookEvents() {
          const overlay = document.getElementById("quick-look-overlay");
          const closeBtn = document.getElementById("quick-look-close");
          const prevBtn = document.getElementById("quick-look-prev");
          const nextBtn = document.getElementById("quick-look-next");

          if (closeBtn) closeBtn.onclick = closeQuickLook;
          if (overlay) {
            overlay.onclick = (e) => {
              if (e.target === overlay) closeQuickLook();
            };
          }
          if (prevBtn) {
            prevBtn.onclick = () => {
              if (quickLookCurrentPage > 1) renderQuickLookPage(quickLookCurrentPage - 1);
            };
          }
          if (nextBtn) {
            nextBtn.onclick = () => {
              if (quickLookCurrentPage < quickLookTotalPages) renderQuickLookPage(quickLookCurrentPage + 1);
            };
          }

          document.addEventListener("keydown", (e) => {
            if (overlay && !overlay.classList.contains("hidden")) {
              if (e.key === "Escape" || e.code === "Space") {
                e.preventDefault();
                closeQuickLook();
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                if (quickLookCurrentPage > 1) renderQuickLookPage(quickLookCurrentPage - 1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                if (quickLookCurrentPage < quickLookTotalPages) renderQuickLookPage(quickLookCurrentPage + 1);
              }
            }
          });
        }

        // Inicializar componentes globais
        initThemeSwitcher();
        initQuickLookEvents();
// Prevenir comportamento padrão do navegador ao arrastar arquivos na janela
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

// Callbacks nativos do macOS
window.onNativeSaveSuccess = function (filename, fullPath) {
  if (currentSaveBtn) currentSaveBtn.disabled = false;
  renderSavedFileSuccess({ filename, fullPath, isFolder: false });
};

window.onNativeBatchSaveSuccess = function (count, folderName, fullPath) {
  if (currentSaveBtn) currentSaveBtn.disabled = false;
  renderSavedFileSuccess({ filename: folderName, fullPath, isFolder: true, count });
};

window.onNativeSaveCancelled = function () {
  if (currentSaveBtn) currentSaveBtn.disabled = false;
  if (currentActiveStatusEl) {
    setStatus(currentActiveStatusEl, "Operação cancelada.", "");
  }
};

// Fechar modal toast ou modal de senha ao clicar fora ou pressionar Escape
document.addEventListener("click", (e) => {
  const pwdOverlay = document.getElementById("password-modal-overlay");
  if (pwdOverlay && !pwdOverlay.classList.contains("hidden") && e.target === pwdOverlay) {
    if (currentPasswordPrompt) currentPasswordPrompt.cancel();
    return;
  }
  const overlay = document.getElementById("save-toast-overlay");
  if (overlay && !overlay.classList.contains("hidden") && e.target === overlay) {
    closeToastAndGoHome();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const pwdOverlay = document.getElementById("password-modal-overlay");
    if (pwdOverlay && !pwdOverlay.classList.contains("hidden")) {
      if (currentPasswordPrompt) currentPasswordPrompt.cancel();
      return;
    }
    const overlay = document.getElementById("save-toast-overlay");
    if (overlay && !overlay.classList.contains("hidden")) {
      closeToastAndGoHome();
    } else if (document.getElementById("workspace").classList.contains("active")) {
      goHome();
    }
  }
});

// Atalhos nativos acionados pelo menu Arquivo (mac/main.swift)
window.triggerOpenFileShortcut = function () {
  const overlay = document.getElementById("save-toast-overlay");
  if (overlay && !overlay.classList.contains("hidden")) return;
  const activeInput = document.querySelector(".workspace.active .dropzone-input");
  if (activeInput) {
    activeInput.click();
  } else {
    openTool("split");
    setTimeout(() => {
      document.querySelector(".workspace.active .dropzone-input")?.click();
    }, 120);
  }
};

window.triggerSaveShortcut = function () {
  const overlay = document.getElementById("save-toast-overlay");
  if (overlay && !overlay.classList.contains("hidden")) return;
  if (currentSaveBtn && !currentSaveBtn.disabled) {
    currentSaveBtn.click();
  } else {
    const btn = document.querySelector(".workspace.active .action-btn:not(:disabled)");
    if (btn) btn.click();
  }
};

// Integração com arquivos abertos via Dock ou Finder
window.onExternalFileOpen = function (filename, fullPath, base64) {
  if (!base64) return;
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const mime = filename.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg";
    const file = new File([bytes], filename, { type: mime });

    const ws = document.getElementById("workspace");
    if (ws && ws.classList.contains("active") && window.currentDropzoneHandler) {
      window.currentDropzoneHandler([file]);
    } else {
      openTool("split");
      setTimeout(() => {
        if (window.currentDropzoneHandler) {
          window.currentDropzoneHandler([file]);
        }
      }, 100);
    }
  } catch (err) {
    console.warn("Erro ao carregar arquivo externo:", err);
  }
};
