# 🛠️ PDF Tool para macOS

Aplicativo nativo macOS para manipulação, organização e conversão de documentos PDF.

---

## ✨ Características Principais

* **100% Nativo e Leve:** Criado em Swift + WebKit, ocupando apenas **~2.3 MB** de espaço.
* **100% Offline e Privado:** Todas as bibliotecas (`pdf-lib`, `pdf.js`) estão embutidas localmente no pacote do app. Seus arquivos nunca saem do seu computador.
* **Janela Nativa "Salvar Como...":** Ao exportar seus PDFs ou imagens, o app abre a janela nativa do macOS para você escolher a pasta e o nome desejados.
* **Compatibilidade com PDFs Protegidos:** Suporta comprovantes bancários, faturas e recibos criptografados (ex.: Mercado Pago, Nubank, bancos) com desbloqueio automático de permissões (`ignoreEncryption: true`).
* **Modo Escuro / Claro:** Adapta-se automaticamente ao tema do macOS.

---

## 🧩 Ferramentas Incluídas

1. **🧩 Combinar PDF:** Junte múltiplos arquivos em um único PDF na ordem que desejar, com rotação individual e reordenação interativa.
2. **✂️ Dividir PDF:** Selecione páginas específicas de um PDF e extraia-as em um novo arquivo.
3. **🔄 Girar PDF:** Gire páginas individuais ou todas as páginas de uma vez (90°, 180°, 270°).
4. **🗑️ Remover Páginas:** Marque visualmente as páginas que deseja excluir do seu documento.
5. **🖼️ PDF para JPG:** Converta páginas do PDF em imagens JPG de alta resolução, com seleção de páginas e rotação.
6. **📷 JPG para PDF:** Transforme uma ou mais imagens em um documento PDF, com escolha de orientação (Vertical / Horizontal).

---

## 🚀 Como Executar ou Instalar

### Abrir o aplicativo diretamente:
```bash
open "./build/PDF Tool.app"
```

### Instalar na pasta de Aplicativos do Mac:
```bash
cp -R "./build/PDF Tool.app" /Applications/
```
Depois disso, você poderá encontrá-lo no **Launchpad**, no **Spotlight** (`Cmd + Espaço` -> `PDF Tool`) ou fixá-lo no seu **Dock**!

---

## 🔨 Como Recompilar o Aplicativo

Caso queira fazer alterações no visual (HTML/CSS) ou na lógica (JS/Swift):
```bash
./build.sh
```

---

## 📁 Estrutura do Repositório

```text
PDF-Tool-Mac/
├── assets/                  # Ícones em alta resolução e AppIcon.icns
├── mac/
│   ├── main.swift           # Código Swift do aplicativo Cocoa/WebKit nativo
│   └── Info.plist           # Metadados e configuração do app macOS
├── src/
│   ├── index.html           # Interface da aplicação
│   ├── css/
│   │   └── app.css          # Estilos modernos adaptados ao design macOS
│   ├── js/
│   │   └── app.js           # Lógica das 6 ferramentas e ponte nativa de salvamento
│   └── vendor/              # Bibliotecas locais offline (pdf-lib, pdf.js, worker)
├── build/
│   └── PDF Tool.app         # Aplicativo compilado pronto para uso
├── build.sh                 # Script de compilação automatizada
└── README.md
```
