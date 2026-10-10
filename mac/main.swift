import Cocoa
import WebKit
import UniformTypeIdentifiers

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

        // 2. Edit Menu (Crucial para copiar, colar, selecionar em inputs)
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

        // 3. View Menu
        let viewMenuItem = NSMenuItem()
        mainMenu.addItem(viewMenuItem)
        let viewMenu = NSMenu(title: "Visualizar")
        viewMenuItem.submenu = viewMenu
        viewMenu.addItem(withTitle: "Recarregar", action: #selector(reloadPage), keyEquivalent: "r")
        viewMenu.addItem(NSMenuItem.separator())
        viewMenu.addItem(withTitle: "Tamanho Real", action: #selector(resetZoom), keyEquivalent: "0")
        viewMenu.addItem(withTitle: "Aumentar Zoom", action: #selector(zoomIn), keyEquivalent: "+")
        viewMenu.addItem(withTitle: "Diminuir Zoom", action: #selector(zoomOut), keyEquivalent: "-")

        // 4. Window Menu
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "Janela")
        windowMenuItem.submenu = windowMenu
        windowMenu.addItem(withTitle: "Minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Zoom", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")
        windowMenu.addItem(NSMenuItem.separator())
        windowMenu.addItem(withTitle: "Fechar", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
    }

    @objc private func showAbout() {
        let alert = NSAlert()
        alert.messageText = "PDF Tool para macOS"
        alert.informativeText = "Versão 1.0.0 • Edição Nativa\n\nFerramenta integrada de manipulação e organização de PDFs.\nFunciona 100% offline com segurança total para seus documentos."
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
        let rect = NSRect(x: 0, y: 0, width: 1180, height: 800)
        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.center()
        window.minSize = NSSize(width: 860, height: 580)
        window.title = "PDF Tool"
        window.isMovableByWindowBackground = true
        window.isReleasedWhenClosed = false

        // WKWebView Configuration
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        contentController.add(self, name: "nativeSave")
        contentController.add(self, name: "nativeSaveBatch")
        config.userContentController = contentController
        
        // Habilitar suporte a inspecionar se necessário
        if #available(macOS 13.3, *) {
            #if DEBUG
            config.preferences.setValue(true, forKey: "developerExtrasEnabled")
            #endif
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

    // MARK: - WKScriptMessageHandler (Native Save As Dialogs)
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
        }
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

            savePanel.beginSheetModal(for: self.window) { response in
                if response == .OK, let targetURL = savePanel.url {
                    do {
                        try data.write(to: targetURL)
                        let escaped = targetURL.lastPathComponent.replacingOccurrences(of: "'", with: "\\'")
                        let js = "window.onNativeSaveSuccess && window.onNativeSaveSuccess('\(escaped)');"
                        self.webView.evaluateJavaScript(js, completionHandler: nil)
                    } catch {
                        let alert = NSAlert(error: error)
                        alert.runModal()
                    }
                }
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

            openPanel.beginSheetModal(for: self.window) { response in
                if response == .OK, let folderURL = openPanel.url {
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
                    let escapedFolder = folderURL.lastPathComponent.replacingOccurrences(of: "'", with: "\\'")
                    let js = "window.onNativeBatchSaveSuccess && window.onNativeBatchSaveSuccess(\(savedCount), '\(escapedFolder)');"
                    self.webView.evaluateJavaScript(js, completionHandler: nil)
                }
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

        if let win = self.window {
            openPanel.beginSheetModal(for: win) { response in
                completionHandler(response == .OK ? openPanel.urls : nil)
            }
        } else {
            openPanel.begin { response in
                completionHandler(response == .OK ? openPanel.urls : nil)
            }
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
