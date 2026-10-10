const { PDFDocument, degrees } = PDFLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";

        const TOOLS = [
          {
            id: "merge",
            icon: "🧩",
            title: "Combinar PDF",
            desc: "Combine vários PDFs em um único arquivo, na ordem que quiser.",
          },
          {
            id: "split",
            icon: "✂️",
            title: "Extrair páginas",
            desc: "Selecione páginas específicas e extraia-as em um novo PDF.",
          },
          {
            id: "rotate",
            icon: "🔄",
            title: "Girar PDF",
            desc: "Gire páginas do seu PDF 90°, 180° ou 270°.",
          },
          {
            id: "remove",
            icon: "🗑️",
            title: "Remover páginas",
            desc: "Escolha quais páginas remover do PDF.",
          },
          {
            id: "pdf2jpg",
            icon: "🖼️",
            title: "PDF para JPG",
            desc: "Converta cada página do PDF em uma imagem JPG.",
          },
          {
            id: "jpg2pdf",
            icon: "📷",
            title: "JPG para PDF",
            desc: "Converta uma ou mais imagens em um único PDF.",
          },
        ];

        function renderHome() {
          const grid = document.getElementById("tool-grid");
          grid.innerHTML = TOOLS.map(
            (t) => `
    <div class="tool-card" onclick="openTool('${t.id}')">
      <div class="icon">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
    </div>
  `,
          ).join("");
        }
        renderHome();

        function goHome() {
          if (currentPasswordPrompt) currentPasswordPrompt.cancel();
          const overlay = document.getElementById("save-toast-overlay");
          if (overlay) overlay.classList.add("hidden");
          currentActiveStatusEl = null;
          currentSaveBtn = null;
          window.currentDropzoneHandler = null;
          document.getElementById("home-screen").style.display =
            "block";
          document
            .getElementById("workspace")
            .classList.remove("active");
          document.getElementById("workspace-content").innerHTML = "";
        }

        function openTool(id) {
          document.getElementById("home-screen").style.display =
            "none";
          const ws = document.getElementById("workspace");
          ws.classList.add("active");
          const content =
            document.getElementById("workspace-content");
          content.innerHTML = "";
          RENDERERS[id](content);
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
            eyeBtn.textContent = "👁️";
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
              eyeBtn.textContent = input.type === "password" ? "👁️" : "🔒";
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
            badge.textContent = "✓";
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
            closeBtn.textContent = "×";
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
            '<h2>🧩 Combinar PDF</h2><p class="hint">Adicione dois ou mais PDFs. Arraste os cartões (ou use as setas) para definir a ordem final antes de unir.</p>';
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
                ph.style.padding = "30px 6px";
                ph.style.fontSize = "28px";
                ph.textContent = "📄";
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
              leftBtn.textContent = "←";
              leftBtn.title = "Mover para a esquerda";
              leftBtn.disabled = i === 0;
              leftBtn.style.cssText =
                "border:1px solid var(--border);background:white;border-radius:6px;cursor:pointer;padding:2px 8px;";
              leftBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === 0) return;
                [files[i - 1], files[i]] = [files[i], files[i - 1]];
                renderList();
              });
              const rightBtn = document.createElement("button");
              rightBtn.textContent = "→";
              rightBtn.title = "Mover para a direita";
              rightBtn.disabled = i === files.length - 1;
              rightBtn.style.cssText =
                "border:1px solid var(--border);background:white;border-radius:6px;cursor:pointer;padding:2px 8px;";
              rightBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === files.length - 1) return;
                [files[i + 1], files[i]] = [files[i], files[i + 1]];
                renderList();
              });
              // Rotate button per file (rotates ALL pages of this file when merging)
              const rotBtn = document.createElement("button");
              rotBtn.className = "card-rot-btn";
              rotBtn.textContent = "⟳";
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
              rm.textContent = "✕";
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
            rb.textContent = "⟳";
            rb.title = "Girar 90°";
            rb.addEventListener("click", (e) => {
              e.stopPropagation();
              const p = parseInt(thumb.dataset.page);
              state.rotations[p] = (state.rotations[p] + 90) % 360;
              canvas.style.transform = `rotate(${state.rotations[p]}deg)`;
            });
            thumb.appendChild(rb);

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
            '<h2>✂️ Extrair páginas</h2><p class="hint">Selecione as páginas que você quer extrair para um novo PDF.</p>';
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
                  <span class="loaded-file-icon">📄</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ✕ Fechar arquivo
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
                setStatus(status, "⚠️ " + err.message, "error");
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
            '<h2>🗑️ Remover páginas</h2><p class="hint">Clique no ícone da lixeira 🗑️ para sinalizar a página em vermelho (marcada para exclusão). Se precisar, você pode clicar em ↩️ Restaurar a qualquer momento.</p>';
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
                  <span class="loaded-file-icon">📄</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ✕ Fechar arquivo
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
              rb.textContent = "⟳";
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
                tb.innerHTML = "🗑️";
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
                restoreBtn.innerHTML = "↩️ Restaurar";
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
                    "Clique no ícone da lixeira 🗑️ para sinalizar as páginas que deseja excluir.",
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
            '<h2>🔄 Girar PDF</h2><p class="hint">Clique no botão ⟳ em cada página para girá-la 90° individualmente, ou use os botões abaixo para girar todas de uma vez.</p>';
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
          btnRotateAllRight.textContent = "⟳ Girar Todas 90°";
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
          btnRotateAllLeft.textContent = "↺ Girar Todas -90°";
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
                  <span class="loaded-file-icon">📄</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ✕ Fechar arquivo
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
                setStatus(status, "⚠️ " + err.message, "error");
                return;
              }
              setStatus(
                status,
                "Clique no botão ⟳ em cada página ou use os botões abaixo para girar todas.",
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
            '<h2>🖼️ PDF para JPG</h2><p class="hint">Selecione as páginas que deseja converter. Use ⟳ para girar antes de baixar.</p>';

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
                  <span class="loaded-file-icon">📄</span>
                  <span class="loaded-file-name" title="${name}">${name}</span>
                  <span class="loaded-file-pages">(${totalPages} pág.)</span>
                </div>
                <button type="button" class="btn-clear-file" title="Fechar este arquivo">
                  ✕ Fechar arquivo
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
                  check.textContent = "✓";
                  const rotBtn = document.createElement("button");
                  rotBtn.type = "button";
                  rotBtn.className = "rotate-btn";
                  rotBtn.textContent = "⟳";
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
            '<h2>📷 JPG para PDF</h2><p class="hint">Selecione uma ou mais imagens (JPG/PNG). Arraste os cartões pelo mouse (ou use as setas) para reordenar — essa será a ordem das páginas no PDF final.</p>';
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
          btnV.textContent = "📄 Vertical";
          const btnH = document.createElement("button");
          btnH.textContent = "🖼️ Horizontal";
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
              leftBtn.textContent = "←";
              leftBtn.title = "Mover para a esquerda";
              leftBtn.disabled = i === 0;
              leftBtn.style.cssText =
                "border:1px solid var(--border);background:white;border-radius:6px;cursor:pointer;padding:2px 8px;";
              leftBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === 0) return;
                [files[i - 1], files[i]] = [files[i], files[i - 1]];
                renderThumbsList();
              });
              const rightBtn = document.createElement("button");
              rightBtn.textContent = "→";
              rightBtn.title = "Mover para a direita";
              rightBtn.disabled = i === files.length - 1;
              rightBtn.style.cssText =
                "border:1px solid var(--border);background:white;border-radius:6px;cursor:pointer;padding:2px 8px;";
              rightBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i === files.length - 1) return;
                [files[i + 1], files[i]] = [files[i], files[i + 1]];
                renderThumbsList();
              });
              // Rotate button per image
              const rotBtn = document.createElement("button");
              rotBtn.className = "card-rot-btn";
              rotBtn.textContent = "⟳";
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
              rm.textContent = "✕";
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
