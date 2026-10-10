import Cocoa
import WebKit
import UniformTypeIdentifiers
import PDFKit
import Vision

// MARK: - Application Delegate
class AppDelegate: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKUIDelegate, WKNavigationDelegate {
    var window: NSWindow!
    var webView: WKWebView!

    func applicationDidFinishLaunching(_ notification: Notification) {
        setupMainMenu()
        setupWindow()
        loadApplicationContent()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        if !flag {
            window?.makeKeyAndOrderFront(nil)
        }
        return true
    }

    private var pendingExternalFilePath: String?

    func application(_ sender: NSApplication, openFiles filenames: [String]) {
        guard let first = filenames.first else { return }
        handleExternalFile(path: first)
    }

    func application(_ sender: NSApplication, openFile filename: String) -> Bool {
        handleExternalFile(path: filename)
        return true
    }

    private func handleExternalFile(path: String) {
        guard webView != nil else {
            pendingExternalFilePath = path
            return
        }
        let url = URL(fileURLWithPath: path)
        let filename = url.lastPathComponent
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "'", with: "\\'")
        let escapedPath = url.path
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "'", with: "\\'")
        var base64 = ""
        if let data = try? Data(contentsOf: url) {
            base64 = data.base64EncodedString()
        }
        let js = "window.onExternalFileOpen && window.onExternalFileOpen('\(filename)', '\(escapedPath)', '\(base64)');"
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
            self?.webView?.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    // MARK: - Menu Setup
    private func setupMainMenu() {
        let mainMenu = NSMenu()
        NSApp.mainMenu = mainMenu

        // 1. App Menu
        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)
        let appMenu = NSMenu(title: "PDF Tool")
        appMenuItem.submenu = appMenu

        appMenu.addItem(withTitle: "Sobre o PDF Tool", action: #selector(showAbout), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Ocultar PDF Tool", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthersItem = NSMenuItem(title: "Ocultar Outros", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)
        appMenu.addItem(withTitle: "Mostrar Todos", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Encerrar PDF Tool", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")

        // 2. Arquivo Menu (Atalhos de Teclado nativos ⌘O, ⌘S, ⌘W)
        let fileMenuItem = NSMenuItem()
        mainMenu.addItem(fileMenuItem)
        let fileMenu = NSMenu(title: "Arquivo")
        fileMenuItem.submenu = fileMenu
        fileMenu.addItem(withTitle: "Selecionar Arquivo...", action: #selector(triggerOpenFileShortcut), keyEquivalent: "o")
        fileMenu.addItem(withTitle: "Executar Ação", action: #selector(triggerSaveShortcut), keyEquivalent: "s")
        fileMenu.addItem(NSMenuItem.separator())
        fileMenu.addItem(withTitle: "Voltar às Ferramentas", action: #selector(triggerBackShortcut), keyEquivalent: "w")

        // 3. Edit Menu (Crucial para copiar, colar, selecionar em inputs)
        let editMenuItem = NSMenuItem()
        mainMenu.addItem(editMenuItem)
        let editMenu = NSMenu(title: "Editar")
        editMenuItem.submenu = editMenu
        editMenu.addItem(withTitle: "Desfazer", action: #selector(UndoManager.undo), keyEquivalent: "z")
        editMenu.addItem(withTitle: "Refazer", action: #selector(UndoManager.redo), keyEquivalent: "Z")
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(withTitle: "Recortar", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Colar", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Selecionar Tudo", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")

        // 4. View Menu
        let viewMenuItem = NSMenuItem()
        mainMenu.addItem(viewMenuItem)
        let viewMenu = NSMenu(title: "Visualizar")
        viewMenuItem.submenu = viewMenu
        viewMenu.addItem(withTitle: "Recarregar", action: #selector(reloadPage), keyEquivalent: "r")
        viewMenu.addItem(NSMenuItem.separator())
        viewMenu.addItem(withTitle: "Tamanho Real", action: #selector(resetZoom), keyEquivalent: "0")
        viewMenu.addItem(withTitle: "Aumentar Zoom", action: #selector(zoomIn), keyEquivalent: "+")
        viewMenu.addItem(withTitle: "Diminuir Zoom", action: #selector(zoomOut), keyEquivalent: "-")

        // 5. Window Menu
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "Janela")
        windowMenuItem.submenu = windowMenu
        windowMenu.addItem(withTitle: "Minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(NSMenuItem.separator())
        windowMenu.addItem(withTitle: "Fechar", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
    }

    @objc private func triggerOpenFileShortcut() {
        webView?.evaluateJavaScript("window.triggerOpenFileShortcut && window.triggerOpenFileShortcut();", completionHandler: nil)
    }

    @objc private func triggerSaveShortcut() {
        webView?.evaluateJavaScript("window.triggerSaveShortcut && window.triggerSaveShortcut();", completionHandler: nil)
    }

    @objc private func triggerBackShortcut() {
        webView?.evaluateJavaScript("window.goHome && window.goHome();", completionHandler: nil)
    }

    @objc private func showAbout() {
        let appName = Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String
            ?? Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String
            ?? "PDF Tool"
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "2.0.0"
        let copyright = Bundle.main.object(forInfoDictionaryKey: "NSHumanReadableCopyright") as? String ?? ""

        let alert = NSAlert()
        alert.messageText = "\(appName) para macOS"
        var details = "Versão \(version) • 2026"
        if !copyright.isEmpty {
            details += "\n\n\(copyright)"
        }
        alert.informativeText = details
        alert.alertStyle = .informational
        alert.runModal()
    }

    @objc private func reloadPage() {
        webView?.reload()
    }

    @objc private func resetZoom() {
        webView?.pageZoom = 1.0
    }

    @objc private func zoomIn() {
        webView?.pageZoom += 0.1
    }

    @objc private func zoomOut() {
        if (webView?.pageZoom ?? 1.0) > 0.4 {
            webView?.pageZoom -= 0.1
        }
    }

    // MARK: - Window Setup
    private func setupWindow() {
        let rect = NSRect(x: 0, y: 0, width: 980, height: 640)
        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.center()
        window.minSize = NSSize(width: 980, height: 640)
        window.title = "PDF Tool"
        window.isMovableByWindowBackground = true
        window.isReleasedWhenClosed = false

        // WKWebView Configuration
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        contentController.add(self, name: "nativeSave")
        contentController.add(self, name: "nativeSaveBatch")
        contentController.add(self, name: "nativeOpenFile")
        contentController.add(self, name: "nativeRevealFile")
        contentController.add(self, name: "nativeDecryptPdf")
        contentController.add(self, name: "nativeSaveEncrypted")
        contentController.add(self, name: "nativeOcr")
        config.userContentController = contentController
        
        // Habilitar suporte a inspecionar
        if #available(macOS 13.3, *) {
            config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        }

        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.uiDelegate = self
        webView.navigationDelegate = self
        
        // Fundo combinando com o tema
        webView.setValue(false, forKey: "drawsBackground")

        window.contentView!.addSubview(webView)
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    // MARK: - Load Content
    private func loadApplicationContent() {
        var targetHTMLURL: URL?
        var rootDirURL: URL?

        // 1. Procurar em Bundle.main.resourceURL
        if let resourceURL = Bundle.main.resourceURL {
            let possible1 = resourceURL.appendingPathComponent("index.html")
            let possible2 = resourceURL.appendingPathComponent("src/index.html")
            if FileManager.default.fileExists(atPath: possible1.path) {
                targetHTMLURL = possible1
                rootDirURL = resourceURL
            } else if FileManager.default.fileExists(atPath: possible2.path) {
                targetHTMLURL = possible2
                rootDirURL = resourceURL
            }
        }

        // 2. Fallback de desenvolvimento local
        if targetHTMLURL == nil {
            let currentDir = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
            let devCandidate = currentDir.appendingPathComponent("src/index.html")
            if FileManager.default.fileExists(atPath: devCandidate.path) {
                targetHTMLURL = devCandidate
                rootDirURL = currentDir.appendingPathComponent("src")
            }
        }

        if let htmlURL = targetHTMLURL, let root = rootDirURL {
            webView.loadFileURL(htmlURL, allowingReadAccessTo: root)
        } else {
            let errorHTML = "<html><body style='font-family:-apple-system;padding:40px;'><h2>Erro ao carregar o aplicativo</h2><p>index.html não foi encontrado.</p></body></html>"
            webView.loadHTMLString(errorHTML, baseURL: nil)
        }
    }

    // MARK: - WKScriptMessageHandler (Native Save As Dialogs & Open File)
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "nativeSave" {
            guard let dict = message.body as? [String: Any],
                  let filename = dict["filename"] as? String,
                  let base64String = dict["data"] as? String,
                  let fileData = Data(base64Encoded: base64String) else {
                return
            }
            handleSingleSave(filename: filename, data: fileData)
        } else if message.name == "nativeSaveBatch" {
            guard let dict = message.body as? [String: Any],
                  let files = dict["files"] as? [[String: Any]] else {
                return
            }
            handleBatchSave(files: files)
        } else if message.name == "nativeOpenFile" {
            guard let dict = message.body as? [String: Any],
                  let path = dict["path"] as? String else {
                return
            }
            let fileURL = URL(fileURLWithPath: path)
            NSWorkspace.shared.open(fileURL)
        } else if message.name == "nativeRevealFile" {
            guard let dict = message.body as? [String: Any],
                  let path = dict["path"] as? String else {
                return
            }
            let fileURL = URL(fileURLWithPath: path)
            NSWorkspace.shared.activateFileViewerSelecting([fileURL])
        } else if message.name == "nativeDecryptPdf" {
            guard let dict = message.body as? [String: Any],
                  let base64 = dict["data"] as? String,
                  let password = dict["password"] as? String,
                  let callbackId = dict["callbackId"] as? String,
                  let pdfData = Data(base64Encoded: base64) else {
                return
            }
            handleDecryptPdf(data: pdfData, password: password, callbackId: callbackId)
        } else if message.name == "nativeSaveEncrypted" {
            guard let dict = message.body as? [String: Any],
                  let filename = dict["filename"] as? String,
                  let base64String = dict["data"] as? String,
                  let password = dict["password"] as? String,
                  let fileData = Data(base64Encoded: base64String) else {
                return
            }
            handleEncryptedSave(filename: filename, data: fileData, password: password)
        } else if message.name == "nativeOcr" {
            guard let dict = message.body as? [String: Any],
                  let base64 = dict["data"] as? String,
                  let callbackId = dict["callbackId"] as? String,
                  let pdfData = Data(base64Encoded: base64) else {
                return
            }
            handleOcr(data: pdfData, callbackId: callbackId)
        }
    }

    // MARK: - Native OCR com Apple Vision e PDFKit
    private func handleOcr(data: Data, callbackId: String) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let pdfDoc = PDFDocument(data: data) else {
                DispatchQueue.main.async {
                    self?.sendOcrResult(callbackId: callbackId, success: false, jsonString: nil, error: "Arquivo PDF inválido.")
                }
                return
            }

            var results: [[String: Any]] = []

            for i in 0..<pdfDoc.pageCount {
                guard let page = pdfDoc.page(at: i) else { continue }
                var pageText = (page.string ?? "").trimmingCharacters(in: .whitespacesAndNewlines)

                // Se a página não tiver texto selecionável nativo suficiente, roda OCR com Apple Vision
                if pageText.isEmpty {
                    let pageBounds = page.bounds(for: .mediaBox)
                    let renderWidth = max(pageBounds.width * 2, 800)
                    let renderHeight = max(pageBounds.height * 2, 1000)
                    let thumbnail = page.thumbnail(of: NSSize(width: renderWidth, height: renderHeight), for: .mediaBox)
                    var proposedRect = CGRect(origin: .zero, size: thumbnail.size)
                    if let cgImage = thumbnail.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) {
                        let request = VNRecognizeTextRequest()
                        request.recognitionLevel = .accurate
                        request.usesLanguageCorrection = true
                        if #available(macOS 11.0, *) {
                            request.recognitionLanguages = ["pt-BR", "en-US", "es-ES"]
                        }
                        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
                        do {
                            try handler.perform([request])
                            if let observations = request.results {
                                let lines = observations.compactMap { $0.topCandidates(1).first?.string }
                                pageText = lines.joined(separator: "\n")
                            }
                        } catch {
                            print("Erro no OCR da página \(i + 1):", error)
                        }
                    }
                }

                results.append([
                    "page": i + 1,
                    "text": pageText
                ])
            }

            do {
                let jsonData = try JSONSerialization.data(withJSONObject: results, options: [])
                let jsonString = String(data: jsonData, encoding: .utf8)
                DispatchQueue.main.async {
                    self?.sendOcrResult(callbackId: callbackId, success: true, jsonString: jsonString, error: nil)
                }
            } catch {
                DispatchQueue.main.async {
                    self?.sendOcrResult(callbackId: callbackId, success: false, jsonString: nil, error: "Falha ao gerar resultado do OCR.")
                }
            }
        }
    }

    private func sendOcrResult(callbackId: String, success: Bool, jsonString: String?, error: String?) {
        var js = ""
        if success, let jsonStr = jsonString {
            if let data = jsonStr.data(using: .utf8) {
                let b64 = data.base64EncodedString()
                js = "window.onNativeOcrResult && window.onNativeOcrResult('\(callbackId)', true, '\(b64)', null);"
            } else {
                js = "window.onNativeOcrResult && window.onNativeOcrResult('\(callbackId)', false, null, 'Falha de codificação');"
            }
        } else {
            let errStr = (error ?? "Erro desconhecido")
                .replacingOccurrences(of: "\\", with: "\\\\")
                .replacingOccurrences(of: "'", with: "\\'")
            js = "window.onNativeOcrResult && window.onNativeOcrResult('\(callbackId)', false, null, '\(errStr)');"
        }
        webView?.evaluateJavaScript(js, completionHandler: nil)
    }

    // Desbloqueio e descriptografia nativa de PDF com PDFKit
    private func handleDecryptPdf(data: Data, password: String, callbackId: String) {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let pdfDoc = PDFDocument(data: data) else {
                DispatchQueue.main.async {
                    self?.sendDecryptResult(callbackId: callbackId, success: false, dataBase64: nil, error: "Arquivo PDF inválido.")
                }
                return
            }

            if pdfDoc.isLocked {
                let unlocked = pdfDoc.unlock(withPassword: password)
                if !unlocked {
                    DispatchQueue.main.async {
                        self?.sendDecryptResult(callbackId: callbackId, success: false, dataBase64: nil, error: "Senha incorreta.")
                    }
                    return
                }
            }

            // Exporta páginas para um documento limpo sem senha
            let cleanDoc = PDFDocument()
            for i in 0..<pdfDoc.pageCount {
                if let page = pdfDoc.page(at: i) {
                    cleanDoc.insert(page, at: cleanDoc.pageCount)
                }
            }

            guard let cleanData = cleanDoc.dataRepresentation() else {
                DispatchQueue.main.async {
                    self?.sendDecryptResult(callbackId: callbackId, success: false, dataBase64: nil, error: "Falha ao processar as páginas do documento.")
                }
                return
            }

            let resultBase64 = cleanData.base64EncodedString()
            DispatchQueue.main.async {
                self?.sendDecryptResult(callbackId: callbackId, success: true, dataBase64: resultBase64, error: nil)
            }
        }
    }

    private func sendDecryptResult(callbackId: String, success: Bool, dataBase64: String?, error: String?) {
        var js = ""
        if success, let b64 = dataBase64 {
            js = "window.onNativeDecryptResult && window.onNativeDecryptResult('\(callbackId)', true, '\(b64)', null);"
        } else {
            let errStr = (error ?? "Erro desconhecido")
                .replacingOccurrences(of: "\\", with: "\\\\")
                .replacingOccurrences(of: "'", with: "\\'")
            js = "window.onNativeDecryptResult && window.onNativeDecryptResult('\(callbackId)', false, null, '\(errStr)');"
        }
        webView?.evaluateJavaScript(js, completionHandler: nil)
    }

    // Salvamento individual com NSSavePanel nativo
    private func handleSingleSave(filename: String, data: Data) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let savePanel = NSSavePanel()
            savePanel.nameFieldStringValue = filename
            savePanel.canCreateDirectories = true
            savePanel.isExtensionHidden = false
            savePanel.title = "Salvar Arquivo"
            savePanel.prompt = "Salvar"

            if let lastPath = UserDefaults.standard.string(forKey: "lastChosenDirectoryPath"),
               FileManager.default.fileExists(atPath: lastPath) {
                savePanel.directoryURL = URL(fileURLWithPath: lastPath)
            }

            let ext = (filename as NSString).pathExtension
            if !ext.isEmpty {
                if #available(macOS 11.0, *) {
                    if let uttype = UTType(filenameExtension: ext) {
                        savePanel.allowedContentTypes = [uttype]
                    }
                } else {
                    savePanel.allowedFileTypes = [ext]
                }
            }

            let finishSave: (NSApplication.ModalResponse) -> Void = { response in
                if response == .OK, let targetURL = savePanel.url {
                    UserDefaults.standard.set(targetURL.deletingLastPathComponent().path, forKey: "lastChosenDirectoryPath")
                    do {
                        try data.write(to: targetURL)
                        let escapedName = targetURL.lastPathComponent
                            .replacingOccurrences(of: "\\", with: "\\\\")
                            .replacingOccurrences(of: "'", with: "\\'")
                        let escapedPath = targetURL.path
                            .replacingOccurrences(of: "\\", with: "\\\\")
                            .replacingOccurrences(of: "'", with: "\\'")
                        let js = "window.onNativeSaveSuccess && window.onNativeSaveSuccess('\(escapedName)', '\(escapedPath)');"
                        self.webView.evaluateJavaScript(js, completionHandler: nil)
                    } catch {
                        let alert = NSAlert(error: error)
                        alert.runModal()
                    }
                } else {
                    let js = "window.onNativeSaveCancelled && window.onNativeSaveCancelled();"
                    self.webView.evaluateJavaScript(js, completionHandler: nil)
                }
            }

            if let win = self.window, win.attachedSheet == nil {
                savePanel.beginSheetModal(for: win, completionHandler: finishSave)
            } else {
                savePanel.begin(completionHandler: finishSave)
            }
        }
    }

    // Salvamento com criptografia nativa (PDF com senha)
    private func handleEncryptedSave(filename: String, data: Data, password: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let savePanel = NSSavePanel()
            savePanel.nameFieldStringValue = filename
            savePanel.canCreateDirectories = true
            savePanel.isExtensionHidden = false
            savePanel.title = "Salvar PDF com Senha"
            savePanel.prompt = "Salvar Protegido"

            if let lastPath = UserDefaults.standard.string(forKey: "lastChosenDirectoryPath"),
               FileManager.default.fileExists(atPath: lastPath) {
                savePanel.directoryURL = URL(fileURLWithPath: lastPath)
            }

            if #available(macOS 11.0, *) {
                savePanel.allowedContentTypes = [.pdf]
            } else {
                savePanel.allowedFileTypes = ["pdf"]
            }

            let finishSave: (NSApplication.ModalResponse) -> Void = { response in
                if response == .OK, let targetURL = savePanel.url {
                    UserDefaults.standard.set(targetURL.deletingLastPathComponent().path, forKey: "lastChosenDirectoryPath")
                    guard let pdfDoc = PDFDocument(data: data) else {
                        let alert = NSAlert()
                        alert.messageText = "Erro ao processar PDF"
                        alert.informativeText = "Não foi possível carregar os dados para aplicar a proteção."
                        alert.runModal()
                        return
                    }
                    let options: [PDFDocumentWriteOption: Any] = [
                        .userPasswordOption: password,
                        .ownerPasswordOption: password
                    ]
                    let success = pdfDoc.write(to: targetURL, withOptions: options)
                    if success {
                        let escapedName = targetURL.lastPathComponent
                            .replacingOccurrences(of: "\\", with: "\\\\")
                            .replacingOccurrences(of: "'", with: "\\'")
                        let escapedPath = targetURL.path
                            .replacingOccurrences(of: "\\", with: "\\\\")
                            .replacingOccurrences(of: "'", with: "\\'")
                        let js = "window.onNativeSaveSuccess && window.onNativeSaveSuccess('\(escapedName)', '\(escapedPath)');"
                        self.webView.evaluateJavaScript(js, completionHandler: nil)
                    } else {
                        let alert = NSAlert()
                        alert.messageText = "Erro ao salvar"
                        alert.informativeText = "O macOS não conseguiu gravar o arquivo protegido no destino selecionado."
                        alert.runModal()
                    }
                } else {
                    let js = "window.onNativeSaveCancelled && window.onNativeSaveCancelled();"
                    self.webView.evaluateJavaScript(js, completionHandler: nil)
                }
            }

            if let win = self.window, win.attachedSheet == nil {
                savePanel.beginSheetModal(for: win, completionHandler: finishSave)
            } else {
                savePanel.begin(completionHandler: finishSave)
            }
        }
    }

    // Salvamento em lote (pasta de destino para múltiplas imagens)
    private func handleBatchSave(files: [[String: Any]]) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let openPanel = NSOpenPanel()
            openPanel.canChooseDirectories = true
            openPanel.canChooseFiles = false
            openPanel.canCreateDirectories = true
            openPanel.title = "Escolha a pasta para salvar as imagens"
            openPanel.prompt = "Salvar Aqui"

            if let lastPath = UserDefaults.standard.string(forKey: "lastChosenDirectoryPath"),
               FileManager.default.fileExists(atPath: lastPath) {
                openPanel.directoryURL = URL(fileURLWithPath: lastPath)
            }

            let finishBatch: (NSApplication.ModalResponse) -> Void = { response in
                if response == .OK, let folderURL = openPanel.url {
                    UserDefaults.standard.set(folderURL.path, forKey: "lastChosenDirectoryPath")
                    var savedCount = 0
                    for item in files {
                        if let filename = item["filename"] as? String,
                           let base64 = item["data"] as? String,
                           let data = Data(base64Encoded: base64) {
                            let fileURL = folderURL.appendingPathComponent(filename)
                            do {
                                try data.write(to: fileURL)
                                savedCount += 1
                            } catch {
                                print("Erro ao salvar arquivo \(filename):", error)
                            }
                        }
                    }
                    let escapedFolder = folderURL.lastPathComponent
                        .replacingOccurrences(of: "\\", with: "\\\\")
                        .replacingOccurrences(of: "'", with: "\\'")
                    let escapedPath = folderURL.path
                        .replacingOccurrences(of: "\\", with: "\\\\")
                        .replacingOccurrences(of: "'", with: "\\'")
                    let js = "window.onNativeBatchSaveSuccess && window.onNativeBatchSaveSuccess(\(savedCount), '\(escapedFolder)', '\(escapedPath)');"
                    self.webView.evaluateJavaScript(js, completionHandler: nil)
                } else {
                    let js = "window.onNativeSaveCancelled && window.onNativeSaveCancelled();"
                    self.webView.evaluateJavaScript(js, completionHandler: nil)
                }
            }

            if let win = self.window, win.attachedSheet == nil {
                openPanel.beginSheetModal(for: win, completionHandler: finishBatch)
            } else {
                openPanel.begin(completionHandler: finishBatch)
            }
        }
    }

    // MARK: - WKUIDelegate (File Picker Open Panel & Alerts)
    func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        let openPanel = NSOpenPanel()
        openPanel.allowsMultipleSelection = parameters.allowsMultipleSelection
        openPanel.canChooseDirectories = parameters.allowsDirectories
        openPanel.canChooseFiles = true
        openPanel.title = "Selecionar Arquivo"
        openPanel.prompt = "Selecionar"

        if let lastPath = UserDefaults.standard.string(forKey: "lastChosenDirectoryPath"),
           FileManager.default.fileExists(atPath: lastPath) {
            openPanel.directoryURL = URL(fileURLWithPath: lastPath)
        }

        let finishHandler: (NSApplication.ModalResponse) -> Void = { response in
            if response == .OK, let first = openPanel.urls.first {
                UserDefaults.standard.set(first.deletingLastPathComponent().path, forKey: "lastChosenDirectoryPath")
                completionHandler(openPanel.urls)
            } else {
                completionHandler(nil)
            }
        }

        if let win = self.window, win.attachedSheet == nil {
            openPanel.beginSheetModal(for: win, completionHandler: finishHandler)
        } else {
            openPanel.begin(completionHandler: finishHandler)
        }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if let pending = pendingExternalFilePath {
            pendingExternalFilePath = nil
            handleExternalFile(path: pending)
        }
    }

    // MARK: - WKUIDelegate (Native Alerts)
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = NSAlert()
        alert.messageText = "PDF Tool"
        alert.informativeText = message
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: window) { _ in
            completionHandler()
        }
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = NSAlert()
        alert.messageText = "PDF Tool"
        alert.informativeText = message
        alert.alertStyle = .warning
        alert.addButton(withTitle: "Confirmar")
        alert.addButton(withTitle: "Cancelar")
        alert.beginSheetModal(for: window) { response in
            completionHandler(response == .alertFirstButtonReturn)
        }
    }
}

// MARK: - Entry Point
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
